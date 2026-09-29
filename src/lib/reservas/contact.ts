// Same WeCare sales number the rest of the site uses (CTAFinal, Footer).
const WA = "https://wa.me/5511969760183";

export const WHATSAPP_RESERVAS = `${WA}?text=${encodeURIComponent("Olá! Quero fazer uma reserva direto com a WeCare.")}`;

export function whatsappForStay(listingName: string, checkin: string, checkout: string, guests: number): string {
  return `${WA}?text=${encodeURIComponent(`Olá! Quero reservar "${listingName}" de ${checkin} a ${checkout} para ${guests} hóspede(s).`)}`;
}
