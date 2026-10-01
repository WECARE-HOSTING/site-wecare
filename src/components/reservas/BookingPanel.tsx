"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import DateRangeCalendar, { type DayRules } from "./DateRangeCalendar";
import GuestStepper from "./GuestStepper";
import { addDays, todayInBrazil } from "@/lib/reservas/dates";
import { useT } from "./I18n";
import type { Quote } from "@/lib/reservas/types";

type Props = {
  listingId: number;
  basePrice: number;
  currency: string;
  personCapacity: number;
  initial: { checkin: string | null; checkout: string | null; guests: number };
};

type QuoteState = { status: "idle" } | { status: "loading" } | { status: "ok"; quote: Quote } | { status: "error"; message: string };

export default function BookingPanel({ listingId, basePrice, currency, personCapacity, initial }: Props) {
  const t = useT();
  const router = useRouter();
  const [checkin, setCheckin] = useState(initial.checkin);
  const [checkout, setCheckout] = useState(initial.checkout);
  const [guests, setGuests] = useState(Math.min(initial.guests, personCapacity));
  const [open, setOpen] = useState<"datas" | "hospedes" | null>(null);
  const [sheet, setSheet] = useState(false);
  const [rules, setRules] = useState(new Map<string, DayRules>());
  const [loadedUntil, setLoadedUntil] = useState<string | undefined>(undefined);
  // Quote results are keyed by the stay they answer; anything else is "loading".
  const [quoteResult, setQuoteResult] = useState<{ key: string; state: QuoteState } | null>(null);
  const loading = useRef(new Set<string>());

  // Calendar arrives in ~4-month chunks as the guest pages forward.
  const loadFrom = useCallback(
    (from: string) => {
      if (loading.current.has(from)) return;
      loading.current.add(from);
      fetch(`/api/reservas/calendario/${listingId}?from=${from}`)
        .then((res) => res.json() as Promise<{ days?: (DayRules & { date: string })[] }>)
        .then(({ days }) => {
          if (!days?.length) return;
          setRules((prev) => {
            const next = new Map(prev);
            for (const d of days) next.set(d.date, d);
            return next;
          });
          setLoadedUntil((prev) => (!prev || days.at(-1)!.date > prev ? days.at(-1)!.date : prev));
        })
        .catch(() => loading.current.delete(from));
    },
    [listingId],
  );

  useEffect(() => loadFrom(todayInBrazil()), [loadFrom]);

  const stayKey = checkin && checkout ? `${checkin}|${checkout}|${guests}` : null;
  useEffect(() => {
    if (!stayKey) return;
    const ctrl = new AbortController();
    const [ci, co, g] = stayKey.split("|");
    fetch("/api/reservas/cotacao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, checkin: ci, checkout: co, guests: Number(g) }),
      signal: ctrl.signal,
    })
      .then(async (res) => {
        const body = await res.json();
        setQuoteResult({ key: stayKey, state: res.ok ? { status: "ok", quote: body.quote } : { status: "error", message: body.error ?? t.quoteFailed } });
      })
      .catch((err) => {
        if (err.name !== "AbortError") setQuoteResult({ key: stayKey, state: { status: "error", message: t.offline } });
      });
    return () => ctrl.abort();
  }, [listingId, stayKey, t]);

  const quote: QuoteState = !stayKey ? { status: "idle" } : quoteResult?.key === stayKey ? quoteResult.state : { status: "loading" };

  const reserve = () => {
    if (!checkin || !checkout) return setOpen("datas");
    if (quote.status !== "ok") return;
    router.push(`/reservas/${listingId}/checkout?checkin=${checkin}&checkout=${checkout}&hospedes=${guests}`);
  };

  const onMonthChange = (ym: string) => {
    // Visible months are ym and ym+1; fetch ahead when they near the loaded edge.
    const needUntil = addDays(`${ym}-01`, 62);
    if (loadedUntil && needUntil > loadedUntil) loadFrom(addDays(loadedUntil, 1));
  };

  const nightly = quote.status === "ok" ? Math.round(quote.quote.lines[0].amount / quote.quote.nights) : basePrice;

  const panel = (
    <div className="rs-book">
      <div className="rs-book-head">
        {quote.status === "ok" ? (
          <><strong>{t.money(quote.quote.total, currency)}</strong> <span>{t.forNights(t.n(quote.quote.nights, t.night))}</span></>
        ) : quote.status === "loading" ? (
          <strong>{t.calculating}</strong>
        ) : (
          <><strong>{t.money(nightly, currency)}</strong> <span>{t.perNight}</span></>
        )}
      </div>

      <div className="rs-book-fields">
        <button type="button" className="rs-book-field" onClick={() => setOpen(open === "datas" ? null : "datas")}>
          <span className="rs-search-k">{t.checkIn}</span>
          <span>{checkin ? t.date(checkin, { day: "2-digit", month: "2-digit", year: "numeric" }) : t.add}</span>
        </button>
        <button type="button" className="rs-book-field" onClick={() => setOpen(open === "datas" ? null : "datas")}>
          <span className="rs-search-k">{t.checkOut}</span>
          <span>{checkout ? t.date(checkout, { day: "2-digit", month: "2-digit", year: "numeric" }) : t.add}</span>
        </button>
        <button type="button" className="rs-book-field is-wide" onClick={() => setOpen(open === "hospedes" ? null : "hospedes")}>
          <span className="rs-search-k">{t.guests}</span>
          <span>{t.n(guests, t.guest)}</span>
          <ChevronDown size={16} className="rs-book-chev" />
        </button>
      </div>

      {open === "datas" && (
        <div className="rs-book-pop">
          <DateRangeCalendar
            checkin={checkin}
            checkout={checkout}
            rules={rules}
            loadedUntil={loadedUntil ?? todayInBrazil()}
            onMonthChange={onMonthChange}
            onChange={(a, b) => {
              setCheckin(a);
              setCheckout(b);
              if (a && b) setOpen(null);
            }}
          />
          <div className="rs-pop-foot">
            <button type="button" className="rs-link" onClick={() => { setCheckin(null); setCheckout(null); }}>{t.clearDates}</button>
            <button type="button" className="rs-btn-dark" onClick={() => setOpen(null)}>{t.close}</button>
          </div>
        </div>
      )}
      {open === "hospedes" && (
        <div className="rs-book-pop">
          <GuestStepper value={guests} onChange={setGuests} max={personCapacity} />
          <p className="rs-muted rs-small">{t.maxGuests(t.n(personCapacity, t.guest))}</p>
        </div>
      )}

      <button type="button" className="rs-btn-gold rs-book-cta" onClick={reserve} disabled={quote.status === "loading" || quote.status === "error"}>
        {!checkin || !checkout ? t.checkAvailability : quote.status === "loading" ? t.calculating : t.reserve}
      </button>

      {quote.status === "error" && <p className="rs-error">{quote.message}</p>}
      {quote.status === "ok" && (
        <>
          <p className="rs-muted rs-small rs-center">{t.notChargedYet}</p>
          <ul className="rs-lines">
            {quote.quote.lines.map((l) => (
              <li key={l.label}><span>{l.label}</span><span>{t.money(l.amount, currency)}</span></li>
            ))}
          </ul>
          <div className="rs-total"><span>{t.total}</span><span>{t.money(quote.quote.total, currency)}</span></div>
        </>
      )}
    </div>
  );

  return (
    <>
      <div className="rs-book-desktop">{panel}</div>

      <div className="rs-book-bar">
        <div>
          {quote.status === "ok" ? (
            <><strong>{t.money(quote.quote.total, currency)}</strong><span>{t.date(checkin!)} – {t.date(checkout!)}</span></>
          ) : quote.status === "loading" ? (
            <><strong>{t.calculating}</strong><span>{t.date(checkin!)} – {t.date(checkout!)}</span></>
          ) : (
            <><strong>{t.money(nightly, currency)} <small>{t.perNight}</small></strong><span>{t.chooseDates}</span></>
          )}
        </div>
        <button type="button" className="rs-btn-gold" onClick={() => (quote.status === "ok" ? reserve() : setSheet(true))}>
          {quote.status === "ok" ? t.reserve : t.seeDates}
        </button>
      </div>

      {sheet && (
        <div className="rs-sheet" role="dialog" aria-modal="true">
          <div className="rs-sheet-bar">
            <button type="button" onClick={() => setSheet(false)} aria-label={t.close}><X size={20} /></button>
          </div>
          {panel}
        </div>
      )}
    </>
  );
}
