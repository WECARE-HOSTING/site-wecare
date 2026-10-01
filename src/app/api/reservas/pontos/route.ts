import type { NextRequest } from "next/server";
import { getListing, getListings } from "@/lib/reservas/hostaway";
import { nearbyPlaces } from "@/lib/reservas/nearby";

export const maxDuration = 300;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Called every 15 min by .github/workflows/reservas-manutencao.yml. Builds the "what's nearby"
 * places of each listing (model + one geocode per place, ~1/s), a few listings per run; finished
 * ones are cached for 30 days so later runs skip them. Returns what it found for review.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const started = Date.now();
  const deadline = started + 240_000; // a listing can take ~20 s; leave room to finish it
  const listings = await getListings();
  const report: { id: number; city: string; places: string[] }[] = [];
  let failed = 0;
  let done = 0;
  for (const summary of listings) {
    if (Date.now() > deadline) break;
    const listing = await getListing(summary.id).catch(() => null);
    if (!listing) continue;
    try {
      const places = await nearbyPlaces(listing);
      report.push({ id: listing.id, city: listing.city, places: places.map((p) => `${p.name} (${p.category})`) });
      done++;
    } catch (err) {
      failed++;
      console.error(`[reservas] nearby places failed for ${listing.id}`, err);
    }
    await sleep(700);
  }
  return Response.json({ listings: listings.length, done, failed, complete: done + failed === listings.length, seconds: Math.round((Date.now() - started) / 1000), report });
}
