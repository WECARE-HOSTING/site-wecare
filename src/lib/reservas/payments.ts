import "server-only";
import { HOLD_STATUS, confirmHold, findConfirmed, getReservation, listOpenHolds, releaseHold } from "./hostaway";
import { checkPayment, infinitePayConfigured, orderNsuFor, parseOrderNsu, toCents } from "./infinitepay";

/** Why a payment needs a human; the confirmation page words it in the guest's language. */
export type AttentionReason = "unknown_order" | "paid_late" | "amount_mismatch";

export type SettleResult =
  | { state: "confirmed"; reservationId: number }
  | { state: "processing" } // paid, confirmation not written yet
  | { state: "pending" } // not paid (yet)
  | { state: "needs_attention"; reason: AttentionReason };

type PaymentRef = { orderNsu: string | null; transactionNsu?: string | null; slug?: string | null };

/**
 * Read-only status for the guest's return page. Only the webhook and the expiry
 * job write, so two requests can never both create the confirmed reservation.
 */
export async function orderStatus(ref: PaymentRef): Promise<SettleResult> {
  const order = parseOrderNsu(ref.orderNsu);
  if (!order || !ref.orderNsu) return { state: "needs_attention", reason: "unknown_order" };
  const confirmed = await findConfirmed(order.listingId, order.checkin, ref.orderNsu);
  if (confirmed) return { state: "confirmed", reservationId: confirmed.id };
  const payment = await checkPayment({ orderNsu: ref.orderNsu, transactionNsu: ref.transactionNsu, slug: ref.slug });
  return payment.paid ? { state: "processing" } : { state: "pending" };
}

/**
 * Turns a paid hold into a confirmed reservation. Called by the InfinitePay
 * webhook and by the expiry job (for holds whose webhook never arrived).
 * Safe to repeat: an order that already has its confirmed reservation is a no-op.
 */
export async function settlePayment(ref: PaymentRef): Promise<SettleResult> {
  const order = parseOrderNsu(ref.orderNsu);
  if (!order || !ref.orderNsu) return { state: "needs_attention", reason: "unknown_order" };

  const already = await findConfirmed(order.listingId, order.checkin, ref.orderNsu);
  if (already) return { state: "confirmed", reservationId: already.id };

  const payment = await checkPayment({ orderNsu: ref.orderNsu, transactionNsu: ref.transactionNsu, slug: ref.slug });
  if (!payment.paid) return { state: "pending" };

  const hold = await getReservation(order.holdId);
  if (!hold || hold.status !== HOLD_STATUS) {
    // Paid after the hold expired and was released: the dates may be gone.
    console.error(`[reservas] ALERTA: pedido ${ref.orderNsu} pago, mas a reserva provisória ${order.holdId} não existe mais — confirmar manualmente ou estornar.`);
    return { state: "needs_attention", reason: "paid_late" };
  }
  // paid_amount can exceed amount when the guest pays card-installment interest;
  // what must match is the charged amount against the reservation total.
  if (payment.amountCents < toCents(hold.total)) {
    console.error(`[reservas] ALERTA: pedido ${ref.orderNsu} pago com ${payment.amountCents} centavos, abaixo do total ${hold.total}.`);
    return { state: "needs_attention", reason: "amount_mismatch" };
  }

  const paymentNote = `paga via InfinitePay (${payment.method ?? "?"}${payment.installments && payment.installments > 1 ? `, ${payment.installments}x` : ""})${ref.transactionNsu ? ` · transação ${ref.transactionNsu}` : ""}`;
  const confirmed = await confirmHold(hold, ref.orderNsu, paymentNote);
  return { state: "confirmed", reservationId: confirmed.id };
}

/** Releases holds past their deadline — after one last check that they were not paid. */
export async function expireHolds(now = Date.now()): Promise<{ checked: number; released: number[]; confirmed: number[] }> {
  const holds = await listOpenHolds();
  const released: number[] = [];
  const confirmed: number[] = [];
  for (const hold of holds) {
    if (!hold.holdExpiresAt || Date.parse(hold.holdExpiresAt) > now) continue;
    if (infinitePayConfigured()) {
      try {
        const result = await settlePayment({ orderNsu: orderNsuFor({ listingId: hold.listingId, checkin: hold.checkin, holdId: hold.id }) });
        if (result.state === "confirmed") {
          confirmed.push(hold.id);
          continue;
        }
      } catch (err) {
        console.error(`[reservas] payment check failed for hold ${hold.id}; releasing anyway`, err);
      }
    }
    await releaseHold(hold.id);
    released.push(hold.id);
  }
  return { checked: holds.length, released, confirmed };
}
