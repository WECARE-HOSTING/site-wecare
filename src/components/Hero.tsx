"use client";
import { useEffect, useRef } from "react";

export default function Hero() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = [leftRef.current, rightRef.current];
    els.forEach((el, i) => {
      if (!el) return;
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 120 + i * 180);
    });
  }, []);

  return (
    <section id="topo" style={{ position: "relative", paddingTop: 64, paddingBottom: 0, overflow: "hidden" }}>
      <div className="wc-container" style={{ position: "relative" }}>
        <div
          className="wc-hero-grid"
          style={{ display: "grid", gridTemplateColumns: "1.08fr 0.92fr", columnGap: 60, alignItems: "start" }}
        >
          {/* Left — headline */}
          <div
            ref={leftRef}
            style={{ paddingTop: 30, opacity: 0, transform: "translateY(28px)", transition: "opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
              <span style={{ width: 36, height: 1, background: "var(--gold-500)", display: "block" }} />
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.6875rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold-700)" }}>
                Patrimônio em boas mãos
              </span>
            </div>

            <h1
              style={{
                fontFamily: "var(--font-serif)",
                fontWeight: 500,
                fontSize: "clamp(2.8rem, 2rem + 3.4vw, 4.5rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
                color: "var(--text-strong)",
                margin: 0,
                textWrap: "balance",
              }}
            >
              O melhor retorno<br />para o seu imóvel —
              <span
                style={{
                  display: "block",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "var(--navy-700)",
                  marginTop: 12,
                }}
              >
                com quem pensa{" "}
                <span style={{ borderBottom: "1px solid var(--gold-500)", paddingBottom: 4 }}>
                  como proprietário.
                </span>
              </span>
            </h1>

            <p style={{ fontSize: "1.12rem", lineHeight: 1.7, color: "var(--text-body)", maxWidth: "46ch", margin: "30px 0 34px" }}>
              Cuidado de alto padrão para imóveis em locação por temporada. Renda passiva de verdade — sem abrir mão do ativo, sem depreciar o que é seu.
            </p>

            <div className="wc-hero-ctas" style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
              <a
                href="https://wa.me/5511969760183?text=Quero%20avaliar%20o%20meu%20im%C3%B3vel%20para%20a%20WECARE%20fazer%20a%20gest%C3%A3o"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "var(--navy-800)",
                  color: "var(--ivory-100)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  padding: "15px 32px",
                  borderRadius: "var(--radius)",
                  textDecoration: "none",
                  transition: "background var(--dur) var(--ease)",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--navy-700)")}
                onMouseLeave={e => (e.currentTarget.style.background = "var(--navy-800)")}
              >
                Avalie seu imóvel
              </a>
              <a className="wc-link-gold" href="#historia" style={{ fontSize: "0.95rem" }}>
                A história do R$ 3.500 → R$ 30.000
              </a>
            </div>

            {/* Credential bar */}
            <div style={{ marginTop: 56, borderTop: "1px solid var(--line-soft)", padding: "22px 0 30px", display: "flex", flexWrap: "wrap", gap: "12px 0", alignItems: "center" }}>
              {["10 anos no Airbnb", "Superhost", "Zero Reclame Aqui"].map((cred, i) => (
                <span key={cred} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      style={{ margin: "0 20px", width: 5, height: 5, background: "var(--gold-500)", transform: "rotate(45deg)", display: "inline-block" }}
                    />
                  )}
                  <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--graphite-400)" }}>
                    {cred}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Right — image */}
          <div
            className="wc-hero-image"
            ref={rightRef}
            style={{ position: "relative", marginTop: 28, paddingBottom: 64, opacity: 0, transform: "translateY(28px)", transition: "opacity 0.9s 0.3s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.9s 0.3s cubic-bezier(0.25,0.46,0.45,0.94)" }}
          >
            {/* Gold frame */}
            <div
              aria-hidden="true"
              style={{ position: "absolute", inset: "-16px 18px 70px -16px", border: "1px solid var(--gold-500)", pointerEvents: "none" }}
            />
            <div
              style={{
                position: "relative",
                height: 540,
                background: "url('https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1100&q=80') center/cover no-repeat, linear-gradient(135deg, var(--stone-300), var(--navy-600))",
              }}
            />
            {/* Curation seal */}
            <div style={{ position: "absolute", bottom: 30, left: -26, zIndex: 3 }}>
              <svg width="116" height="116" viewBox="0 0 116 116" aria-hidden="true">
                <circle cx="58" cy="58" r="55" fill="none" stroke="var(--gold-500)" strokeWidth="1" />
                <circle cx="58" cy="58" r="48" fill="none" stroke="var(--gold-500)" strokeWidth="0.5" opacity="0.5" />
                <text x="58" y="52" textAnchor="middle" fontFamily="var(--font-serif)" fontWeight="500" fontSize="9" fill="var(--navy-800)" letterSpacing="2">CURADORIA</text>
                <text x="58" y="64" textAnchor="middle" fontFamily="var(--font-serif)" fontStyle="italic" fontWeight="400" fontSize="11" fill="var(--gold-600)">WeCare</text>
                <text x="58" y="76" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="600" fontSize="7" fill="var(--graphite-400)" letterSpacing="2">PREMIUM</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
