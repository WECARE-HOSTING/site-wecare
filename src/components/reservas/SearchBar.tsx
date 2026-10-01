"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import DateRangeCalendar from "./DateRangeCalendar";
import GuestStepper from "./GuestStepper";
import { useT } from "./I18n";

export type Destination = { label: string; count: number };

type Panel = "destino" | "datas" | "hospedes" | null;

type Props = {
  destinations: Destination[];
  initial: { destino: string; checkin: string | null; checkout: string | null; hospedes: number };
};

export default function SearchBar({ destinations, initial }: Props) {
  const t = useT();
  const router = useRouter();
  const [destino, setDestino] = useState(initial.destino);
  const [checkin, setCheckin] = useState(initial.checkin);
  const [checkout, setCheckout] = useState(initial.checkout);
  const [hospedes, setHospedes] = useState(initial.hospedes);
  const [panel, setPanel] = useState<Panel>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setPanel(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  const submit = () => {
    const q = new URLSearchParams();
    if (destino) q.set("destino", destino);
    if (checkin && checkout) {
      q.set("checkin", checkin);
      q.set("checkout", checkout);
    }
    if (hospedes > 1) q.set("hospedes", String(hospedes));
    setPanel(null);
    router.push(`/reservas${q.size ? `?${q}` : ""}`);
  };

  const matches = destinations.filter((d) => d.label.toLowerCase().includes(destino.trim().toLowerCase())).slice(0, 8);

  return (
    <div className="rs-search" ref={ref}>
      <div className={`rs-search-pill${panel ? " is-active" : ""}`}>
        <label className={`rs-search-seg rs-search-dest${panel === "destino" ? " is-on" : ""}`} onClick={() => setPanel("destino")}>
          <span className="rs-search-k">{t.destination}</span>
          <input value={destino} onChange={(e) => setDestino(e.target.value)} onFocus={() => setPanel("destino")} placeholder={t.searchDestinations} aria-label={t.destination} onKeyDown={(e) => e.key === "Enter" && submit()} />
        </label>
        <button type="button" className={`rs-search-seg${panel === "datas" ? " is-on" : ""}`} onClick={() => setPanel("datas")}>
          <span className="rs-search-k">{t.checkIn}</span>
          <span className={`rs-search-v${checkin ? "" : " is-empty"}`}>{checkin ? t.date(checkin) : t.insertDates}</span>
        </button>
        <button type="button" className={`rs-search-seg${panel === "datas" ? " is-on" : ""}`} onClick={() => setPanel("datas")}>
          <span className="rs-search-k">{t.checkOut}</span>
          <span className={`rs-search-v${checkout ? "" : " is-empty"}`}>{checkout ? t.date(checkout) : t.insertDates}</span>
        </button>
        <div className={`rs-search-seg rs-search-last${panel === "hospedes" ? " is-on" : ""}`} onClick={() => setPanel("hospedes")} role="button" tabIndex={0}>
          <span className="rs-search-k">{t.who}</span>
          <span className={`rs-search-v${hospedes > 1 ? "" : " is-empty"}`}>{hospedes > 1 ? t.n(hospedes, t.guest) : t.guestsQ}</span>
        </div>
        <button type="button" className="rs-search-go" onClick={submit} aria-label={t.search}>
          <Search size={18} strokeWidth={2.4} />
          <span>{t.search}</span>
        </button>
      </div>

      {panel === "destino" && (
        <div className="rs-pop rs-pop-dest">
          <div className="rs-pop-title">{t.wecareDestinations}</div>
          {matches.length === 0 && <p className="rs-muted">{t.noDestination}</p>}
          {matches.map((d) => (
            <button
              key={d.label}
              type="button"
              className="rs-dest-opt"
              onClick={() => {
                setDestino(d.label);
                setPanel("datas");
              }}
            >
              <span className="rs-dest-ico"><MapPin size={18} /></span>
              <span>
                {d.label}
                <small>{t.n(d.count, t.property)}</small>
              </span>
            </button>
          ))}
        </div>
      )}
      {panel === "datas" && (
        <div className="rs-pop rs-pop-cal">
          <DateRangeCalendar
            checkin={checkin}
            checkout={checkout}
            onChange={(a, b) => {
              setCheckin(a);
              setCheckout(b);
              if (a && b) setPanel("hospedes");
            }}
          />
          <div className="rs-pop-foot">
            <button type="button" className="rs-link" onClick={() => { setCheckin(null); setCheckout(null); }}>{t.clearDates}</button>
          </div>
        </div>
      )}
      {panel === "hospedes" && (
        <div className="rs-pop rs-pop-guests">
          <GuestStepper value={hospedes} onChange={setHospedes} />
        </div>
      )}
    </div>
  );
}
