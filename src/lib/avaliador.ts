import model from "./avaliador-model.json";

export type Regiao = "sp" | "litoral" | "bertioga" | "guaruja" | "outra";
export type TipoImovel = "apto" | "casa";
export type Input = { regiao: Regiao; bairro?: string; tipo: TipoImovel; quartos: number };

/** Faixas pedidas no lugar da contagem exata. 4+ legado não vira número: a tabela não separa 4–5 de 6+. */
export type Faixa = "1" | "2" | "3" | "4-5" | "6+";

const MIN_N = 5;

const FAIXA_ROTULO: Record<Faixa, string> = {
  "1": "1 quarto",
  "2": "2 quartos",
  "3": "3 quartos",
  "4-5": "4–5 quartos",
  "6+": "6 quartos ou mais",
};

type Serie = {
  n: number;
  p25: number;
  p50: number;
  p75: number;
  mean?: number;
  p90?: number;
  adr: number;
  occ: number;
  fonte?: string;
  lido?: string;
  fator?: number;
};

type Modelo = {
  segments: Record<string, Serie>;
  seasonality: Record<string, Record<string, number>>;
  updated: string;
  market?: Record<string, Serie>;
};

const dados = model as Modelo;

type Linha = Serie & { token: string };

const PERSONALIZADA = {
  tipo: "personalizada" as const,
  motivo:
    "Ainda não temos imóveis comparáveis suficientes nessa combinação para um número confiável. Um especialista faz a avaliação personalizada, grátis.",
};

export function faixaDeQuartos(quartos: number): Faixa {
  if (quartos <= 1) return "1";
  if (quartos === 2) return "2";
  if (quartos === 3) return "3";
  if (quartos <= 5) return "4-5";
  return "6+";
}

/** Inteiro de 1 a 20. Rejeita vazio, decimal e texto. */
export function quartosValidos(v: unknown): number | null {
  let n: number;
  if (typeof v === "number") n = v;
  else if (typeof v === "string" && /^\d+$/.test(v.trim())) n = Number(v.trim());
  else return null;
  if (!Number.isInteger(n) || n < 1 || n > 20) return null;
  return n;
}

function tokenCabeNaFaixa(token: string, faixa: Faixa): boolean {
  if (token === faixa) return true;
  if (!/^\d+$/.test(token)) return false;
  return faixaDeQuartos(Number(token)) === faixa;
}

function linhas(tabela: Record<string, Serie> | undefined, faixa: Faixa, aceita: (partes: string[]) => boolean): Linha[] {
  if (!tabela) return [];
  const out: Linha[] = [];
  for (const [chave, serie] of Object.entries(tabela)) {
    const partes = chave.split("|");
    const token = partes[partes.length - 1];
    if (!token || !aceita(partes) || !tokenCabeNaFaixa(token, faixa)) continue;
    out.push({ ...serie, token });
  }
  return out;
}

/**
 * Provável = mediana (p50), não a média.
 * Em SP 1 quarto a média da tabela é ~R$ 74 mil e a mediana ~R$ 62 mil; em SP 2 quartos, ~R$ 190 mil contra ~R$ 161 mil.
 * No mercado PriceLabs o campo `mean` não é a média da amostra: é a mediana vezes o fator WeCare já gravado (1,248).
 * Nesse caso o provável continua sendo essa mediana calibrada — o mesmo número da tabela, sem média enviesada.
 */
function valorProvavel(s: Serie): { bruto: number; central: "mediana" | "mediana-calibrada" } {
  if (typeof s.fator === "number" && s.fator > 0) return { bruto: s.p50 * s.fator, central: "mediana-calibrada" };
  return { bruto: s.p50, central: "mediana" };
}

function sazonalidade(regiao: Regiao): Record<string, number> | null {
  if (regiao === "sp") return dados.seasonality.sp ?? null;
  if (regiao === "litoral" || regiao === "bertioga" || regiao === "guaruja") return dados.seasonality.litoral ?? null;
  return null;
}

function serieUnica(linhasDaFaixa: Linha[]): Linha | null {
  if (linhasDaFaixa.length !== 1) return null;
  if (linhasDaFaixa[0].n < MIN_N) return null;
  return linhasDaFaixa[0];
}

export function estimar(i: Input) {
  if (i.regiao === "outra") return PERSONALIZADA;
  const faixa = faixaDeQuartos(i.quartos);
  const mercado = linhas(dados.market, faixa, ([regiao, tipo]) => regiao === i.regiao && tipo === i.tipo);
  // Casa em SP usa a série da cidade quando ela existe: a tabela WeCare não separa casa de apartamento.
  const usaSegmento = i.tipo === "apto" || (i.tipo === "casa" && i.regiao === "sp");
  const segmento = usaSegmento ? linhas(dados.segments, faixa, ([regiao]) => regiao === i.regiao) : [];
  // Mercado é a série com tipo (casa/apto). Não mistura com o segmento WeCare: percentis não se somam.
  const fonte = mercado.length > 0 ? mercado : segmento;
  if (fonte.length > 1) {
    console.error("[avaliador] faixa com mais de uma série agregada; medianas não são combinadas");
  }
  const serie = serieUnica(fonte);
  if (!serie) return PERSONALIZADA;
  const sea = sazonalidade(i.regiao);
  if (!sea) return PERSONALIZADA;

  const mil = (x: number) => Math.round(x / 1000) * 1000;
  const { bruto, central } = valorProvavel(serie);
  const otimista = serie.p90 ?? serie.p75;
  const larga = faixa === "4-5" || faixa === "6+";
  const quartosDaSerie = /^\d+$/.test(serie.token) ? Number(serie.token) : null;
  return {
    tipo: "estimativa" as const,
    anual: { provavel: mil(bruto), otimista: mil(otimista) },
    mensalMedia: mil(bruto / 12),
    sazonal: Object.fromEntries(Object.entries(sea).map(([m, f]) => [m, mil((bruto / 12) * f)])),
    base: {
      comparaveis: serie.n,
      diariaMediana: Math.round(serie.adr),
      ocupacaoMediana: serie.occ,
      atualizado: serie.lido ?? dados.updated,
      fonte: serie.fonte,
      faixa: FAIXA_ROTULO[faixa],
      serie: larga && quartosDaSerie != null ? (quartosDaSerie === 1 ? "1 quarto" : `${quartosDaSerie} quartos`) : undefined,
      central,
      casaNaSerieDaRegiao: i.tipo === "casa" && i.regiao === "sp" && mercado.length === 0,
    },
    confianca: !serie.fonte && serie.n >= 15 ? "alta" : "média",
  };
}

export type Resultado = ReturnType<typeof estimar>;

const REGIAO_NOME: Record<string, string> = {
  sp: "São Paulo (capital)",
  bertioga: "Bertioga",
  guaruja: "Guarujá",
  litoral: "Litoral",
  outra: "Outra cidade",
};

export function nomeRegiao(regiao: string) {
  return REGIAO_NOME[regiao] ?? regiao;
}

const moeda = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export function resumoTexto(i: Input, r: Resultado) {
  const onde = [nomeRegiao(i.regiao), i.bairro].filter(Boolean).join(", ");
  const cabeca = `${i.tipo === "casa" ? "Casa" : "Apartamento"}, ${i.quartos} quarto(s), ${onde}.`;
  if (r.tipo === "personalizada") return `Estimativa WeCare Hosting\n${cabeca}\n${r.motivo}`;
  return [
    "Estimativa WeCare Hosting",
    cabeca,
    `Potencial provável: ${moeda(r.anual.provavel)} por ano.`,
    `Potencial otimista: ${moeda(r.anual.otimista)} por ano.`,
    `Cerca de ${moeda(r.mensalMedia)} por mês no cenário provável.`,
    `Faixa: ${r.base.faixa}. ${r.base.comparaveis} comparáveis.`,
    "Valor bruto, antes de taxas. Não é garantia de receita.",
  ].join("\n");
}

/** Abre conversa no WhatsApp do número informado, com o resumo pronto para enviar. */
export function linkWhatsapp(telefone: string, texto: string) {
  const digits = telefone.replace(/\D/g, "");
  const comPais = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${comPais}?text=${encodeURIComponent(texto)}`;
}
