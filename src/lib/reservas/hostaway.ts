import "server-only";
import { unstable_cache } from "next/cache";
import type { CalendarDay, GuestDetails, HeldReservation, Listing, Quote, QuoteLine, StayRequest } from "./types";
import { addDays, nightsBetween, todayInBrazil } from "./dates";
import * as mock from "./mock";
import { amenityId } from "./amenities";
import type { T } from "./i18n";
import { isAllowedImage } from "./image-hosts";

const API = "https://api.hostaway.com/v1";

// Sent as `source`, though Hostaway stores "apiv1" instead; ours are recognised by host-note markers.
export const RESERVATION_SOURCE = "site-wecare";

// Hostaway: 2000 = direct booking channel.
const DIRECT_CHANNEL_ID = 2000;

// Status a reservation sits in while the guest is paying; it blocks the calendar.
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
  const body = (await res.json().catch(() => null)) as { status?: string; result?: unknown; message?: string } | null;
  if (!res.ok || body?.status !== "success") {
    const detail = body?.message ?? (typeof body?.result === "string" ? body.result : res.statusText);
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
const BRAND_SUFFIX = /\s*[|\-–—]\s*we\s*care(\s*hosting)?\s*$/i;
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
    .map((a) => amenityId(str(a.amenityName)))
    .filter((a): a is string => Boolean(a));

  // Portuguese copy lives in the channel-specific fields; `name`/`description` are English.
  const summaryEn = str(raw.description);
  const summary = str(raw.homeawayPropertyDescription) || [str(raw.airbnbSummary), str(raw.airbnbSpace)].filter(Boolean).join("\n\n") || str(raw.description);

  return {
    id: num(raw.id),
    name: cleanTitle(str(raw.airbnbName) || str(raw.bookingcomPropertyName) || str(raw.externalListingName) || str(raw.name)),
    city: str(raw.city),
    state: str(raw.state),
    neighborhood: "",
    description: summary,
    nameEn: cleanTitle(str(raw.name)),
    descriptionEn: summaryEn,
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
  ["hostaway-listings-v2"],
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

export async function getHostawayQuote(stay: StayRequest, currency: string, t: T): Promise<Quote> {
  const nights = nightsBetween(stay.checkin, stay.checkout);
  if (mockMode()) return mock.quote(stay, currency, t);

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
    const label = type === "accommodation" && name === "baseRate" ? t.n(nights, t.night) : t.fee[name] || str(c.title) || (type === "tax" ? t.taxes : name);
    lines.push({ label, amount });
  }
  const total = num(result.totalPrice);
  if (!total) throw new HostawayError("Hostaway returned no price for these dates");
  if (!lines.length) lines.push({ label: t.n(nights, t.night), amount: total });

  return { ...stay, nights, currency, lines, total };
}

// ---------------------------------------------------------------------------
// Writes
//
// Verified against the live API (test listing 560237, 2026-09-29):
// - POST /reservations with status awaitingPayment blocks the calendar.
// - Hostaway refuses a reservation over a confirmed one (403 "Requested dates
//   are not available") but accepts it over holds and manual blocks, so we
//   check for conflicts ourselves right after creating a hold.
// - An awaitingPayment reservation can't be cancelled (403) and PUT ignores
//   status/isPaid, so it can never be promoted. On payment we create a new
//   confirmed reservation and DELETE the hold; unpaid holds are DELETEd too.
// - `source` is overwritten with "apiv1", so our reservations are recognised
//   by the markers we write into hostNote instead.
// ---------------------------------------------------------------------------

export const HOLD_MINUTES = 30;
// Hostaway timestamps carry no timezone, so the hold deadline is written by us,
// as ISO-8601, into the host note and read back from there.
const HOLD_NOTE = /Reserva do site WeCare — aguardando pagamento até (\S+)/;
const ORDER_NOTE = (orderNsu: string) => `pedido ${orderNsu}`;

// Statuses that don't occupy the calendar.
const INACTIVE = new Set(["cancelled", "declined", "expired", "inquiry", "inquiryPreapproved", "inquiryDenied", "inquiryTimedout", "inquiryNotPossible"]);

function mapReservation(raw: Raw): HeldReservation {
  const expires = HOLD_NOTE.exec(str(raw.hostNote))?.[1] ?? null;
  return {
    id: num(raw.id),
    listingId: num(raw.listingMapId),
    status: str(raw.status),
    total: num(raw.totalPrice),
    currency: str(raw.currency) || "BRL",
    checkin: str(raw.arrivalDate),
    checkout: str(raw.departureDate),
    guests: num(raw.numberOfGuests, 1),
    guest: { firstName: str(raw.guestFirstName), lastName: str(raw.guestLastName), email: str(raw.guestEmail), phone: str(raw.phone) },
    hostNote: str(raw.hostNote),
    holdExpiresAt: expires && !Number.isNaN(Date.parse(expires)) ? expires : null,
  };
}

function reservationBody(r: { listingId: number; checkin: string; checkout: string; guests: number; total: number; currency: string; guest: GuestDetails }, status: string, hostNote: string) {
  return JSON.stringify({
    channelId: DIRECT_CHANNEL_ID,
    listingMapId: r.listingId,
    source: RESERVATION_SOURCE,
    arrivalDate: r.checkin,
    departureDate: r.checkout,
    guestFirstName: r.guest.firstName,
    guestLastName: r.guest.lastName,
    guestName: `${r.guest.firstName} ${r.guest.lastName}`,
    guestEmail: r.guest.email,
    phone: r.guest.phone,
    numberOfGuests: r.guests,
    adults: r.guests,
    totalPrice: r.total,
    currency: r.currency,
    isPaid: status === "new" ? 1 : 0,
    status,
    hostNote,
  });
}

/**
 * Whatever else occupies a night of the stay: active reservations other than
 * `exceptId`, and manual blocks (reported as id 0, status "blocked").
 */
async function conflictingReservations(listingId: number, checkin: string, checkout: string, exceptId: number): Promise<{ id: number; status: string }[]> {
  const lastNight = addDays(checkout, -1);
  const days = await call<Raw[]>(`/listings/${listingId}/calendar?startDate=${checkin}&endDate=${lastNight}&includeResources=1`);
  const found = new Map<number, string>();
  for (const d of days) {
    if (str(d.status) === "blocked") found.set(0, "blocked");
    for (const r of (Array.isArray(d.reservations) ? d.reservations : []) as Raw[]) {
      if (num(r.id) !== exceptId && !INACTIVE.has(str(r.status))) found.set(num(r.id), str(r.status));
    }
  }
  return [...found].map(([id, status]) => ({ id, status }));
}

export class HoldConflictError extends Error {}

/**
 * Blocks the dates while the guest pays. Because Hostaway accepts overlapping
 * reservations, we look right after creating: if anything else now sits on
 * these nights the hold is removed again. Two simultaneous holds see each
 * other; only the older one (lower id) survives.
 */
export async function createHold(quote: Quote, guest: GuestDetails): Promise<HeldReservation> {
  if (mockMode()) return mock.createHold(quote, guest);
  const note = `Reserva do site WeCare — aguardando pagamento até ${new Date(Date.now() + HOLD_MINUTES * 60_000).toISOString()}`;
  const hold = mapReservation(
    await call<Raw>("/reservations", { method: "POST", body: reservationBody({ ...quote, guest }, HOLD_STATUS, note) }).catch((err) => {
      if (err instanceof HostawayError && err.status === 403 && /not available/i.test(err.message)) throw new HoldConflictError(err.message);
      throw err;
    }),
  );

  const conflicts = await conflictingReservations(quote.listingId, quote.checkin, quote.checkout, hold.id).catch(async (err) => {
    await releaseHold(hold.id).catch(() => {});
    throw err;
  });
  // A newer hold on the same nights yields to us (it runs this same check);
  // anything else — an older hold or a real booking — wins over ours.
  const blocking = conflicts.filter((c) => !(c.status === HOLD_STATUS && c.id > hold.id));
  if (blocking.length) {
    await releaseHold(hold.id);
    throw new HoldConflictError(`Dates taken by reservation(s) ${blocking.map((c) => c.id).join(", ")}`);
  }
  return hold;
}

export async function getReservation(id: number): Promise<HeldReservation | null> {
  if (mockMode()) return mock.getReservation(id);
  try {
    return mapReservation(await call<Raw>(`/reservations/${id}`));
  } catch (err) {
    if (err instanceof HostawayError && (err.status === 404 || err.status === 403)) return null;
    throw err;
  }
}

/** The confirmed reservation created for an order, if there is one. */
export async function findConfirmed(listingId: number, checkin: string, orderNsu: string): Promise<HeldReservation | null> {
  if (mockMode()) return mock.findConfirmed(orderNsu);
  const rows = await call<Raw[]>(`/reservations?listingId=${listingId}&arrivalStartDate=${checkin}&arrivalEndDate=${checkin}&limit=50`);
  return rows.map(mapReservation).find((r) => r.status !== HOLD_STATUS && !INACTIVE.has(r.status) && r.hostNote.includes(ORDER_NOTE(orderNsu))) ?? null;
}

/** Turns a paid hold into a confirmed reservation: create the real one first, then drop the hold, so the dates are never free in between. */
export async function confirmHold(hold: HeldReservation, orderNsu: string, paymentNote: string): Promise<HeldReservation> {
  if (mockMode()) return mock.confirmHold(hold.id, orderNsu);
  const confirmed = mapReservation(
    await call<Raw>("/reservations", { method: "POST", body: reservationBody(hold, "new", `Reserva do site WeCare — ${paymentNote} · ${ORDER_NOTE(orderNsu)}`) }),
  );
  await releaseHold(hold.id).catch((err) => console.error(`[reservas] confirmed ${confirmed.id} but could not delete hold ${hold.id}; delete it by hand`, err));
  return confirmed;
}

/** Unpaid holds are deleted, not cancelled: Hostaway refuses to cancel them, and they never were real bookings. */
export async function releaseHold(id: number): Promise<void> {
  if (mockMode()) return mock.releaseHold(id);
  await call(`/reservations/${id}`, { method: "DELETE" });
}

/** Our unpaid holds: Hostaway filters by status; the host-note marker proves the hold is ours. */
export async function listOpenHolds(): Promise<HeldReservation[]> {
  if (mockMode()) return mock.openHolds();
  const rows = await call<Raw[]>(`/reservations?status=${HOLD_STATUS}&limit=200`);
  return rows.map(mapReservation).filter((r) => r.status === HOLD_STATUS && r.holdExpiresAt !== null);
}
