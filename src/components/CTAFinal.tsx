"use client";

const WA_LINK = "https://wa.me/5511969760183?text=Quero%20avaliar%20o%20meu%20im%C3%B3vel%20para%20a%20WECARE%20fazer%20a%20gest%C3%A3o";

export default function CTAFinal() {
  return (
    <section
      id="avaliar"
      style={{ background: "var(--navy-900)", padding: "clamp(80px, 9vw, 120px) 0", color: "var(--ivory-100)", position: "relative", overflow: "hidden" }}
    >
      {/* Decorative seal */}
      <div aria-hidden="true" style={{ position: "absolute", right: "6%", top: "50%", transform: "translateY(-50%)", opacity: 0.06, pointerEvents: "none" }}>
        <svg width="280" height="280" viewBox="0 0 280 280">
          <circle cx="140" cy="140" r="136" fill="none" stroke="var(--gold-500)" strokeWidth="1" />
          <circle cx="140" cy="140" r="120" fill="none" stroke="var(--gold-500)" strokeWidth="0.5" opacity="0.5" />
          <text x="140" y="132" textAnchor="middle" fontFamily="var(--font-serif)" fontWeight="500" fontSize="22" fill="var(--ivory-100)" letterSpacing="4">CURADORIA</text>
          <text x="140" y="158" textAnchor="middle" fontFamily="var(--font-serif)" fontStyle="italic" fontWeight="400" fontSize="30" fill="var(--gold-300)">WeCare</text>
          <text x="140" y="178" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="600" fontSize="14" fill="var(--navy-200)" letterSpacing="6">PREMIUM</text>
        </svg>
      </div>

      <div className="wc-container" style={{ position: "relative" }}>
        <div data-reveal="" style={{ maxWidth: 680 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
            <span style={{ width: 36, height: 1, background: "var(--gold-500)", display: "block" }} />
            <span className="wc-label" style={{ color: "var(--gold-300)" }}>O próximo passo</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(2.2rem, 1.6rem + 2.4vw, 3.4rem)", lineHeight: 1.12, letterSpacing: "-0.01em", color: "var(--ivory-100)", margin: 0 }}>
            Cuidamos de um número{" "}
            <span style={{ fontStyle: "italic", color: "var(--gold-300)" }}>limitado</span>{" "}
            de imóveis.
          </h2>
          <p style={{ fontSize: "1.1rem", lineHeight: 1.7, color: "var(--navy-100)", margin: "26px 0 36px", maxWidth: "52ch" }}>
            Avaliamos o seu imóvel sem compromisso. Se houver fit dos dois lados, seguimos para o contrato de gestão. Quem está, está bem.
          </p>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
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
                padding: "16px 36px",
                borderRadius: "var(--radius)",
                textDecoration: "none",
                transition: "background var(--dur) var(--ease)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--ivory-100)"; }}
            >
              Avalie seu imóvel
            </a>
            <a
              href="https://wa.me/5511969760183"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                color: "var(--ivory-100)",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
                borderBottom: "1px solid var(--gold-500)",
                paddingBottom: 3,
                transition: "color var(--dur) var(--ease), border-color var(--dur) var(--ease)",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "var(--gold-300)"; e.currentTarget.style.borderColor = "var(--gold-300)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "var(--ivory-100)"; e.currentTarget.style.borderColor = "var(--gold-500)"; }}
            >
              Falar pelo WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
