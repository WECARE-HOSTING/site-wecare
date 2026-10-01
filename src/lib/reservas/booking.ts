import "server-only";
import type { CalendarDay, Listing, Quote, StayRequest } from "./types";
import type { T } from "./i18n";
import { isIsoDate, nightsBetween, stayNights, todayInBrazil } from "./dates";
import { getCalendar, getHostawayQuote, getListing, type AvailabilityIndex } from "./hostaway";

export class StayError extends Error {}

/** Parses untrusted input (query string or JSON body) into a StayRequest. */
export function parseStay(input: { listingId?: unknown; checkin?: unknown; checkout?: unknown; guests?: unknown }, t: T): StayRequest {
  const listingId = Number(input.listingId);
  const guests = Number(input.guests ?? 1);
  if (!Number.isInteger(listingId) || listingId <= 0) throw new StayError(t.errInvalidListing);
  if (!isIsoDate(input.checkin) || !isIsoDate(input.checkout)) throw new StayError(t.errPickDates);
  if (!Number.isInteger(guests) || guests < 1 || guests > 50) throw new StayError(t.errInvalidGuests);
  return { listingId, checkin: input.checkin, checkout: input.checkout, guests };
}

/** Rules shared by the live check and the search index: returns a reason or null. */
function stayProblem(t: T, listing: Listing, stay: StayRequest, day: (date: string) => Pick<CalendarDay, "available" | "minimumStay" | "closedOnArrival" | "closedOnDeparture"> | undefined): string | null {
  const nights = nightsBetween(stay.checkin, stay.checkout);
  if (stay.checkin < todayInBrazil()) return t.errCheckinPast;
  if (nights < 1) return t.errCheckoutAfter;
  if (stay.guests > listing.personCapacity) return t.errCapacity(listing.personCapacity);
  if (nights > listing.maxNights) return t.errMaxNights(listing.maxNights);
  for (const date of stayNights(stay.checkin, stay.checkout)) {
    if (!day(date)?.available) return t.errUnavailable;
  }
  const arrival = day(stay.checkin)!;
  const minStay = Math.max(arrival.minimumStay || 1, 1);
  if (nights < minStay) return t.errMinStay(minStay);
  if (arrival.closedOnArrival) return t.errNoArrival;
  if (day(stay.checkout)?.closedOnDeparture) return t.errNoDeparture;
  return null;
}

/**
 * The authoritative check before showing a price or taking money: live calendar
 * plus Hostaway's own price calculation. Never trust a total sent by the browser.
 */
export async function quoteStay(stay: StayRequest, t: T): Promise<{ listing: Listing; quote: Quote }> {
  const listing = await getListing(stay.listingId);
  if (!listing) throw new StayError(t.errListingNotFound);
  const days = await getCalendar(listing.id, stay.checkin, stay.checkout);
  const byDate = new Map(days.map((d) => [d.date, d]));
  const problem = stayProblem(t, listing, stay, (d) => byDate.get(d));
  if (problem) throw new StayError(problem);
  const quote = await getHostawayQuote(stay, listing.currency, t);
  return { listing, quote };
}

/** Search-time check against the cached index. Null when the dates fall outside it. */
export function matchesIndex(t: T, listing: Listing, stay: StayRequest, index: AvailabilityIndex): { ok: boolean; nightlyAverage: number | null } {
  const entry = index.listings[listing.id];
  const offset = nightsBetween(index.start, stay.checkin);
  const nights = nightsBetween(stay.checkin, stay.checkout);
  if (!entry || offset < 0 || offset + nights > entry.open.length) {
    return { ok: stay.guests <= listing.personCapacity, nightlyAverage: null };
  }
  const day = (date: string) => {
    const i = nightsBetween(index.start, date);
    if (i < 0 || i >= entry.open.length) return undefined;
    return { available: entry.open[i] === "1", minimumStay: entry.minStay[i], closedOnArrival: entry.noArrive[i] === "1", closedOnDeparture: entry.noDepart[i] === "1" };
  };
  // Checkout day may sit one past the index window; treat it as unrestricted.
  const checkoutDay = day(stay.checkout) ?? { available: true, minimumStay: 1, closedOnArrival: false, closedOnDeparture: false };
  const ok = stayProblem(t, listing, stay, (d) => (d === stay.checkout ? checkoutDay : day(d))) === null;
  const prices = entry.price.slice(offset, offset + nights);
  return { ok, nightlyAverage: prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : null };
}
