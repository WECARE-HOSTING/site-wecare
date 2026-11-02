"use client";
import { useState } from "react";
import { bairrosDaRegiao, OUTRO_BAIRRO } from "@/lib/avaliador-bairros";
import { linkWhatsapp, nomeRegiao, resumoTexto, type Input } from "@/lib/avaliador";

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const MESES = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
type Canal = "pdf" | "email" | "whatsapp";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type R = any;

const box = { padding: 12, fontSize: 16, width: "100%", marginTop: 6, border: "1px solid var(--stone-400)", borderRadius: 8, background: "#fff", color: "var(--text-strong)", fontFamily: "var(--font-sans)" } as const;
const btn = { padding: "14px 16px", fontSize: 16, border: 0, borderRadius: 8, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "var(--font-sans)" } as const;

function jaUsouSemContato() {
  let uso = false;
  let lead = false;
  try {
    uso = Number(localStorage.getItem("wc_av_usos") || 0) >= 1;
    lead = localStorage.getItem("wc_av_lead") === "1";
  } catch { /* modo privado */ }
  if (typeof document !== "undefined" && /(?:^|;\s*)wc_av_visto=1(?:;|$)/.test(document.cookie)) uso = true;
  if (typeof document !== "undefined" && /(?:^|;\s*)wc_av_contato=1(?:;|$)/.test(document.cookie)) lead = true;
  return uso && !lead;
}

function marcarUsoLocal(comContato: boolean) {
  try { localStorage.setItem("wc_av_usos", "1"); if (comContato) localStorage.setItem("wc_av_lead", "1"); } catch { /* segue o cookie */ }
  const base = "Path=/; Max-Age=31536000; SameSite=Lax";
  document.cookie = `wc_av_visto=1; ${base}`;
  if (comContato) document.cookie = `wc_av_contato=1; ${base}`;
}

export default function Avaliador() {
  const [f, setF] = useState<{ regiao: string; bairro: string; outro: string; tipo: string; quartos: number | "" }>({ regiao: "sp", bairro: "", outro: "", tipo: "apto", quartos: 1 });
  const [r, setR] = useState<R>(null);
  const [lead, setLead] = useState({ email: "", telefone: "", consentimento: false });
  const [pedeLead, setPedeLead] = useState(false);
  const [erro, setErro] = useState("");
  const [canal, setCanal] = useState<Canal | null>(null);
  const [contato, setContato] = useState({ email: "", telefone: "", consentimento: false });
  const [erroAcao, setErroAcao] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [linkWa, setLinkWa] = useState("");

  const bairroEnvio = f.bairro === OUTRO_BAIRRO ? (f.outro.trim() || OUTRO_BAIRRO) : f.bairro;
  const corpoBase = { regiao: f.regiao, tipo: f.tipo, quartos: f.quartos === "" ? null : f.quartos, bairro: bairroEnvio };

  async function enviar(comLead: boolean) {
    setErro("");
    if (!comLead && jaUsouSemContato()) { setPedeLead(true); setR(null); return; }
    const corpo = comLead ? { ...corpoBase, lead: { ...lead, nome: "" } } : corpoBase;
    let res: Response;
    try {
      res = await fetch("/api/avalie", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(corpo) });
    } catch {
      setR(null);
      setErro("Não foi possível falar com o servidor. Tente de novo.");
      return;
    }
    const j = await res.json().catch(() => null);
    if (j?.tipo === "lead" || res.status === 403 || res.status === 422) {
      setPedeLead(true); setR(null); setErro(typeof j?.erro === "string" ? j.erro : ""); return;
    }
    if (!res.ok || !j || (j.tipo !== "estimativa" && j.tipo !== "personalizada")) {
      setR(null); setErro(typeof j?.erro === "string" ? j.erro : "Não foi possível calcular a estimativa."); return;
    }
    marcarUsoLocal(comLead);
    setPedeLead(false); setErro(""); setCanal(null); setConfirmacao(""); setLinkWa(""); setR(j);
  }

  async function entregar(e: React.FormEvent) {
    e.preventDefault();
    if (!canal) return;
    setErroAcao("");
    setConfirmacao("");
    setLinkWa("");
    let abriuWa = false;
    if (canal === "whatsapp" && contato.consentimento && contato.telefone.replace(/\D/g, "").length >= 10 && r && typeof f.quartos === "number") {
      const url = linkWhatsapp(contato.telefone, resumoTexto({ regiao: f.regiao, tipo: f.tipo, quartos: f.quartos, bairro: bairroEnvio } as Input, r));
      const aberto = window.open(url, "_blank", "noopener,noreferrer");
      abriuWa = true;
      setLinkWa(url);
      setConfirmacao(aberto ? "WhatsApp aberto com o resumo." : "Se a janela não abriu, use o link abaixo.");
    }
    let res: Response;
    try {
      res = await fetch("/api/avalie/entrega", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...corpoBase, canal, contato: { ...contato, nome: "" } }),
      });
    } catch {
      setErroAcao("Não foi possível falar com o servidor. Tente de novo.");
      return;
    }
    if (canal === "pdf") {
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        setErroAcao(typeof j?.erro === "string" ? j.erro : "Não foi possível gerar o PDF.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "estimativa-wecare.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      marcarUsoLocal(true);
      setConfirmacao("O PDF da estimativa foi baixado.");
      setCanal(null);
      return;
    }
    const j = await res.json().catch(() => null);
    if (!res.ok) { setErroAcao(typeof j?.erro === "string" ? j.erro : "Não foi possível concluir."); return; }
    marcarUsoLocal(true);
    if (canal === "whatsapp" && typeof j?.url === "string") {
      if (!abriuWa) {
        const aberto = window.open(j.url, "_blank", "noopener,noreferrer");
        setLinkWa(j.url);
        setConfirmacao(aberto ? "WhatsApp aberto com o resumo." : "Se a janela não abriu, use o link abaixo.");
      }
      setCanal(null);
      return;
    }
    setConfirmacao(typeof j?.mensagem === "string" ? j.mensagem : "Contato registrado.");
    setCanal(null);
  }

  const bairros = bairrosDaRegiao(f.regiao);
  return <div data-avaliador>
    <form noValidate onSubmit={(e) => { e.preventDefault(); void enviar(false); }} style={{ display: "grid", gap: 14, margin: "24px 0", padding: 24, background: "var(--surface-card)", border: "1px solid var(--border-card)", borderRadius: 12, boxShadow: "var(--shadow-sm)", fontSize: 14, fontWeight: 500, color: "var(--navy)" }}>
      <label>Região<select style={box} value={f.regiao} onChange={(e) => setF({ ...f, regiao: e.target.value, bairro: "", outro: "" })}><option value="sp">São Paulo (capital)</option><option value="bertioga">Bertioga</option><option value="guaruja">Guarujá</option><option value="outra">Outra cidade</option></select></label>
      <label>Bairro
        <select style={box} value={f.bairro} onChange={(e) => setF({ ...f, bairro: e.target.value, outro: e.target.value === OUTRO_BAIRRO ? f.outro : "" })}>
          <option value="">Selecione</option>
          {bairros.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
      </label>
      {f.bairro === OUTRO_BAIRRO && <label>Qual bairro?<input style={box} value={f.outro} maxLength={80} onChange={(e) => setF({ ...f, outro: e.target.value })} /></label>}
      <label>Tipo<select style={box} value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}><option value="apto">Apartamento</option><option value="casa">Casa</option></select></label>
      <label>Quartos<input required style={box} type="number" inputMode="numeric" min={1} max={20} step={1} value={f.quartos} onChange={(e) => setF({ ...f, quartos: e.target.value === "" ? "" : Number(e.target.value) })} /></label>
      <button type="submit" style={{ ...btn, background: "var(--navy)", color: "var(--ivory-100)" }}>Ver estimativa</button>
    </form>
    {erro && <p role="alert" style={{ color: "#9B2C2C", fontSize: 14, margin: "0 0 16px" }}>{erro}</p>}
    {pedeLead && <form noValidate onSubmit={(e) => { e.preventDefault(); void enviar(true); }} style={{ display: "grid", gap: 12, marginBottom: 16, padding: 24, background: "var(--surface-card)", borderRadius: 12, boxShadow: "var(--shadow-sm)", fontSize: 14, fontWeight: 500, color: "var(--navy)" }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, color: "var(--navy)", fontSize: 24, margin: 0 }}>Para calcular de novo</h2>
      <p style={{ margin: 0, color: "var(--text-muted)", fontWeight: 400 }}>Informe um e-mail ou WhatsApp. Usamos o contato só para esta estimativa e para a equipe retomar, com o seu consentimento.</p>
      <label>E-mail<input type="email" style={box} value={lead.email} autoComplete="email" onChange={(e) => setLead({ ...lead, email: e.target.value })} /></label>
      <label>WhatsApp<input type="tel" placeholder="(11) 99999-9999" style={box} value={lead.telefone} autoComplete="tel" onChange={(e) => setLead({ ...lead, telefone: e.target.value })} /></label>
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontWeight: 400, fontSize: 13, color: "var(--text-body)" }}><input type="checkbox" checked={lead.consentimento} onChange={(e) => setLead({ ...lead, consentimento: e.target.checked })} style={{ marginTop: 3 }} />Autorizo a WeCare Hosting a usar estes dados para enviar a estimativa e entrar em contato sobre a gestão do imóvel, conforme a LGPD (Lei 13.709/2018). Posso pedir a exclusão a qualquer momento.</label>
      <button type="submit" style={{ ...btn, background: "var(--navy)", color: "var(--ivory-100)" }}>Ver estimativa</button>
    </form>}
    {r?.tipo === "estimativa" && <section style={{ padding: 24, background: "var(--surface-card)", borderRadius: 12, boxShadow: "var(--shadow-sm)" }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, color: "var(--navy)", fontSize: 26, marginTop: 0 }}>Potencial com gestão WeCare (receita bruta por ano)</h2>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>{(["provavel", "otimista"] as const).map((k) => <div key={k} style={{ flex: "1 1 140px", padding: 14, borderRadius: 10, background: k === "provavel" ? "var(--navy)" : "var(--ivory-200)", color: k === "provavel" ? "var(--ivory-100)" : "var(--navy)" }}><small>{k === "provavel" ? "Potencial provável" : "Potencial otimista"}</small><div style={{ fontSize: 26, fontFamily: "var(--font-serif)", marginTop: 4 }}>{brl(r.anual[k])}</div></div>)}</div>
      <p>≈ {brl(r.mensalMedia)}/mês no cenário provável. Sazonalidade (provável):</p>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 90 }}>{MESES.map((m) => <div key={m} title={brl(r.sazonal[m])} style={{ flex: 1, textAlign: "center", fontSize: 11 }}><div style={{ background: "var(--gold)", borderRadius: "3px 3px 0 0", height: Math.max(4, r.sazonal[m] / Math.max(...Object.values(r.sazonal as Record<string, number>)) * 70) }} />{m}</div>)}</div>
      <p style={{ fontSize: 13, color: "var(--text-muted)" }}>Base: {r.base.comparaveis} imóveis comparáveis {r.base.fonte ? `do mercado (${r.base.fonte})` : "geridos pela WeCare"} (diária mediana {brl(r.base.diariaMediana)}, ocupação mediana {r.base.ocupacaoMediana}%), últimos 12 meses, atualizado em {r.base.atualizado}. Confiança {r.confianca}. {r.base.central === "mediana" ? "O potencial provável é a mediana: a média fica puxada por imóveis de receita muito alta. " : ""}Estimativa baseada em imóveis que gerimos e em dados de mercado; não é garantia. Valor bruto, antes de taxas de plataforma, limpeza e gestão.</p>
      <div style={{ marginTop: 18, padding: 16, borderLeft: "3px solid var(--gold)", background: "var(--ivory-50)", borderRadius: 6 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-700)", marginBottom: 8 }}>Premissas da estimativa</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.7 }}>
          <li><b>Taxa de ocupação:</b> {r.base.ocupacaoMediana}% (mediana do segmento)</li>
          <li><b>Diária mediana:</b> {brl(r.base.diariaMediana)}</li>
          <li><b>Região:</b> {nomeRegiao(f.regiao)}{bairroEnvio ? `. Bairro: ${bairroEnvio}. O número usa a faixa da cidade.` : ""}</li>
          <li><b>Tipo e quartos:</b> {f.tipo === "casa" ? "casa" : "apartamento"}, {f.quartos} quarto(s). Faixa usada: {r.base.faixa}{r.base.serie ? ` (série já tabelada: ${r.base.serie})` : ""}</li>
          {r.base.casaNaSerieDaRegiao && <li><b>Casa em São Paulo:</b> a tabela não separa casa e apartamento; a estimativa usa os imóveis geridos nessa faixa.</li>}
          <li><b>Fonte:</b> {r.base.fonte ? `dados de mercado ${r.base.fonte}, calibrados pelo faturamento real de casas geridas pela WeCare no litoral` : "faturamento real de imóveis geridos pela WeCare"} ({r.base.comparaveis} comparáveis, últimos 12 meses)</li>
        </ul>
      </div>
    </section>}
    {r?.tipo === "personalizada" && <section style={{ padding: 24, background: "var(--surface-card)", borderRadius: 12, boxShadow: "var(--shadow-sm)" }}><h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, color: "var(--navy)", marginTop: 0 }}>Avaliação personalizada</h2><p>{r.motivo}</p></section>}
    {r && <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
      <button type="button" onClick={() => { setCanal("pdf"); setErroAcao(""); setConfirmacao(""); setLinkWa(""); }} style={{ ...btn, background: "var(--navy)", color: "var(--ivory-100)" }}>Baixar PDF</button>
      <button type="button" onClick={() => { setCanal("whatsapp"); setErroAcao(""); setConfirmacao(""); setLinkWa(""); }} style={{ ...btn, background: "var(--gold)", color: "var(--navy-900)" }}>Enviar pelo WhatsApp</button>
      <button type="button" onClick={() => { setCanal("email"); setErroAcao(""); setConfirmacao(""); setLinkWa(""); }} style={{ ...btn, background: "#fff", color: "var(--navy)", border: "1px solid var(--stone-400)" }}>Enviar por e-mail</button>
    </div>}
    {canal && <form noValidate onSubmit={(e) => { void entregar(e); }} style={{ display: "grid", gap: 12, marginTop: 12, padding: 24, background: "var(--surface-card)", borderRadius: 12, boxShadow: "var(--shadow-sm)", fontSize: 14, fontWeight: 500, color: "var(--navy)" }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 22, margin: 0 }}>{canal === "pdf" ? "Baixar PDF" : canal === "whatsapp" ? "Enviar pelo WhatsApp" : "Enviar por e-mail"}</h2>
      <p style={{ margin: 0, color: "var(--text-muted)", fontWeight: 400 }}>{canal === "whatsapp" ? "Informe o WhatsApp que recebe o resumo." : "Informe o e-mail que recebe o resultado."}</p>
      {canal === "whatsapp"
        ? <label>WhatsApp<input required type="tel" placeholder="(11) 99999-9999" style={box} value={contato.telefone} autoComplete="tel" onChange={(e) => setContato({ ...contato, telefone: e.target.value })} /></label>
        : <label>E-mail<input required type="email" style={box} value={contato.email} autoComplete="email" onChange={(e) => setContato({ ...contato, email: e.target.value })} /></label>}
      <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontWeight: 400, fontSize: 13, color: "var(--text-body)" }}><input type="checkbox" checked={contato.consentimento} onChange={(e) => setContato({ ...contato, consentimento: e.target.checked })} style={{ marginTop: 3 }} />Autorizo a WeCare Hosting a usar este contato para enviar a estimativa e falar sobre a gestão do imóvel, conforme a LGPD (Lei 13.709/2018).</label>
      {erroAcao && <p role="alert" style={{ color: "#9B2C2C", margin: 0 }}>{erroAcao}</p>}
      <button type="submit" style={{ ...btn, background: "var(--navy)", color: "var(--ivory-100)" }}>{canal === "pdf" ? "Gerar PDF" : canal === "whatsapp" ? "Abrir WhatsApp" : "Enviar e-mail"}</button>
    </form>}
    {confirmacao && <p role="status" style={{ marginTop: 12, color: "var(--navy)" }}>{confirmacao}</p>}
    {linkWa && <a href={linkWa} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center", marginTop: 8, color: "var(--navy)", fontWeight: 600 }}>Abrir o WhatsApp com o resumo</a>}
  </div>;
}
