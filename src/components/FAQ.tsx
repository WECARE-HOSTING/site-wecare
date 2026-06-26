"use client";

const faqs = [
  {
    q: "Como e quando eu recebo?",
    a: "O Dia do Repasse: repasse pontual todo mês, com demonstrativo em tempo real no Relatório WeCare. Números reais, sem custos ocultos.",
  },
  {
    q: "O que está incluído na gestão?",
    a: "Anúncio e marketing, precificação dinâmica, atendimento 24/7 ao hóspede, curadoria e gestão de reservas. Na Gestão 360, somam-se limpeza, manutenção e enxoval. Você escolhe quanto delega.",
  },
  {
    q: "Tenho fidelidade ou multa?",
    a: "Não. Sem fidelidade e sem multa — você entra e sai quando quiser. Acreditamos que a relação se sustenta por resultado, não por contrato amarrado.",
  },
  {
    q: "Posso usar meu imóvel quando quiser?",
    a: "Sempre. Você bloqueia as datas que quiser, sem taxa. O imóvel é seu — a operação se encaixa na sua vida, e não o contrário.",
  },
  {
    q: "Como vocês escolhem os hóspedes?",
    a: "Curadoria antes da reserva: verificação de cada hóspede, análise de risco e seguro obrigatório. Protegemos o seu patrimônio ativamente — quem entra, cuida.",
  },
  {
    q: "Meu imóvel se qualifica?",
    a: "Avaliamos sem compromisso. Só entra o que acreditamos que vai render melhor em temporada do que em qualquer outra modalidade. Se houver fit dos dois lados, seguimos para o contrato.",
  },
];

const ChevronIcon = () => (
  <svg
    className="faq-chevron"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="var(--gold-700)"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0 }}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default function FAQ() {
  return (
    <section id="faq" style={{ background: "var(--surface-page-alt)", padding: "clamp(80px, 9vw, 120px) 0" }}>
      <div className="wc-container" style={{ maxWidth: 920 }}>
        <div data-reveal="" style={{ maxWidth: 620, marginBottom: 48 }}>
          <div className="wc-eyebrow">
            <span className="wc-label" style={{ color: "var(--gold-700)" }}>Perguntas frequentes</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(2rem, 1.5rem + 1.8vw, 2.8rem)", lineHeight: 1.16, letterSpacing: "-0.01em", color: "var(--text-strong)", margin: 0 }}>
            Tudo o que você precisa{" "}
            <span style={{ fontStyle: "italic", color: "var(--navy-700)" }}>saber.</span>
          </h2>
        </div>

        <div data-reveal="">
          {faqs.map((faq, i) => (
            <details
              key={faq.q}
              style={{ borderTop: "1px solid var(--line-soft)", ...(i === faqs.length - 1 ? { borderBottom: "1px solid var(--line-soft)" } : {}) }}
            >
              <summary style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, padding: "26px 0" }}>
                <span style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "1.25rem", color: "var(--text-strong)" }}>{faq.q}</span>
                <ChevronIcon />
              </summary>
              <p style={{ margin: 0, padding: "0 0 26px", fontSize: "1rem", lineHeight: 1.7, color: "var(--text-body)", maxWidth: "64ch" }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
