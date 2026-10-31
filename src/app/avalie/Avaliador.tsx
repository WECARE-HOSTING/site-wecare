"use client";
import { useState } from "react";
const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const MESES = ["01","02","03","04","05","06","07","08","09","10","11","12"];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type R = any;
export default function Avaliador() {
  const [f, setF] = useState({ regiao: "sp", bairro: "", tipo: "apto", quartos: 1 });
  const [r, setR] = useState<R>(null);
  const box = { padding: 10, fontSize: 16, width: "100%", marginTop: 4 } as const;
  async function go(e: React.FormEvent) { e.preventDefault(); setR(await (await fetch("/api/avalie", { method: "POST", body: JSON.stringify(f) })).json()); }
  const wa = () => `https://wa.me/5511969760183?text=${encodeURIComponent(`Olá! Fiz a avaliação no site: ${f.tipo === "casa" ? "casa" : "apartamento"}, ${f.quartos} quarto(s), ${f.bairro || f.regiao}. ${r?.tipo === "estimativa" ? `Estimativa provável ${brl(r.anual.provavel)}/ano. ` : ""}Quero uma avaliação personalizada.`)}`;
  return <div>
    <form onSubmit={go} style={{ display: "grid", gap: 14, margin: "24px 0", padding: 20, border: "1px solid #ddd", borderRadius: 12 }}>
      <label>Região<select style={box} value={f.regiao} onChange={e => setF({ ...f, regiao: e.target.value })}><option value="sp">São Paulo (capital)</option><option value="bertioga">Bertioga</option><option value="guaruja">Guarujá</option><option value="outra">Outra cidade</option></select></label>
      <label>Bairro<input style={box} placeholder="Ex.: Pinheiros" value={f.bairro} onChange={e => setF({ ...f, bairro: e.target.value })} /></label>
      <label>Tipo<select style={box} value={f.tipo} onChange={e => setF({ ...f, tipo: e.target.value })}><option value="apto">Apartamento</option><option value="casa">Casa</option></select></label>
      <label>Quartos<input style={box} type="number" min={0} max={20} value={f.quartos} onChange={e => setF({ ...f, quartos: Number(e.target.value) })} /></label>
      <button style={{ padding: 14, fontSize: 17, background: "#0f5132", color: "#fff", border: 0, borderRadius: 8 }}>Ver estimativa</button>
    </form>
    {r?.tipo === "estimativa" && <section>
      <h2>Receita bruta estimada por ano</h2>
      <div style={{ display: "flex", gap: 12 }}>{(["conservadora","provavel","otimista"] as const).map(k => <div key={k} style={{ flex: 1, padding: 14, borderRadius: 10, background: k === "provavel" ? "#e7f5ee" : "#f5f5f5" }}><small>{k === "provavel" ? "Provável" : k[0].toUpperCase() + k.slice(1)}</small><div style={{ fontSize: 22, fontWeight: 700 }}>{brl(r.anual[k])}</div></div>)}</div>
      <p>≈ {brl(r.mensalMedia)}/mês em média. Sazonalidade (provável):</p>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 90 }}>{MESES.map(m => <div key={m} title={brl(r.sazonal[m])} style={{ flex: 1, textAlign: "center", fontSize: 11 }}><div style={{ background: "#0f5132", height: Math.max(4, r.sazonal[m] / Math.max(...Object.values(r.sazonal as Record<string, number>)) * 70) }} />{m}</div>)}</div>
      <p style={{ fontSize: 13, color: "#666" }}>Base: {r.base.comparaveis} imóveis comparáveis {r.base.fonte ? `do mercado (${r.base.fonte})` : "geridos pela WeCare"} (diária mediana {brl(r.base.diariaMediana)}, ocupação mediana {r.base.ocupacaoMediana}%), últimos 12 meses, atualizado em {r.base.atualizado}. Confiança {r.confianca}. Valor bruto antes de taxas de plataforma, limpeza e gestão. Não é garantia de receita: localização exata, padrão e fotos mudam o resultado.</p>
    </section>}
    {r?.tipo === "personalizada" && <section><h2>Avaliação personalizada</h2><p>{r.motivo}</p></section>}
    {r && <a href={wa()} style={{ display: "block", textAlign: "center", marginTop: 20, padding: 14, background: "#25d366", color: "#fff", borderRadius: 8, fontWeight: 700, textDecoration: "none" }}>Receber avaliação detalhada no WhatsApp</a>}
  </div>;
}
