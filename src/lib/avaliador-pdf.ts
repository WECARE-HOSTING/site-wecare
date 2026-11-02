import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Input, Resultado } from "@/lib/avaliador";

const NAVY = rgb(12 / 255, 35 / 255, 48 / 255);
const GOLD = rgb(183 / 255, 145 / 255, 82 / 255);
const INK = rgb(0.09, 0.09, 0.08);
const MUTED = rgb(0.35, 0.33, 0.3);
const IVORY = rgb(251 / 255, 247 / 255, 239 / 255);

const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function limpo(s: string) {
  return s.replace(/[–—]/g, "-").replace(/[“”]/g, '"').replace(/’/g, "'");
}

function rotuloRegiao(regiao: string) {
  return ({ sp: "São Paulo (capital)", bertioga: "Bertioga", guaruja: "Guarujá", litoral: "Litoral", outra: "Outra cidade" } as Record<string, string>)[regiao] ?? regiao;
}

export async function pdfEstimativa(input: Input, r: Resultado): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();

  page.drawRectangle({ x: 0, y: height - 92, width, height: 92, color: NAVY });
  page.drawRectangle({ x: 0, y: height - 98, width, height: 6, color: GOLD });
  page.drawText("WeCare Hosting", { x: 48, y: height - 48, size: 22, font: bold, color: IVORY });
  page.drawText("Estimativa de receita por temporada", { x: 48, y: height - 72, size: 12, font, color: GOLD });

  let y = height - 136;
  const linha = (texto: string, size = 11, usado = font, cor = INK) => {
    page.drawText(limpo(texto), { x: 48, y, size, font: usado, color: cor });
    y -= size + 8;
  };

  const onde = [rotuloRegiao(input.regiao), input.bairro].filter(Boolean).join(" · ");
  linha(`${input.tipo === "casa" ? "Casa" : "Apartamento"}, ${input.quartos} quarto(s)`, 13, bold);
  linha(onde, 12, font, MUTED);
  y -= 8;

  if (r.tipo === "personalizada") {
    linha("Avaliação personalizada", 16, bold, NAVY);
    y -= 4;
    for (const pedaco of quebrar(r.motivo, 78)) linha(pedaco, 11);
  } else {
    page.drawRectangle({ x: 48, y: y - 58, width: 240, height: 74, color: NAVY });
    page.drawRectangle({ x: 300, y: y - 58, width: 247, height: 74, color: IVORY });
    page.drawText("Potencial provável", { x: 62, y: y - 4, size: 10, font, color: GOLD });
    page.drawText(limpo(brl(r.anual.provavel)), { x: 62, y: y - 28, size: 18, font: bold, color: IVORY });
    page.drawText("por ano", { x: 62, y: y - 46, size: 10, font, color: IVORY });
    page.drawText("Potencial otimista", { x: 314, y: y - 4, size: 10, font, color: MUTED });
    page.drawText(limpo(brl(r.anual.otimista)), { x: 314, y: y - 28, size: 18, font: bold, color: NAVY });
    page.drawText("por ano", { x: 314, y: y - 46, size: 10, font, color: MUTED });
    y -= 84;
    linha(`Cerca de ${brl(r.mensalMedia)} por mês no cenário provável.`, 12, bold);
    y -= 6;
    linha("Premissas", 12, bold, NAVY);
    linha(`Faixa de quartos: ${r.base.faixa}${r.base.serie ? ` (serie tabelada: ${r.base.serie})` : ""}`);
    linha(`Comparáveis: ${r.base.comparaveis}. Diária mediana ${brl(r.base.diariaMediana)}. Ocupação mediana ${r.base.ocupacaoMediana}%.`);
    linha(`Confianca ${r.confianca}. Atualizado em ${r.base.atualizado}.`);
    if (r.base.fonte) linha(`Fonte: ${r.base.fonte}.`);
    if (r.base.central === "mediana") linha("O provável é a mediana: a média fica puxada por poucos imóveis muito acima.");
    if (r.base.casaNaSerieDaRegiao) linha("Em São Paulo a série não separa casa e apartamento.");
  }

  y -= 10;
  for (const pedaco of quebrar("Valor bruto, antes de taxas de plataforma, limpeza e gestão. Não é garantia de receita: localização exata, padrão e fotos mudam o resultado.", 86)) {
    linha(pedaco, 9, font, MUTED);
  }
  linha(`Gerado em ${new Date().toLocaleDateString("pt-BR")}.`, 9, font, MUTED);

  doc.setTitle("Estimativa WeCare Hosting");
  doc.setAuthor("WeCare Hosting");
  return doc.save();
}

function quebrar(texto: string, max: number) {
  const palavras = limpo(texto).split(/\s+/);
  const linhas: string[] = [];
  let atual = "";
  for (const p of palavras) {
    const prox = atual ? `${atual} ${p}` : p;
    if (prox.length > max) {
      if (atual) linhas.push(atual);
      atual = p;
    } else atual = prox;
  }
  if (atual) linhas.push(atual);
  return linhas;
}
