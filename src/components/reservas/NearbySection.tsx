"use client";
import dynamic from "next/dynamic";
import type { Poi } from "@/lib/reservas/nearby";
import { CATEGORY_ICON } from "./poi-icons";
import { useT } from "./I18n";

const NearbyMap = dynamic(() => import("./NearbyMap"), { ssr: false, loading: () => <div className="rs-map rs-map-nearby rs-skel" /> });

export default function NearbySection({ lat, lng, pois }: { lat: number; lng: number; pois: Poi[] }) {
  const t = useT();
  return (
    <section className="rs-section" id="por-perto">
      <h2 className="rs-h2">{t.nearbyTitle}</h2>
      <NearbyMap lat={lat} lng={lng} pois={pois} />
      <ul className="rs-poi-list">
        {pois.map((p) => (
          <li key={p.name}><span aria-hidden="true">{CATEGORY_ICON[p.category]}</span> {p.name} <small>{t.poiCategory[p.category]}</small></li>
        ))}
      </ul>
      <p className="rs-map-note">{t.nearbyNote}</p>
    </section>
  );
}
