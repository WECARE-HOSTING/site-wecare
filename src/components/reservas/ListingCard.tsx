"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { formatMoney, plural } from "@/lib/reservas/dates";

export type ListingCardData = {
  id: number;
  name: string;
  place: string;
  images: string[];
  personCapacity: number;
  bedrooms: number;
  rating: number | null;
  nightly: number;
  nightlyIsEstimate: boolean;
  total: number | null;
  nights: number | null;
  currency: string;
};

export default function ListingCard({ listing, query }: { listing: ListingCardData; query: string }) {
  const [i, setI] = useState(0);
  const photos = listing.images.slice(0, 6);
  const step = (e: React.MouseEvent, n: number) => {
    e.preventDefault();
    setI((v) => (v + n + photos.length) % photos.length);
  };

  return (
    <Link href={`/reservas/${listing.id}${query}`} className="rs-card">
      <div className="rs-card-media">
        {/* Only the visible photo and the next one are mounted, so a page of cards doesn't fetch 6× the images. */}
        {photos.map((src, idx) => (idx !== i && idx !== (i + 1) % photos.length ? null : (
          <Image key={src} src={src} alt="" fill sizes="(max-width: 560px) 100vw, (max-width: 880px) 50vw, (max-width: 1128px) 33vw, 300px" className={idx === i ? "is-on" : ""} />
        )))}
        {photos.length > 1 && (
          <>
            <button type="button" className="rs-card-arrow is-left" onClick={(e) => step(e, -1)} aria-label="Foto anterior"><ChevronLeft size={16} /></button>
            <button type="button" className="rs-card-arrow is-right" onClick={(e) => step(e, 1)} aria-label="Próxima foto"><ChevronRight size={16} /></button>
            <div className="rs-card-dots">
              {photos.map((_, idx) => <span key={idx} className={idx === i ? "is-on" : ""} />)}
            </div>
          </>
        )}
      </div>
      <div className="rs-card-body">
        <div className="rs-card-row">
          <span className="rs-card-place">{listing.place}</span>
          {listing.rating ? (
            <span className="rs-card-rating"><Star size={12} fill="currentColor" /> {(listing.rating / 2).toFixed(2).replace(".", ",")}</span>
          ) : (
            <span className="rs-card-new">Novo</span>
          )}
        </div>
        <div className="rs-card-name">{listing.name}</div>
        <div className="rs-card-meta">{plural(listing.personCapacity, "hóspede", "hóspedes")} · {listing.bedrooms ? plural(listing.bedrooms, "quarto", "quartos") : "Studio"}</div>
        <div className="rs-card-price">
          {listing.total && listing.nights ? (
            <>
              <strong>{formatMoney(listing.total, listing.currency)}</strong> <span>por {plural(listing.nights, "noite", "noites")}</span>
            </>
          ) : (
            <>
              <span>{listing.nightlyIsEstimate ? "A partir de " : ""}</span>
              <strong>{formatMoney(listing.nightly, listing.currency)}</strong> <span>/ noite</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
