import "server-only";
import { createHash } from "node:crypto";
import { durable } from "./durable";
import { after } from "next/server";
import { generateText, Output } from "ai";
import { z } from "zod";
import type { Listing } from "./types";
import { CACHE_MODEL_TAG, aiModel } from "./model";

/**
 * "What's nearby" for a listing, taken from the places its own description names (Hostaway text
 * is the source of truth; nothing is added from the model's own knowledge):
 *   1. The model lists the specific named places in the description;
 *   2. OpenStreetMap's Nominatim finds each one near the listing's (rounded) location;
 *   3. roads, rivers and anything implausibly far are dropped.
 * Slow (a geocode per place, 1 request/second as Nominatim requires), so it is cached for 30 days
 * under a hash of the source text and filled by /api/reservas/pontos; pages never wait for it.
 */

export const POI_CATEGORIES = ["transit", "food", "shopping", "nature", "culture", "sports", "health", "other"] as const;
export type PoiCategory = (typeof POI_CATEGORIES)[number];
export type Poi = { name: string; category: PoiCategory; lat: number; lng: number };

const MAX_DISTANCE_KM = 7;
const MAX_POIS = 10;
export const MIN_POIS = 3;

const schema = z.object({
  places: z
    .array(z.object({ name: z.string().describe("Official proper name of the place, as a map would label it"), category: z.enum(POI_CATEGORIES) }))
    .max(16),
});

const INSTRUCTIONS = [
  "You read a Brazilian vacation-rental description and list the specific, named places it mentions near the property:",
  "parks, metro/train stations, malls, beaches, restaurants, museums, hospitals, theaters, stadiums, landmarks.",
  "Only places explicitly named in the text; never add places from your own knowledge.",
  "No generic mentions ('restaurants', 'the beach') unless a name is given. No roads, avenues, highways or rivers.",
  "Not the property's own building or condominium. No duplicates.",
].join(" ");

// Names that are streets or waterways even when the model lists them anyway.
const NOT_A_PLACE = /^(av\.?|avenida|rua|alameda|rodovia|estrada|marginal|corredor|via|travessa|ponte|t[uú]nel|rio|c[oó]rrego)\b/i;

const km = (aLat: number, aLng: number, bLat: number, bLng: number) => {
  const rad = (x: number) => (x * Math.PI) / 180;
  const h = Math.sin(rad(bLat - aLat) / 2) ** 2 + Math.cos(rad(aLat)) * Math.cos(rad(bLat)) * Math.sin(rad(bLng - aLng) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

// Nominatim's usage policy: at most one request per second, with an identifying User-Agent.
let lastGeocode = Promise.resolve();
function throttled<T>(fn: () => Promise<T>): Promise<T> {
  const run = lastGeocode.then(fn);
  lastGeocode = run.then(() => new Promise<void>((r) => setTimeout(r, 1100)), () => new Promise<void>((r) => setTimeout(r, 1100)));
  return run;
}

async function geocode(name: string, city: string, lat: number, lng: number): Promise<{ lat: number; lng: number } | null> {
  const d = 0.07;
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.search = new URLSearchParams({ format: "jsonv2", limit: "1", bounded: "1", viewbox: `${lng - d},${lat + d},${lng + d},${lat - d}`, "accept-language": "pt-BR", q: `${name}, ${city}` }).toString();
  const rows = await throttled(() => fetch(url, { headers: { "User-Agent": "WeCareHosting-site/1.0 (+https://www.wecarehosting.com.br)" }, cache: "no-store", signal: AbortSignal.timeout(15_000) }).then((r) => (r.ok ? r.json() : [])).catch(() => []));
  const hit = (rows as { lat: string; lon: string }[])[0];
  if (!hit) return null;
  const found = { lat: Number(hit.lat), lng: Number(hit.lon) };
  return Number.isFinite(found.lat) && km(lat, lng, found.lat, found.lng) <= MAX_DISTANCE_KM ? found : null;
}

async function build(city: string, state: string, text: string, lat: number, lng: number): Promise<Poi[]> {
  const { output } = await generateText({
    model: aiModel(),
    temperature: 0,
    instructions: INSTRUCTIONS,
    prompt: `Property city: ${city}, ${state}.\n\nDESCRIPTION:\n${text}`,
    output: Output.object({ schema }),
    abortSignal: AbortSignal.timeout(90_000),
  });
  const seen = new Set<string>();
  const pois: Poi[] = [];
  for (const place of output.places) {
    const key = place.name.toLowerCase();
    if (NOT_A_PLACE.test(place.name.trim()) || seen.has(key)) continue;
    seen.add(key);
    const at = await geocode(place.name, city, lat, lng);
    if (at) pois.push({ name: place.name.trim(), category: place.category, ...at });
  }
  return pois.sort((a, b) => km(lat, lng, a.lat, a.lng) - km(lat, lng, b.lat, b.lng)).slice(0, MAX_POIS);
}

const sourceText = (listing: Listing) => listing.sections.map((s) => s.text).join("\n\n").slice(0, 12_000);

/** Get-or-compute. Resolves with [] when the listing has nothing to work from. */
export function nearbyPlaces(listing: Listing): Promise<Poi[]> {
  const text = sourceText(listing);
  if (!text || listing.lat === null || listing.lng === null) return Promise.resolve([]);
  const { lat, lng } = { lat: listing.lat, lng: listing.lng };
  const id = `${listing.id}-${createHash("sha256").update([CACHE_MODEL_TAG, listing.city, lat, lng, text].join("\u0000")).digest("hex").slice(0, 20)}`;
  return durable("nearby", id, () => build(listing.city, listing.state, text, lat, lng));
}

/** For pages: the places if already cached (or ready within `waitMs`); otherwise null and the work finishes after the response. */
export async function nearbyPlacesWithin(listing: Listing, waitMs: number): Promise<Poi[] | null> {
  const work = nearbyPlaces(listing);
  const quiet = work.catch((err) => {
    console.error(`[reservas] nearby places failed (${listing.id})`, err);
    return null;
  });
  const first = await Promise.race([quiet, new Promise<null>((r) => setTimeout(() => r(null), waitMs))]);
  if (first === null) {
    try {
      after(() => quiet);
    } catch {
      // outside a request
    }
  }
  return first;
}
