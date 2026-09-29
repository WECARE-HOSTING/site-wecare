import "server-only";
import { HOLD_STATUS, cancelHold, confirmPaid, getReservation, listOpenHolds } from "./hostaway";
import { checkPayment, infinitePayConfigured, orderNsuFor, reservationIdFrom, toCents } from "./infinitepay";

export type SettleResult =
  | { state: "confirmed"; reservationId: number }
  | { state: "pending"; reservationId: number | null }
  | { state: "needs_attention"; reservationId: number | null; reason: string };

/**
 * Moves a hold to a confirmed reservation once InfinitePay says it is paid.
 * Called by both the webhook and the guest's return page — whichever arrives
 * first does the work; the other sees it already confirmed. Safe to repeat.
 */
export async function settlePayment(params: { orderNsu: string | null; transactionNsu?: string | null; slug?: string | null }): Promise<SettleResult> {
  const reservationId = reservationIdFrom(params.orderNsu);
  if (!reservationId || !params.orderNsu) return { state: "needs_attention", reservationId: null, reason: "Pedido não reconhecido." };

  const reservation = await getReservation(reservationId);
  if (!reservation) return { state: "needs_attention", reservationId, reason: "Reserva não encontrada na Hostaway." };
  if (reservation.status !== HOLD_STATUS && reservation.status !== "cancelled" && reservation.isPaid) {
    return { state: "confirmed", reservationId };
  }

  const payment = await checkPayment({ orderNsu: params.orderNsu, transactionNsu: params.transactionNsu, slug: params.slug });
  if (!payment.paid) return { state: "pending", reservationId };

  // paid_amount can exceed amount when the guest pays card-installment interest;
  // what must match is the charged amount against the reservation total.
  if (payment.amountCents < toCents(reservation.total)) {
    console.error(`[reservas] ALERTA: pagamento de ${payment.amountCents} centavos menor que o total da reserva ${reservationId} (${reservation.total}).`);
    return { state: "needs_attention", reservationId, reason: "Valor pago diferente do total da reserva." };
  }

  const note = `Reserva do site WeCare — paga via InfinitePay (${payment.method ?? "?"}${payment.installments && payment.installments > 1 ? `, ${payment.installments}x` : ""}) · pedido ${params.orderNsu}${params.transactionNsu ? ` · transação ${params.transactionNsu}` : ""}`;
  try {
    // Also covers a hold the sweeper already released: Hostaway's overbooking
    // protection re-accepts it only if nobody else took the dates meanwhile.
    await confirmPaid(reservationId, note);
    return { state: "confirmed", reservationId };
  } catch (err) {
    console.error(`[reservas] ALERTA: reserva ${reservationId} foi paga mas não pôde ser confirmada — verificar e, se preciso, estornar.`, err);
    return { state: "needs_attention", reservationId, reason: "Pagamento recebido, mas as datas não puderam ser confirmadas automaticamente." };
  }
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
        const result = await settlePayment({ orderNsu: orderNsuFor(hold.id) });
        if (result.state === "confirmed") {
          confirmed.push(hold.id);
          continue;
        }
      } catch (err) {
        console.error(`[reservas] payment check failed for hold ${hold.id}; releasing anyway`, err);
      }
    }
    await cancelHold(hold.id);
    released.push(hold.id);
  }
  return { checked: holds.length, released, confirmed };
}
