import type { Metadata } from "next";
import Avaliador from "./Avaliador";
export const metadata: Metadata = { title: "Avalie seu imóvel | WeCare", description: "Estimativa grátis de receita de aluguel por temporada com dados reais de imóveis geridos pela WeCare.", robots: { index: false } };
export default function Page() {
  return <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 20px", fontFamily: "system-ui, sans-serif" }}>
    <h1 style={{ fontSize: 32, marginBottom: 8 }}>Quanto seu imóvel pode render por temporada?</h1>
    <p style={{ color: "#555" }}>Estimativa grátis baseada em dados reais de imóveis que a WeCare administra. Sem cadastro.</p>
    <Avaliador />
  </main>;
}
