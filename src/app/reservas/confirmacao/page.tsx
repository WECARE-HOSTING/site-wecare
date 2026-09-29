import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { settlePayment, type SettleResult } from "@/lib/reservas/payments";
import { WHATSAPP_RESERVAS } from "@/lib/reservas/contact";

export const metadata: Metadata = {
  title: "Confirmação da reserva",
  robots: { index: false, follow: false },
};

type Search = Promise<{ order_nsu?: string; transaction_nsu?: string; slug?: string; receipt_url?: string }>;

/** InfinitePay sends the guest here after paying; we settle right away instead of waiting for the webhook. */
export default async function ConfirmacaoPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  let result: SettleResult;
  try {
    result = await settlePayment({ orderNsu: sp.order_nsu ?? null, transactionNsu: sp.transaction_nsu, slug: sp.slug });
  } catch (err) {
    console.error("[reservas] confirmation settle failed", err);
    result = { state: "pending", reservationId: null };
  }
  const retry = `/reservas/confirmacao?${new URLSearchParams(Object.entries(sp).filter((e): e is [string, string] => typeof e[1] === "string"))}`;
  const receipt = sp.receipt_url?.startsWith("https://") ? sp.receipt_url : null;

  return (
    <div className="rs-wrap rs-narrow rs-confirm">
      {result.state === "confirmed" && (
        <>
          <CheckCircle2 size={48} className="rs-ok-ico" />
          <h1 className="rs-h1">Reserva confirmada!</h1>
          <p>Pagamento recebido e datas garantidas. Você vai receber a confirmação e as instruções de chegada por e-mail e WhatsApp.</p>
          <p className="rs-muted">Código da reserva: <strong>{result.reservationId}</strong></p>
        </>
      )}
      {result.state === "pending" && (
        <>
          <Clock size={48} className="rs-wait-ico" />
          <h1 className="rs-h1">Estamos confirmando seu pagamento</h1>
          <p>Assim que a InfinitePay confirmar, sua reserva é concluída automaticamente e você recebe a confirmação por e-mail. Pagamentos via Pix costumam levar poucos segundos.</p>
          <a href={retry} className="rs-btn-dark rs-inline-btn">Atualizar</a>
        </>
      )}
      {result.state === "needs_attention" && (
        <>
          <AlertTriangle size={48} className="rs-warn-ico" />
          <h1 className="rs-h1">Precisamos de um minuto seu</h1>
          <p>{result.reason} Nossa equipe já foi avisada e vai falar com você — se preferir, chame a gente agora no WhatsApp.</p>
          <a href={WHATSAPP_RESERVAS} target="_blank" rel="noopener noreferrer" className="rs-btn-gold rs-inline-btn">Falar no WhatsApp</a>
        </>
      )}
      {receipt && <p><a className="rs-link" href={receipt} target="_blank" rel="noopener noreferrer">Ver comprovante do pagamento</a></p>}
      <p><Link href="/reservas" className="rs-link">Voltar para as reservas</Link></p>
    </div>
  );
}
