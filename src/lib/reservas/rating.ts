// Hostaway's averageReviewRating is on a 0–10 scale; guests see 0–5 stars.
// We only show a score once it is strong enough to help the sale (the star
// and the number go together): below this the card shows neither.
export const MIN_PUBLIC_STARS = 4.8;

/** The 0–5 score to display, or null when it is missing or below the bar. */
export function publicStars(rating: number | null): number | null {
  if (rating === null) return null;
  const stars = rating / 2;
  return stars >= MIN_PUBLIC_STARS ? stars : null;
}
