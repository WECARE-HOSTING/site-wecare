import type { NextRequest } from "next/server";
import { getListing, getListings } from "@/lib/reservas/hostaway";
import { translateCaptions, translateText } from "@/lib/reservas/translate";

// Translating the whole catalogue the first time takes a few minutes; later runs only redo what changed.
export const maxDuration = 300;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const START_BUDGET_MS = 200_000;

/**
 * Called every 15 min by .github/workflows/reservas-manutencao.yml. Walks the listings and makes
 * sure each one's Spanish description, house rules (EN/ES) and photo captions (EN/ES) are in the
 * cache, so guests never wait for the model. Already-cached texts return instantly.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const started = Date.now();
  const listings = await getListings();
  const jobs: Promise<unknown>[] = [];
  let visited = 0;
  for (const summary of listings) {
    if (Date.now() - started > START_BUDGET_MS) break;
    // One listing fetch at a time, spaced out: the Hostaway rate limit is shared with other WeCare systems.
    const listing = await getListing(summary.id).catch(() => null);
    if (!listing) continue;
    visited++;
    jobs.push(
      ...listing.sections.map((s) => translateText("description", "es", s.text, Infinity)),
      ...(listing.houseRules ? [translateText("rules", "en", listing.houseRules, Infinity), translateText("rules", "es", listing.houseRules, Infinity)] : []),
      translateCaptions("en", listing.images.map((i) => i.caption), Infinity),
      translateCaptions("es", listing.images.map((i) => i.caption), Infinity),
    );
    await sleep(700);
  }
  const results = await Promise.all(jobs);
  const failed = results.filter((r) => r === null).length;
  return Response.json({ listings: listings.length, visited, jobs: results.length, failed, seconds: Math.round((Date.now() - started) / 1000) });
}
