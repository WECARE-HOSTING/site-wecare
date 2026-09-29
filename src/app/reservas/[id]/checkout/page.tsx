import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import CheckoutForm from "@/components/reservas/CheckoutForm";
import { parseStay, quoteStay, StayError } from "@/lib/reservas/booking";
import { infinitePayConfigured } from "@/lib/reservas/infinitepay";
import { whatsappForStay } from "@/lib/reservas/contact";
import { formatDateBR, formatMoney, plural } from "@/lib/reservas/dates";

export const maxDuration = 300;

export const metadata: Metadata = {
  title: "Confirmar e pagar",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ checkin?: string; checkout?: string; hospedes?: string }> };

export default async function CheckoutPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const back = `/reservas/${id}?${new URLSearchParams({ ...(sp.checkin && { checkin: sp.checkin }), ...(sp.checkout && { checkout: sp.checkout }), ...(sp.hospedes && { hospedes: sp.hospedes }) })}`;

  let result: Awaited<ReturnType<typeof quoteStay>>;
  try {
    result = await quoteStay(parseStay({ listingId: id, checkin: sp.checkin, checkout: sp.checkout, guests: sp.hospedes }));
  } catch (err) {
    const message = err instanceof StayError ? err.message : "Não foi possível verificar a disponibilidade agora. Tente novamente em instantes.";
    if (!(err instanceof StayError)) console.error("[reservas] checkout page quote failed", err);
    return (
      <div className="rs-wrap rs-narrow">
        <h1 className="rs-h1">Não foi possível continuar</h1>
        <p className="rs-error">{message}</p>
        <Link href={back} className="rs-btn-dark rs-inline-btn">Escolher outras datas</Link>
      </div>
    );
  }

  const { listing, quote } = result;
  const cover = listing.images[0]?.url;

  return (
    <div className="rs-wrap rs-checkout">
      <div className="rs-checkout-head">
        <Link href={back} className="rs-back" aria-label="Voltar"><ChevronLeft size={20} /></Link>
        <h1 className="rs-h1">Confirmar e pagar</h1>
      </div>

      <div className="rs-checkout-cols">
        <div>
          <section className="rs-section">
            <h2 className="rs-h2">Sua viagem</h2>
            <div className="rs-trip-row"><div><strong>Datas</strong><p>{formatDateBR(quote.checkin, { day: "numeric", month: "long" })} – {formatDateBR(quote.checkout, { day: "numeric", month: "long", year: "numeric" })}</p></div><Link href={back} className="rs-link">Editar</Link></div>
            <div className="rs-trip-row"><div><strong>Hóspedes</strong><p>{plural(quote.guests, "hóspede", "hóspedes")}</p></div><Link href={back} className="rs-link">Editar</Link></div>
          </section>
          <CheckoutForm
            listingId={listing.id}
            checkin={quote.checkin}
            checkout={quote.checkout}
            guests={quote.guests}
            total={quote.total}
            currency={quote.currency}
            paymentsEnabled={infinitePayConfigured()}
            whatsappHref={whatsappForStay(listing.name, formatDateBR(quote.checkin), formatDateBR(quote.checkout), quote.guests)}
          />
        </div>

        <aside className="rs-summary">
          <div className="rs-summary-listing">
            {cover && <Image src={cover} alt="" width={220} height={180} />}
            <div>
              <strong>{listing.name}</strong>
              <span>{listing.city}</span>
            </div>
          </div>
          <h3 className="rs-h3">Detalhes do preço</h3>
          <ul className="rs-lines">
            {quote.lines.map((l) => <li key={l.label}><span>{l.label}</span><span>{formatMoney(l.amount, quote.currency)}</span></li>)}
          </ul>
          <div className="rs-total"><span>Total ({quote.currency})</span><span>{formatMoney(quote.total, quote.currency)}</span></div>
        </aside>
      </div>
    </div>
  );
}
