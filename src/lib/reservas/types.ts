export type ListingImage = { url: string; caption: string };

export type Listing = {
  id: number;
  name: string;
  city: string;
  state: string;
  neighborhood: string;
  description: string;
  houseRules: string;
  personCapacity: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  basePrice: number;
  currency: string;
  minNights: number;
  maxNights: number;
  checkInTime: number | null;
  checkOutTime: number | null;
  lat: number | null;
  lng: number | null;
  rating: number | null;
  images: ListingImage[];
  amenities: string[];
};

export type CalendarDay = {
  date: string; // YYYY-MM-DD
  available: boolean;
  price: number;
  minimumStay: number;
  closedOnArrival: boolean;
  closedOnDeparture: boolean;
};

export type QuoteLine = { label: string; amount: number };

export type Quote = {
  listingId: number;
  checkin: string;
  checkout: string;
  guests: number;
  nights: number;
  currency: string;
  lines: QuoteLine[];
  total: number;
};

export type StayRequest = {
  listingId: number;
  checkin: string;
  checkout: string;
  guests: number;
};

export type GuestDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

export type HeldReservation = {
  id: number;
  listingId: number;
  status: string;
  total: number;
  currency: string;
  checkin: string;
  checkout: string;
  guests: number;
  guest: GuestDetails;
  hostNote: string;
  /** ISO timestamp after which an unpaid hold is released; null when not one of our holds. */
  holdExpiresAt: string | null;
};
