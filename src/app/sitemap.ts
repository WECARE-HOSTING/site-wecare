import type { MetadataRoute } from "next";
import { posts } from "@/content/blog/registry";
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
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/reservas`, changeFrequency: "daily", priority: 0.8 },
    ...listings.map((l) => ({ url: `${SITE_URL}/reservas/${l.id}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.meta.slug}`,
      lastModified: post.meta.dateModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
