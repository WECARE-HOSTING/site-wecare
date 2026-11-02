import { NextResponse } from "next/server";
import { estimar, quartosValidos, type Input, type Regiao, type TipoImovel } from "@/lib/avaliador";
import { hashIp, uso, registrarUso, validarLead, salvarLead } from "@/lib/avaliador-leads";

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
  const temCookie = /(?:^|;\s*)wc_av_lead=1/.test(req.headers.get("cookie") ?? "");
  let u: { n: number; lead?: boolean } = { n: 0 };
  try {
    u = await uso(h);
  } catch (err) {
    console.error("[avaliador] falha ao ler uso", err);
  }
  const input = { regiao: b.regiao as Regiao, tipo: b.tipo as TipoImovel, quartos, bairro: String(b.bairro ?? "").slice(0, 80) };
  const lead = b.lead ? validarLead(b.lead) : null;
  if (b.lead && !lead) return NextResponse.json({ tipo: "lead", erro: "Confira nome, e-mail, WhatsApp e o consentimento." }, { status: 422 });
  if (u.n >= 1 && !u.lead && !temCookie && !lead) return NextResponse.json({ tipo: "lead" }, { status: 403 });
  if (lead) {
    try {
      await salvarLead(lead, h, input);
    } catch (err) {
      console.error("[avaliador] falha ao gravar lead", err);
      return jsonErro("Não foi possível registrar seu contato. Tente de novo em instantes.", 500);
    }
  }
  try {
    await registrarUso(h, !!lead);
  } catch (err) {
    console.error("[avaliador] falha ao registrar uso", err);
  }
  const res = NextResponse.json(estimar(input));
  if (lead) res.cookies.set("wc_av_lead", "1", { httpOnly: true, sameSite: "lax", secure: true, maxAge: 60 * 60 * 24 * 365, path: "/" });
  return res;
}
