"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Todo CTA de conversão do site é um link wa.me (Nav, Hero, Planos, CTAFinal,
// Footer, blog). Um listener delegado no documento cobre todos — atuais e
// futuros — sem instrumentar componente por componente.
export default function GtagLeadTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href*="wa.me"]');
      if (!anchor) return;
      window.gtag?.("event", "generate_lead", {
        link_url: (anchor as HTMLAnchorElement).href,
        page_location: window.location.href,
      });
    }
    // Fase de captura: dispara antes de a navegação começar.
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  return null;
}
