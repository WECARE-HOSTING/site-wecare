import type { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/content/blog/registry";
import { buildBlogIndexGraph } from "@/lib/blog-schema";

export const metadata: Metadata = {
  title: "Blog | WeCare Hosting",
  description:
    "Guias sobre gestão de Airbnb, aluguel por temporada e rentabilidade de imóveis em São Paulo — direto da WeCare Hosting.",
  alternates: { canonical: "https://www.wecarehosting.com.br/blog" },
};

export default function BlogIndexPage() {
  const graph = buildBlogIndexGraph(posts.map((p) => p.meta));

  return (
    <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
    <section style={{ padding: "clamp(128px, 13vw, 168px) 0 clamp(80px, 9vw, 120px)" }}>
      <div className="wc-container" style={{ maxWidth: 900 }}>
        <div className="wc-eyebrow">
          <span className="wc-label" style={{ color: "var(--gold-700)" }}>
            Blog
          </span>
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 500,
            fontSize: "clamp(2.1rem, 1.5rem + 2.4vw, 3.1rem)",
            lineHeight: 1.16,
            color: "var(--text-strong)",
            margin: "0 0 16px",
          }}
        >
          Gestão de temporada, <span style={{ fontStyle: "italic", color: "var(--navy-700)" }}>explicada.</span>
        </h1>
        <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--text-body)", maxWidth: "60ch", margin: "0 0 56px" }}>
          Guias diretos sobre administração de Airbnb, contrato de gestão e rentabilidade de imóveis em São Paulo —
          com números reais, não projeções infladas.
        </p>

        <div style={{ display: "grid", gap: 24 }}>
          {posts.map((post) => (
            <Link
              key={post.meta.slug}
              href={`/blog/${post.meta.slug}`}
              className="wc-card-hover"
              style={{
                display: "block",
                padding: "32px 36px",
                background: "var(--surface-card)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius-md)",
                textDecoration: "none",
              }}
            >
              <span className="wc-label" style={{ color: "var(--gold-700)", display: "block", marginBottom: 12 }}>
                {post.meta.eyebrow}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 500,
                  fontSize: "1.4rem",
                  color: "var(--text-strong)",
                  display: "block",
                  marginBottom: 10,
                }}
              >
                {post.meta.title}
              </span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                {post.meta.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
