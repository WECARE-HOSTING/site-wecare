import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { orderStatus, type AttentionReason, type SettleResult } from "@/lib/reservas/payments";
import { whatsappLink } from "@/lib/reservas/contact";
import { getT } from "@/lib/reservas/lang";

export const metadata: Metadata = {
  title: "Confirmação da reserva",
  robots: { index: false, follow: false },
};

type Search = Promise<{ order_nsu?: string; transaction_nsu?: string; slug?: string; receipt_url?: string }>;

/** InfinitePay sends the guest here after paying. Read-only: the webhook is what confirms the reservation. */
export default async function ConfirmacaoPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const t = await getT();
  const reasons: Record<AttentionReason, string> = { unknown_order: t.unknownOrder, paid_late: t.paidTooLate, amount_mismatch: t.amountMismatch };
  let result: SettleResult;
  try {
    result = await orderStatus({ orderNsu: sp.order_nsu ?? null, transactionNsu: sp.transaction_nsu, slug: sp.slug });
  } catch (err) {
    console.error("[reservas] confirmation settle failed", err);
    result = { state: "pending" };
  }
  const retry = `/reservas/confirmacao?${new URLSearchParams(Object.entries(sp).filter((e): e is [string, string] => typeof e[1] === "string"))}`;
  const receipt = sp.receipt_url?.startsWith("https://") ? sp.receipt_url : null;

  return (
    <div className="rs-wrap rs-narrow rs-confirm">
      {result.state === "confirmed" && (
        <>
          <CheckCircle2 size={48} className="rs-ok-ico" />
          <h1 className="rs-h1">{t.confirmed}</h1>
          <p>{t.confirmedBody}</p>
          <p className="rs-muted">{t.bookingCode} <strong>{result.reservationId}</strong></p>
        </>
      )}
      {result.state === "processing" && (
        <>
          <meta httpEquiv="refresh" content="5" />
          <Clock size={48} className="rs-wait-ico" />
          <h1 className="rs-h1">{t.paymentReceived}</h1>
          <p>{t.paymentReceivedBody}</p>
        </>
      )}
      {result.state === "pending" && (
        <>
          <Clock size={48} className="rs-wait-ico" />
          <h1 className="rs-h1">{t.confirmingPayment}</h1>
          <p>{t.confirmingBody}</p>
          <a href={retry} className="rs-btn-dark rs-inline-btn">{t.refresh}</a>
        </>
      )}
      {result.state === "needs_attention" && (
        <>
          <AlertTriangle size={48} className="rs-warn-ico" />
          <h1 className="rs-h1">{t.needAMinute}</h1>
          <p>{t.needAMinuteBody(reasons[result.reason])}</p>
          <a href={whatsappLink(t.whatsappGreeting)} target="_blank" rel="noopener noreferrer" className="rs-btn-gold rs-inline-btn">{t.talkOnWhatsapp}</a>
        </>
      )}
      {receipt && <p><a className="rs-link" href={receipt} target="_blank" rel="noopener noreferrer">{t.viewReceipt}</a></p>}
      <p><Link href="/reservas" className="rs-link">{t.backToBookings}</Link></p>
    </div>
  );
}
