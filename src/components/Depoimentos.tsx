"use client";

const proprietarios = [
  {
    quote: "Eu passava os fins de semana resolvendo problema de hóspede. Hoje abro o Relatório uma vez por mês e está tudo lá.",
    initials: "M&A",
    name: "Marina e Antônio",
    role: "Proprietários · Itaim",
  },
  {
    quote: "Eu queria manter o apartamento, não virar hoteleiro. Eles operam como se o imóvel fosse deles — e os números provam.",
    initials: "R",
    name: "Ricardo",
    role: "Proprietário · Jardins",
  },
  {
    quote: "O que me convenceu foi a curadoria. Só entra quem eles aprovam — meu patrimônio voltou melhor do que entreguei.",
    initials: "H",
    name: "Helena",
    role: "Proprietária · Higienópolis",
  },
];

const hospedes = [
  {
    quote: "Apartamento com excelente localização, espaço amplo e decoração impecável. Tem tudo o que se precisa numa estadia — e o atendimento do time fez toda a diferença. Espero me hospedar aqui novamente.",
    name: "Gilson",
    role: "Hóspede · Weston, Flórida",
  },
  {
    quote: "Minha estadia foi ótima, pela segunda vez. Tudo correu tranquilamente do check-in ao check-out. Sei que posso contar com a equipe para resolver qualquer questão — e isso passa muita tranquilidade. Voltarei.",
    name: "Evelyn",
    role: "Hóspede · North Miami Beach, Flórida",
  },
  {
    quote: "Fiquei sete meses no apartamento. A portaria avisa tudo e estão sempre atentos, assim como a wecare. Amei a estadia!",
    name: "Stephanie",
    role: "Hóspede · 5 anos no Airbnb",
  },
];

function TestimonialCard({ quote, initials, name, role }: { quote: string; initials?: string; name: string; role: string }) {
  return (
    <figure
      className="wc-card-hover"
      data-reveal=""
      style={{
        margin: 0,
        background: "var(--surface-card)",
        border: "1px solid var(--border-card)",
        borderRadius: "var(--radius-md)",
        boxShadow: "var(--shadow-xs)",
        padding: "34px 32px 30px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {initials ? (
        <span aria-hidden="true" style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "4.4rem", lineHeight: 0.6, color: "var(--gold-500)" }}>"</span>
      ) : (
        <div aria-label="Cinco estrelas" style={{ color: "var(--gold-700)", fontSize: "1rem", letterSpacing: 4, marginBottom: 20 }}>★★★★★</div>
      )}
      <blockquote style={{ margin: initials ? "16px 0 0" : 0, fontFamily: "var(--font-serif)", fontSize: "1.15rem", lineHeight: 1.55, color: "var(--text-strong)", flex: 1 }}>
        {initials ? `"${quote}"` : `"${quote}"`}
      </blockquote>
      <figcaption style={{ marginTop: 26, paddingTop: 20, borderTop: "1px solid var(--gold-500)", display: "flex", alignItems: "center", gap: 14 }}>
        {initials && (
          <span aria-hidden="true" style={{ width: 46, height: 46, borderRadius: 999, background: "var(--navy-800)", color: "var(--gold-300)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "0.9rem", flexShrink: 0 }}>
            {initials}
          </span>
        )}
        <span>
          <span style={{ display: "block", fontWeight: 600, fontSize: "0.95rem", color: "var(--text-strong)" }}>{name}</span>
          <span style={{ display: "block", marginTop: 2, fontFamily: "var(--font-sans)", fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-muted)" }}>{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Depoimentos() {
  return (
    <>
      {/* Proprietários */}
      <section id="depoimentos" style={{ background: "var(--surface-page)", padding: "clamp(72px, 8vw, 112px) 0" }}>
        <div className="wc-container">
          <div data-reveal="" style={{ maxWidth: 620, marginBottom: 56 }}>
            <div className="wc-eyebrow">
              <span className="wc-label" style={{ color: "var(--gold-700)" }}>Histórias de proprietários</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(2rem, 1.5rem + 1.8vw, 2.8rem)", lineHeight: 1.16, letterSpacing: "-0.01em", color: "var(--text-strong)", margin: 0 }}>
              Quem entra, <span style={{ fontStyle: "italic", color: "var(--navy-700)" }}>fica.</span>
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--text-body)", margin: "22px 0 0" }}>
              Proprietários reais que trocaram a preocupação operacional por renda passiva de verdade.
            </p>
          </div>

          <div className="wc-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {proprietarios.map(t => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>

      {/* Hóspedes */}
      <section id="hospedes" style={{ background: "var(--surface-page-alt)", padding: "clamp(72px, 8vw, 112px) 0" }}>
        <div className="wc-container">
          <div data-reveal="" style={{ maxWidth: 660, marginBottom: 56 }}>
            <div className="wc-eyebrow">
              <span className="wc-label" style={{ color: "var(--gold-700)" }}>O que dizem os hóspedes</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(2rem, 1.5rem + 1.8vw, 2.8rem)", lineHeight: 1.16, letterSpacing: "-0.01em", color: "var(--text-strong)", margin: 0 }}>
              Hóspedes encantados
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--text-body)", margin: "22px 0 0" }}>
              Avaliações cinco estrelas — o melhor sinal de que o seu imóvel está em boas mãos.
            </p>
          </div>

          <div className="wc-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {hospedes.map(t => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
