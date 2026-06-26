"use client";

const steps = [
  {
    num: "01",
    title: "Onboarding profissional",
    body: "Vistoria, inventário, manual da casa e fotografia profissional. Anunciamos e posicionamos o seu imóvel à altura do que ele é.",
    offset: 0,
  },
  {
    num: "02",
    title: "Operação ativa",
    body: "Precificação dinâmica, atendimento 24/7, curadoria de hóspedes, limpeza e manutenção. Resolvemos sem te incomodar.",
    offset: 40,
  },
  {
    num: "03",
    title: "Renda passiva",
    body: "O Relatório WeCare todo mês — Seu Patrimônio, Seu Resultado, Seu Sossego — e o repasse pontual no Dia do Repasse.",
    offset: 80,
  },
];

export default function ComoFunciona() {
  return (
    <section id="como-funciona" style={{ background: "var(--surface-page)", padding: "clamp(72px, 8vw, 112px) 0" }}>
      <div className="wc-container">
        <div data-reveal="" style={{ textAlign: "center", maxWidth: 620, margin: "0 auto 64px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <span style={{ width: 36, height: 1, background: "var(--gold-500)", display: "block" }} />
            <span className="wc-label" style={{ color: "var(--gold-700)" }}>Como funciona</span>
            <span style={{ width: 36, height: 1, background: "var(--gold-500)", display: "block" }} />
          </div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(2rem, 1.5rem + 1.8vw, 2.8rem)", lineHeight: 1.16, letterSpacing: "-0.01em", color: "var(--text-strong)", margin: 0 }}>
            Três passos até a{" "}
            <span style={{ fontStyle: "italic", color: "var(--navy-700)" }}>renda passiva.</span>
          </h2>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--text-body)", margin: "22px 0 0" }}>
            Seu imóvel ativo nas principais plataformas em até 7 dias — zero burocracia.
          </p>
        </div>

        <div className="wc-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, alignItems: "start" }}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              data-reveal=""
              className={i === 1 ? "wc-step-2" : i === 2 ? "wc-step-3" : ""}
              style={{ marginTop: step.offset }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 500,
                    fontSize: "3.4rem",
                    lineHeight: 1,
                    color: "transparent",
                    WebkitTextStroke: "1px var(--gold-500)",
                  }}
                >
                  {step.num}
                </span>
                <span style={{ flex: 1, height: 1, background: "var(--line-soft)", display: "block" }} />
              </div>
              <h3 style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "1.55rem", color: "var(--text-strong)", margin: "24px 0 12px" }}>
                {step.title}
              </h3>
              <p style={{ fontSize: "0.98rem", lineHeight: 1.7, color: "var(--text-body)", margin: 0 }}>
                {step.body}
              </p>
            </div>
          ))}
        </div>

        <div data-reveal="" style={{ display: "flex", justifyContent: "center", marginTop: 64 }}>
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
              padding: "15px 36px",
              borderRadius: "var(--radius)",
              textDecoration: "none",
              transition: "background var(--dur) var(--ease)",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--navy-700)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--navy-800)")}
          >
            Avalie seu imóvel
          </a>
        </div>
      </div>
    </section>
  );
}
