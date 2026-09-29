import "server-only";
import type { CalendarDay, GuestDetails, HeldReservation, Listing, Quote, StayRequest } from "./types";
import { addDays, nightsBetween, stayNights } from "./dates";

// Sample data used only when Hostaway credentials are absent outside production
// (see useMock in hostaway.ts). Photos are the site's own portfolio uploads.

const img = (name: string, caption = "") => ({ url: `/uploads/${name}`, caption });

const AMENITIES = ["Wi-Fi rápido", "Ar-condicionado", "Cozinha completa", "Máquina de lavar", "Espaço de trabalho", "Roupa de cama e banho", "Smart TV", "Portaria 24h"];

export const listings: Listing[] = [
  {
    id: 900001,
    name: "Apartamento com vista no Itaim Bibi",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Itaim Bibi",
    description:
      "Apartamento de alto padrão a poucos passos da Faria Lima, com sala ampla, varanda com vista da cidade e acabamento de hotel boutique.\n\nIdeal para estadias a trabalho ou lazer: cozinha equipada, espaço de trabalho e roupa de cama de hotel. Check-in autônomo e suporte WeCare 24h.",
    houseRules: "Não é permitido fumar. Não são permitidas festas ou eventos.",
    personCapacity: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 2,
    basePrice: 690,
    currency: "BRL",
    minNights: 2,
    maxNights: 90,
    checkInTime: 15,
    checkOutTime: 11,
    lat: -23.585,
    lng: -46.68,
    rating: 9.7,
    images: [img("apto-vista-sp-capital.jpg", "Vista"), img("apto-itaim-sala-poltronas.jpg", "Sala"), img("quarto-vista-noturna-sp.jpg", "Quarto"), img("banheiro-spa-detalhe.jpg", "Banheiro"), img("apartamento-itaim-sala-estar.jpg", "Sala de estar")],
    amenities: AMENITIES,
  },
  {
    id: 900002,
    name: "Duplex com banheira nos Jardins",
    city: "São Paulo",
    state: "SP",
    neighborhood: "Jardins",
    description: "Duplex com pé-direito duplo, banheira e decoração assinada, no coração dos Jardins. Restaurantes, cafés e a Oscar Freire a uma caminhada.",
    houseRules: "Não é permitido fumar. Pets não são permitidos.",
    personCapacity: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1.5,
    basePrice: 540,
    currency: "BRL",
    minNights: 1,
    maxNights: 60,
    checkInTime: 15,
    checkOutTime: 11,
    lat: -23.564,
    lng: -46.665,
    rating: 9.5,
    images: [img("duplex-escada-banheira.jpg"), img("loft-sala-jantar-poltrona-bolha.jpg"), img("banheiro-spa-detalhe.jpg"), img("quarto-vista-noturna-sp.jpg"), img("apto-itaim-sala-poltronas.jpg")],
    amenities: AMENITIES.slice(0, 6),
  },
  {
    id: 900003,
    name: "Casa com piscina e jardim na serra",
    city: "Campos do Jordão",
    state: "SP",
    neighborhood: "Capivari",
    description: "Casa espaçosa cercada de verde, com piscina, jardim e lareira. Perfeita para famílias e grupos que querem descansar longe da cidade.",
    houseRules: "Pets pequenos são bem-vindos mediante aviso. Silêncio após as 22h.",
    personCapacity: 10,
    bedrooms: 4,
    beds: 6,
    bathrooms: 4,
    basePrice: 1450,
    currency: "BRL",
    minNights: 3,
    maxNights: 30,
    checkInTime: 16,
    checkOutTime: 12,
    lat: -22.739,
    lng: -45.591,
    rating: 9.8,
    images: [img("casa-jardim-piscina.jpg"), img("casa-passargada-005.jpg"), img("loft-sala-jantar-poltrona-bolha.jpg"), img("banheiro-spa-detalhe.jpg"), img("apartamento-itaim-sala-estar.jpg")],
    amenities: [...AMENITIES.slice(0, 6), "Piscina", "Lareira", "Churrasqueira", "Estacionamento gratuito"],
  },
  {
    id: 900004,
    name: "Casa de praia com piscina na lagoa",
    city: "Florianópolis",
    state: "SC",
    neighborhood: "Lagoa da Conceição",
    description: "Casa de praia com piscina de frente para a lagoa, deck para o pôr do sol e acesso rápido às praias do leste da ilha.",
    houseRules: "Não é permitido fumar dentro de casa.",
    personCapacity: 8,
    bedrooms: 3,
    beds: 5,
    bathrooms: 3,
    basePrice: 1190,
    currency: "BRL",
    minNights: 2,
    maxNights: 30,
    checkInTime: 15,
    checkOutTime: 11,
    lat: -27.6,
    lng: -48.47,
    rating: null,
    images: [img("litoral-piscina-lagoa.jpg"), img("casa-passargada-005.jpg"), img("eco-retiros.jpg"), img("quarto-vista-noturna-sp.jpg"), img("banheiro-spa-detalhe.jpg")],
    amenities: [...AMENITIES.slice(0, 6), "Piscina", "Vista para a lagoa", "Estacionamento gratuito"],
  },
];

/** Deterministic pseudo-occupancy so the calendar looks realistic and stable. */
function isBooked(listingId: number, date: string): boolean {
  let h = listingId;
  for (const ch of date.slice(0, 7)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const day = Number(date.slice(8, 10));
  const start = (h % 20) + 3;
  return (day >= start && day < start + 4) || (day >= (start + 11) % 28 && day < ((start + 11) % 28) + 2);
}

// Mirrors Hostaway: holds and confirmed reservations are separate records.
const reservations = new Map<number, HeldReservation>();

export function calendar(listingId: number, startDate: string, endDate: string): CalendarDay[] {
  const listing = listings.find((l) => l.id === listingId);
  if (!listing) return [];
  const days: CalendarDay[] = [];
  for (let d = startDate; d <= endDate; d = addDays(d, 1)) {
    const weekday = new Date(`${d}T00:00:00Z`).getUTCDay();
    const held = [...reservations.values()].some((h) => h.listingId === listingId && d >= h.checkin && d < h.checkout);
    days.push({
      date: d,
      available: !isBooked(listingId, d) && !held,
      price: Math.round(listing.basePrice * (weekday === 5 || weekday === 6 ? 1.2 : 1)),
      minimumStay: listing.minNights,
      closedOnArrival: false,
      closedOnDeparture: false,
    });
  }
  return days;
}

export function quote(stay: StayRequest, currency: string): Quote {
  const listing = listings.find((l) => l.id === stay.listingId)!;
  const nights = nightsBetween(stay.checkin, stay.checkout);
  const days = calendar(stay.listingId, stay.checkin, addDays(stay.checkout, -1));
  const lodging = stayNights(stay.checkin, stay.checkout).reduce((sum, d) => sum + (days.find((x) => x.date === d)?.price ?? listing.basePrice), 0);
  const cleaning = Math.round(listing.basePrice * 0.35);
  return {
    ...stay,
    nights,
    currency,
    lines: [
      { label: `${nights} ${nights === 1 ? "noite" : "noites"}`, amount: lodging },
      { label: "Taxa de limpeza", amount: cleaning },
    ],
    total: lodging + cleaning,
  };
}

let nextId = 700001;

export function createHold(q: Quote, guest: GuestDetails): HeldReservation {
  const hold: HeldReservation = {
    id: nextId++,
    listingId: q.listingId,
    status: "awaitingPayment",
    total: q.total,
    currency: q.currency,
    checkin: q.checkin,
    checkout: q.checkout,
    guests: q.guests,
    guest,
    hostNote: "",
    holdExpiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
  };
  reservations.set(hold.id, hold);
  return hold;
}

export function getReservation(id: number): HeldReservation | null {
  return reservations.get(id) ?? null;
}

export function findConfirmed(orderNsu: string): HeldReservation | null {
  return [...reservations.values()].find((r) => r.status === "new" && r.hostNote.includes(`pedido ${orderNsu}`)) ?? null;
}

export function confirmHold(holdId: number, orderNsu: string): HeldReservation {
  const hold = reservations.get(holdId)!;
  const confirmed = { ...hold, id: nextId++, status: "new", hostNote: `pedido ${orderNsu}`, holdExpiresAt: null };
  reservations.set(confirmed.id, confirmed);
  reservations.delete(holdId);
  return confirmed;
}

export function releaseHold(id: number): void {
  reservations.delete(id);
}

export function openHolds(): HeldReservation[] {
  return [...reservations.values()].filter((h) => h.status === "awaitingPayment");
}
