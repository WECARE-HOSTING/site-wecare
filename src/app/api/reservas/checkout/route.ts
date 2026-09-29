import { parseStay, quoteStay, StayError } from "@/lib/reservas/booking";
import { cancelHold, createHold } from "@/lib/reservas/hostaway";
import { createCheckoutLink, infinitePayConfigured } from "@/lib/reservas/infinitepay";
import { siteUrl } from "@/lib/reservas/site-url";
import type { GuestDetails } from "@/lib/reservas/types";

function parseGuest(input: Record<string, unknown>): GuestDetails {
  const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const guest = {
    firstName: text(input.firstName, 60),
    lastName: text(input.lastName, 80),
    email: text(input.email, 120).toLowerCase(),
    phone: text(input.phone, 30).replace(/[^\d+]/g, ""),
  };
  if (!guest.firstName || !guest.lastName) throw new StayError("Informe nome e sobrenome.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email)) throw new StayError("Informe um e-mail válido.");
  const digits = guest.phone.replace(/\D/g, "");
  if (digits.length < 10) throw new StayError("Informe um telefone com DDD.");
  if (!guest.phone.startsWith("+")) guest.phone = digits.startsWith("55") && digits.length >= 12 ? `+${digits}` : `+55${digits}`;
  return guest;
}

/**
 * Re-validates dates and price on the server, blocks the dates in Hostaway
 * (unpaid hold), and returns the InfinitePay URL. If the payment link can't be
 * created the hold is released immediately.
 */
export async function POST(request: Request) {
  if (!infinitePayConfigured()) {
    return Response.json({ error: "O pagamento online ainda não está disponível. Fale com a gente pelo WhatsApp para reservar." }, { status: 503 });
  }
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Requisição inválida." }, { status: 400 });
  }

  try {
    const stay = parseStay(body);
    const guest = parseGuest((body.guest ?? {}) as Record<string, unknown>);
    if (body.acceptedTerms !== true) throw new StayError("É preciso aceitar as regras da casa e a política de cancelamento.");

    const { listing, quote } = await quoteStay(stay);
    if (typeof body.expectedTotal === "number" && Math.abs(body.expectedTotal - quote.total) > 0.5) {
      return Response.json({ error: "O preço dessas datas foi atualizado. Confira o novo valor antes de pagar.", quote }, { status: 409 });
    }

    const hold = await createHold(quote, guest).catch((err) => {
      // Overbooking protection rejects the hold if someone just took the dates.
      console.error("[reservas] hold failed", err);
      throw new StayError("Essas datas acabaram de ser reservadas. Escolha outras datas.");
    });

    try {
      const url = await createCheckoutLink({ reservationId: hold.id, listing, quote, guest, siteUrl: siteUrl() });
      return Response.json({ url, reservationId: hold.id });
    } catch (err) {
      console.error(`[reservas] payment link failed, releasing hold ${hold.id}`, err);
      await cancelHold(hold.id).catch((e) => console.error(`[reservas] ALERTA: não foi possível liberar a reserva ${hold.id}`, e));
      return Response.json({ error: "Não foi possível abrir o pagamento agora. Tente novamente em instantes." }, { status: 502 });
    }
  } catch (err) {
    if (err instanceof StayError) return Response.json({ error: err.message }, { status: 422 });
    console.error("[reservas] checkout failed", err);
    return Response.json({ error: "Não foi possível concluir agora. Tente novamente em instantes." }, { status: 502 });
  }
}
