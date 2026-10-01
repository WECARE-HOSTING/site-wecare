import "server-only";
import { createHash } from "node:crypto";
import { after } from "next/server";
import { generateText } from "ai";
import type { Lang } from "./i18n";
import type { Listing } from "./types";
import { durable } from "./durable";
import { CACHE_MODEL_TAG, aiModel } from "./model";

/**
 * Machine translation of listing copy (Hostaway only holds it in Portuguese, plus English for the
 * description). Claude Haiku 4.5 through Anthropic's API (see model.ts), a few US$ for the whole
 * catalogue the first time and cents afterwards.
 *
 * One stored file per listing and language (see durable.ts), keyed by a hash of the source text:
 * reused across deploys, and redone only when someone edits the text in Hostaway.
 * Translating a 4 000-character section takes several seconds, so a guest never waits for it:
 * pages ask with a short deadline and show the Portuguese original meanwhile, while the work
 * finishes in the background (`after`). The maintenance job (/api/reservas/traducoes) fills them.
 */

export type Target = Exclude<Lang, "pt">;
type Kind = "description" | "rules" | "captions";

const TARGET_NAME: Record<Target, string> = { en: "American English", es: "neutral Spanish (understandable across Spain and Latin America)" };

const KIND_RULES: Record<Kind, string> = {
  description: "It is the description of a vacation rental: keep the warm, polished hospitality tone.",
  rules: "These are house rules and policies: translate faithfully and precisely; never soften, add or drop a rule, amount, time or deadline.",
  captions: "These are short photo captions, one per line, each starting with its number and a period (\"1. \"). Return every line with the same number, in the same order, one per line, and nothing else.",
};

function instructions(kind: Kind, target: Target): string {
  return [
    `You translate text for WeCare Hosting, a vacation-rental manager in Brazil, from Brazilian Portuguese into ${TARGET_NAME[target]}.`,
    KIND_RULES[kind],
    "Keep brand and place names (WeCare, Airbnb, Booking.com, neighborhoods, streets) and all numbers, times, distances and R$ amounts exactly as written.",
    "Preserve the structure: line breaks, blank lines, bullets, numbering and emojis.",
    "Do not add, remove or explain anything. Reply with the translation only.",
  ].join(" ");
}

// At most this many model calls at once, however many pages and jobs ask.
const MAX_CONCURRENT = 12;
let running = 0;
const waiting: (() => void)[] = [];
async function slot<T>(fn: () => Promise<T>): Promise<T> {
  if (running >= MAX_CONCURRENT) await new Promise<void>((resolve) => waiting.push(resolve));
  running++;
  try {
    return await fn();
  } finally {
    running--;
    waiting.shift()?.();
  }
}

// When the API refuses us (bad key, out of credit, rate limited) every attempt would
// fail the same way and slow each page down, so we stop trying for a few minutes.
const PAUSE_MS = 5 * 60_000;
const REFUSALS = new Set([401, 402, 403, 429]);
let pausedUntil = 0;

async function callModel(kind: Kind, target: Target, text: string): Promise<string> {
  if (Date.now() < pausedUntil) throw new Error("translation paused after the AI provider refused a request");
  const { text: out } = await slot(() =>
    generateText({ model: aiModel(), instructions: instructions(kind, target), prompt: text, temperature: 0, abortSignal: AbortSignal.timeout(150_000) }),
  ).catch((err) => {
    if (REFUSALS.has((err as { statusCode?: number }).statusCode ?? 0)) pausedUntil = Date.now() + PAUSE_MS;
    throw err;
  });
  const result = out.trim();
  // A reply that is empty or wildly the wrong size is a refusal or a truncation, not a translation.
  if (!result || result.length < text.length * 0.4 || result.length > text.length * 2.8) throw new Error(`translation looks wrong (${text.length} → ${result.length} chars)`);
  return result;
}

/** Captions go in one call as numbered lines ("1. text") and must come back with every number. */
async function translateCaptionBatch(target: Target, captions: string[]): Promise<string[]> {
  const flat = captions.map((c) => c.replace(/\s*\n+\s*/g, " "));
  const raw = await callModel("captions", target, flat.map((c, i) => `${i + 1}. ${c}`).join("\n"));
  const byNumber = new Map<number, string>();
  for (const line of raw.split("\n")) {
    const m = /^\s*(\d+)\.\s*(.+?)\s*$/.exec(line);
    if (m) byNumber.set(Number(m[1]), m[2]);
  }
  const out = flat.map((_, i) => byNumber.get(i + 1));
  if (out.some((c) => !c)) throw new Error(`caption batch came back incomplete (${byNumber.size}/${captions.length})`);
  return out as string[];
}

/** Everything translated for one listing in one language. `null` parts did not exist in the source. */
export type ListingTranslation = { sections: string[] | null; rules: string | null; captions: string[] | null };

async function translateListing(listing: Listing, target: Target): Promise<ListingTranslation> {
  const captions = listing.images.map((i) => i.caption);
  const distinct = [...new Set(captions.filter(Boolean))];
  const [sections, rules, translatedDistinct] = await Promise.all([
    // English descriptions come straight from Hostaway; only Spanish needs the sections translated.
    target === "es" ? Promise.all(listing.sections.map((s) => callModel("description", "es", s.text))) : Promise.resolve(null),
    listing.houseRules.trim() ? callModel("rules", target, listing.houseRules) : Promise.resolve(null),
    distinct.length ? translateCaptionBatch(target, distinct) : Promise.resolve(null),
  ]);
  const byText = new Map(distinct.map((c, i) => [c, translatedDistinct?.[i] ?? c]));
  return { sections, rules, captions: distinct.length ? captions.map((c) => (c ? (byText.get(c) ?? c) : c)) : null };
}

function listingKey(listing: Listing, target: Target): string {
  const source = JSON.stringify({ sections: target === "es" ? listing.sections.map((s) => s.text) : null, rules: listing.houseRules, captions: listing.images.map((i) => i.caption) });
  return `${target}-${listing.id}-${createHash("sha256").update(`${CACHE_MODEL_TAG}\u0000${source}`).digest("hex").slice(0, 20)}`;
}

/**
 * The listing's translation if it is ready within `waitMs`; otherwise null, and the work carries on
 * after the response so the next visitor gets it. `waitMs: Infinity` (maintenance job) waits for it.
 */
export async function listingTranslation(listing: Listing, target: Target, waitMs = 1200): Promise<ListingTranslation | null> {
  const work = durable("translation", listingKey(listing, target), () => translateListing(listing, target));
  const quiet = work.catch((err) => {
    console.error(`[reservas] translation failed (${listing.id}/${target})`, err);
    return null;
  });
  if (waitMs === Infinity) return quiet;
  const first = await Promise.race([quiet, new Promise<null>((r) => setTimeout(() => r(null), waitMs))]);
  if (first === null) {
    try {
      after(() => quiet);
    } catch {
      // not inside a request (e.g. a script): the promise just keeps running
    }
  }
  return first;
}
