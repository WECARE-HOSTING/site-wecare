import type { MetadataRoute } from "next";
import { posts } from "@/content/blog/registry";

const SITE_URL = "https://www.wecarehosting.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.meta.slug}`,
      lastModified: post.meta.dateModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
