"use client";

export default function ProofBar() {
  return (
    <section id="prova" style={{ background: "var(--navy-800)", padding: "76px 0" }}>
      <div
        className="wc-container wc-proof-grid"
        style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr 1fr 1.5fr", gap: 40, alignItems: "center" }}
      >
        <div data-reveal="">
          <div style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(2.2rem, 1.6rem + 1.6vw, 3.1rem)", lineHeight: 1, color: "var(--ivory-100)" }}>
            R$ 200M +
          </div>
          <div style={{ marginTop: 14, fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--navy-200)" }}>
            patrimônio sob gestão
          </div>
        </div>

        <div data-reveal="" className="wc-proof-border" style={{ borderLeft: "1px solid var(--line-soft-dark)", paddingLeft: 32 }}>
          <div style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(2.2rem, 1.6rem + 1.6vw, 3.1rem)", lineHeight: 1, color: "var(--ivory-100)" }}>
            10 anos
          </div>
          <div style={{ marginTop: 14, fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--navy-200)" }}>
            de experiência
          </div>
        </div>

        <div data-reveal="" className="wc-proof-border" style={{ borderLeft: "1px solid var(--line-soft-dark)", paddingLeft: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 50, height: 50, borderRadius: 999, border: "1px solid var(--gold-500)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold-300)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </span>
            <span style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(1.8rem, 1.3rem + 1.2vw, 2.5rem)", lineHeight: 1, color: "var(--ivory-100)" }}>
              Superhost
            </span>
          </div>
          <div style={{ marginTop: 14, fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--navy-200)" }}>
            Airbnb · Pro.Host
          </div>
        </div>

        <p
          data-reveal=""
          style={{ margin: 0, fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.3rem", lineHeight: 1.5, color: "var(--ivory-100)", borderLeft: "1px solid var(--gold-500)", paddingLeft: 32 }}
        >
          "Só gerimos o que acreditamos que vai ganhar."
          <span style={{ display: "block", marginTop: 10, fontFamily: "var(--font-sans)", fontStyle: "normal", fontSize: "0.66rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-300)" }}>
            Shortstay feito para longo prazo
          </span>
        </p>
      </div>
    </section>
  );
}
