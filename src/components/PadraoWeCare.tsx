"use client";

const pillars = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gold-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    title: "Curadoria & confiança",
    body: "Selecionamos imóveis e verificamos cada hóspede antes da reserva. Quem entra, fica.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gold-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
      </svg>
    ),
    title: "Precificação inteligente",
    body: "Tecnologia e um time ajustando o preço todo dia, por demanda e sazonalidade. Você recebe — sem operar.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gold-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: "Transparência total",
    body: "O Relatório WeCare com demonstrativos em tempo real e repasse pontual. Sem custos ocultos.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gold-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"/>
      </svg>
    ),
    title: "Proteção em camadas",
    body: "Aircover e EasyCover. Seu imóvel e seus objetos cobertos, com recuperação de valores quando preciso.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gold-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
      </svg>
    ),
    title: "Seu imóvel, suas regras",
    body: "Use quando quiser, sem fidelidade. Calendário otimizado: ocupado quando rende, livre quando você precisa.",
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--gold-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: "Operação impecável",
    body: "Limpeza, manutenção e hospedagem 24/7 com equipe multilíngue. Dez anos de cuidado em cada detalhe.",
  },
];

export default function PadraoWeCare() {
  return (
    <section id="porque" style={{ background: "var(--navy-800)", padding: "clamp(80px, 9vw, 120px) 0", color: "var(--ivory-100)", position: "relative", overflow: "hidden" }}>
      {/* Background seal */}
      <div aria-hidden="true" style={{ position: "absolute", right: -140, bottom: -140, opacity: 0.06, pointerEvents: "none" }}>
        <svg width="460" height="460" viewBox="0 0 460 460">
          <circle cx="230" cy="230" r="226" fill="none" stroke="var(--gold-500)" strokeWidth="1" />
          <circle cx="230" cy="230" r="200" fill="none" stroke="var(--gold-500)" strokeWidth="0.5" opacity="0.5" />
          <text x="230" y="218" textAnchor="middle" fontFamily="var(--font-serif)" fontWeight="500" fontSize="36" fill="var(--ivory-100)" letterSpacing="6">CURADORIA</text>
          <text x="230" y="258" textAnchor="middle" fontFamily="var(--font-serif)" fontStyle="italic" fontWeight="400" fontSize="48" fill="var(--gold-300)">WeCare</text>
          <text x="230" y="290" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="600" fontSize="24" fill="var(--navy-200)" letterSpacing="8">PREMIUM</text>
        </svg>
      </div>

      <div className="wc-container" style={{ position: "relative" }}>
        <div data-reveal="" style={{ maxWidth: 660, marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ width: 36, height: 1, background: "var(--gold-500)", display: "block" }} />
            <span className="wc-label" style={{ color: "var(--gold-300)" }}>O Padrão WeCare</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(2rem, 1.5rem + 1.8vw, 2.9rem)", lineHeight: 1.18, color: "var(--ivory-100)", margin: 0 }}>
            O cuidado de dono, com a{" "}
            <span style={{ fontStyle: "italic", color: "var(--gold-300)" }}>operação de uma gestora.</span>
          </h2>
        </div>

        <div
          className="wc-pillar-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
            background: "var(--line-soft-dark)",
            border: "1px solid var(--line-soft-dark)",
          }}
        >
          {pillars.map(p => (
            <div key={p.title} data-reveal="" style={{ background: "var(--navy-800)", padding: "38px 34px", transition: "background var(--dur) var(--ease)" }}>
              {p.icon}
              <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "1.35rem", color: "var(--ivory-100)", margin: "20px 0 10px" }}>
                {p.title}
              </h3>
              <p style={{ fontSize: "0.94rem", lineHeight: 1.65, color: "var(--navy-200)", margin: 0 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
