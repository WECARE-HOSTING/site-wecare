import type { NextRequest } from "next/server";
import { getAvailabilityIndex, getListings, getReviews } from "@/lib/reservas/hostaway";
import { SHOW_REVIEWS } from "@/lib/reservas/features";
import { expireHolds } from "@/lib/reservas/payments";

// Rebuilding the availability index can take a couple of minutes.
export const maxDuration = 300;

/**
 * Called every 15 min by .github/workflows/reservas-manutencao.yml:
 * releases unpaid holds and keeps the search caches warm.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }
  const holds = await expireHolds();
  const listings = await getListings();
  const index = await getAvailabilityIndex();
  if (SHOW_REVIEWS) await getReviews(0); // warms the reviews cache (one pass over all of Hostaway's reviews)
  return Response.json({ holds, listings: listings.length, indexBuiltAt: index.builtAt });
}
