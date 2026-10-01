import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { BedDouble, Bath, Clock, DoorOpen, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
import Gallery from "@/components/reservas/Gallery";
import ReviewCard from "@/components/reservas/ReviewCard";
import BookingPanel from "@/components/reservas/BookingPanel";
import { getListing, getReviewsWithin } from "@/lib/reservas/hostaway";
import type { Listing } from "@/lib/reservas/types";
import { isIsoDate } from "@/lib/reservas/dates";
import { amenityLabel } from "@/lib/reservas/amenities";
import { getT } from "@/lib/reservas/lang";
import { publicStars } from "@/lib/reservas/rating";
import { translateCaptions, translateText } from "@/lib/reservas/translate";

export const maxDuration = 300;

const SITE_URL = "https://www.wecarehosting.com.br";

type Params = Promise<{ id: string }>;
type Search = Promise<{ checkin?: string; checkout?: string; hospedes?: string }>;

// Memoized per request: generateMetadata and the page both ask for the same listing.
const loadById = cache(async (id: string) => (/^\d+$/.test(id) ? getListing(Number(id)) : null));
async function load(params: Params) {
  return loadById((await params).id);
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
  const reviews = await getReviewsWithin(listing.id, 2500);
  const sp = await searchParams;
  const checkin = isIsoDate(sp.checkin) ? sp.checkin : null;
  const checkout = isIsoDate(sp.checkout) && checkin && sp.checkout! > checkin ? sp.checkout! : null;
  const guests = Math.max(1, Number(sp.hospedes) || 1);
  const place = listing.state && listing.state !== listing.city ? `${listing.city}, ${listing.state}` : listing.city;
  // Machine translations come from the cache (see translate.ts). Anything not ready yet falls back
  // to the Portuguese original, with a note, and is there on the next visit.
  const target = t.lang === "pt" ? null : t.lang;
  const [esSections, rulesTranslated, captions] = target
    ? await Promise.all([
        target === "es" ? Promise.all(listing.sections.map((s) => translateText("description", "es", s.text))) : null,
        listing.houseRules ? translateText("rules", target, listing.houseRules) : null,
        translateCaptions(target, listing.images.map((i) => i.caption)),
      ])
    : [null, null, null];
  const images = captions ? listing.images.map((img, i) => ({ ...img, caption: captions[i] ?? img.caption })) : listing.images;
  const houseRules = rulesTranslated ?? listing.houseRules;
  const rulesInOriginal = target !== null && Boolean(listing.houseRules) && rulesTranslated === null;
  // English: Hostaway's own full description. Portuguese/Spanish: the same description rebuilt
  // from the section fields, each with a heading (Spanish translated by us when available).
  const split = (s: string) => s.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const blocks: { title?: string; paragraphs: string[] }[] =
    t.lang === "en" && listing.descriptionEn
      ? [{ paragraphs: split(listing.descriptionEn) }]
      : listing.sections.map((s, i) => ({ title: t.sectionTitle[s.key], paragraphs: split(esSections?.[i] ?? s.text) }));
  const shownBlocks = blocks.slice(0, 2);
  const moreBlocks = blocks.slice(2);
  // A single English block has no sections to fold, so fold by paragraphs instead.
  const foldByParagraph = blocks.length === 1;
  const translated = t.lang === "pt" || (t.lang === "en" && Boolean(listing.descriptionEn)) || (t.lang === "es" && esSections !== null && esSections.every((s) => s !== null));

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

      <Gallery images={images} name={text.name} />

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

          {blocks.length > 0 && (
            <section className="rs-section">
              <h2 className="rs-h2">{t.about}</h2>
              {foldByParagraph ? (
                <>
                  <div className="rs-prose">{blocks[0].paragraphs.slice(0, 4).map((p, i) => <p key={i}>{p}</p>)}</div>
                  {blocks[0].paragraphs.length > 4 && (
                    <details className="rs-more">
                      <summary>{t.showMore}</summary>
                      <div className="rs-prose">{blocks[0].paragraphs.slice(4).map((p, i) => <p key={i}>{p}</p>)}</div>
                    </details>
                  )}
                </>
              ) : (
                <>
                  {shownBlocks.map((b) => (
                    <div key={b.title} className="rs-prose">
                      {b.title && b.title !== t.sectionTitle.summary && <h3 className="rs-h3">{b.title}</h3>}
                      {b.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                    </div>
                  ))}
                  {moreBlocks.length > 0 && (
                    <details className="rs-more">
                      <summary>{t.showMore}</summary>
                      {moreBlocks.map((b) => (
                        <div key={b.title} className="rs-prose">
                          <h3 className="rs-h3">{b.title}</h3>
                          {b.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                        </div>
                      ))}
                    </details>
                  )}
                </>
              )}
              {!translated && t.descriptionOriginalPt && <p className="rs-muted rs-small">{t.descriptionOriginalPt}</p>}
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

          {reviews.items.length > 0 && (
            <section className="rs-section" id="avaliacoes">
              <h2 className="rs-h2">
                {t.reviewsTitle}
                <span className="rs-reviews-meta">
                  {stars !== null && <><Star size={15} fill="currentColor" /> {stars.toLocaleString(t.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} · </>}
                  {t.reviewCount(reviews.total)}
                </span>
              </h2>
              {/* Every published review is shown, not a selection. The stars follow the same rule as the
                  listing score: below the public threshold they are left out, the text stays. */}
              <div className="rs-reviews">
                {reviews.items.slice(0, 6).map((r, i) => <ReviewCard key={i} review={r} showStars={stars !== null} />)}
              </div>
              {reviews.items.length > 6 && (
                <details className="rs-more">
                  <summary>{reviews.total > reviews.items.length ? t.showRecentReviews(reviews.items.length) : t.showAllReviews(reviews.total)}</summary>
                  <div className="rs-reviews">
                    {reviews.items.slice(6).map((r, i) => <ReviewCard key={i} review={r} showStars={stars !== null} />)}
                  </div>
                </details>
              )}
            </section>
          )}

          <section className="rs-section">
            <h2 className="rs-h2">{t.stayInfo}</h2>
            <div className="rs-facts-grid">
              {hour(listing.checkInTime) && <span><Clock size={18} /> {t.checkInFrom(hour(listing.checkInTime)!)}</span>}
              {hour(listing.checkOutTime) && <span><Clock size={18} /> {t.checkOutUntil(hour(listing.checkOutTime)!)}</span>}
              <span><Clock size={18} /> {t.minStay(t.n(listing.minNights, t.night))}</span>
            </div>
            {houseRules && (
              <details className="rs-more">
                <summary>{t.houseRules}</summary>
                <div className="rs-prose">
                  {rulesInOriginal && t.rulesOriginalPt && <p className="rs-muted rs-small">{t.rulesOriginalPt}</p>}
                  {houseRules.split(/\n+/).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)}
                </div>
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
