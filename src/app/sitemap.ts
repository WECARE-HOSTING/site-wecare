import type { MetadataRoute } from "next";
import { posts } from "@/content/blog/registry";
import { CASAS_SLUGS } from "@/lib/casas";
import { getListings } from "@/lib/reservas/hostaway";

const SITE_URL = "https://www.wecarehosting.com.br";

// Listing pages come from Hostaway, so the sitemap is built per request (cheap: the listings are cached)
// instead of being frozen at build time, which also keeps the build independent of Hostaway credentials.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getListings().catch((err) => {
    console.error("[sitemap] could not load listings", err);
    return [];
  });
  // /avalie is noindex (see src/app/avalie/page.tsx) and stays out of the sitemap.
  // Listing a noindex URL here is the Search Console inconsistency this filter avoids.
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/reservas`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/casas`, changeFrequency: "weekly", priority: 0.8 },
    ...CASAS_SLUGS.map((s) => ({ url: `${SITE_URL}/casas/${s}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...listings.map((l) => ({ url: `${SITE_URL}/reservas/${l.id}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.meta.slug}`,
      lastModified: post.meta.dateModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
  return entries.filter((entry) => {
    try {
      const path = new URL(entry.url).pathname.replace(/\/+$/, "") || "/";
      return path !== "/avalie";
    } catch {
      return true;
    }
  });
}
