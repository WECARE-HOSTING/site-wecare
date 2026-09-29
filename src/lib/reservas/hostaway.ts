import "server-only";
import { unstable_cache } from "next/cache";
import type { CalendarDay, GuestDetails, HeldReservation, Listing, Quote, QuoteLine, StayRequest } from "./types";
import { addDays, nightsBetween, todayInBrazil } from "./dates";
import * as mock from "./mock";
import { translateAmenity } from "./amenities";
import { isAllowedImage } from "./image-hosts";

const API = "https://api.hostaway.com/v1";

/** Marks every reservation this site creates, so the expiry job only ever touches ours. */
export const RESERVATION_SOURCE = "site-wecare";

// Hostaway: 2000 = direct booking channel.
const DIRECT_CHANNEL_ID = 2000;

// Status a reservation sits in while the guest is paying. Hostaway's overbooking
// protection treats it as occupying the dates, which is what makes the hold work.
export const HOLD_STATUS = process.env.HOSTAWAY_HOLD_STATUS || "awaitingPayment";

export class HostawayError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
  }
}

export function hostawayConfigured(): boolean {
  return Boolean(process.env.HOSTAWAY_ACCESS_TOKEN || (process.env.HOSTAWAY_ACCOUNT_ID && process.env.HOSTAWAY_API_KEY));
}

/**
 * Without credentials we serve sample listings so the pages can be built and
 * reviewed locally. Production never falls back: a missing key there must fail
 * loudly instead of showing guests fake properties.
 */
function mockMode(): boolean {
  if (hostawayConfigured()) return false;
  if (process.env.VERCEL_ENV === "production") {
    throw new HostawayError("Hostaway credentials are not configured");
  }
  return true;
}

let tokenPromise: Promise<string> | null = null;

async function accessToken(): Promise<string> {
  if (process.env.HOSTAWAY_ACCESS_TOKEN) return process.env.HOSTAWAY_ACCESS_TOKEN;
  tokenPromise ??= (async () => {
    const res = await fetch(`${API}/accessTokens`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Cache-control": "no-cache" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.HOSTAWAY_ACCOUNT_ID!,
        client_secret: process.env.HOSTAWAY_API_KEY!,
        scope: "general",
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new HostawayError(`Hostaway auth failed (${res.status})`, res.status);
    const data = (await res.json()) as { access_token?: string };
    if (!data.access_token) throw new HostawayError("Hostaway auth returned no token");
    return data.access_token;
  })().catch((err) => {
    tokenPromise = null;
    throw err;
  });
  return tokenPromise;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// The account limit (20 req / 10 s) is shared with every other WeCare system that
// talks to Hostaway, so on a 429 we back off instead of hammering it.
async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await accessToken();
  let res: Response;
  for (let attempt = 0; ; attempt++) {
    res = await fetch(`${API}${path}`, {
      cache: "no-store",
      ...init,
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "Cache-control": "no-cache", ...init.headers },
    });
    if (res.status !== 429 || attempt >= 3) break;
    const retryAt = Number(res.headers.get("X-RateLimit-Retry-After")) * 1000;
    await sleep(Math.min(Math.max(retryAt - Date.now(), 1000), 10_000));
  }
  const body = (await res.json().catch(() => null)) as { status?: string; result?: unknown } | null;
  if (!res.ok || body?.status !== "success") {
    const detail = typeof body?.result === "string" ? body.result : res.statusText;
    throw new HostawayError(`Hostaway ${init.method ?? "GET"} ${path.split("?")[0]} failed (${res.status}): ${detail}`, res.status);
  }
  return body.result as T;
}

// ---------------------------------------------------------------------------
// Mapping — Hostaway returns loosely typed objects (numbers as strings, 0/1 flags)
// ---------------------------------------------------------------------------

type Raw = Record<string, unknown>;
const num = (v: unknown, fallback = 0) => (v === null || v === undefined || v === "" || Number.isNaN(Number(v)) ? fallback : Number(v));
const numOrNull = (v: unknown) => (v === null || v === undefined || v === "" || Number.isNaN(Number(v)) ? null : Number(v));
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

// Titles carry a channel suffix ("… | Wecare Hosting", "…|WeCare") that is noise on our own site.
const BRAND_SUFFIX = /\s*\|\s*we\s*care(\s*hosting)?\s*$/i;
const cleanTitle = (t: string) => t.replace(BRAND_SUFFIX, "").trim();

// Hostaway listing tags that mean "do not sell this directly".
const HIDDEN_TAGS = new Set(["inativo", "restrito"]);

function isPublic(raw: Raw): boolean {
  if (raw.specialStatus) return false;
  if (/\bteste?\b/i.test(str(raw.name))) return false;
  const tags = Array.isArray(raw.listingTags) ? (raw.listingTags as Raw[]).map((t) => str(t.name).toLowerCase()) : [];
  return !tags.some((t) => HIDDEN_TAGS.has(t));
}

/**
 * Whitelists public fields only. The raw Hostaway object also carries door codes,
 * Wi-Fi passwords, owner contacts and the exact street address — none of that may
 * ever reach a page, a cache entry or the browser.
 */
function mapListing(raw: Raw): Listing {
  const images = (Array.isArray(raw.listingImages) ? (raw.listingImages as Raw[]) : [])
    .slice()
    .sort((a, b) => num(a.sortOrder) - num(b.sortOrder))
    .slice(0, 40)
    .map((img) => ({ url: str(img.url), caption: str(img.bookingEngineCaption) || str(img.airbnbCaption) }))
    .filter((img) => isAllowedImage(img.url));
  const amenities = (Array.isArray(raw.listingAmenities) ? (raw.listingAmenities as Raw[]) : [])
    .map((a) => translateAmenity(str(a.amenityName)))
    .filter((a): a is string => Boolean(a));

  // Portuguese copy lives in the channel-specific fields; `name`/`description` are English.
  const summary = str(raw.homeawayPropertyDescription) || [str(raw.airbnbSummary), str(raw.airbnbSpace)].filter(Boolean).join("\n\n") || str(raw.description);

  return {
    id: num(raw.id),
    name: cleanTitle(str(raw.airbnbName) || str(raw.bookingcomPropertyName) || str(raw.externalListingName) || str(raw.name)),
    city: str(raw.city),
    state: str(raw.state),
    neighborhood: "",
    description: summary,
    houseRules: str(raw.houseRules),
    personCapacity: num(raw.personCapacity, 1),
    bedrooms: num(raw.bedroomsNumber),
    beds: num(raw.bedsNumber),
    bathrooms: num(raw.bathroomsNumber),
    basePrice: num(raw.price),
    currency: str(raw.currencyCode) || "BRL",
    minNights: num(raw.minNights, 1),
    maxNights: num(raw.maxNights, 365),
    checkInTime: numOrNull(raw.checkInTimeStart),
    checkOutTime: numOrNull(raw.checkOutTime),
    // Rounded to ~1 km: enough for "which area", never the building.
    lat: numOrNull(raw.lat) === null ? null : Math.round(num(raw.lat) * 100) / 100,
    lng: numOrNull(raw.lng) === null ? null : Math.round(num(raw.lng) * 100) / 100,
    rating: numOrNull(raw.averageReviewRating),
    images,
    amenities: [...new Set(amenities)],
  };
}

function mapDay(raw: Raw): CalendarDay {
  return {
    date: str(raw.date),
    available: num(raw.isAvailable) === 1,
    price: num(raw.price),
    minimumStay: num(raw.minimumStay, 1),
    closedOnArrival: num(raw.closedOnArrival) === 1,
    closedOnDeparture: num(raw.closedOnDeparture) === 1,
  };
}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

/** Optional allowlist so only properties cleared for direct booking show up. */
function allowedIds(): Set<number> | null {
  const ids = (process.env.HOSTAWAY_LISTING_IDS ?? "").split(",").map((s) => Number(s.trim())).filter(Boolean);
  return ids.length ? new Set(ids) : null;
}

// The full listings payload is ~7 MB and takes close to a minute in one call;
// three parallel pages cut that to ~20 s. It only runs on cache revalidation.
const PAGE_SIZE = 25;

async function fetchAllRawListings(): Promise<Raw[]> {
  const pages = await Promise.all([0, 1, 2].map((p) => call<Raw[]>(`/listings?limit=${PAGE_SIZE}&offset=${p * PAGE_SIZE}&includeResources=1`)));
  const rows = pages.flat();
  for (let offset = 3 * PAGE_SIZE; pages.at(-1)?.length === PAGE_SIZE; offset += PAGE_SIZE) {
    const next = await call<Raw[]>(`/listings?limit=${PAGE_SIZE}&offset=${offset}&includeResources=1`);
    pages.push(next);
    rows.push(...next);
  }
  return rows;
}

const fetchListings = unstable_cache(
  async (): Promise<Listing[]> => {
    const rows = await fetchAllRawListings();
    const allow = allowedIds();
    return rows
      .filter(isPublic)
      .map(mapListing)
      .filter((l) => (allow ? allow.has(l.id) : true));
  },
  ["hostaway-listings"],
  { revalidate: 3600, tags: ["hostaway-listings"] },
);

export async function getListings(): Promise<Listing[]> {
  if (mockMode()) return mock.listings;
  return fetchListings();
}

export async function getListing(id: number): Promise<Listing | null> {
  return (await getListings()).find((l) => l.id === id) ?? null;
}

/** Always fresh: availability is the one thing we can never serve stale. */
export async function getCalendar(listingId: number, startDate: string, endDate: string): Promise<CalendarDay[]> {
  if (mockMode()) return mock.calendar(listingId, startDate, endDate);
  const rows = await call<Raw[]>(`/listings/${listingId}/calendar?startDate=${startDate}&endDate=${endDate}`);
  return rows.map(mapDay);
}

// ---------------------------------------------------------------------------
// Availability index — what the search page filters on
// ---------------------------------------------------------------------------

/**
 * Compact per-listing snapshot of the next INDEX_DAYS days. Search results come
 * from here (at most ~20 min stale); the listing page and checkout always
 * re-check the live calendar, so a stale entry can never produce a booking.
 */
export type AvailabilityIndex = {
  start: string;
  builtAt: string;
  listings: Record<number, { open: string; minStay: number[]; price: number[]; noArrive: string; noDepart: string }>;
};

export const INDEX_DAYS = 180;

const buildAvailabilityIndex = unstable_cache(
  async (start: string): Promise<AvailabilityIndex> => {
    const listings = await getListings();
    const end = addDays(start, INDEX_DAYS - 1);
    const index: AvailabilityIndex = { start, builtAt: new Date().toISOString(), listings: {} };
    // Two workers with a pause each: ~2 req/s, well under the shared account limit.
    const queue = [...listings];
    const worker = async () => {
      for (let listing = queue.shift(); listing; listing = queue.shift()) {
        await indexListing(listing);
        if (!mockMode()) await sleep(700);
      }
    };
    const indexListing = async (listing: Listing) => {
      try {
        const days = await getCalendar(listing.id, start, end);
        const byDate = new Map(days.map((d) => [d.date, d]));
        const entry = { open: "", minStay: [] as number[], price: [] as number[], noArrive: "", noDepart: "" };
        for (let i = 0; i < INDEX_DAYS; i++) {
          const d = byDate.get(addDays(start, i));
          entry.open += d?.available ? "1" : "0";
          entry.noArrive += d?.closedOnArrival ? "1" : "0";
          entry.noDepart += d?.closedOnDeparture ? "1" : "0";
          entry.minStay.push(d?.minimumStay ?? listing.minNights);
          entry.price.push(d?.price ?? listing.basePrice);
        }
        index.listings[listing.id] = entry;
      } catch (err) {
        console.error(`[reservas] availability index skipped listing ${listing.id}:`, err);
      }
    };
    await Promise.all([worker(), worker()]);
    return index;
  },
  ["hostaway-availability-index"],
  { revalidate: 1200, tags: ["hostaway-availability"] },
);

export async function getAvailabilityIndex(): Promise<AvailabilityIndex> {
  return buildAvailabilityIndex(todayInBrazil());
}

const COMPONENT_LABELS: Record<string, string> = {
  cleaningFee: "Taxa de limpeza",
  additionalCleaningFee: "Taxa de limpeza",
  guestChannelFee: "Taxa de serviço",
  hostChannelFee: "Taxa de serviço",
  petFee: "Taxa de pet",
  securityDepositFee: "Caução",
  extraPersonFee: "Hóspede adicional",
  weeklyDiscount: "Desconto semanal",
  monthlyDiscount: "Desconto mensal",
};

export async function getHostawayQuote(stay: StayRequest, currency: string): Promise<Quote> {
  const nights = nightsBetween(stay.checkin, stay.checkout);
  if (mockMode()) return mock.quote(stay, currency);

  const result = await call<{ totalPrice?: unknown; components?: Raw[] }>(`/listings/${stay.listingId}/calendar/priceDetails`, {
    method: "POST",
    body: JSON.stringify({ startingDate: stay.checkin, endingDate: stay.checkout, numberOfGuests: stay.guests }),
  });

  const lines: QuoteLine[] = [];
  for (const c of result.components ?? []) {
    const type = str(c.type);
    const amount = num(c.total, num(c.value));
    if (!amount || type === "totals" || type === "commissions" || num(c.isIncludedInTotalPrice, 1) !== 1) continue;
    const name = str(c.name);
    const label = type === "accommodation" ? `${nights} ${nights === 1 ? "noite" : "noites"}` : COMPONENT_LABELS[name] || str(c.title) || (type === "tax" ? "Impostos" : name);
    lines.push({ label, amount });
  }
  const total = num(result.totalPrice);
  if (!total) throw new HostawayError("Hostaway returned no price for these dates");
  if (!lines.length) lines.push({ label: `${nights} ${nights === 1 ? "noite" : "noites"}`, amount: total });

  return { ...stay, nights, currency, lines, total };
}

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

// Hostaway timestamps carry no timezone, so the hold deadline is written by us,
// as ISO-8601, into the reservation's host note and read back from there.
export const HOLD_MINUTES = 30;
const HOLD_NOTE = /Reserva do site WeCare — aguardando pagamento até (\S+)/;

function mapReservation(raw: Raw): HeldReservation {
  const expires = HOLD_NOTE.exec(str(raw.hostNote))?.[1] ?? null;
  return {
    id: num(raw.id),
    listingId: num(raw.listingMapId),
    status: str(raw.status),
    total: num(raw.totalPrice),
    isPaid: num(raw.isPaid) === 1,
    holdExpiresAt: expires && !Number.isNaN(Date.parse(expires)) ? expires : null,
    source: str(raw.source) || null,
  };
}

export async function createHold(quote: Quote, guest: GuestDetails): Promise<HeldReservation> {
  if (mockMode()) return mock.createHold(quote);
  const raw = await call<Raw>("/reservations", {
    method: "POST",
    body: JSON.stringify({
      channelId: DIRECT_CHANNEL_ID,
      listingMapId: quote.listingId,
      source: RESERVATION_SOURCE,
      arrivalDate: quote.checkin,
      departureDate: quote.checkout,
      guestFirstName: guest.firstName,
      guestLastName: guest.lastName,
      guestName: `${guest.firstName} ${guest.lastName}`,
      guestEmail: guest.email,
      phone: guest.phone,
      numberOfGuests: quote.guests,
      adults: quote.guests,
      totalPrice: quote.total,
      currency: quote.currency,
      isPaid: 0,
      status: HOLD_STATUS,
      hostNote: `Reserva do site WeCare — aguardando pagamento até ${new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString()}`,
    }),
  });
  return mapReservation(raw);
}

export async function getReservation(id: number): Promise<HeldReservation | null> {
  if (mockMode()) return mock.getReservation(id);
  try {
    return mapReservation(await call<Raw>(`/reservations/${id}`));
  } catch (err) {
    if (err instanceof HostawayError && err.status === 404) return null;
    throw err;
  }
}

export async function confirmPaid(id: number, paymentNote: string): Promise<void> {
  if (mockMode()) return mock.setStatus(id, "new");
  await call(`/reservations/${id}`, {
    method: "PUT",
    body: JSON.stringify({ status: "new", isPaid: 1, hostNote: paymentNote }),
  });
}

export async function cancelHold(id: number): Promise<void> {
  if (mockMode()) return mock.setStatus(id, "cancelled");
  await call(`/reservations/${id}/statuses/cancelled`, {
    method: "PUT",
    body: JSON.stringify({ cancelledBy: "host" }),
  });
}

/**
 * Our own unpaid holds. They are always among the most recently touched
 * reservations, so the latest 100 by activity is enough; filtering on `source`
 * guarantees we never look at a reservation another channel created.
 */
export async function listOpenHolds(): Promise<HeldReservation[]> {
  if (mockMode()) return mock.openHolds();
  const rows = await call<Raw[]>(`/reservations?limit=100&sortOrder=latestActivityDesc&channelId=${DIRECT_CHANNEL_ID}`);
  return rows.map(mapReservation).filter((r) => r.source === RESERVATION_SOURCE && r.status === HOLD_STATUS);
}
