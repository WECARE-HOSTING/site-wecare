"use client";

const platforms = [
  { name: "Airbnb", accent: false },
  { name: "Booking.com", accent: false },
  { name: "Expedia", accent: false },
  { name: "Vrbo", accent: false },
  { name: "Google", accent: false },
  { name: "Reserva direta", accent: true },
];

export default function Visibilidade() {
  return (
    <section id="visibilidade" style={{ background: "var(--surface-page)", padding: "clamp(72px, 8vw, 112px) 0" }}>
      <div className="wc-container">
        <div
          className="wc-vis-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, alignItems: "center", position: "relative" }}
        >
          {/* Left card */}
          <div
            className="wc-vis-card"
            data-reveal=""
            style={{
              position: "relative",
              zIndex: 2,
              background: "#fff",
              border: "1px solid var(--border-card)",
              boxShadow: "var(--shadow)",
              borderRadius: "var(--radius-md)",
              padding: "48px 44px",
              marginRight: -64,
            }}
          >
            <div className="wc-eyebrow">
              <span className="wc-label" style={{ color: "var(--gold-700)" }}>Distribuição</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(1.9rem, 1.4rem + 1.6vw, 2.6rem)", lineHeight: 1.18, letterSpacing: "-0.01em", color: "var(--text-strong)", margin: 0 }}>
              Seu imóvel{" "}
              <span style={{ fontStyle: "italic", color: "var(--navy-700)" }}>em toda parte</span>{" "}
              que o hóspede certo procura.
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--text-body)", margin: "22px 0 30px", maxWidth: "44ch" }}>
              Anunciamos e posicionamos o seu imóvel nas principais plataformas em até 7 dias — exposição máxima, ocupação otimizada e o hóspede ouro encontrando a sua casa.
            </p>

            {/* Platform grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid var(--line-soft)", borderLeft: "1px solid var(--line-soft)" }}>
              {platforms.map(p => (
                <div
                  key={p.name}
                  className="wc-ota-cell"
                  style={{ color: p.accent ? "var(--gold-700)" : "var(--navy-800)" }}
                >
                  {p.name}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Airbnb screenshot, sem cortar */}
          <div
            className="wc-vis-image"
            data-reveal=""
            style={{
              borderRadius: "var(--radius-md)",
              overflow: "hidden",
              boxShadow: "var(--shadow-sm)",
              background: "var(--ivory-50)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 480,
              padding: "12px",
              position: "relative",
              zIndex: 3,
              marginLeft: 32,
            }}
          >
            <img
              src="/uploads/airbnb-anuncio.png"
              alt="Anúncio WeCare no Airbnb — Superhost e Preferido dos Hóspedes"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: 8,
                boxShadow: "0 2px 12px rgba(12,35,48,0.08)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
