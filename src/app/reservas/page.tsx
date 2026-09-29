import type { Metadata } from "next";
import Link from "next/link";
import SearchBar, { type Destination } from "@/components/reservas/SearchBar";
import ListingCard, { type ListingCardData } from "@/components/reservas/ListingCard";
import { getAvailabilityIndex, getListings } from "@/lib/reservas/hostaway";
import { matchesIndex } from "@/lib/reservas/booking";
import { isIsoDate, nightsBetween, plural, todayInBrazil } from "@/lib/reservas/dates";
import type { Listing } from "@/lib/reservas/types";

// A cold cache (first request after the Hostaway data expires) can take a while.
export const maxDuration = 300;

export const metadata: Metadata = {
  title: "Reserve direto com a WeCare",
  description: "Apartamentos, casas de praia e refúgios com o padrão WeCare. Veja a disponibilidade em tempo real e reserve direto, sem taxas de plataforma.",
  alternates: { canonical: "https://www.wecarehosting.com.br/reservas" },
};

type Search = { destino?: string; checkin?: string; checkout?: string; hospedes?: string };

const placeOf = (l: Listing) => (l.state && l.state !== l.city ? `${l.city}, ${l.state}` : l.city);
const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

export default async function ReservasPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const destino = (sp.destino ?? "").slice(0, 80);
  const guests = Math.max(1, Math.min(50, Number(sp.hospedes) || 1));
  const hasDates = isIsoDate(sp.checkin) && isIsoDate(sp.checkout) && sp.checkin < sp.checkout && sp.checkin >= todayInBrazil();
  const checkin = hasDates ? sp.checkin! : null;
  const checkout = hasDates ? sp.checkout! : null;

  const listings = await getListings();
  const index = hasDates ? await getAvailabilityIndex() : null;

  const counts = new Map<string, number>();
  for (const l of listings) if (l.city) counts.set(placeOf(l), (counts.get(placeOf(l)) ?? 0) + 1);
  const destinations: Destination[] = [...counts].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count);

  const q = norm(destino);
  const results: ListingCardData[] = [];
  for (const l of listings) {
    if (q && !norm(`${placeOf(l)} ${l.name}`).includes(q)) continue;
    if (guests > l.personCapacity) continue;
    let nightly = l.basePrice;
    let estimate = true;
    if (index && checkin && checkout) {
      const m = matchesIndex(l, { listingId: l.id, checkin, checkout, guests }, index);
      if (!m.ok) continue;
      if (m.nightlyAverage) {
        nightly = m.nightlyAverage;
        estimate = false;
      }
    }
    const nights = checkin && checkout ? nightsBetween(checkin, checkout) : null;
    results.push({
      id: l.id,
      name: l.name,
      place: placeOf(l),
      images: l.images.slice(0, 6).map((i) => i.url),
      personCapacity: l.personCapacity,
      bedrooms: l.bedrooms,
      rating: l.rating,
      nightly,
      nightlyIsEstimate: estimate,
      // Nightly rates only; cleaning and fees are added on the listing page quote.
      total: nights && !estimate ? nightly * nights : null,
      nights: !estimate ? nights : null,
      currency: l.currency,
    });
  }
  results.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

  const query = new URLSearchParams();
  if (checkin && checkout) {
    query.set("checkin", checkin);
    query.set("checkout", checkout);
  }
  if (guests > 1) query.set("hospedes", String(guests));
  const qs = query.size ? `?${query}` : "";

  return (
    <>
      <section className="rs-hero">
        <div className="rs-wrap">
          <h1 className="rs-hero-title">Hospede-se com o <em>padrão WeCare</em>.</h1>
          <p className="rs-hero-sub">Reserve direto com quem cuida do imóvel — disponibilidade em tempo real, sem taxa de plataforma.</p>
          <SearchBar destinations={destinations} initial={{ destino, checkin, checkout, hospedes: guests }} />
        </div>
      </section>

      <section className="rs-wrap rs-results">
        <div className="rs-chips" aria-label="Destinos">
          <Link href={`/reservas${qs}`} className={`rs-chip${q ? "" : " is-on"}`}>Todos</Link>
          {destinations.slice(0, 10).map((d) => {
            const p = new URLSearchParams(query);
            p.set("destino", d.label);
            return (
              <Link key={d.label} href={`/reservas?${p}`} className={`rs-chip${norm(d.label) === q ? " is-on" : ""}`}>{d.label}</Link>
            );
          })}
        </div>

        <p className="rs-results-count">
          {results.length ? plural(results.length, "acomodação", "acomodações") : "Nenhuma acomodação"}
          {destino ? ` em ${destino}` : ""}
          {checkin && checkout ? ` disponíveis para ${plural(nightsBetween(checkin, checkout), "noite", "noites")}` : ""}
        </p>

        {results.length ? (
          <div className="rs-grid">
            {results.map((r) => <ListingCard key={r.id} listing={r} query={qs} />)}
          </div>
        ) : (
          <div className="rs-empty">
            <p>Não encontramos imóveis para essa busca. Tente outras datas ou outro destino.</p>
            <Link href="/reservas" className="rs-btn-dark rs-inline-btn">Ver todos os imóveis</Link>
          </div>
        )}
      </section>
    </>
  );
}
