/** Bairros reais de cada praça. "Outro" abre um campo livre. A estimativa continua na faixa da cidade. */
const SP = [
  "Alto de Pinheiros",
  "Bela Vista",
  "Brooklin",
  "Campo Belo",
  "Centro",
  "Cerqueira César",
  "Consolação",
  "Higienópolis",
  "Itaim Bibi",
  "Jardim América",
  "Jardim Europa",
  "Jardim Paulista",
  "Jardim Paulistano",
  "Moema",
  "Morumbi",
  "Paraíso",
  "Perdizes",
  "Pinheiros",
  "Santo Amaro",
  "Vila Madalena",
  "Vila Mariana",
  "Vila Nova Conceição",
  "Vila Olímpia",
];

const BERTIOGA = [
  "Riviera de São Lourenço",
  "Boraceia",
  "Centro",
  "Costa do Sol",
  "Indaiá",
  "Jardim Rio da Praia",
  "Maitinga",
  "São Lourenço",
  "Vista Linda",
];

const GUARUJA = [
  "Astúrias",
  "Balneário Cidade Atlântica",
  "Enseada",
  "Iporanga",
  "Jardim Acapulco",
  "Jardim Las Palmas",
  "Jardim Praiano",
  "Jardim Virgínia",
  "Pernambuco",
  "Pitangueiras",
  "Tijucopava",
  "Tombo",
];

const LISTAS: Record<string, string[]> = { sp: SP, bertioga: BERTIOGA, guaruja: GUARUJA };

export const OUTRO_BAIRRO = "Outro";

export function bairrosDaRegiao(regiao: string): string[] {
  return [...(LISTAS[regiao] ?? []), OUTRO_BAIRRO];
}
