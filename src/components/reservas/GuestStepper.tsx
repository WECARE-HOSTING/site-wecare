"use client";
import { Minus, Plus } from "lucide-react";
import { useT } from "./I18n";

export default function GuestStepper({ value, onChange, max = 30 }: { value: number; onChange: (n: number) => void; max?: number }) {
  const t = useT();
  return (
    <div className="rs-stepper">
      <div>
        <div className="rs-stepper-label">{t.guests}</div>
        <div className="rs-stepper-sub">{t.guestsHint}</div>
      </div>
      <div className="rs-stepper-ctrl">
        <button type="button" onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1} aria-label={t.fewerGuests}>
          <Minus size={14} />
        </button>
        <span aria-live="polite">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={t.moreGuests}>
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
