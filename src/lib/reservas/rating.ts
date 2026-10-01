import { SHOW_RATINGS } from "./features";

// Hostaway's averageReviewRating is on a 0–10 scale; guests see 0–5 stars.
// We only show a score once it is strong enough to help the sale (the star
// and the number go together): below this the card shows neither.
export const MIN_PUBLIC_STARS = 4.8;

/** The 0–5 score above the bar, or null. Used for ranking; what guests see goes through `publicStars`. */
export function rankingStars(rating: number | null): number | null {
  if (rating === null) return null;
  const stars = rating / 2;
  return stars >= MIN_PUBLIC_STARS ? stars : null;
}

/** The 0–5 score to display, or null when it is missing, below the bar, or ratings are switched off. */
export function publicStars(rating: number | null): number | null {
  return SHOW_RATINGS ? rankingStars(rating) : null;
}
