import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Página não encontrada | WeCare",
  robots: { index: false, follow: true },
};

const links = [
  { href: "/", label: "Início" },
  { href: "/#servicos", label: "Serviços" },
  { href: "/#historia", label: "Nossa história" },
  { href: "/blog", label: "Blog" },
];

export default function NotFound() {
  return (
    <div style={{ background: "var(--surface-page)", overflowX: "hidden" }}>
      <Nav />
      <main style={{ padding: "clamp(120px, 16vw, 200px) 0 clamp(80px, 9vw, 120px)" }}>
        <div className="wc-container" style={{ maxWidth: 640 }}>
          <span className="wc-label" style={{ color: "var(--gold-500)" }}>Erro 404</span>
          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontWeight: 500,
              fontSize: "clamp(2rem, 1.5rem + 2vw, 3rem)",
              lineHeight: 1.15,
              letterSpacing: "-0.01em",
              color: "var(--navy-900)",
              margin: "18px 0 20px",
            }}
          >
            Essa página não existe mais{" "}
            <span style={{ fontStyle: "italic", color: "var(--gold-500)" }}>por aqui</span>.
          </h1>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--navy-700)", margin: "0 0 36px", maxWidth: "52ch" }}>
            O link que te trouxe aqui pode ser de uma versão antiga do site. Segue por um destes caminhos:
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  display: "inline-block",
                  background: "var(--navy-900)",
                  color: "var(--ivory-100)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  padding: "13px 26px",
                  borderRadius: "var(--radius)",
                  textDecoration: "none",
                  transition: "background var(--dur) var(--ease)",
                }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://wa.me/5511969760183?text=Quero%20avaliar%20o%20meu%20im%C3%B3vel%20para%20a%20WECARE%20fazer%20a%20gest%C3%A3o"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "transparent",
                color: "var(--navy-900)",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "0.9rem",
                padding: "13px 26px",
                borderRadius: "var(--radius)",
                border: "1px solid var(--navy-900)",
                textDecoration: "none",
              }}
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
