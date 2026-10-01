import type { NextRequest } from "next/server";
import { getListing, getListings } from "@/lib/reservas/hostaway";
import { translateCaptions, translateText } from "@/lib/reservas/translate";

// Translating the whole catalogue the first time takes a few minutes; later runs only redo what changed.
export const maxDuration = 300;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const START_BUDGET_MS = 210_000;

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
  const deadline = started + 270_000; // maxDuration is 300 s: report progress instead of timing out
  const listings = await getListings();
  const jobs: Promise<unknown>[] = [];
  let pending = 0;
  const track = (p: Promise<unknown>) => {
    pending++;
    jobs.push(p.finally(() => pending--));
  };
  let visited = 0;
  for (const summary of listings) {
    if (Date.now() > started + START_BUDGET_MS) break;
    // Don't queue the whole catalogue at once: wait while the model is still busy with earlier listings.
    while (pending > 24 && Date.now() < deadline) await sleep(1000);
    // One listing fetch at a time, spaced out: the Hostaway rate limit is shared with other WeCare systems.
    const listing = await getListing(summary.id).catch(() => null);
    if (!listing) continue;
    visited++;
    for (const section of listing.sections) track(translateText("description", "es", section.text, Infinity));
    if (listing.houseRules) {
      track(translateText("rules", "en", listing.houseRules, Infinity));
      track(translateText("rules", "es", listing.houseRules, Infinity));
    }
    const captions = listing.images.map((i) => i.caption);
    track(translateCaptions("en", captions, Infinity));
    track(translateCaptions("es", captions, Infinity));
    await sleep(700);
  }
  // Finished translations are already cached; whatever is still running at the deadline is picked up by the next run.
  const settled = await Promise.race([Promise.all(jobs).then(() => true), sleep(Math.max(0, deadline - Date.now())).then(() => false)]);
  return Response.json({ listings: listings.length, visited, jobs: jobs.length, stillRunning: pending, complete: settled && visited === listings.length, seconds: Math.round((Date.now() - started) / 1000) });
}
