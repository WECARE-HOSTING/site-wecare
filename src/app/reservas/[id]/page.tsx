import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BedDouble, Bath, Clock, DoorOpen, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
import Gallery from "@/components/reservas/Gallery";
import BookingPanel from "@/components/reservas/BookingPanel";
import { getListing } from "@/lib/reservas/hostaway";
import { isIsoDate, plural } from "@/lib/reservas/dates";

export const maxDuration = 300;

const SITE_URL = "https://www.wecarehosting.com.br";

type Params = Promise<{ id: string }>;
type Search = Promise<{ checkin?: string; checkout?: string; hospedes?: string }>;

async function load(params: Params) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return null;
  return getListing(Number(id));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const listing = await load(params);
  if (!listing) return {};
  const description = listing.description.replace(/\s+/g, " ").slice(0, 155);
  return {
    title: listing.name,
    description,
    alternates: { canonical: `${SITE_URL}/reservas/${listing.id}` },
    openGraph: { title: listing.name, description, url: `${SITE_URL}/reservas/${listing.id}`, images: listing.images.slice(0, 1).map((i) => i.url), locale: "pt_BR", siteName: "WeCare Hosting" },
  };
}

const hour = (h: number | null) => (h === null ? null : `${String(h).padStart(2, "0")}:00`);

export default async function ListingPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const listing = await load(params);
  if (!listing) notFound();
  const sp = await searchParams;
  const checkin = isIsoDate(sp.checkin) ? sp.checkin : null;
  const checkout = isIsoDate(sp.checkout) && checkin && sp.checkout! > checkin ? sp.checkout! : null;
  const guests = Math.max(1, Number(sp.hospedes) || 1);
  const place = listing.state && listing.state !== listing.city ? `${listing.city}, ${listing.state}` : listing.city;
  const paragraphs = listing.description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <article className="rs-wrap rs-detail">
      <header className="rs-detail-head">
        <h1 className="rs-h1">{listing.name}</h1>
        <div className="rs-detail-sub">
          {listing.rating ? <span className="rs-card-rating"><Star size={14} fill="currentColor" /> {(listing.rating / 2).toFixed(2).replace(".", ",")}</span> : <span className="rs-card-new">Novo</span>}
          <span>·</span>
          <span>{place}</span>
        </div>
      </header>

      <Gallery images={listing.images} name={listing.name} />

      <div className="rs-detail-cols">
        <div className="rs-detail-main">
          <section className="rs-section rs-host">
            <div>
              <h2 className="rs-h2">Hospedagem com gestão WeCare</h2>
              <p className="rs-facts">
                {plural(listing.personCapacity, "hóspede", "hóspedes")} · {listing.bedrooms ? plural(listing.bedrooms, "quarto", "quartos") : "Studio"} · {plural(listing.beds || 1, "cama", "camas")} · {plural(listing.bathrooms || 1, "banheiro", "banheiros")}
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG */}
            <img src="/brand/wecare-simbolo.svg" alt="" width={48} height={48} className="rs-host-mark" />
          </section>

          <section className="rs-section rs-highlights">
            <div><ShieldCheck size={22} /><div><strong>Reserva direta e segura</strong><p>Você reserva com a WeCare, sem intermediários e sem taxa de plataforma.</p></div></div>
            <div><Sparkles size={22} /><div><strong>Padrão de hotel boutique</strong><p>Limpeza profissional, enxoval de hotel e vistoria antes de cada chegada.</p></div></div>
            <div><DoorOpen size={22} /><div><strong>Suporte durante toda a estadia</strong><p>Nossa equipe acompanha sua hospedagem do check-in ao check-out.</p></div></div>
          </section>

          {paragraphs.length > 0 && (
            <section className="rs-section">
              <h2 className="rs-h2">Sobre este espaço</h2>
              <div className="rs-prose">{paragraphs.slice(0, 3).map((p, i) => <p key={i}>{p}</p>)}</div>
              {paragraphs.length > 3 && (
                <details className="rs-more">
                  <summary>Mostrar mais</summary>
                  <div className="rs-prose">{paragraphs.slice(3).map((p, i) => <p key={i}>{p}</p>)}</div>
                </details>
              )}
            </section>
          )}

          <section className="rs-section">
            <h2 className="rs-h2">O que tem aqui</h2>
            <div className="rs-facts-grid">
              <span><Users size={18} /> Até {plural(listing.personCapacity, "hóspede", "hóspedes")}</span>
              <span><BedDouble size={18} /> {plural(listing.beds || 1, "cama", "camas")}</span>
              <span><Bath size={18} /> {plural(listing.bathrooms || 1, "banheiro", "banheiros")}</span>
            </div>
            {listing.amenities.length > 0 && (
              <ul className="rs-amenities">
                {listing.amenities.map((a) => <li key={a}>{a}</li>)}
              </ul>
            )}
          </section>

          <section className="rs-section">
            <h2 className="rs-h2">Informações da estadia</h2>
            <div className="rs-facts-grid">
              {hour(listing.checkInTime) && <span><Clock size={18} /> Check-in a partir das {hour(listing.checkInTime)}</span>}
              {hour(listing.checkOutTime) && <span><Clock size={18} /> Check-out até as {hour(listing.checkOutTime)}</span>}
              <span><Clock size={18} /> Estadia mínima de {plural(listing.minNights, "noite", "noites")}</span>
            </div>
            {listing.houseRules && (
              <details className="rs-more">
                <summary>Regras da casa</summary>
                <div className="rs-prose">{listing.houseRules.split(/\n+/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}</div>
              </details>
            )}
          </section>
        </div>

        <aside className="rs-detail-side">
          <BookingPanel listingId={listing.id} basePrice={listing.basePrice} currency={listing.currency} personCapacity={listing.personCapacity} initial={{ checkin, checkout, guests }} />
        </aside>
      </div>
    </article>
  );
}
