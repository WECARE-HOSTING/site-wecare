/**
 * Switches for review content. Both are off since 01/10/2026: we decided not to reuse reviews that
 * come from Airbnb/Booking (the text belongs to the guest, and those platforms' terms don't allow
 * copying it), so stars and the reviews section stay hidden until WeCare has its own reviews.
 * Flip to `true` to bring them back; the code and data fetching are intact.
 */
export const SHOW_RATINGS = false; // stars + score on cards and listing pages, and the "Novo" badge
export const SHOW_REVIEWS = false; // the "Avaliações" section (guest reviews imported through Hostaway)
