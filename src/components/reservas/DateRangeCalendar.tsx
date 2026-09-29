"use client";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, nightsBetween, todayInBrazil } from "@/lib/reservas/dates";

export type DayRules = { available: boolean; minimumStay: number; closedOnArrival: boolean; closedOnDeparture: boolean; price?: number };

type Props = {
  checkin: string | null;
  checkout: string | null;
  onChange: (checkin: string | null, checkout: string | null) => void;
  /** Per-day availability. Omitted (search bar) = every future day is open. */
  rules?: Map<string, DayRules>;
  /** Dates beyond what `rules` covers yet; shown as loading instead of unavailable. */
  loadedUntil?: string;
  onMonthChange?: (firstVisibleMonth: string) => void;
};

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const monthLabel = (ym: string) => {
  const label = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${ym}-01T00:00:00Z`));
  return label.charAt(0).toUpperCase() + label.slice(1);
};
const addMonths = (ym: string, n: number) => {
  const d = new Date(`${ym}-01T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString().slice(0, 7);
};

function monthCells(ym: string): (string | null)[] {
  const first = new Date(`${ym}-01T00:00:00Z`);
  const cells: (string | null)[] = Array(first.getUTCDay()).fill(null);
  for (let d = `${ym}-01`; d.startsWith(ym); d = addDays(d, 1)) cells.push(d);
  return cells;
}

export default function DateRangeCalendar({ checkin, checkout, onChange, rules, loadedUntil, onMonthChange }: Props) {
  const today = todayInBrazil();
  const [month, setMonth] = useState((checkin ?? today).slice(0, 7));
  const [hover, setHover] = useState<string | null>(null);

  const go = (n: number) => {
    const next = addMonths(month, n);
    if (next < today.slice(0, 7)) return;
    setMonth(next);
    onMonthChange?.(next);
  };

  // With a check-in chosen, the first blocked night after it caps the stay: you
  // can check out on that day (the next guest arrives then) but not after it.
  const maxCheckout = useMemo(() => {
    if (!checkin || checkout || !rules) return null;
    for (let d = checkin, i = 0; i < 400; d = addDays(d, 1), i++) {
      const r = rules.get(d);
      if (loadedUntil && d > loadedUntil) return null;
      if (!r?.available) return d;
    }
    return null;
  }, [checkin, checkout, rules, loadedUntil]);

  const minCheckout = checkin && !checkout ? addDays(checkin, Math.max(rules?.get(checkin)?.minimumStay ?? 1, 1)) : null;

  type State = "past" | "loading" | "blocked" | "ok" | "tooShort";
  const stateOf = (d: string): State => {
    if (d < today) return "past";
    const choosingCheckout = checkin && !checkout && d > checkin;
    if (!rules) return "ok";
    if (loadedUntil && d > loadedUntil) return "loading";
    if (choosingCheckout) {
      if (maxCheckout && d > maxCheckout) return "blocked";
      if (rules.get(d)?.closedOnDeparture) return "blocked";
      if (minCheckout && d < minCheckout) return "tooShort";
      return "ok";
    }
    const r = rules.get(d);
    return r?.available && !r.closedOnArrival ? "ok" : "blocked";
  };

  const pick = (d: string) => {
    const s = stateOf(d);
    const choosingCheckout = checkin && !checkout && d > checkin;
    if (choosingCheckout && s === "ok") return onChange(checkin, d);
    if (choosingCheckout && s === "tooShort") return;
    // Otherwise this click starts a new range, if the day can be an arrival.
    const r = rules?.get(d);
    if (d < today || (rules && (!r?.available || r.closedOnArrival))) return;
    onChange(d, null);
  };

  const rangeEnd = checkout ?? (checkin && hover && hover > checkin && stateOf(hover) === "ok" ? hover : null);

  const renderMonth = (ym: string) => (
    <div className="rs-cal-month" key={ym}>
      <div className="rs-cal-title">{monthLabel(ym)}</div>
      <div className="rs-cal-grid" role="grid">
        {WEEKDAYS.map((w, i) => (
          <div key={i} className="rs-cal-wd">{w}</div>
        ))}
        {monthCells(ym).map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const s = stateOf(d);
          const isStart = d === checkin;
          const isEnd = d === rangeEnd;
          const inRange = checkin && rangeEnd && d > checkin && d < rangeEnd;
          const disabled = s === "past" || s === "blocked" || s === "loading";
          const tooShort = s === "tooShort";
          return (
            <button
              key={d}
              type="button"
              className={["rs-cal-day", disabled && "is-disabled", tooShort && "is-short", isStart && "is-start", isEnd && "is-end", inRange && "is-range", rangeEnd && isStart && "has-range"].filter(Boolean).join(" ")}
              disabled={disabled}
              onClick={() => pick(d)}
              onMouseEnter={() => setHover(d)}
              aria-pressed={isStart || isEnd}
              aria-label={d}
              title={tooShort && minCheckout && checkin ? `Mínimo de ${nightsBetween(checkin, minCheckout)} noites` : undefined}
            >
              <span>{Number(d.slice(8))}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="rs-cal" onMouseLeave={() => setHover(null)}>
      <div className="rs-cal-nav">
        <button type="button" onClick={() => go(-1)} disabled={month <= today.slice(0, 7)} aria-label="Mês anterior">
          <ChevronLeft size={18} />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Próximo mês">
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="rs-cal-months">
        {renderMonth(month)}
        {renderMonth(addMonths(month, 1))}
      </div>
      {checkin && !checkout && minCheckout && nightsBetween(checkin, minCheckout) > 1 && (
        <p className="rs-cal-hint">Estadia mínima de {nightsBetween(checkin, minCheckout)} noites a partir desta data.</p>
      )}
    </div>
  );
}
