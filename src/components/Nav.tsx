"use client";
import { useEffect, useRef } from "react";

export default function Nav() {
  const headerRef = useRef<HTMLElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hiddenRef = useRef(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const show = () => {
      header.style.transform = "translateY(0)";
      header.style.opacity = "1";
      hiddenRef.current = false;
    };

    const hide = () => {
      header.style.transform = "translateY(-100%)";
      header.style.opacity = "0";
      hiddenRef.current = true;
    };

    const resetTimer = () => {
      show();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(hide, 3000);
    };

    // Start the timer on mount
    timerRef.current = setTimeout(hide, 3000);

    // Any user interaction resets the timer and shows the nav
    const events = ["scroll", "mousemove", "touchstart", "keydown", "click"];
    events.forEach(ev => window.addEventListener(ev, resetTimer, { passive: true }));

    return () => {
      events.forEach(ev => window.removeEventListener(ev, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(242,234,217,0.92)",
        backdropFilter: "saturate(150%) blur(12px)",
        WebkitBackdropFilter: "saturate(150%) blur(12px)",
        borderBottom: "1px solid var(--line-soft)",
        transform: "translateY(0)",
        opacity: 1,
        transition: "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}
    >
      <div
        className="wc-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 76,
        }}
      >
        {/* Logo */}
        <a href="#topo" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
          <svg width="120" height="28" viewBox="0 0 120 28" fill="none" aria-label="WeCare">
            <text x="0" y="22" fontFamily="var(--font-serif)" fontWeight="500" fontSize="22" fill="var(--navy-800)">
              wecare
            </text>
            <text x="86" y="22" fontFamily="var(--font-serif)" fontWeight="500" fontSize="22" fill="var(--gold-500)">
              .
            </text>
          </svg>
        </a>

        {/* Nav links */}
        <nav className="wc-nav-links" style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <a className="wc-nav-link" href="#porque">Por que</a>
          <a className="wc-nav-link" href="#servicos">Serviços</a>
          <a className="wc-nav-link" href="#portfolio">Portfólio</a>
          <a className="wc-nav-link" href="#como-funciona">Como funciona</a>
          <a className="wc-nav-link" href="#planos">Planos</a>
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
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              padding: "10px 20px",
              borderRadius: "var(--radius)",
              textDecoration: "none",
              transition: "background var(--dur) var(--ease)",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--navy-700)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--navy-800)")}
          >
            Avalie seu imóvel
          </a>
        </nav>
      </div>
    </header>
  );
}
