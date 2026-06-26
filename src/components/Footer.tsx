"use client";

export default function Footer() {
  return (
    <footer style={{ background: "var(--navy-900)", color: "var(--ivory-100)", padding: "72px 0 40px", borderTop: "1px solid var(--line-soft-dark)" }}>
      <div className="wc-container">
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 48, paddingBottom: 48, borderBottom: "1px solid var(--line-soft-dark)" }}>
          {/* Brand */}
          <div style={{ maxWidth: 340 }}>
            <svg width="130" height="30" viewBox="0 0 130 30" aria-label="WeCare">
              <text x="0" y="24" fontFamily="var(--font-serif)" fontWeight="500" fontSize="24" fill="var(--ivory-100)">wecare</text>
              <text x="93" y="24" fontFamily="var(--font-serif)" fontWeight="500" fontSize="24" fill="var(--gold-500)">.</text>
            </svg>
            <p style={{ marginTop: 20, color: "var(--navy-200)", fontSize: "0.95rem", lineHeight: 1.65 }}>
              Gestão de imóveis para temporada, no alto padrão de quem cuida do próprio.
            </p>
            <p style={{ marginTop: 14, fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.05rem", color: "var(--ivory-100)" }}>
              Patrimônio em boas mãos.
            </p>
          </div>

          {/* Links */}
          <div style={{ display: "flex", gap: 72, flexWrap: "wrap" }}>
            <div>
              <div className="wc-label" style={{ color: "var(--gold-300)", marginBottom: 16 }}>Proprietários</div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                {[
                  { href: "https://wa.me/5511969760183?text=Quero%20avaliar%20o%20meu%20im%C3%B3vel%20para%20a%20WECARE%20fazer%20a%20gest%C3%A3o", label: "Avalie seu imóvel", external: true },
                  { href: "#como-funciona", label: "Como funciona" },
                  { href: "#planos", label: "Planos e investimento" },
                  { href: "#historia", label: "Nossa história" },
                ].map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      style={{ color: "var(--ivory-100)", textDecoration: "none", fontSize: "0.9rem", transition: "color var(--dur) var(--ease)" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--gold-300)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--ivory-100)"; }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="wc-label" style={{ color: "var(--gold-300)", marginBottom: 16 }}>WeCare</div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                {[
                  { href: "#porque", label: "O Padrão WeCare" },
                  { href: "#servicos", label: "Serviços" },
                  { href: "https://instagram.com/wecarehosting", label: "@wecarehosting", external: true },
                  { href: "https://wecarehosting.com.br", label: "wecarehosting.com.br", external: true },
                ].map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      style={{ color: "var(--ivory-100)", textDecoration: "none", fontSize: "0.9rem", transition: "color var(--dur) var(--ease)" }}
                      onMouseEnter={e => { e.currentTarget.style.color = "var(--gold-300)"; }}
                      onMouseLeave={e => { e.currentTarget.style.color = "var(--ivory-100)"; }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, paddingTop: 26, fontFamily: "var(--font-sans)", fontSize: "0.76rem", color: "var(--navy-200)" }}>
          <span>© 2026 WeCare Hosting</span>
          <span style={{ letterSpacing: "0.16em", textTransform: "uppercase" }}>São Paulo · Brasil</span>
        </div>
      </div>
    </footer>
  );
}
