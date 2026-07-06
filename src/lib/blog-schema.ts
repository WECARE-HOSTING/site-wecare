import type { BlogPostMeta } from "@/content/blog/types";

const SITE_URL = "https://www.wecarehosting.com.br";
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

// Minimal, self-contained stubs of the homepage's Organization/WebSite nodes
// (same @id as src/app/homepage-schema.json) so each blog page's @graph
// validates on its own while still merging with the site-wide graph via @id.
function orgNode() {
  return {
    "@type": "Organization",
    "@id": ORG_ID,
    name: "WeCare Hosting",
    url: `${SITE_URL}/`,
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: `${SITE_URL}/brand/wecare-simbolo-solido.png`,
    },
  };
}

function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: "WeCare — Gestão de Imóveis por Temporada",
    inLanguage: "pt-BR",
    publisher: { "@id": ORG_ID },
  };
}

export function buildBlogPostGraph(meta: BlogPostMeta) {
  const url = `${SITE_URL}/blog/${meta.slug}`;

  const personNodes = (meta.mentions ?? []).map((p) => ({
    "@type": "Person",
    "@id": `${SITE_URL}/#person-${p.id}`,
    name: p.name,
    jobTitle: p.jobTitle,
    worksFor: { "@id": ORG_ID },
  }));

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: meta.title, item: url },
    ],
  };

  const article = {
    "@type": "Article",
    "@id": `${url}#article`,
    headline: meta.title,
    description: meta.description,
    url,
    datePublished: meta.datePublished,
    dateModified: meta.dateModified,
    inLanguage: "pt-BR",
    isPartOf: { "@id": WEBSITE_ID },
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    ...(personNodes.length
      ? { mentions: personNodes.map((p) => ({ "@id": p["@id"] })) }
      : {}),
  };

  const faqPage = meta.faq.length
    ? {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: "pt-BR",
        mainEntity: meta.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }
    : null;

  return {
    "@context": "https://schema.org",
    "@graph": [
      orgNode(),
      websiteNode(),
      ...personNodes,
      breadcrumb,
      article,
      ...(faqPage ? [faqPage] : []),
    ],
  };
}

export function buildBlogIndexGraph(posts: BlogPostMeta[]) {
  const url = `${SITE_URL}/blog`;

  const breadcrumb = {
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: url },
    ],
  };

  const blog = {
    "@type": "Blog",
    "@id": `${url}#blog`,
    url,
    name: "Blog WeCare Hosting",
    description:
      "Guias sobre gestão de Airbnb, aluguel por temporada e rentabilidade de imóveis em São Paulo — direto da WeCare Hosting.",
    inLanguage: "pt-BR",
    isPartOf: { "@id": WEBSITE_ID },
    publisher: { "@id": ORG_ID },
    // Referencing each post's Article node by @id (not inlining) keeps this
    // in sync automatically: every post already ships its own #article node
    // via buildBlogPostGraph, so adding a post here is just listing its slug.
    blogPost: posts.map((p) => ({ "@id": `${SITE_URL}/blog/${p.slug}#article` })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [orgNode(), websiteNode(), breadcrumb, blog],
  };
}
