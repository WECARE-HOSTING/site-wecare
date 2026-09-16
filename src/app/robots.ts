import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/page-sitemap.xml",
        "/post-sitemap.xml",
        "/sitemap_index.xml",
        "/wp-sitemap.xml",
        "/wp-sitemap-posts-post-1.xml",
        "/wp-sitemap-pages-1.xml",
      ],
    },
    sitemap: "https://www.wecarehosting.com.br/sitemap.xml",
  };
}
