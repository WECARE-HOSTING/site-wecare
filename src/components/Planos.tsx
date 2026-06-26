"use client";

const CheckIcon = ({ color = "var(--gold-700)" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const WA_LINK = "https://wa.me/5511969760183?text=Quero%20avaliar%20o%20meu%20im%C3%B3vel%20para%20a%20WECARE%20fazer%20a%20gest%C3%A3o";

const notes = [
  {
    label: "Obrigatório",
    title: "EasyCover · R$ 120/mês",
    body: "Seguro que cobre danos ao imóvel e aos seus objetos. Incluído em todo contrato.",
  },
  {
    label: "Sem fidelidade",
    title: "Entra e sai quando quiser",
    body: "Sem multa e sem burocracia. A relação se sustenta por resultado.",
  },
  {
    label: "Taxa de adesão",
    title: "Cobrança única",
    body: "Cobre o onboarding e o setup do anúncio. Definida na avaliação do imóvel.",
  },
  {
    label: "Opcional",
    title: "Pagadoria · R$ 99/mês",
    body: "Pagamos condomínio, água, energia, IPTU e internet e descontamos do repasse.",
  },
];

export default function Planos() {
  return (
    <section id="planos" style={{ background: "var(--surface-page)", padding: "clamp(80px, 9vw, 120px) 0" }}>
      <div className="wc-container">
        <div data-reveal="" style={{ textAlign: "center", maxWidth: 640, margin: "0 auto 56px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ width: 36, height: 1, background: "var(--gold-500)", display: "block" }} />
            <span className="wc-label" style={{ color: "var(--gold-700)" }}>Investimento</span>
            <span style={{ width: 36, height: 1, background: "var(--gold-500)", display: "block" }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(2rem, 1.5rem + 1.8vw, 2.8rem)", lineHeight: 1.16, letterSpacing: "-0.01em", color: "var(--text-strong)", margin: 0 }}>
            Você escolhe quanto <span style={{ fontStyle: "italic", color: "var(--navy-700)" }}>delega.</span>
          </h2>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--text-body)", margin: "22px 0 0" }}>
            Sem mensalidade fixa e sem fidelidade. A WeCare se remunera como percentual sobre as locações — só ganhamos quando o seu imóvel rende.
          </p>
        </div>

        {/* Plan cards */}
        <div className="wc-plans-grid wc-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "stretch" }}>
          {/* Gestão Online */}
          <div
            className="wc-plan-card"
            data-reveal=""
            style={{
              background: "var(--surface-card)",
              border: "1px solid var(--border-card)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-xs)",
              padding: "44px 40px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span className="wc-label" style={{ color: "var(--text-muted)" }}>Gestão Online</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "18px 0 6px" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "4rem", lineHeight: 1, color: "var(--text-strong)" }}>15%</span>
              <span style={{ fontSize: "0.92rem", color: "var(--text-muted)" }}>das locações</span>
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.1rem", color: "var(--navy-700)", margin: "6px 0 26px" }}>
              A gestão que faz o seu imóvel render.
            </p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--text-body)", margin: "0 0 26px" }}>
              Cuidamos de tudo que faz o imóvel render. Gerenciamos limpeza e manutenção com a sua equipe.
            </p>
            <div style={{ height: 1, background: "var(--line-soft)", marginBottom: 24 }} />
            <ul style={{ listStyle: "none", margin: "0 0 32px", padding: 0, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
              {["Anúncios, marketing e precificação inteligente", "Atendimento 24/7 e gestão de reservas", "Relatórios em tempo real e repasse pontual", "Comunicação direta com a sua equipe local"].map(item => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: "0.95rem", color: "var(--text-body)" }}>
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                textAlign: "center",
                background: "transparent",
                color: "var(--navy-800)",
                border: "1px solid var(--navy-800)",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "0.95rem",
                padding: "15px 28px",
                borderRadius: "var(--radius)",
                textDecoration: "none",
                transition: "background var(--dur) var(--ease)",
                marginTop: "auto",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(12,35,48,0.05)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              Avalie seu imóvel
            </a>
          </div>

          {/* Gestão 360 */}
          <div
            className="wc-plan-card"
            data-reveal=""
            style={{
              background: "var(--navy-800)",
              border: "1px solid var(--navy-800)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow)",
              padding: "44px 40px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: 24, right: 28 }}>
              <span style={{ display: "inline-block", fontFamily: "var(--font-sans)", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--navy-900)", background: "var(--gold-500)", padding: "6px 12px", borderRadius: 999 }}>
                Recomendado
              </span>
            </div>
            <span className="wc-label" style={{ color: "var(--gold-300)" }}>Gestão 360</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, margin: "18px 0 6px" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "4rem", lineHeight: 1, color: "var(--ivory-100)" }}>20%</span>
              <span style={{ fontSize: "0.92rem", color: "var(--navy-200)" }}>das locações</span>
            </div>
            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.1rem", color: "var(--gold-300)", margin: "6px 0 26px" }}>
              Operação completa, nossa equipe.
            </p>
            <p style={{ fontSize: "0.95rem", lineHeight: 1.65, color: "var(--navy-100)", margin: "0 0 26px" }}>
              Tudo da Gestão Online, mais a operação física sob a nossa gestão — enxoval, limpeza e manutenção. O ativo é sempre seu.
            </p>
            <div style={{ height: 1, background: "var(--line-soft-dark)", marginBottom: 24 }} />
            <ul style={{ listStyle: "none", margin: "0 0 24px", padding: 0, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
              {["Tudo da Gestão Online", "Limpeza, manutenção e enxoval", "Lavanderia e amenities", "Vistoria e cuidado contínuo do patrimônio"].map(item => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: "0.95rem", color: "var(--ivory-100)" }}>
                  <CheckIcon color="var(--gold-300)" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                textAlign: "center",
                background: "var(--ivory-100)",
                color: "var(--navy-800)",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "0.95rem",
                padding: "15px 28px",
                borderRadius: "var(--radius)",
                textDecoration: "none",
                transition: "background var(--dur) var(--ease)",
                marginTop: "auto",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--ivory-100)"; }}
            >
              Avalie seu imóvel
            </a>
          </div>
        </div>

        {/* Notes grid */}
        <div data-reveal="" className="wc-grid-4" style={{ marginTop: 28, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid var(--line-soft)" }}>
          {notes.map(n => (
            <div key={n.label} style={{ padding: "26px 24px 0" }}>
              <span style={{ display: "block", fontFamily: "var(--font-sans)", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--gold-700)", marginBottom: 8 }}>{n.label}</span>
              <span style={{ display: "block", fontFamily: "var(--font-serif)", fontSize: "1.05rem", color: "var(--text-strong)", marginBottom: 6 }}>{n.title}</span>
              <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.86rem", lineHeight: 1.55, color: "var(--text-muted)" }}>{n.body}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
