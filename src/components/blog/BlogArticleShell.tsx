import Link from "next/link";
import type { ReactNode } from "react";
import type { BlogPost, BlogPostMeta } from "@/content/blog/types";
import BlogCTAProprietario from "@/components/blog/BlogCTAProprietario";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function BlogArticleShell({
  meta,
  related,
  children,
}: {
  meta: BlogPostMeta;
  related: BlogPost[];
  children: ReactNode;
}) {
  return (
    <article style={{ background: "var(--surface-page)", padding: "clamp(128px, 13vw, 168px) 0 0" }}>
      <div className="wc-container" style={{ maxWidth: 760 }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: 28 }}>
          <ol
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              listStyle: "none",
              margin: 0,
              padding: 0,
              fontFamily: "var(--font-sans)",
              fontSize: "0.78rem",
              color: "var(--text-muted)",
            }}
          >
            <li>
              <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                Blog
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li style={{ color: "var(--text-strong)" }}>{meta.title}</li>
          </ol>
        </nav>

        <div className="wc-eyebrow">
          <span className="wc-label" style={{ color: "var(--gold-700)" }}>
            {meta.eyebrow}
          </span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 500,
            fontSize: "clamp(2.1rem, 1.5rem + 2.4vw, 3.1rem)",
            lineHeight: 1.16,
            letterSpacing: "-0.01em",
            color: "var(--text-strong)",
            margin: "0 0 18px",
          }}
        >
          {meta.title}
        </h1>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.8rem", color: "var(--text-muted)", margin: "0 0 48px" }}>
          Publicado em {formatDate(meta.datePublished)} · WeCare Hosting
          {meta.dateModified !== meta.datePublished ? ` · Atualizado em ${formatDate(meta.dateModified)}` : ""}
        </p>

        <div className="wc-prose">{children}</div>

        <BlogCTAProprietario />

        {related.length > 0 && (
          <div style={{ borderTop: "1px solid var(--line-soft)", paddingTop: 40, marginBottom: 100 }}>
            <span className="wc-label" style={{ color: "var(--gold-700)", display: "block", marginBottom: 20 }}>
              Leia também
            </span>
            <div
              className={related.length >= 3 ? "wc-grid-3" : "wc-grid-2"}
              style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(related.length, 3)}, 1fr)`, gap: 24 }}
            >
              {related.map((r) => (
                <Link
                  key={r.meta.slug}
                  href={`/blog/${r.meta.slug}`}
                  className="wc-card-hover"
                  style={{
                    display: "block",
                    padding: 24,
                    background: "var(--surface-card)",
                    border: "1px solid var(--border-card)",
                    borderRadius: "var(--radius-md)",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: "1.05rem",
                      color: "var(--text-strong)",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    {r.meta.title}
                  </span>
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {r.meta.description.slice(0, 90)}…
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
