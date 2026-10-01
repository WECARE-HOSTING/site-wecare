"use client";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { ListingCardData } from "./ListingCard";
import { useT } from "./I18n";

// Listings share rounded coordinates (~1 km), so several often land on the same spot.
// One pin per spot: its price when alone, the count when not; the popup lists them.
type Spot = { lat: number; lng: number; items: ListingCardData[] };

function groupBySpot(items: ListingCardData[]): Spot[] {
  const spots = new Map<string, Spot>();
  for (const item of items) {
    if (item.lat === null || item.lng === null) continue;
    const key = `${item.lat},${item.lng}`;
    const spot = spots.get(key) ?? { lat: item.lat, lng: item.lng, items: [] };
    spot.items.push(item);
    spots.set(key, spot);
  }
  return [...spots.values()];
}

const el = <K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text; // text nodes only: listing names are never parsed as HTML
  return node;
};

export default function ResultsMap({ items, query }: { items: ListingCardData[]; query: string }) {
  const t = useT();
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!host.current) return;
    const map = L.map(host.current, { scrollWheelZoom: false, worldCopyJump: true });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const spots = groupBySpot(items);
    for (const spot of spots) {
      const cheapest = Math.min(...spot.items.map((i) => i.nightly));
      const label = spot.items.length === 1 ? t.money(cheapest, spot.items[0].currency) : String(spot.items.length);
      const icon = L.divIcon({ className: "rs-pin-wrap", html: `<span class="rs-pin${spot.items.length > 1 ? " is-group" : ""}">${label.replace(/[<>&]/g, "")}</span>`, iconSize: [0, 0] });
      const popup = el("div", "rs-map-pop");
      for (const item of spot.items.slice(0, 5)) {
        const link = el("a", "rs-map-item");
        link.href = `/reservas/${item.id}${query}`;
        if (item.images[0]) {
          const img = el("img");
          img.src = item.images[0];
          img.alt = "";
          img.loading = "lazy";
          link.append(img);
        }
        const text = el("span");
        text.append(el("strong", undefined, item.name), el("small", undefined, `${t.money(item.nightly, item.currency)} ${t.perNight}`));
        link.append(text);
        popup.append(link);
      }
      if (spot.items.length > 5) popup.append(el("p", "rs-map-more", `+${spot.items.length - 5}`));
      L.marker([spot.lat, spot.lng], { icon }).addTo(map).bindPopup(popup, { maxWidth: 280, minWidth: 220 });
    }

    if (spots.length) map.fitBounds(L.latLngBounds(spots.map((s) => [s.lat, s.lng] as [number, number])), { padding: [40, 40], maxZoom: 13 });
    else map.setView([-14.2, -51.9], 4);

    // The page may reveal this container after layout; make sure Leaflet measured the right size.
    const fix = window.setTimeout(() => map.invalidateSize(), 50);
    return () => {
      window.clearTimeout(fix);
      map.remove();
    };
  }, [items, query, t]);

  return (
    <div className="rs-map-frame">
      <div ref={host} className="rs-map" role="region" aria-label={t.viewMap} />
      <p className="rs-map-note">{t.approxLocation}</p>
    </div>
  );
}
