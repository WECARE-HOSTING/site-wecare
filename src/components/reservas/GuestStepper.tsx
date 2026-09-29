"use client";
import { Minus, Plus } from "lucide-react";

export default function GuestStepper({ value, onChange, max = 30 }: { value: number; onChange: (n: number) => void; max?: number }) {
  return (
    <div className="rs-stepper">
      <div>
        <div className="rs-stepper-label">Hóspedes</div>
        <div className="rs-stepper-sub">Adultos e crianças acima de 2 anos</div>
      </div>
      <div className="rs-stepper-ctrl">
        <button type="button" onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1} aria-label="Menos hóspedes">
          <Minus size={14} />
        </button>
        <span aria-live="polite">{value}</span>
        <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Mais hóspedes">
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
