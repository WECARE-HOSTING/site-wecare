/** Parts of the Hostaway description, in the order a guest reads them. Titles come from the UI language. */
export type SectionKey = "summary" | "space" | "access" | "interaction" | "neighborhood" | "transit" | "notes";
export type DescriptionSection = { key: SectionKey; text: string };

export type ListingImage = { url: string; caption: string };

export type Listing = {
  id: number;
  name: string;
  city: string;
  state: string;
  neighborhood: string;
  /** Full Portuguese description (all sections joined); used for meta tags. */
  description: string;
  sections: DescriptionSection[];
  /** Hostaway keeps its own `name`/`description` in English; used when the guest browses in English. */
  nameEn: string;
  descriptionEn: string;
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
  /** Amenity ids (see amenities.ts), not display text. */
  amenities: string[];
};

/** A published guest review, reduced to what the listing page shows. Never includes private feedback. */
export type Review = {
  /** First name only (LGPD); empty when Hostaway has none. */
  name: string;
  /** 0–10 as Hostaway stores it; stars = rating / 2. */
  rating: number;
  text: string;
  /** YYYY-MM-DD */
  date: string;
  source: "airbnb" | "booking" | null;
};

/** `total` counts every publishable review; `items` holds only the most recent ones. */
export type ReviewSet = { total: number; items: Review[] };

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
