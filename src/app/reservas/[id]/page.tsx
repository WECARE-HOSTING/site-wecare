import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BedDouble, Bath, Clock, DoorOpen, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
import Gallery from "@/components/reservas/Gallery";
import BookingPanel from "@/components/reservas/BookingPanel";
import { getListing } from "@/lib/reservas/hostaway";
import type { Listing } from "@/lib/reservas/types";
import { isIsoDate } from "@/lib/reservas/dates";
import { amenityLabel } from "@/lib/reservas/amenities";
import { getT } from "@/lib/reservas/lang";
import { publicStars } from "@/lib/reservas/rating";

export const maxDuration = 300;

const SITE_URL = "https://www.wecarehosting.com.br";

type Params = Promise<{ id: string }>;
type Search = Promise<{ checkin?: string; checkout?: string; hospedes?: string }>;

async function load(params: Params) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return null;
  return getListing(Number(id));
}

/** English visitors get Hostaway's English copy; Portuguese and Spanish get the Portuguese listing text. */
const textFor = (listing: Listing, lang: string) => (lang === "en" ? { name: listing.nameEn || listing.name, description: listing.descriptionEn || listing.description } : { name: listing.name, description: listing.description });

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const [listing, t] = await Promise.all([load(params), getT()]);
  if (!listing) return {};
  const text = textFor(listing, t.lang);
  const description = text.description.replace(/\s+/g, " ").slice(0, 155);
  return {
    title: text.name,
    description,
    alternates: { canonical: `${SITE_URL}/reservas/${listing.id}` },
    openGraph: { title: text.name, description, url: `${SITE_URL}/reservas/${listing.id}`, images: listing.images.slice(0, 1).map((i) => i.url), locale: t.locale.replace("-", "_"), siteName: "WeCare Hosting" },
  };
}

const hour = (h: number | null) => (h === null ? null : `${String(h).padStart(2, "0")}:00`);

export default async function ListingPage({ params, searchParams }: { params: Params; searchParams: Search }) {
  const [listing, t] = await Promise.all([load(params), getT()]);
  if (!listing) notFound();
  const text = textFor(listing, t.lang);
  const stars = publicStars(listing.rating);
  const sp = await searchParams;
  const checkin = isIsoDate(sp.checkin) ? sp.checkin : null;
  const checkout = isIsoDate(sp.checkout) && checkin && sp.checkout! > checkin ? sp.checkout! : null;
  const guests = Math.max(1, Number(sp.hospedes) || 1);
  const place = listing.state && listing.state !== listing.city ? `${listing.city}, ${listing.state}` : listing.city;
  const paragraphs = text.description.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <article className="rs-wrap rs-detail">
      <header className="rs-detail-head">
        <h1 className="rs-h1">{text.name}</h1>
        <div className="rs-detail-sub">
          {stars !== null && (
            <>
              <span className="rs-card-rating"><Star size={14} fill="currentColor" /> {stars.toLocaleString(t.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span>·</span>
            </>
          )}
          {stars === null && listing.rating === null && (
            <>
              <span className="rs-card-new">{t.isNew}</span>
              <span>·</span>
            </>
          )}
          <span>{place}</span>
        </div>
      </header>

      <Gallery images={listing.images} name={text.name} />

      <div className="rs-detail-cols">
        <div className="rs-detail-main">
          <section className="rs-section rs-host">
            <div>
              <h2 className="rs-h2">{t.hostedBy}</h2>
              <p className="rs-facts">
                {t.n(listing.personCapacity, t.guest)} · {listing.bedrooms ? t.n(listing.bedrooms, t.bedroom) : t.studio} · {t.n(listing.beds || 1, t.bed)} · {t.n(listing.bathrooms || 1, t.bathroom)}
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG */}
            <img src="/brand/wecare-simbolo.svg" alt="" width={48} height={48} className="rs-host-mark" />
          </section>

          <section className="rs-section rs-highlights">
            <div><ShieldCheck size={22} /><div><strong>{t.hl1[0]}</strong><p>{t.hl1[1]}</p></div></div>
            <div><Sparkles size={22} /><div><strong>{t.hl2[0]}</strong><p>{t.hl2[1]}</p></div></div>
            <div><DoorOpen size={22} /><div><strong>{t.hl3[0]}</strong><p>{t.hl3[1]}</p></div></div>
          </section>

          {paragraphs.length > 0 && (
            <section className="rs-section">
              <h2 className="rs-h2">{t.about}</h2>
              <div className="rs-prose">{paragraphs.slice(0, 3).map((p, i) => <p key={i}>{p}</p>)}</div>
              {paragraphs.length > 3 && (
                <details className="rs-more">
                  <summary>{t.showMore}</summary>
                  <div className="rs-prose">{paragraphs.slice(3).map((p, i) => <p key={i}>{p}</p>)}</div>
                </details>
              )}
            </section>
          )}

          <section className="rs-section">
            <h2 className="rs-h2">{t.whatsHere}</h2>
            <div className="rs-facts-grid">
              <span><Users size={18} /> {t.upTo(t.n(listing.personCapacity, t.guest))}</span>
              <span><BedDouble size={18} /> {t.n(listing.beds || 1, t.bed)}</span>
              <span><Bath size={18} /> {t.n(listing.bathrooms || 1, t.bathroom)}</span>
            </div>
            {listing.amenities.length > 0 && (
              <ul className="rs-amenities">
                {listing.amenities.map((a) => <li key={a}>{amenityLabel(a, t.lang)}</li>)}
              </ul>
            )}
          </section>

          <section className="rs-section">
            <h2 className="rs-h2">{t.stayInfo}</h2>
            <div className="rs-facts-grid">
              {hour(listing.checkInTime) && <span><Clock size={18} /> {t.checkInFrom(hour(listing.checkInTime)!)}</span>}
              {hour(listing.checkOutTime) && <span><Clock size={18} /> {t.checkOutUntil(hour(listing.checkOutTime)!)}</span>}
              <span><Clock size={18} /> {t.minStay(t.n(listing.minNights, t.night))}</span>
            </div>
            {listing.houseRules && (
              <details className="rs-more">
                <summary>{t.houseRules}</summary>
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
