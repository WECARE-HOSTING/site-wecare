import Link from "next/link";
import type { ReactNode } from "react";
import type { BlogPost, BlogPostMeta } from "@/content/blog/types";

const WA_LINK =
  "https://wa.me/5511969760183?text=Quero%20avaliar%20o%20meu%20im%C3%B3vel%20para%20a%20WECARE%20fazer%20a%20gest%C3%A3o";

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

        <div
          style={{
            margin: "64px 0",
            padding: "clamp(28px, 4vw, 44px)",
            background: "var(--navy-900)",
            borderRadius: "var(--radius-md)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "1.3rem",
              color: "var(--ivory-100)",
              margin: "0 0 22px",
            }}
          >
            Quer saber quanto o seu imóvel pode render?
          </p>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: "var(--ivory-100)",
              color: "var(--navy-800)",
              fontFamily: "var(--font-sans)",
              fontWeight: 600,
              fontSize: "0.95rem",
              padding: "15px 32px",
              borderRadius: "var(--radius)",
              textDecoration: "none",
            }}
          >
            Avalie seu imóvel
          </a>
        </div>

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
