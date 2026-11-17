"use client";
import { useState } from "react";
import { bairrosDaRegiao, OUTRO_BAIRRO } from "@/lib/avaliador-bairros";
import {
  linkWhatsappWeCare,
  mensagemWhatsappEspecialista,
  nomeRegiao,
  type Input,
  type Resultado,
  type UtmOrigem,
} from "@/lib/avaliador";
import { camposUtm, capturarUtmFirstTouch } from "@/lib/privacidade/utm";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
const MESES = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
type Canal = "pdf" | "email";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type R = any;

const box = { padding: 12, fontSize: 16, width: "100%", marginTop: 6, border: "1px solid var(--stone-400)", borderRadius: 8, background: "#fff", color: "var(--text-strong)", fontFamily: "var(--font-sans)" } as const;
const btn = { padding: "14px 16px", fontSize: 16, border: 0, borderRadius: 8, fontWeight: 600, cursor: "pointer", width: "100%", fontFamily: "var(--font-sans)" } as const;
const CHAVE_CONTATO = "wc_av_v2_contato";

type ContatoSalvo = { email: string; telefone: string; consentimento: true };

function lerContato(): ContatoSalvo | null {
  try {
    const j = JSON.parse(localStorage.getItem(CHAVE_CONTATO) || "null") as Partial<ContatoSalvo> | null;
    if (!j || j.consentimento !== true) return null;
    const email = String(j.email || "");
    const telefone = String(j.telefone || "");
    if (!email && !telefone) return null;
    return { email, telefone, consentimento: true };
  } catch {
    return null;
  }
}

function guardarContato(email: string, telefone: string) {
  try {
    localStorage.setItem(CHAVE_CONTATO, JSON.stringify({ email, telefone, consentimento: true }));
  } catch {
    /* a próxima ação pede de novo */
  }
}

function capturarUtms(): UtmOrigem {
  return capturarUtmFirstTouch();
}

function registrarEvento(nome: string, params: Record<string, unknown>) {
  try {
    window.gtag?.("event", nome, params);
  } catch {
    /* sem GA nesta visita */
  }
}

function parametrosEvento(f: { regiao: string; tipo: string; quartos: number | "" }, r: R, utm: UtmOrigem) {
  return {
    tipo_resultado: r?.tipo,
    regiao: f.regiao,
    tipo_imovel: f.tipo,
    quartos: typeof f.quartos === "number" ? f.quartos : undefined,
    aproximada: Boolean(r?.base?.aproximada),
    utm_source: utm.source || undefined,
    utm_medium: utm.medium || undefined,
    utm_campaign: utm.campaign || undefined,
    utm_content: utm.content || undefined,
    utm_term: utm.term || undefined,
  };
}

function CtaEspecialista({ href, rotulo, sub, onClick }: { href: string; rotulo: string; sub: string; onClick: () => void }) {
  return (
    <div style={{ margin: "18px 0 4px" }}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick}
        style={{
          display: "block",
          textAlign: "center",
          padding: "18px 20px",
          fontSize: 18,
          lineHeight: 1.3,
          background: "var(--gold)",
          color: "var(--navy-900)",
          borderRadius: 10,
          fontWeight: 700,
          textDecoration: "none",
          fontFamily: "var(--font-sans)",
        }}
      >
        {rotulo}
      </a>
      <p style={{ margin: "10px 0 0", fontSize: 13, color: "var(--text-muted)", textAlign: "center", fontWeight: 400 }}>
        {sub}
      </p>
    </div>
  );
}

export default function Avaliador() {
  const [f, setF] = useState<{ regiao: string; bairro: string; outro: string; tipo: string; quartos: number | "" }>({
    regiao: "sp",
    bairro: "",
    outro: "",
    tipo: "apto",
    quartos: 1,
  });
  const [r, setR] = useState<R>(null);
  const [modal, setModal] = useState<null | Canal | "aviso">(null);
  const [erro, setErro] = useState("");
  const [contato, setContato] = useState({ email: "", telefone: "", consentimento: false });
  const [erroModal, setErroModal] = useState("");
  const [aviso, setAviso] = useState("");
  // Lido na hora do clique/resultado (já no cliente). Evita useSyncExternalStore com objeto novo a cada snapshot (React #185).
  const utm = capturarUtms();

  const bairroEnvio = f.bairro === OUTRO_BAIRRO ? f.outro.trim() || OUTRO_BAIRRO : f.bairro;
  const corpoBase = { regiao: f.regiao, tipo: f.tipo, quartos: f.quartos === "" ? null : f.quartos, bairro: bairroEnvio };
  const inputValido: Input | null = typeof f.quartos === "number" ? ({ regiao: f.regiao, tipo: f.tipo, quartos: f.quartos, bairro: bairroEnvio } as Input) : null;
  const waHref = r && inputValido ? linkWhatsappWeCare(mensagemWhatsappEspecialista(inputValido, r as Resultado, utm)) : "";
  const ctaAproximada = Boolean(r?.tipo === "personalizada" || r?.base?.aproximada);
  const rotuloCta = ctaAproximada ? "Fale com um especialista" : "Agende uma conversa de 15 min com um especialista";

  function fecharModal() {
    setModal(null);
    setErroModal("");
    setAviso("");
  }

  async function enviar() {
    setErro("");
    let res: Response;
    try {
      res = await fetch("/api/avalie", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...corpoBase, ...camposUtm(capturarUtmFirstTouch()) }) });
    } catch {
      setErro("Não foi possível falar com o servidor. Tente de novo.");
      return;
    }
    const j = await res.json().catch(() => null);
    if (!res.ok || !j || (j.tipo !== "estimativa" && j.tipo !== "personalizada")) {
      setErro(typeof j?.erro === "string" ? j.erro : "Não foi possível calcular a estimativa.");
      return;
    }
    setR(j);
    registrarEvento("avalie_simulacao", parametrosEvento(f, j, utm));
    fecharModal();
  }

  function abrirAcao(c: Canal) {
    const salvo = lerContato();
    if (salvo?.email) {
      void entregarCanal(c, salvo);
      return;
    }
    setContato({ email: salvo?.email || "", telefone: salvo?.telefone || "", consentimento: false });
    setErroModal("");
    setAviso("");
    setModal(c);
  }

  async function entregarCanal(c: Canal, dados: { email: string; telefone: string; consentimento: boolean }) {
    setErroModal("");
    let res: Response;
    try {
      res = await fetch("/api/avalie/entrega", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...corpoBase, canal: c, contato: { ...dados, nome: "" }, ...camposUtm(capturarUtmFirstTouch()) }),
      });
    } catch {
      setErroModal("Não foi possível falar com o servidor. Tente de novo.");
      setModal(c);
      return;
    }
    if (c === "pdf") {
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        setErroModal(typeof j?.erro === "string" ? j.erro : "Não foi possível gerar o PDF.");
        setModal(c);
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
      if (dados.consentimento) guardarContato(dados.email, dados.telefone);
      fecharModal();
      return;
    }
    const j = await res.json().catch(() => null);
    if (!res.ok) {
      setErroModal(typeof j?.erro === "string" ? j.erro : "Não foi possível concluir.");
      setModal(c);
      return;
    }
    if (dados.consentimento) guardarContato(dados.email, dados.telefone);
    setAviso(typeof j?.mensagem === "string" ? j.mensagem : "Contato registrado.");
    setModal("aviso");
  }

  function aoClicarWhatsapp() {
    registrarEvento("avalie_whatsapp", parametrosEvento(f, r, utm));
  }

  const bairros = bairrosDaRegiao(f.regiao);
  return (
    <div data-avaliador>
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void enviar();
        }}
        style={{ display: "grid", gap: 14, margin: "24px 0", padding: 24, background: "var(--surface-card)", border: "1px solid var(--border-card)", borderRadius: 12, boxShadow: "var(--shadow-sm)", fontSize: 14, fontWeight: 500, color: "var(--navy)" }}
      >
        <label>
          Região
          <select style={box} value={f.regiao} onChange={(e) => setF({ ...f, regiao: e.target.value, bairro: "", outro: "" })}>
            <option value="sp">São Paulo (capital)</option>
            <option value="bertioga">Bertioga</option>
            <option value="guaruja">Guarujá</option>
            <option value="outra">Outra cidade</option>
          </select>
        </label>
        <label>
          Bairro
          <select style={box} value={f.bairro} onChange={(e) => setF({ ...f, bairro: e.target.value, outro: e.target.value === OUTRO_BAIRRO ? f.outro : "" })}>
            <option value="">Selecione</option>
            {bairros.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
        {f.bairro === OUTRO_BAIRRO && (
          <label>
            Qual bairro?
            <input style={box} value={f.outro} maxLength={80} onChange={(e) => setF({ ...f, outro: e.target.value })} />
          </label>
        )}
        <label>
          Tipo
          <select style={box} value={f.tipo} onChange={(e) => setF({ ...f, tipo: e.target.value })}>
            <option value="apto">Apartamento</option>
            <option value="casa">Casa</option>
          </select>
        </label>
        <label>
          Quartos
          <input required style={box} type="number" inputMode="numeric" min={1} max={20} step={1} value={f.quartos} onChange={(e) => setF({ ...f, quartos: e.target.value === "" ? "" : Number(e.target.value) })} />
        </label>
        {erro && (
          <p role="alert" style={{ color: "#9B2C2C", fontSize: 14, margin: 0 }}>
            {erro}
          </p>
        )}
        <button type="submit" style={{ ...btn, background: "var(--navy)", color: "var(--ivory-100)" }}>
          Ver estimativa
        </button>
      </form>
      {r?.tipo === "estimativa" && (
        <section style={{ padding: 24, background: "var(--surface-card)", borderRadius: 12, boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, color: "var(--navy)", fontSize: 26, marginTop: 0 }}>Potencial com gestão WeCare (receita bruta por ano)</h2>
          {r.base.aproximada && (
            <p style={{ marginTop: 0, padding: "10px 12px", background: "var(--ivory-50)", borderLeft: "3px solid var(--gold)", borderRadius: 6 }}>
              <b>Referência aproximada.</b> Não há série confiável nesta faixa. O número é o da série mais próxima já tabelada: {r.base.referencia} ({r.base.comparaveis} comparáveis).
            </p>
          )}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {(["provavel", "otimista"] as const).map((k) => (
              <div key={k} style={{ flex: "1 1 140px", padding: 14, borderRadius: 10, background: k === "provavel" ? "var(--navy)" : "var(--ivory-200)", color: k === "provavel" ? "var(--ivory-100)" : "var(--navy)" }}>
                <small>{k === "provavel" ? "Potencial provável" : "Potencial otimista"}</small>
                <div style={{ fontSize: 26, fontFamily: "var(--font-serif)", marginTop: 4 }}>{brl(r.anual[k])}</div>
              </div>
            ))}
          </div>
          <p style={{ marginBottom: 0 }}>≈ {brl(r.mensalMedia)}/mês no cenário provável.</p>
          {waHref && <CtaEspecialista href={waHref} rotulo={rotuloCta} sub="Conversa de 15 minutos, sem compromisso, com um especialista WeCare." onClick={aoClicarWhatsapp} />}
          <p>Sazonalidade (provável):</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 90 }}>
            {MESES.map((m) => (
              <div key={m} title={brl(r.sazonal[m])} style={{ flex: 1, textAlign: "center", fontSize: 11 }}>
                <div style={{ background: "var(--gold)", borderRadius: "3px 3px 0 0", height: Math.max(4, r.sazonal[m] / Math.max(...Object.values(r.sazonal as Record<string, number>)) * 70) }} />
                {m}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Base: {r.base.comparaveis} imóveis comparáveis {r.base.fonte ? `do mercado (${r.base.fonte})` : "geridos pela WeCare"} (diária mediana {brl(r.base.diariaMediana)}, ocupação mediana {r.base.ocupacaoMediana}%), últimos 12 meses, atualizado em {r.base.atualizado}. Confiança {r.confianca}.{" "}
            {r.base.central === "mediana" ? "O potencial provável é a mediana: a média fica puxada por imóveis de receita muito alta. " : ""}
            Estimativa baseada em imóveis que gerimos e em dados de mercado; não é garantia. Valor bruto, antes de taxas de plataforma, limpeza e gestão.
          </p>
          <div style={{ marginTop: 18, padding: 16, borderLeft: "3px solid var(--gold)", background: "var(--ivory-50)", borderRadius: 6 }}>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-700)", marginBottom: 8 }}>Premissas da estimativa</div>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.7 }}>
              <li>
                <b>Taxa de ocupação:</b> {r.base.ocupacaoMediana}% (mediana do segmento)
              </li>
              <li>
                <b>Diária mediana:</b> {brl(r.base.diariaMediana)}
              </li>
              <li>
                <b>Região:</b> {nomeRegiao(f.regiao)}
                {bairroEnvio ? `. Bairro: ${bairroEnvio}. O número usa a faixa da cidade.` : ""}
              </li>
              <li>
                <b>Tipo e quartos:</b> {f.tipo === "casa" ? "casa" : "apartamento"}, {f.quartos} quarto(s). Faixa usada: {r.base.faixa}
                {r.base.serie ? ` (série já tabelada: ${r.base.serie})` : ""}
              </li>
              {r.base.casaNaSerieDaRegiao && (
                <li>
                  <b>Casa em São Paulo:</b> a tabela não separa casa e apartamento; a estimativa usa os imóveis geridos nessa faixa.
                </li>
              )}
              <li>
                <b>Fonte:</b> {r.base.fonte ? `dados de mercado ${r.base.fonte}, calibrados pelo faturamento real de casas geridas pela WeCare no litoral` : "faturamento real de imóveis geridos pela WeCare"} ({r.base.comparaveis} comparáveis, últimos 12 meses)
              </li>
            </ul>
          </div>
        </section>
      )}
      {r?.tipo === "personalizada" && (
        <section style={{ padding: 24, background: "var(--surface-card)", borderRadius: 12, boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontWeight: 400, color: "var(--navy)", marginTop: 0 }}>Avaliação personalizada</h2>
          <p>{r.motivo}</p>
          {waHref && <CtaEspecialista href={waHref} rotulo="Fale com um especialista" sub="Um especialista WeCare faz a avaliação personalizada, grátis e sem compromisso." onClick={aoClicarWhatsapp} />}
        </section>
      )}
      {r && (
        <div style={{ display: "grid", gap: 8, marginTop: 16 }}>
          <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", textAlign: "center" }}>Ou receba o resultado:</p>
          <button type="button" onClick={() => abrirAcao("pdf")} style={{ ...btn, background: "#fff", color: "var(--navy)", border: "1px solid var(--stone-400)", fontWeight: 500, fontSize: 15, padding: "12px 16px" }}>
            Baixar PDF
          </button>
          <button type="button" onClick={() => abrirAcao("email")} style={{ ...btn, background: "#fff", color: "var(--navy)", border: "1px solid var(--stone-400)", fontWeight: 500, fontSize: 15, padding: "12px 16px" }}>
            Enviar por e-mail
          </button>
        </div>
      )}
      {modal && (
        <div role="presentation" onClick={fecharModal} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(8,23,32,.48)", display: "grid", placeItems: "center", padding: 20 }}>
          <div role="dialog" aria-modal="true" aria-labelledby="av-modal-titulo" onClick={(e) => e.stopPropagation()} style={{ width: "min(440px, 100%)", background: "var(--surface-card)", borderRadius: 12, padding: 24, boxShadow: "var(--shadow-sm)", color: "var(--navy)" }}>
            {modal === "aviso" ? (
              <>
                <h2 id="av-modal-titulo" style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 24, margin: "0 0 12px" }}>
                  Pronto
                </h2>
                <p role="status" style={{ margin: "0 0 16px" }}>
                  {aviso}
                </p>
                <button type="button" onClick={fecharModal} style={{ ...btn, background: "var(--navy)", color: "var(--ivory-100)" }}>
                  Fechar
                </button>
              </>
            ) : (
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  if (modal === "pdf" || modal === "email") void entregarCanal(modal, contato);
                }}
              >
                <h2 id="av-modal-titulo" style={{ fontFamily: "var(--font-serif)", fontWeight: 400, fontSize: 24, margin: "0 0 8px" }}>
                  {modal === "pdf" ? "Baixar PDF" : "Enviar por e-mail"}
                </h2>
                <p style={{ margin: "0 0 12px", color: "var(--text-muted)", fontWeight: 400 }}>Informe o e-mail que recebe o resultado.</p>
                <label>
                  E-mail
                  <input type="email" style={box} value={contato.email} autoComplete="email" onChange={(e) => setContato({ ...contato, email: e.target.value })} />
                </label>
                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontWeight: 400, fontSize: 13, color: "var(--text-body)", margin: "12px 0" }}>
                  <input type="checkbox" checked={contato.consentimento} onChange={(e) => setContato({ ...contato, consentimento: e.target.checked })} style={{ marginTop: 3 }} />
                  Autorizo a WeCare Hosting a usar este contato para enviar a estimativa e falar sobre a gestão do imóvel, conforme a LGPD (Lei 13.709/2018).
                </label>
                {erroModal && (
                  <p role="alert" style={{ color: "#9B2C2C", margin: "0 0 12px" }}>
                    {erroModal}
                  </p>
                )}
                <div style={{ display: "grid", gap: 8 }}>
                  <button type="submit" style={{ ...btn, background: "var(--navy)", color: "var(--ivory-100)" }}>
                    {modal === "pdf" ? "Gerar PDF" : "Enviar e-mail"}
                  </button>
                  <button type="button" onClick={fecharModal} style={{ ...btn, background: "#fff", color: "var(--navy)", border: "1px solid var(--stone-400)" }}>
                    Cancelar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
