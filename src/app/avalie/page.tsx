import type { Metadata } from "next";
import Link from "next/link";
import Avaliador from "./Avaliador";
// noindex até o lançamento. A URL não entra em src/app/sitemap.ts.
export const metadata: Metadata = { title: "Avalie seu imóvel | WeCare Hosting", description: "Estimativa grátis de receita de aluguel por temporada com dados reais de imóveis geridos pela WeCare.", robots: { index: false } };
export default function Page() {
  return <main style={{ background: "var(--surface-page)", minHeight: "100vh", color: "var(--text-body)", fontFamily: "var(--font-sans)", paddingBottom: 48 }}>
    <style>{`body:has([data-avaliador]) .wc-wa-float{display:none !important}`}</style>
    <header style={{ background: "var(--surface-inverse)", padding: "18px 20px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}><Link href="/"><img src="/brand/wecare-logo-reverso.svg" alt="WeCare Hosting" width={148} height={34} style={{ height: 34, width: "auto" }} /></Link></div>
    </header>
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 64px" }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-700)" }}>Gestão de aluguel por temporada</div>
      <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 40, lineHeight: 1.15, color: "var(--navy)", margin: "10px 0 12px" }}>Quanto seu imóvel pode render por temporada?</h1>
      <p style={{ color: "var(--text-muted)", fontSize: 17 }}>Estimativa grátis com dados reais de imóveis que a WeCare administra.</p>
      <Avaliador />
    </div>
  </main>;
}
