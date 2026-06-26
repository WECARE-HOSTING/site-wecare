"use client";

const services = [
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--navy-700)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 11l8-8 8 8" /><path d="M19 11v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9" /><path d="M9 21v-6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6" />
        <path d="M21 11h-4" /><circle cx="18" cy="8" r="3" />
      </svg>
    ),
    title: "Anúncio & Marketing",
    body: "Fotografia profissional, copy que vende e posicionamento premium em todas as plataformas, com precificação inteligente.",
    items: ["Fotografia & produção profissional", "Anúncio multi-plataforma", "Precificação dinâmica diária", "Crescimento da reserva direta"],
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--navy-700)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 22V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v18"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>
      </svg>
    ),
    title: "Hospedagem & Hóspedes",
    body: "Atendimento humano 24/7 e multilíngue, do primeiro contato ao check-out — com curadoria de quem entra na sua casa.",
    items: ["Atendimento 24/7 multilíngue", "Curadoria e verificação de hóspedes", "Check-in e gestão de reservas", "Gestão e resposta de avaliações"],
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--navy-700)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
    title: "Limpeza & Turnover",
    body: "Equipe própria sob o Padrão WeCare entre cada estadia — higiene de hotel, enxoval e vistoria com registro.",
    items: ["Equipe de limpeza própria", "Enxoval e lavanderia", "Reposição de amenities", "Vistoria com registro fotográfico"],
  },
  {
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--navy-700)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    title: "Manutenção & Reparos",
    body: "O Cuidado WeCare: manutenção preventiva trimestral e rede de parceiros para preservar — e valorizar — o seu patrimônio.",
    items: ["Manutenção preventiva trimestral", "Resposta a emergências", "Rede de parceiros turnkey", "Acompanhamento e registro"],
  },
];

export default function Servicos() {
  return (
    <section id="servicos" style={{ background: "var(--surface-page-alt)", padding: "clamp(72px, 8vw, 112px) 0" }}>
      <div className="wc-container">
        <div data-reveal="" style={{ maxWidth: 640, marginBottom: 56 }}>
          <div className="wc-eyebrow">
            <span className="wc-label" style={{ color: "var(--gold-700)" }}>O que fazemos</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(2rem, 1.5rem + 1.8vw, 2.8rem)", lineHeight: 1.16, letterSpacing: "-0.01em", color: "var(--text-strong)", margin: 0 }}>
            Operação ponta a ponta.{" "}
            <span style={{ fontStyle: "italic", color: "var(--navy-700)" }}>Você só colhe a renda.</span>
          </h2>
          <p style={{ fontSize: "1.08rem", lineHeight: 1.7, color: "var(--text-body)", margin: "22px 0 0" }}>
            Da primeira foto do anúncio à resposta da última avaliação, cuidamos de cada detalhe — para que o seu imóvel renda sem tirar a sua paz.
          </p>
        </div>

        <div className="wc-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {services.map(svc => (
            <div
              key={svc.title}
              className="wc-card-hover"
              data-reveal=""
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border-card)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-xs)",
                padding: "38px 36px",
              }}
            >
              <div style={{ width: 56, height: 56, borderRadius: "var(--radius)", background: "var(--ivory-300)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                {svc.icon}
              </div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "1.5rem", color: "var(--text-strong)", margin: "0 0 12px" }}>
                {svc.title}
              </h3>
              <p style={{ fontSize: "0.98rem", lineHeight: 1.65, color: "var(--text-body)", margin: "0 0 22px" }}>
                {svc.body}
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 11 }}>
                {svc.items.map(item => (
                  <li key={item} style={{ display: "flex", alignItems: "baseline", gap: 12, fontSize: "0.92rem", color: "var(--text-body)" }}>
                    <span style={{ width: 5, height: 5, background: "var(--gold-500)", transform: "rotate(45deg)", flexShrink: 0, display: "inline-block", marginTop: 2 }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
