import model from "./avaliador-model.json";
export type Regiao = "sp" | "litoral" | "outra";
export type Input = { regiao: Regiao; bairro?: string; tipo: "apto" | "casa"; quartos: number };
const MIN_N = 5; // mínimo de imóveis comparáveis maduros para mostrar número
export function estimar(i: Input) {
  const q = i.quartos <= 1 ? "1" : i.quartos === 2 ? "2" : i.quartos === 3 ? "3" : "4+";
  const seg = (model.segments as Record<string, { n: number; p25: number; p50: number; p75: number; adr: number; occ: number }>)[`${i.regiao}|${q}`];
  if (i.regiao === "outra" || !seg || seg.n < MIN_N || i.tipo === "casa")
    return { tipo: "personalizada" as const, motivo: "Ainda não temos imóveis comparáveis suficientes nessa combinação para um número confiável. Um especialista faz a avaliação personalizada, grátis." };
  const sea = (model.seasonality as Record<string, Record<string, number>>)[i.regiao];
  const r = (x: number) => Math.round(x / 1000) * 1000;
  return {
    tipo: "estimativa" as const,
    anual: { conservadora: r(seg.p25), provavel: r(seg.p50), otimista: r(seg.p75) },
    mensalMedia: r(seg.p50 / 12),
    sazonal: Object.fromEntries(Object.entries(sea).map(([m, f]) => [m, r((seg.p50 / 12) * f)])),
    base: { comparaveis: seg.n, diariaMediana: Math.round(seg.adr), ocupacaoMediana: seg.occ, atualizado: model.updated },
    confianca: seg.n >= 15 ? "alta" : "média",
  };
}
