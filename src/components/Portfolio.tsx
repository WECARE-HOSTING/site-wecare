"use client";

const cards = [
  { region: "São Paulo · Capital", title: "Coberturas nos Jardins e Itaim", img: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=80", objectPosition: "center 55%" },
  { region: "Litoral", title: "Casas de praia premium", img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=900&q=80", objectPosition: "center" },
  { region: "Serra & Campo", title: "Refúgios fora da cidade", img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=900&q=80", objectPosition: "center 50%" },
  { region: "Amazônia", title: "Eco-retiros na floresta", img: "/uploads/eco-retiros.jpg", objectPosition: "center" },
];

const mosaic = [
  { span: 2, img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" },
  { span: 2, img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" },
  { span: 2, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" },
  { span: 3, img: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80" },
  { span: 3, img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80" },
];

const imgStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
};

export default function Portfolio() {
  return (
    <section id="portfolio" style={{ background: "var(--surface-page)", padding: "clamp(72px, 8vw, 112px) 0" }}>
      <div className="wc-container">
        {/* Header */}
        <div data-reveal="" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 28, marginBottom: 52 }}>
          <div style={{ maxWidth: 620 }}>
            <div className="wc-eyebrow">
              <span className="wc-label" style={{ color: "var(--gold-700)" }}>Portfólio</span>
            </div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "clamp(2rem, 1.5rem + 1.8vw, 2.8rem)", lineHeight: 1.16, letterSpacing: "-0.01em", color: "var(--text-strong)", margin: 0 }}>
              Um portfólio de qualidade<span style={{ fontStyle: "italic", color: "var(--navy-700)" }}>.</span>
            </h2>
            <p style={{ fontSize: "1.05rem", lineHeight: 1.7, color: "var(--text-body)", margin: "22px 0 0", maxWidth: "52ch" }}>
              Cuidamos de imóveis em todo o Brasil — de São Paulo à Amazônia. Onde há patrimônio que merece atenção, a WeCare opera.
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "var(--font-serif)", fontWeight: 600, fontSize: "clamp(2.4rem, 1.8rem + 1.6vw, 3.4rem)", lineHeight: 1, color: "var(--gold-700)" }}>
              R$ 200M +
            </div>
            <div style={{ marginTop: 10, fontFamily: "var(--font-sans)", fontSize: "0.68rem", fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--text-muted)" }}>
              do Itaim à Amazônia
            </div>
          </div>
        </div>

        {/* 4-card row — img tag for proper zoom effect */}
        <div className="wc-portfolio-grid wc-grid-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {cards.map(card => (
            <div
              key={card.title}
              data-reveal=""
              style={{ position: "relative", height: 340, borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-xs)", cursor: "default" }}
              onMouseEnter={e => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1.07)";
              }}
              onMouseLeave={e => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1)";
              }}
            >
              <img
                src={card.img}
                alt={card.title}
                style={{ ...imgStyle, objectPosition: card.objectPosition }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,23,32,0.84), rgba(8,23,32,0.04) 56%)" }} />
              <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "24px 22px" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--gold-300)" }}>
                  {card.region}
                </span>
                <div style={{ fontFamily: "var(--font-serif)", fontWeight: 500, fontSize: "1.3rem", color: "var(--ivory-100)", marginTop: 6, lineHeight: 1.25 }}>
                  {card.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mosaic grid — also zoom on hover */}
        <div
          data-reveal=""
          className="wc-portfolio-mosaic"
          style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gridAutoRows: 200, gap: 20 }}
        >
          {mosaic.map((m, i) => (
            <div
              key={i}
              style={{ gridColumn: `span ${m.span}`, borderRadius: "var(--radius-md)", overflow: "hidden", boxShadow: "var(--shadow-xs)", position: "relative" }}
              onMouseEnter={e => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1.07)";
              }}
              onMouseLeave={e => {
                const img = e.currentTarget.querySelector("img");
                if (img) img.style.transform = "scale(1)";
              }}
            >
              <img
                src={m.img}
                alt=""
                aria-hidden="true"
                style={{ ...imgStyle, objectPosition: "center" }}
              />
            </div>
          ))}
        </div>

        <p data-reveal="" style={{ margin: "36px 0 0", fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "1.15rem", lineHeight: 1.5, color: "var(--navy-700)", maxWidth: "60ch" }}>
          A WeCare vai onde o seu hóspede quer estar.
        </p>
      </div>
    </section>
  );
}
