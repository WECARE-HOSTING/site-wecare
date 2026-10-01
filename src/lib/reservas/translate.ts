import "server-only";
import { createHash } from "node:crypto";
import { unstable_cache } from "next/cache";
import { after } from "next/server";
import { generateText } from "ai";
import type { Lang } from "./i18n";

/**
 * Machine translation of listing copy (Hostaway only holds it in Portuguese, plus English for the
 * description). Claude Haiku through the Vercel AI Gateway — no API key, the project's OIDC token
 * is enough — at roughly US$ 2 for the whole catalogue.
 *
 * Translating a 4 000-character section takes several seconds, so a guest never waits for it:
 * pages ask with a short deadline and show the original text meanwhile, while the translation
 * finishes in the background (`after`) and lands in the cache for the next visit. Every
 * translation is cached for 30 days under a hash of the source text, so it is redone only when
 * someone edits the text in Hostaway. The maintenance job (/api/reservas/traducoes) warms them.
 */

export const TRANSLATION_MODEL = "anthropic/claude-haiku-4.5";
const TTL_SECONDS = 60 * 60 * 24 * 30;

export type Target = Exclude<Lang, "pt">;
export type Kind = "description" | "rules" | "captions";

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

// When the Gateway refuses us (no card on file, out of credit, rate limited) every attempt would
// fail the same way and slow each page down, so we stop trying for a few minutes.
const PAUSE_MS = 5 * 60_000;
const REFUSALS = new Set([401, 402, 403, 429]);
let pausedUntil = 0;

async function callModel(kind: Kind, target: Target, text: string): Promise<string> {
  if (Date.now() < pausedUntil) throw new Error("translation paused after the AI Gateway refused a request");
  const { text: out } = await slot(() =>
    generateText({ model: TRANSLATION_MODEL, instructions: instructions(kind, target), prompt: text, temperature: 0, abortSignal: AbortSignal.timeout(150_000) }),
  ).catch((err) => {
    if (REFUSALS.has((err as { statusCode?: number }).statusCode ?? 0)) pausedUntil = Date.now() + PAUSE_MS;
    throw err;
  });
  const result = out.trim();
  // A reply that is empty or wildly the wrong size is a refusal or a truncation, not a translation.
  if (!result || result.length < text.length * 0.4 || result.length > text.length * 2.8) throw new Error(`translation looks wrong (${text.length} → ${result.length} chars)`);
  return result;
}

const hash = (...parts: string[]) => createHash("sha256").update(parts.join("\u0000")).digest("hex").slice(0, 24);
const inFlight = new Map<string, Promise<string>>();

/** Get-or-compute with the data cache; concurrent callers in one instance share a single model call. */
function translation(kind: Kind, target: Target, text: string): Promise<string> {
  const id = hash(kind, target, text);
  let p = inFlight.get(id);
  if (!p) {
    p = unstable_cache(() => callModel(kind, target, text), ["reservas-translation", TRANSLATION_MODEL, id], { revalidate: TTL_SECONDS, tags: ["reservas-translation"] })().finally(() =>
      inFlight.delete(id),
    );
    inFlight.set(id, p);
  }
  return p;
}

const sleep = (ms: number) => new Promise<null>((r) => setTimeout(() => r(null), ms));

/**
 * The translation if it is ready within `waitMs`, otherwise null — and the work carries on after
 * the response so the next visitor gets it. `waitMs: Infinity` (maintenance job) waits for it.
 */
async function ready<T>(work: Promise<T>, waitMs: number, label: string): Promise<T | null> {
  const quiet = work.catch((err) => {
    console.error(`[reservas] translation failed (${label})`, err);
    return null;
  });
  if (waitMs === Infinity) return quiet;
  const first = await Promise.race([quiet, sleep(waitMs)]);
  if (first === null) {
    try {
      after(() => quiet);
    } catch {
      // not inside a request (e.g. a script): the promise just keeps running
    }
  }
  return first;
}

export const translateText = (kind: Exclude<Kind, "captions">, target: Target, text: string, waitMs = 1200) =>
  text.trim() ? ready(translation(kind, target, text), waitMs, `${kind}/${target}`) : Promise.resolve(text);

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

export async function translateCaptions(target: Target, captions: string[], waitMs = 1200): Promise<string[] | null> {
  if (!captions.some(Boolean)) return captions;
  // Only distinct, non-empty captions are sent (Hostaway repeats them across channels and photos).
  const distinct = [...new Set(captions.filter(Boolean))];
  const id = hash("captions", target, JSON.stringify(distinct));
  const work = unstable_cache(() => translateCaptionBatch(target, distinct), ["reservas-captions", TRANSLATION_MODEL, id], { revalidate: TTL_SECONDS, tags: ["reservas-translation"] })();
  const done = await ready(work, waitMs, `captions/${target}`);
  if (!done) return null;
  const byText = new Map(distinct.map((c, i) => [c, done[i]]));
  return captions.map((c) => (c ? (byText.get(c) ?? c) : c));
}
