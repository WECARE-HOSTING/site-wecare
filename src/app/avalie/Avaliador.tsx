"use client";
import { useState } from "react";
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const MESES = ["01","02","03","04","05","06","07","08","09","10","11","12"];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type R = any;
export default function Avaliador() {
  const [f, setF] = useState({ regiao: "sp", bairro: "", tipo: "apto", quartos: 1 });
  const [r, setR] = useState<R>(null);
  const box = { padding: 12, fontSize: 16, width: "100%", marginTop: 6, border: "1px solid var(--stone-400)", borderRadius: 8, background: "#fff", color: "var(--text-strong)", fontFamily: "var(--font-sans)" } as const;
  const [lead, setLead] = useState({ nome: "", email: "", telefone: "", consentimento: false });
  const [pedeLead, setPedeLead] = useState(false);
  const [erro, setErro] = useState("");
  async function enviar(comLead: boolean) {
    const res = await fetch("/api/avalie", { method: "POST", body: JSON.stringify(comLead ? { ...f, lead } : f) });
    const j = await res.json();
    if (j.tipo === "lead") { setPedeLead(true); setR(null); setErro(j.erro ?? ""); return; }
    try { localStorage.setItem("wc_av_usos", String(Number(localStorage.getItem("wc_av_usos") || 0) + 1)); if (comLead) localStorage.setItem("wc_av_lead", "1"); } catch {}
    setPedeLead(false); setErro(""); setR(j);
  }
  async function go(e: React.FormEvent) {
    e.preventDefault();
    let local = 0, temLead = false; try { local = Number(localStorage.getItem("wc_av_usos") || 0); temLead = localStorage.getItem("wc_av_lead") === "1"; } catch {}
    if (local >= 1 && !temLead) { setPedeLead(true); setR(null); return; }
    await enviar(false);
  }
  async function goLead(e: React.FormEvent) { e.preventDefault(); await enviar(true); }
  const wa = () => `https://wa.me/5511969760183?text=${encodeURIComponent(`Olá! Fiz a avaliação no site: ${f.tipo === "casa" ? "casa" : "apartamento"}, ${f.quartos} quarto(s), ${f.bairro || f.regiao}. ${r?.tipo === "estimativa" ? `Estimativa provável ${brl(r.anual.provavel)}/ano. ` : ""}Quero uma avaliação personalizada.`)}`;
  return <div>
    <form onSubmit={go} style={{ display: "grid", gap: 14, margin: "24px 0", padding: 24, background: "var(--surface-card)", border: "1px solid var(--border-card)", borderRadius: 12, boxShadow: "var(--shadow-sm)", fontSize: 14, fontWeight: 500, color: "var(--navy)" }}>
      <label>Região<select style={box} value={f.regiao} onChange={e => setF({ ...f, regiao: e.target.value })}><option value="sp">São Paulo (capital)</option><option value="bertioga">Bertioga</option><option value="guaruja">Guarujá</option><option value="outra">Outra cidade</option></select></label>
      <label>Bairro<input style={box} placeholder="Ex.: Pinheiros" value={f.bairro} onChange={e => setF({ ...f, bairro: e.target.value })} /></label>
      <label>Tipo<select style={box} value={f.tipo} onChange={e => setF({ ...f, tipo: e.target.value })}><option value="apto">Apartamento</option><option value="casa">Casa</option></select></label>
      <label>Quartos<input style={box} type="number" min={0} max={20} value={f.quartos} onChange={e => setF({ ...f, quartos: Number(e.target.value) })} /></label>
      <button style={{ padding: 14, fontSize: 17, background: "var(--navy)", color: "var(--ivory-100)", border: 0, borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Ver estimativa</button>
    </form>
    {pedeLead && <form onSubmit={goLead} style={{ display: "grid", gap: 12, padding: 24, background: "var(--surface-card)", borderRadius: 12, boxShadow: "var(--shadow-sm)", fontSize: 14, fontWeight: 500, color: "var(--navy)" }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, color: "var(--navy)", fontSize: 24, margin: 0 }}>Sua próxima simulação está pronta</h2>
      <p style={{ margin: 0, color: "var(--text-muted)", fontWeight: 400 }}>A primeira é livre. Para continuar simulando, deixe seu contato. Um especialista WeCare pode enviar a avaliação detalhada.</p>
      <label>Nome<input required style={box} value={lead.nome} onChange={e => setLead({ ...lead, nome: e.target.value })} /></label>
      <label>E-mail<input required type="email" style={box} value={lead.email} onChange={e => setLead({ ...lead, email: e.target.value })} /></label>
      <label>WhatsApp<input required type="tel" placeholder="(11) 99999-9999" style={box} value={lead.telefone} onChange={e => setLead({ ...lead, telefone: e.target.value })} /></label>
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontWeight: 400, fontSize: 13, color: "var(--text-body)" }}><input required type="checkbox" checked={lead.consentimento} onChange={e => setLead({ ...lead, consentimento: e.target.checked })} style={{ marginTop: 3 }} />Autorizo a WeCare Hosting a usar meus dados para enviar a avaliação e entrar em contato sobre gestão do meu imóvel, conforme a LGPD (Lei 13.709/2018). Posso pedir a exclusão a qualquer momento.</label>
      {erro && <div style={{ color: "#9B2C2C", fontSize: 13 }}>{erro}</div>}
      <button style={{ padding: 14, fontSize: 17, background: "var(--navy)", color: "var(--ivory-100)", border: 0, borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Ver estimativa</button>
    </form>}
    {r?.tipo === "estimativa" && <section style={{ padding: 24, background: "var(--surface-card)", borderRadius: 12, boxShadow: "var(--shadow-sm)" }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, color: "var(--navy)", fontSize: 26, marginTop: 0 }}>Potencial com gestão WeCare (receita bruta por ano)</h2>
      <div style={{ display: "flex", gap: 12 }}>{(["provavel","otimista"] as const).map(k => <div key={k} style={{ flex: 1, padding: 14, borderRadius: 10, background: k === "provavel" ? "var(--navy)" : "var(--ivory-200)", color: k === "provavel" ? "var(--ivory-100)" : "var(--navy)" }}><small>{k === "provavel" ? "Potencial provável" : "Potencial otimista"}</small><div style={{ fontSize: 26, fontFamily: "var(--font-serif)", marginTop: 4 }}>{brl(r.anual[k])}</div></div>)}</div>
      <p>≈ {brl(r.mensalMedia)}/mês em média. Sazonalidade (provável):</p>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 90 }}>{MESES.map(m => <div key={m} title={brl(r.sazonal[m])} style={{ flex: 1, textAlign: "center", fontSize: 11 }}><div style={{ background: "var(--gold)", borderRadius: "3px 3px 0 0", height: Math.max(4, r.sazonal[m] / Math.max(...Object.values(r.sazonal as Record<string, number>)) * 70) }} />{m}</div>)}</div>
      <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Base: {r.base.comparaveis} imóveis comparáveis {r.base.fonte ? `do mercado (${r.base.fonte})` : "geridos pela WeCare"} (diária mediana {brl(r.base.diariaMediana)}, ocupação mediana {r.base.ocupacaoMediana}%), últimos 12 meses, atualizado em {r.base.atualizado}. Confiança {r.confianca}. Estimativa baseada em imóveis que gerimos e em dados de mercado; não é garantia. Valor bruto, antes de taxas de plataforma, limpeza e gestão.</p>
      <div style={{ marginTop: 18, padding: 16, borderLeft: "3px solid var(--gold)", background: "var(--ivory-50)", borderRadius: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-700)", marginBottom: 8 }}>Premissas da estimativa</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.7 }}>
          <li><b>Taxa de ocupação:</b> {r.base.ocupacaoMediana}% (mediana do segmento)</li>
          <li><b>Diária média:</b> {brl(r.base.diariaMediana)} (mediana do segmento)</li>
          <li><b>Região:</b> {({ sp: "São Paulo (capital)", bertioga: "Bertioga", guaruja: "Guarujá" } as Record<string, string>)[f.regiao] ?? f.regiao}{f.bairro ? ` (bairro informado: ${f.bairro}; a estimativa usa a região, não o bairro)` : ""}</li>
          <li><b>Tipo e quartos:</b> {f.tipo === "casa" ? "casa" : "apartamento"}, {f.quartos} quarto(s)</li>
          <li><b>Fonte:</b> {r.base.fonte ? `dados de mercado ${r.base.fonte}, calibrados pelo faturamento real de casas geridas pela WeCare no litoral` : "faturamento real de imóveis geridos pela WeCare"} ({r.base.comparaveis} comparáveis, últimos 12 meses)</li>
        </ul>
      </div>
    </section>}
    {r?.tipo === "personalizada" && <section style={{ padding: 24, background: "var(--surface-card)", borderRadius: 12, boxShadow: "var(--shadow-sm)" }}><h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, color: "var(--navy)", marginTop: 0 }}>Avaliação personalizada</h2><p>{r.motivo}</p></section>}
    {r && <a href={wa()} style={{ display: "block", textAlign: "center", marginTop: 20, padding: 14, background: "var(--gold)", color: "var(--navy-900)", borderRadius: 8, fontWeight: 600, textDecoration: "none" }}>Receber avaliação detalhada no WhatsApp</a>}
  </div>;
}
