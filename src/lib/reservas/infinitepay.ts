import "server-only";
import type { GuestDetails, Listing, Quote } from "./types";
import { formatDateBR } from "./dates";

const API = "https://api.checkout.infinitepay.io";

export class InfinitePayError extends Error {}

export function infinitePayConfigured(): boolean {
  return Boolean(process.env.INFINITEPAY_HANDLE);
}

function handle(): string {
  const h = process.env.INFINITEPAY_HANDLE?.replace(/^\$/, "");
  if (!h) throw new InfinitePayError("INFINITEPAY_HANDLE is not configured");
  return h;
}

export const toCents = (value: number) => Math.round(value * 100);

export type OrderRef = { listingId: number; checkin: string; holdId: number };

/**
 * Our order id carries everything needed to find the order again in Hostaway
 * without a database: listing, arrival date and the hold's reservation id.
 * (The hold itself is deleted once paid, so its id alone is not enough.)
 */
export const orderNsuFor = (r: OrderRef) => `WC-${r.listingId}-${r.checkin.replaceAll("-", "")}-${r.holdId}`;

export function parseOrderNsu(orderNsu: string | null | undefined): OrderRef | null {
  const m = /^WC-(\d+)-(\d{4})(\d{2})(\d{2})-(\d+)$/.exec(orderNsu ?? "");
  return m ? { listingId: Number(m[1]), checkin: `${m[2]}-${m[3]}-${m[4]}`, holdId: Number(m[5]) } : null;
}

export async function createCheckoutLink(params: {
  order: OrderRef;
  listing: Listing;
  quote: Quote;
  guest: GuestDetails;
  siteUrl: string;
}): Promise<string> {
  const { order, listing, quote, guest, siteUrl } = params;
  const stay = `${formatDateBR(quote.checkin)} a ${formatDateBR(quote.checkout)}`;
  const res = await fetch(`${API}/links`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      handle: handle(),
      order_nsu: orderNsuFor(order),
      redirect_url: `${siteUrl}/reservas/confirmacao`,
      webhook_url: `${siteUrl}/api/infinitepay/webhook`,
      // One line with the total Hostaway calculated; the breakdown already
      // appeared on our checkout page.
      items: [{ quantity: 1, price: toCents(quote.total), description: `${listing.name} · ${stay} · ${quote.guests} hósp.`.slice(0, 250) }],
      customer: { name: `${guest.firstName} ${guest.lastName}`, email: guest.email, phone_number: guest.phone },
    }),
  });
  const body = (await res.json().catch(() => null)) as { url?: string; link?: string } | null;
  const url = body?.url ?? body?.link;
  if (!res.ok || !url) throw new InfinitePayError(`InfinitePay link creation failed (${res.status})`);
  return url;
}

export type PaymentStatus = { paid: boolean; amountCents: number; paidAmountCents: number; method: string | null; installments: number | null };

/**
 * The only source of truth for "was this paid". Webhook bodies are not signed,
 * so we always re-ask InfinitePay before confirming a reservation.
 */
export async function checkPayment(params: { orderNsu: string; transactionNsu?: string | null; slug?: string | null }): Promise<PaymentStatus> {
  const res = await fetch(`${API}/payment_check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ handle: handle(), order_nsu: params.orderNsu, transaction_nsu: params.transactionNsu ?? undefined, slug: params.slug ?? undefined }),
  });
  const b = (await res.json().catch(() => null)) as { success?: boolean; paid?: boolean; amount?: number; paid_amount?: number; capture_method?: string; installments?: number } | null;
  if (!res.ok || !b?.success) throw new InfinitePayError(`InfinitePay payment_check failed (${res.status})`);
  return { paid: Boolean(b.paid), amountCents: Number(b.amount ?? 0), paidAmountCents: Number(b.paid_amount ?? 0), method: b.capture_method ?? null, installments: b.installments ?? null };
}

