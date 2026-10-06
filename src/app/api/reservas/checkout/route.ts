import { getT } from "@/lib/reservas/lang";
import type { T } from "@/lib/reservas/i18n";
import { parseStay, quoteStay, StayError } from "@/lib/reservas/booking";
import { HoldConflictError, createHold, releaseHold } from "@/lib/reservas/hostaway";
import { createCheckoutLink, infinitePayConfigured } from "@/lib/reservas/infinitepay";
import { siteUrl } from "@/lib/reservas/site-url";
import type { GuestDetails } from "@/lib/reservas/types";

function parseGuest(input: Record<string, unknown>, t: T): GuestDetails {
  const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const guest = {
    firstName: text(input.firstName, 60),
    lastName: text(input.lastName, 80),
    email: text(input.email, 120).toLowerCase(),
    phone: text(input.phone, 30).replace(/[^\d+]/g, ""),
  };
  if (!guest.firstName || !guest.lastName) throw new StayError(t.errName);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) throw new StayError(t.errEmail);
  const digits = guest.phone.replace(/\D/g, "");
  if (digits.length < 10) throw new StayError(t.errPhone);
  if (!guest.phone.startsWith("+")) guest.phone = digits.startsWith("55") && digits.length >= 12 ? `+${digits}` : `+55${digits}`;
  return guest;
}

/**
 * Re-validates dates and price on the server, blocks the dates in Hostaway
 * (unpaid hold, checked for conflicts), and returns the InfinitePay URL. If the
 * payment link can't be created the hold is released immediately.
 */
export async function POST(request: Request) {
  const t = await getT();
  if (!infinitePayConfigured()) {
    return Response.json({ error: t.errPaymentsOff }, { status: 503 });
  }
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: t.errBadRequest }, { status: 400 });
  }

  try {
    const stay = parseStay(body, t);
    const guest = parseGuest((body.guest ?? {}) as Record<string, unknown>, t);
    if (body.acceptedTerms !== true) throw new StayError(t.errTerms);

    const { listing, quote } = await quoteStay(stay, t);
    if (typeof body.expectedTotal === "number" && Math.abs(body.expectedTotal - quote.total) > 0.5) {
      return Response.json({ error: t.errPriceChanged, quote }, { status: 409 });
    }

    const hold = await createHold(quote, guest).catch((err) => {
      if (err instanceof HoldConflictError) throw new StayError(t.errJustBooked);
      throw err;
    });

    try {
      const url = await createCheckoutLink({ order: { listingId: listing.id, checkin: quote.checkin, holdId: hold.id }, listing, quote, guest, siteUrl: siteUrl() });
      return Response.json({ url, reservationId: hold.id });
    } catch (err) {
      console.error(`[reservas] payment link failed, releasing hold ${hold.id}`, err);
      await releaseHold(hold.id, quote).catch((e) => console.error(`[reservas] ALERTA: não foi possível liberar a reserva ${hold.id}`, e));
      return Response.json({ error: t.errPaymentLink }, { status: 502 });
    }
  } catch (err) {
    if (err instanceof StayError) return Response.json({ error: err.message }, { status: 422 });
    console.error("[reservas] checkout failed", err);
    return Response.json({ error: t.errCheckoutFailed }, { status: 502 });
  }
}
