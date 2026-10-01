import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Headset, Sparkles } from "lucide-react";
import SearchBar, { type Destination } from "@/components/reservas/SearchBar";
import ListingCard, { type ListingCardData } from "@/components/reservas/ListingCard";
import ResultsView from "@/components/reservas/ResultsView";
import { getAvailabilityIndex, getListings } from "@/lib/reservas/hostaway";
import { matchesIndex } from "@/lib/reservas/booking";
import { isIsoDate, nightsBetween, todayInBrazil } from "@/lib/reservas/dates";
import { getT } from "@/lib/reservas/lang";
import { publicStars } from "@/lib/reservas/rating";
import { FILTER_AMENITIES, amenityLabel } from "@/lib/reservas/amenities";
import type { Listing } from "@/lib/reservas/types";

// A cold cache (first request after the Hostaway data expires) can take a while.
export const maxDuration = 300;

export const metadata: Metadata = {
  title: "Reserve direto com a WeCare",
  description: "Apartamentos, casas de praia e refúgios com o padrão WeCare. Veja a disponibilidade em tempo real e reserve direto, sem taxas de plataforma.",
  alternates: { canonical: "https://www.wecarehosting.com.br/reservas" },
};

type Search = { destino?: string; checkin?: string; checkout?: string; hospedes?: string; comodidades?: string };

const placeOf = (l: Listing) => (l.state && l.state !== l.city ? `${l.city}, ${l.state}` : l.city);
const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

// The photo behind the search bar. Change the id to feature another property; when it is not
// (or no longer) among our listings the best-rated one is used.
const HERO_LISTING_ID = 415609;

// Cities that count as "near the sea" for the home-page section.
const COAST_CITIES = new Set(
  ["Bertioga", "Guarujá", "Maraú", "Ubatuba", "Ilhabela", "São Sebastião", "Caraguatatuba", "Santos", "Praia Grande", "Paraty", "Angra dos Reis", "Búzios", "Cabo Frio", "Arraial do Cabo", "Trancoso", "Porto Seguro", "Itacaré"].map(norm),
);

const STANDARD_ICONS = [BadgeCheck, Headset, Sparkles];

export default async function ReservasPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const t = await getT();
  const destino = (sp.destino ?? "").slice(0, 80);
  const guests = Math.max(1, Math.min(50, Number(sp.hospedes) || 1));
  const hasDates = isIsoDate(sp.checkin) && isIsoDate(sp.checkout) && sp.checkin < sp.checkout && sp.checkin >= todayInBrazil();
  const checkin = hasDates ? sp.checkin! : null;
  const checkout = hasDates ? sp.checkout! : null;
  const selectedSlugs = (sp.comodidades ?? "").split(",").filter((slug) => FILTER_AMENITIES.some((a) => a.slug === slug));
  const selectedIds = selectedSlugs.map((slug) => FILTER_AMENITIES.find((a) => a.slug === slug)!.id);
  // Curated sections are the landing page; any search or filter goes straight to the results.
  const searching = Boolean(destino || hasDates || sp.hospedes || selectedSlugs.length);

  const listings = await getListings();
  const index = hasDates ? await getAvailabilityIndex() : null;
  const nameOf = (l: Listing) => (t.lang === "en" ? l.nameEn || l.name : l.name);

  const counts = new Map<string, number>();
  for (const l of listings) if (l.city) counts.set(placeOf(l), (counts.get(placeOf(l)) ?? 0) + 1);
  const destinations: Destination[] = [...counts].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);

  const card = (l: Listing, nightly: number, estimate: boolean, nights: number | null): ListingCardData => ({
    id: l.id,
    name: nameOf(l),
    place: placeOf(l),
    images: l.images.slice(0, 6).map((i) => i.url),
    personCapacity: l.personCapacity,
    bedrooms: l.bedrooms,
    stars: publicStars(l.rating),
    unrated: l.rating === null,
    nightly,
    nightlyIsEstimate: estimate,
    // Nightly rates only; cleaning and fees are added on the listing page quote.
    total: nights && !estimate ? nightly * nights : null,
    nights: !estimate ? nights : null,
    currency: l.currency,
    lat: l.lat,
    lng: l.lng,
  });

  const q = norm(destino);
  const results: ListingCardData[] = [];
  for (const l of listings) {
    if (q && !norm(`${placeOf(l)} ${l.name}`).includes(q)) continue;
    if (guests > l.personCapacity) continue;
    if (selectedIds.some((id) => !l.amenities.includes(id))) continue;
    let nightly = l.basePrice;
    let estimate = true;
    if (index && checkin && checkout) {
      const m = matchesIndex(t, l, { listingId: l.id, checkin, checkout, guests }, index);
      if (!m.ok) continue;
      if (m.nightlyAverage) {
        nightly = m.nightlyAverage;
        estimate = false;
      }
    }
    results.push(card(l, nightly, estimate, checkin && checkout ? nightsBetween(checkin, checkout) : null));
  }
  const starsById = new Map(listings.map((l) => [l.id, publicStars(l.rating)]));
  results.sort((a, b) => (starsById.get(b.id) ?? 0) - (starsById.get(a.id) ?? 0));

  // The query string that carries a search over to a listing page.
  const query = new URLSearchParams();
  if (checkin && checkout) {
    query.set("checkin", checkin);
    query.set("checkout", checkout);
  }
  if (guests > 1) query.set("hospedes", String(guests));
  const qs = query.size ? `?${query}` : "";

  // Links that keep the current search and change one filter.
  const hrefWith = (change: (p: URLSearchParams) => void) => {
    const p = new URLSearchParams();
    if (destino) p.set("destino", destino);
    if (checkin && checkout) {
      p.set("checkin", checkin);
      p.set("checkout", checkout);
    }
    if (sp.hospedes) p.set("hospedes", String(guests));
    if (selectedSlugs.length) p.set("comodidades", selectedSlugs.join(","));
    change(p);
    return `/reservas${p.size ? `?${p}` : ""}`;
  };
  const toggleAmenity = (slug: string) =>
    hrefWith((p) => {
      const next = selectedSlugs.includes(slug) ? selectedSlugs.filter((x) => x !== slug) : [...selectedSlugs, slug];
      if (next.length) p.set("comodidades", next.join(","));
      else p.delete("comodidades");
    });

  // Home-page sections (no dates yet, so prices are "from" nightly rates).
  const nearSea = listings.filter((l) => COAST_CITIES.has(norm(l.city))).slice(0, 8).map((l) => card(l, l.basePrice, true, null));
  const premiumSp = listings
    .filter((l) => norm(l.city) === "sao paulo")
    .sort((a, b) => b.basePrice - a.basePrice)
    .slice(0, 8)
    .map((l) => card(l, l.basePrice, true, null));

  const hero = listings.find((l) => l.id === HERO_LISTING_ID && l.images.length) ?? [...listings].filter((l) => l.images.length).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))[0];

  const curated = (title: string, sub: string, items: ListingCardData[]) =>
    items.length ? (
      <section className="rs-wrap rs-block">
        <h2 className="rs-h2">{title}</h2>
        <p className="rs-block-sub">{sub}</p>
        <div className="rs-grid">{items.map((r) => <ListingCard key={r.id} listing={r} query="" />)}</div>
      </section>
    ) : null;

  return (
    <>
      <section className={`rs-hero${hero ? " rs-hero-photo" : ""}`}>
        {hero && (
          <>
            <div className="rs-hero-bg" aria-hidden="true">
              <Image src={hero.images[0].url} alt="" fill priority sizes="100vw" />
            </div>
            <div className="rs-hero-shade" aria-hidden="true" />
          </>
        )}
        <div className="rs-wrap rs-hero-in">
          <h1 className="rs-hero-title">{t.heroA} <em>{t.heroEm}</em>.</h1>
          <p className="rs-hero-sub">{t.heroSub}</p>
          <SearchBar destinations={destinations} initial={{ destino, checkin, checkout, hospedes: sp.hospedes ? guests : null }} />
        </div>
        {hero && (
          <Link href={`/reservas/${hero.id}`} className="rs-hero-credit">{t.heroCredit(nameOf(hero))}</Link>
        )}
      </section>

      {!searching && (
        <>
          <section className="rs-wrap rs-block rs-standard">
            <h2 className="rs-h2">{t.standardTitle}</h2>
            <div className="rs-standard-grid">
              {t.standardItems.map(([title, text], i) => {
                const Icon = STANDARD_ICONS[i];
                return (
                  <div key={title} className="rs-standard-item">
                    <span className="rs-standard-ico"><Icon size={22} /></span>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                );
              })}
            </div>
          </section>
          {curated(t.nearSeaTitle, t.nearSeaSub, nearSea)}
          {curated(t.premiumSpTitle, t.premiumSpSub, premiumSp)}
        </>
      )}

      <section className="rs-wrap rs-results">
        {!searching && <h2 className="rs-h2 rs-all-title">{t.allStays}</h2>}
        <div className="rs-chips" aria-label={t.destinations}>
          <Link href={hrefWith((p) => p.delete("destino"))} className={`rs-chip${q ? "" : " is-on"}`}>{t.all}</Link>
          {destinations.slice(0, 10).map((d) => (
            <Link key={d.label} href={hrefWith((p) => p.set("destino", d.label))} className={`rs-chip${norm(d.label) === q ? " is-on" : ""}`}>{d.label}</Link>
          ))}
        </div>
        <div className="rs-chips rs-chips-amenities" aria-label={t.amenitiesFilter}>
          {FILTER_AMENITIES.map((a) => (
            <Link key={a.slug} href={toggleAmenity(a.slug)} scroll={false} className={`rs-chip${selectedSlugs.includes(a.slug) ? " is-on" : ""}`} aria-pressed={selectedSlugs.includes(a.slug)}>
              {amenityLabel(a.id, t.lang)}
            </Link>
          ))}
          {selectedSlugs.length > 0 && <Link href={hrefWith((p) => p.delete("comodidades"))} scroll={false} className="rs-chip rs-chip-clear">{t.clearFilters}</Link>}
        </div>

        <p className="rs-results-count">
          {results.length ? t.n(results.length, t.accommodation) : t.noAccommodation}
          {destino ? t.inPlace(destino) : ""}
          {checkin && checkout ? t.availableFor(t.n(nightsBetween(checkin, checkout), t.night)) : ""}
        </p>

        {results.length ? (
          <ResultsView items={results} query={qs} priority={searching} />
        ) : (
          <div className="rs-empty">
            <p>{t.emptySearch}</p>
            <Link href="/reservas" className="rs-btn-dark rs-inline-btn">{t.seeAll}</Link>
          </div>
        )}
      </section>
    </>
  );
}
