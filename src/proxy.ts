import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Legacy WordPress / Yoast sitemap endpoints — return 410 so crawlers stop retrying. */
const GONE_SITEMAPS = new Set([
  "/page-sitemap.xml",
  "/post-sitemap.xml",
  "/sitemap_index.xml",
  "/wp-sitemap.xml",
  "/wp-sitemap-posts-post-1.xml",
  "/wp-sitemap-pages-1.xml",
]);

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (GONE_SITEMAPS.has(path)) {
    return new NextResponse("Gone", {
      status: 410,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/page-sitemap.xml",
    "/post-sitemap.xml",
    "/sitemap_index.xml",
    "/wp-sitemap.xml",
    "/wp-sitemap-posts-post-1.xml",
    "/wp-sitemap-pages-1.xml",
  ],
};
