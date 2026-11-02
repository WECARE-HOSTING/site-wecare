import { NextResponse } from "next/server";
import { estimar, quartosValidos, type Input, type Regiao, type TipoImovel } from "@/lib/avaliador";
import { hashIp, uso, registrarUso, validarContato, salvarLead } from "@/lib/avaliador-leads";
import { lerCookiesAvaliador, marcarCookies } from "@/lib/avaliador-cookies";

export const runtime = "nodejs";

const REGIOES: readonly Regiao[] = ["sp", "litoral", "bertioga", "guaruja", "outra"];
const TIPOS: readonly TipoImovel[] = ["apto", "casa"];

function jsonErro(erro: string, status: number) {
  return NextResponse.json({ erro }, { status });
}

export async function POST(req: Request) {
  const b = (await req.json().catch(() => null)) as (Partial<Input> & { lead?: unknown }) | null;
  if (!b || typeof b !== "object") return jsonErro("Dados inválidos.", 400);
  const quartos = quartosValidos(b.quartos);
  if (quartos == null) return jsonErro("Informe os quartos como um número inteiro de 1 a 20.", 400);
  if (!REGIOES.includes(b.regiao as Regiao) || !TIPOS.includes(b.tipo as TipoImovel)) return jsonErro("Dados inválidos.", 400);

  const ip = (req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "0").trim();
  const h = hashIp(ip);
  const cookies = lerCookiesAvaliador(req.headers.get("cookie"));
  const lead = b.lead ? validarContato(b.lead, "um") : null;
  if (b.lead && !lead) return NextResponse.json({ tipo: "lead", erro: "Informe um e-mail ou WhatsApp válido e marque o consentimento." }, { status: 422 });

  let disco = { n: 0, lead: false };
  try {
    const u = await uso(h);
    disco = { n: u.n, lead: !!u.lead };
  } catch (err) {
    console.error("[avaliador] falha ao ler uso", err);
  }
  const jaUsou = cookies.uso || disco.n >= 1;
  const jaDeixouContato = cookies.lead || disco.lead;
  if (jaUsou && !jaDeixouContato && !lead) return NextResponse.json({ tipo: "lead" }, { status: 403 });

  const input = { regiao: b.regiao as Regiao, tipo: b.tipo as TipoImovel, quartos, bairro: String(b.bairro ?? "").slice(0, 80) };
  if (lead) await salvarLead(lead, h, input);
  try {
    await registrarUso(h, !!lead || jaDeixouContato);
  } catch (err) {
    console.error("[avaliador] falha ao registrar uso em disco; o cookie segue valendo", err);
  }
  const res = NextResponse.json(estimar(input));
  marcarCookies(res, req, { uso: true, lead: !!lead || jaDeixouContato });
  return res;
}
