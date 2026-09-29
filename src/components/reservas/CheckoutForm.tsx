"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";
import { formatMoney } from "@/lib/reservas/dates";

type Props = {
  listingId: number;
  checkin: string;
  checkout: string;
  guests: number;
  total: number;
  currency: string;
  paymentsEnabled: boolean;
  whatsappHref: string;
};

export default function CheckoutForm({ listingId, checkin, checkout, guests, total, currency, paymentsEnabled, whatsappHref }: Props) {
  const router = useRouter();
  const [guest, setGuest] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof guest) => (e: React.ChangeEvent<HTMLInputElement>) => setGuest((g) => ({ ...g, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/reservas/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, checkin, checkout, guests, guest, acceptedTerms: accepted, expectedTotal: total }),
      });
      const body = await res.json();
      if (res.ok && body.url) {
        window.location.href = body.url;
        return;
      }
      setError(body.error ?? "Não foi possível continuar.");
      if (res.status === 409) router.refresh(); // price changed: re-render the summary with the new total
    } catch {
      setError("Sem conexão. Tente novamente.");
    }
    setBusy(false);
  };

  if (!paymentsEnabled) {
    return (
      <div className="rs-section">
        <h2 className="rs-h2">Pagamento</h2>
        <p>O pagamento online será liberado em breve. Para garantir essas datas agora, fale com a nossa equipe — respondemos em minutos.</p>
        <a className="rs-btn-gold rs-inline-btn" href={whatsappHref} target="_blank" rel="noopener noreferrer">Reservar pelo WhatsApp</a>
      </div>
    );
  }

  return (
    <form className="rs-section" onSubmit={submit}>
      <h2 className="rs-h2">Seus dados</h2>
      <div className="rs-form-grid">
        <label className="rs-input"><span>Nome</span><input required autoComplete="given-name" value={guest.firstName} onChange={set("firstName")} /></label>
        <label className="rs-input"><span>Sobrenome</span><input required autoComplete="family-name" value={guest.lastName} onChange={set("lastName")} /></label>
        <label className="rs-input"><span>E-mail</span><input required type="email" autoComplete="email" value={guest.email} onChange={set("email")} /></label>
        <label className="rs-input"><span>Celular com DDD</span><input required type="tel" autoComplete="tel" placeholder="(11) 99999-9999" value={guest.phone} onChange={set("phone")} /></label>
      </div>

      <label className="rs-check">
        <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} required />
        <span>Li e aceito as regras da casa e a política de cancelamento deste imóvel.</span>
      </label>

      {error && <p className="rs-error">{error}</p>}

      <button type="submit" className="rs-btn-gold rs-pay-btn" disabled={busy}>
        <Lock size={16} /> {busy ? "Abrindo pagamento…" : `Pagar ${formatMoney(total, currency)}`}
      </button>
      <p className="rs-muted rs-small">
        Você será levado ao checkout seguro da InfinitePay (Pix ou cartão em até 12x). As datas ficam reservadas para você por 30 minutos enquanto o pagamento é concluído.
      </p>
    </form>
  );
}
