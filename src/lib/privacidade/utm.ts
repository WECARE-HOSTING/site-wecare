/**
 * Origem da visita (UTM), first-touch, nesta aba.
 * sessionStorage do próprio site — não é cookie de terceiro.
 * A primeira URL da sessão vale; páginas seguintes não substituem.
 */

export const CHAVE_UTM_SESSAO = "wc_utm_v1";
export const WHATSAPP_CAPTACAO = "5511969760183";

const CHAVES = ["source", "medium", "campaign", "content", "term"] as const;
const PARAMS = [
  ["utm_source", "source"],
  ["utm_medium", "medium"],
  ["utm_campaign", "campaign"],
  ["utm_content", "content"],
  ["utm_term", "term"],
] as const;

export type Utm = Record<(typeof CHAVES)[number], string>;

export function utmVazio(): Utm {
  return { source: "", medium: "", campaign: "", content: "", term: "" };
}

/** Minúsculas, sem quebra de linha, tamanho limitado. Vazio se não for texto. */
export function normalizarUtm(valor: unknown): string {
  if (typeof valor !== "string") return "";
  return valor
    .normalize("NFKC")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .slice(0, 80);
}

export function lerUtmDaQuery(search: string): Utm {
  const q = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const utm = utmVazio();
  for (const [param, chave] of PARAMS) utm[chave] = normalizarUtm(q.get(param) ?? "");
  return utm;
}

export function lerUtmDeCorpo(corpo: unknown): Utm {
  const utm = utmVazio();
  if (!corpo || typeof corpo !== "object") return utm;
  const o = corpo as Record<string, unknown>;
  for (const [param, chave] of PARAMS) utm[chave] = normalizarUtm(o[param]);
  return utm;
}

export function camposUtm(utm: Utm): Record<(typeof PARAMS)[number][0], string> {
  return {
    utm_source: utm.source,
    utm_medium: utm.medium,
    utm_campaign: utm.campaign,
    utm_content: utm.content,
    utm_term: utm.term,
  };
}

export function temUtm(utm: Utm): boolean {
  return CHAVES.some((chave) => utm[chave] !== "");
}

/** Ex.: "Origem: meta / wc_captacao_nov26 / sp_capital" (vazios saem). */
export function linhaOrigem(utm: Utm): string | null {
  const partes = CHAVES.map((chave) => utm[chave]).filter(Boolean);
  return partes.length ? `Origem: ${partes.join(" / ")}` : null;
}

export function textoComOrigem(texto: string, utm: Utm): string {
  const linha = linhaOrigem(utm);
  if (!linha) return texto;
  const base = texto
    .split("\n")
    .filter((l) => !/^origem:\s/i.test(l.trim()))
    .join("\n")
    .trim();
  return base ? `${base}\n${linha}` : linha;
}

function urlCaptacao(href: string): URL | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (host !== "wa.me" && host !== "api.whatsapp.com") return null;
  const fone = `${url.pathname}${url.searchParams.get("phone") ?? ""}`.replace(/\D/g, "");
  return fone === WHATSAPP_CAPTACAO ? url : null;
}

export function ehLinkCaptacao(href: string): boolean {
  return urlCaptacao(href) !== null;
}

/**
 * Devolve o href com a linha de origem no texto, ou null se não for o
 * WhatsApp de captação ou se o texto já estiver certo.
 */
export function decorarWhatsappCaptacao(href: string, utm: Utm): string | null {
  const url = urlCaptacao(href);
  if (!url) return null;
  const atual = url.searchParams.get("text") ?? "";
  const novo = textoComOrigem(atual, utm);
  if (novo === atual) return null;
  if (novo) url.searchParams.set("text", novo);
  else url.searchParams.delete("text");
  return url.toString();
}

type Gravado = { v: 1; utm: Utm };

function lerSessao(): Utm | null {
  try {
    const bruto = sessionStorage.getItem(CHAVE_UTM_SESSAO);
    if (!bruto) return null;
    const j = JSON.parse(bruto) as Partial<Gravado> | null;
    if (!j || j.v !== 1 || !j.utm) return null;
    const utm = utmVazio();
    for (const chave of CHAVES) utm[chave] = normalizarUtm(j.utm[chave]);
    return utm;
  } catch {
    return null;
  }
}

function gravarSessao(utm: Utm) {
  try {
    const gravado: Gravado = { v: 1, utm };
    sessionStorage.setItem(CHAVE_UTM_SESSAO, JSON.stringify(gravado));
  } catch {
    /* aba privada ou cota cheia: a visita segue sem origem salva */
  }
}

/** Primeira chamada na sessão grava a URL atual. As seguintes devolvem isso. */
export function capturarUtmFirstTouch(search?: string): Utm {
  if (typeof window === "undefined") return utmVazio();
  const salvo = lerSessao();
  if (salvo) return salvo;
  const utm = lerUtmDaQuery(search ?? window.location.search);
  gravarSessao(utm);
  return utm;
}

const CAMPOS_FORM = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

/** Coloca a origem nos links de captação e em campos ocultos de cada formulário. */
export function aplicarUtmNoDocumento(doc: Document, utm: Utm) {
  doc.querySelectorAll<HTMLAnchorElement>('a[href*="5511969760183"]').forEach((a) => {
    const novo = decorarWhatsappCaptacao(a.href, utm);
    if (novo) a.href = novo;
  });
  const campos = camposUtm(utm);
  doc.querySelectorAll("form").forEach((form) => {
    for (const nome of CAMPOS_FORM) {
      let input = form.querySelector<HTMLInputElement>(`input[data-wc-utm="${nome}"]`);
      if (!input) {
        input = doc.createElement("input");
        input.type = "hidden";
        input.name = nome;
        input.dataset.wcUtm = nome;
        input.tabIndex = -1;
        input.setAttribute("autocomplete", "off");
        input.setAttribute("aria-hidden", "true");
        form.append(input);
      }
      const valor = campos[nome];
      if (input.value !== valor) input.value = valor;
    }
  });
}
