import { NextResponse } from "next/server";
import { estimar, quartosValidos, type Input, type Regiao } from "@/lib/avaliador";
import { hashIp, salvarLead, validarContato } from "@/lib/avaliador-leads";

export const runtime = "nodejs";

const REGIOES: readonly Regiao[] = ["sp", "litoral", "bertioga", "guaruja", "outra"];
const TIPOS = ["apto", "casa"] as const;

function jsonErro(erro: string, status: number) {
  return NextResponse.json({ erro }, { status });
}

/** A 1ª simulação nunca é barrada aqui. O pedido de contato é só no navegador, depois de um resultado exibido. */
export async function POST(req: Request) {
  const b = (await req.json().catch(() => null)) as (Partial<Input> & { lead?: unknown }) | null;
  if (!b || typeof b !== "object") return jsonErro("Dados inválidos.", 400);
  const quartos = quartosValidos(b.quartos);
  if (quartos == null) return jsonErro("Informe os quartos como um número inteiro de 1 a 20.", 400);
  if (!REGIOES.includes(b.regiao as Regiao) || !TIPOS.includes(b.tipo as (typeof TIPOS)[number])) return jsonErro("Dados inválidos.", 400);

  const lead = b.lead ? validarContato(b.lead, "um") : null;
  if (b.lead && !lead) return NextResponse.json({ tipo: "lead", erro: "Informe um e-mail ou WhatsApp válido e marque o consentimento." }, { status: 422 });

  const input = { regiao: b.regiao as Regiao, tipo: b.tipo as Input["tipo"], quartos, bairro: String(b.bairro ?? "").slice(0, 80) };
  if (lead) {
    const ip = (req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "0").trim();
    await salvarLead(lead, hashIp(ip), input);
  }
  return NextResponse.json(estimar(input), { headers: { "Cache-Control": "private, no-store, max-age=0", "X-Avalie-Versao": "referencia-aproximada" } });
}
