// Shown instantly while a /reservas page renders on the server, so a search or a
// click on a listing never looks frozen.
export default function Loading() {
  return (
    <section className="rs-wrap rs-results" aria-busy="true" aria-live="polite">
      <div className="rs-skel rs-skel-line" style={{ width: 180, margin: "24px 0" }} />
      <div className="rs-grid">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i}>
            <div className="rs-skel rs-skel-media" />
            <div className="rs-skel rs-skel-line" style={{ width: "60%", marginTop: 12 }} />
            <div className="rs-skel rs-skel-line" style={{ width: "85%", marginTop: 8 }} />
            <div className="rs-skel rs-skel-line" style={{ width: "40%", marginTop: 8 }} />
          </div>
        ))}
      </div>
    </section>
  );
}
