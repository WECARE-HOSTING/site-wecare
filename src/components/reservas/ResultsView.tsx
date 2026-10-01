"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { List, Map as MapIcon } from "lucide-react";
import ListingCard, { type ListingCardData } from "./ListingCard";
import { useT } from "./I18n";

// Leaflet touches `window`, and most visitors never open the map: load it on demand, browser only.
const ResultsMap = dynamic(() => import("./ResultsMap"), { ssr: false, loading: () => <div className="rs-map rs-skel" /> });

export default function ResultsView({ items, query, priority }: { items: ListingCardData[]; query: string; priority: boolean }) {
  const t = useT();
  const [view, setView] = useState<"list" | "map">("list");
  const canMap = items.some((i) => i.lat !== null && i.lng !== null);

  return (
    <>
      {canMap && (
        <div className="rs-view-toggle" role="group" aria-label={t.viewMode}>
          <button type="button" className={view === "list" ? "is-on" : ""} aria-pressed={view === "list"} onClick={() => setView("list")}>
            <List size={16} /> {t.viewList}
          </button>
          <button type="button" className={view === "map" ? "is-on" : ""} aria-pressed={view === "map"} onClick={() => setView("map")}>
            <MapIcon size={16} /> {t.viewMap}
          </button>
        </div>
      )}
      {view === "map" && canMap ? (
        <ResultsMap items={items} query={query} />
      ) : (
        <div className="rs-grid">
          {items.map((r, n) => <ListingCard key={r.id} listing={r} query={query} priority={priority && n < 4} />)}
        </div>
      )}
    </>
  );
}
