import type { Metadata } from "next";
import Avaliador from "./Avaliador";
export const metadata: Metadata = { title: "Avalie seu imóvel | WeCare Hosting", description: "Estimativa grátis de receita de aluguel por temporada com dados reais de imóveis geridos pela WeCare.", robots: { index: false } };
export default function Page() {
  return <main style={{ background: "var(--surface-page)", minHeight: "100vh", color: "var(--text-body)", fontFamily: "var(--font-sans)" }}>
    <header style={{ background: "var(--surface-inverse)", padding: "18px 20px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}><a href="/"><img src="/brand/wecare-logo-reverso.svg" alt="WeCare Hosting" style={{ height: 34 }} /></a></div>
    </header>
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 20px 64px" }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-700)" }}>Gestão de aluguel por temporada</div>
      <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 40, lineHeight: 1.15, color: "var(--navy)", margin: "10px 0 12px" }}>Quanto seu imóvel pode render por temporada?</h1>
      <p style={{ color: "var(--text-muted)", fontSize: 17 }}>Estimativa grátis baseada em dados reais de imóveis que a WeCare administra. Sem cadastro.</p>
      <Avaliador />
    </div>
  </main>;
}
