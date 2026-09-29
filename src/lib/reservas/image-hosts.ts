// Where Hostaway listing photos live: its own bucket, or Airbnb's CDN for
// listings imported from Airbnb. next.config.ts allows exactly these for
// next/image, and the listing mapper drops photos hosted anywhere else so an
// unexpected URL can never crash a page.
export const LISTING_IMAGE_PATTERNS = [
  "https://hostaway-platform.s3.us-west-2.amazonaws.com/listing/**",
  "https://a0.muscache.com/im/pictures/**",
];

export function isAllowedImage(url: string): boolean {
  return LISTING_IMAGE_PATTERNS.some((p) => url.startsWith(p.replace("**", "")));
}
