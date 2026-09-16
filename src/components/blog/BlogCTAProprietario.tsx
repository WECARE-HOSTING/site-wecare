/**
 * Bloco de conversão de proprietário (ICP 1) — M-00129
 * Espelha o pedido da home (`CTAFinal` / #avaliar), adaptado à largura do artigo.
 * CTA BrandScript ICP 1: "Avalie seu imóvel" / "Veja se seu imóvel se qualifica"
 */
const WA_LINK =
  "https://wa.me/5511969760183?text=Quero%20avaliar%20o%20meu%20im%C3%B3vel%20para%20a%20WECARE%20fazer%20a%20gest%C3%A3o";
const WA_PLAIN = "https://wa.me/5511969760183";

export default function BlogCTAProprietario({
  variant = "article",
}: {
  /** article = dentro do post; index = rodapé do /blog */
  variant?: "article" | "index";
}) {
  const margin = variant === "index" ? "56px 0 0" : "64px 0";

  return (
    <aside
      aria-label="Avaliação do imóvel"
      style={{
        margin,
        padding: "clamp(32px, 4vw, 48px)",
        background: "var(--navy-900)",
        borderRadius: "var(--radius-md)",
        color: "var(--ivory-100)",
        position: "relative",
        overflow: "hidden",
        textAlign: "left",
      }}
    >
      <div style={{ position: "relative", maxWidth: 560 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <span style={{ width: 28, height: 1, background: "var(--gold-500)", display: "block" }} />
          <span
            className="wc-label"
            style={{ color: "var(--gold-300)", letterSpacing: "0.08em" }}
          >
            O próximo passo
          </span>
        </div>

        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontWeight: 500,
            fontSize: "clamp(1.55rem, 1.2rem + 1.2vw, 2rem)",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            color: "var(--ivory-100)",
            margin: "0 0 14px",
          }}
        >
          Cuidamos de um número{" "}
          <span style={{ fontStyle: "italic", color: "var(--gold-300)" }}>limitado</span> de
          imóveis.
        </h2>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "1rem",
            lineHeight: 1.65,
            color: "var(--navy-100)",
            margin: "0 0 22px",
            maxWidth: "48ch",
          }}
        >
          Avaliamos o seu imóvel sem compromisso. Se houver fit dos dois lados, seguimos para o
          contrato de gestão — sem fidelidade e sem multa. Quem está, está bem.
        </p>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.78rem",
            lineHeight: 1.5,
            color: "var(--navy-200)",
            margin: "0 0 26px",
          }}
        >
          10 anos · Superhost · churn &lt;1%/mês · zero Reclame Aqui
        </p>

        <div
          className="wc-cta-group"
          style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}
        >
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
              padding: "15px 32px",
              borderRadius: "var(--radius)",
              textDecoration: "none",
            }}
          >
            Avalie seu imóvel
          </a>
          <a
            href={WA_PLAIN}
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
            }}
          >
            Falar pelo WhatsApp
          </a>
        </div>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.8rem",
            color: "var(--navy-200)",
            margin: "18px 0 0",
          }}
        >
          Ainda pesquisando?{" "}
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--gold-300)", textDecoration: "none", borderBottom: "1px solid var(--gold-500)" }}
          >
            Veja se seu imóvel se qualifica
          </a>
          .
        </p>
      </div>
    </aside>
  );
}
