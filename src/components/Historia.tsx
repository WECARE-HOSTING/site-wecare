"use client";

export default function Historia() {
  return (
    <section id="historia" style={{ background: "var(--surface-page-alt)", padding: "clamp(80px, 9vw, 120px) 0" }}>
      <div className="wc-container">
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
          <span style={{ width: 36, height: 1, background: "var(--gold-500)", display: "block" }} />
          <span className="wc-label" style={{ color: "var(--gold-700)" }}>A história de origem</span>
        </div>

        {/* Big number reveal */}
        <div data-reveal="" style={{ display: "flex", alignItems: "baseline", gap: "4vw", flexWrap: "wrap", margin: "30px 0 0" }}>
          <span style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: "clamp(2rem, 1.2rem + 2.6vw, 3.4rem)", color: "var(--graphite-300)", textDecoration: "line-through", textDecorationColor: "var(--stone-400)", textDecorationThickness: 1 }}>
            R$ 3.500
          </span>
          <span aria-hidden="true" style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "clamp(1.8rem, 1rem + 2.4vw, 3rem)", color: "var(--gold-500)" }}>
            →
          </span>
          <span style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "clamp(3.6rem, 2rem + 5.6vw, 7rem)", lineHeight: 1, letterSpacing: "-0.015em", color: "var(--gold-700)" }}>
            R$ 30.000
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--text-muted)" }}>
            por mês · a mesma casa
          </span>
        </div>

        {/* Story text */}
        <div
          data-reveal=""
          className="wc-historia-grid"
          style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: 64, marginTop: 52, borderTop: "1px solid var(--line-soft)", paddingTop: 40 }}
        >
          <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "1.75rem", lineHeight: 1.3, color: "var(--text-strong)", margin: 0 }}>
            A casa que ia ser vendida{" "}
            <span style={{ fontStyle: "italic" }}>virou a tese.</span>
          </h2>
          <div style={{ fontSize: "1.05rem", lineHeight: 1.75, color: "var(--text-body)", maxWidth: "58ch" }}>
            <p style={{ margin: 0 }}>
              Em 2019, a casa da família em Granja Viana rendia R$ 3.500 por mês — tão pouco que já se falava em vender. Reformada e operada com método, passou a faturar R$ 30 mil mensais.
            </p>
            <p style={{ margin: "18px 0 0" }}>
              A WeCare nasceu daí: transformar imóveis e fazê-los render, sem o proprietário abrir mão do ativo.{" "}
              <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>Prova, não promessa.</span>
            </p>
          </div>
        </div>

        {/* Hero image */}
        <div data-reveal="" style={{ marginTop: 48, height: 480, borderRadius: "var(--radius-md)", overflow: "hidden", position: "relative", boxShadow: "var(--shadow-sm)" }}>
          <img
            src="/uploads/casa-passargada-005.jpg"
            alt="A casa de Granja Viana"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 55%", transition: "transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(12,35,48,0.18), transparent 60%)" }} />
          <div style={{ position: "absolute", bottom: 28, left: 36 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--gold-300)", background: "rgba(12,35,48,0.55)", padding: "4px 10px", borderRadius: 2 }}>
              Granja Viana · A casa que deu origem
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
