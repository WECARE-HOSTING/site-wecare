import model from "./avaliador-model.json";
export type Regiao = "sp" | "litoral" | "bertioga" | "guaruja" | "outra";
export type Input = { regiao: Regiao; bairro?: string; tipo: "apto" | "casa"; quartos: number };
const MIN_N = 5; // mínimo de imóveis comparáveis maduros para mostrar número
export function estimar(i: Input) {
  const q = i.quartos <= 1 ? "1" : i.quartos === 2 ? "2" : i.quartos === 3 ? "3" : "4+";
  const seg = (model.segments as Record<string, { n: number; p25: number; p50: number; p75: number; mean: number; p90: number; adr: number; occ: number }>)[`${i.regiao}|${q}`];
  const mk = (model as unknown as { market?: Record<string, { n: number; p25: number; p50: number; p75: number; mean: number; p90: number; adr: number; occ: number; fonte: string; lido: string }> }).market?.[`${i.regiao}|${i.tipo}|${Math.min(i.quartos, 6)}`];
  if (mk) {
    const r0 = (x: number) => Math.round(x / 1000) * 1000;
    const sea0 = (model.seasonality as Record<string, Record<string, number>>).litoral;
    return { tipo: "estimativa" as const, anual: { provavel: r0(mk.mean), otimista: r0(mk.p90) }, mensalMedia: r0(mk.mean / 12),
      sazonal: Object.fromEntries(Object.entries(sea0).map(([m, f]) => [m, r0((mk.mean / 12) * f)])),
      base: { comparaveis: mk.n, diariaMediana: Math.round(mk.adr), ocupacaoMediana: mk.occ, atualizado: mk.lido, fonte: mk.fonte }, confianca: "média" };
  }
  if (i.regiao === "outra" || i.regiao === "bertioga" || i.regiao === "guaruja" || !seg || seg.n < MIN_N || i.tipo === "casa")
    return { tipo: "personalizada" as const, motivo: "Ainda não temos imóveis comparáveis suficientes nessa combinação para um número confiável. Um especialista faz a avaliação personalizada, grátis." };
  const sea = (model.seasonality as Record<string, Record<string, number>>)[i.regiao];
  const r = (x: number) => Math.round(x / 1000) * 1000;
  return {
    tipo: "estimativa" as const,
    anual: { provavel: r(seg.mean), otimista: r(Math.max(seg.p75, seg.p90)) },
    mensalMedia: r(seg.mean / 12),
    sazonal: Object.fromEntries(Object.entries(sea).map(([m, f]) => [m, r((seg.mean / 12) * f)])),
    base: { comparaveis: seg.n, diariaMediana: Math.round(seg.adr), ocupacaoMediana: seg.occ, atualizado: model.updated },
    confianca: seg.n >= 15 ? "alta" : "média",
  };
}
