"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Poi } from "@/lib/reservas/nearby";
import { CATEGORY_ICON } from "./poi-icons";
import { useT } from "./I18n";

/** The listing's rounded location (a ~700 m circle, never an exact pin) and the places its description names. */
export default function NearbyMap({ lat, lng, pois }: { lat: number; lng: number; pois: Poi[] }) {
  const t = useT();
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!host.current) return;
    const map = L.map(host.current, { scrollWheelZoom: false });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(map);
    L.circle([lat, lng], { radius: 700, color: "#9a7a3a", weight: 2, fillColor: "#d2b785", fillOpacity: 0.28 }).addTo(map);
    for (const poi of pois) {
      const icon = L.divIcon({ className: "rs-pin-wrap", html: `<span class="rs-poi">${CATEGORY_ICON[poi.category]}</span>`, iconSize: [0, 0] });
      const label = document.createElement("strong");
      label.textContent = poi.name;
      L.marker([poi.lat, poi.lng], { icon, title: poi.name }).addTo(map).bindPopup(label);
    }
    map.fitBounds(L.latLngBounds([[lat, lng], ...pois.map((p) => [p.lat, p.lng] as [number, number])]), { padding: [36, 36], maxZoom: 15 });
    const fix = window.setTimeout(() => map.invalidateSize(), 50);
    return () => {
      window.clearTimeout(fix);
      map.remove();
    };
  }, [lat, lng, pois]);

  return <div ref={host} className="rs-map rs-map-nearby" role="region" aria-label={t.nearbyTitle} />;
}
