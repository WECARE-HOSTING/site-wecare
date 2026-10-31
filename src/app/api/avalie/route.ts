import { NextResponse } from "next/server";
import { estimar, type Input } from "@/lib/avaliador";
import { hashIp, uso, registrarUso, validarLead, salvarLead } from "@/lib/avaliador-leads";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const b = (await req.json().catch(() => null)) as (Partial<Input> & { lead?: unknown }) | null;
  const quartos = Number(b?.quartos);
  if (!b || !["sp", "litoral", "bertioga", "guaruja", "outra"].includes(String(b.regiao)) || !["apto", "casa"].includes(String(b.tipo)) || !(quartos >= 0 && quartos <= 20))
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
  const ip = (req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "0").trim();
  const h = hashIp(ip);
  const temCookie = /(?:^|;\s*)wc_av_lead=1/.test(req.headers.get("cookie") ?? "");
  const u = await uso(h);
  const input = { regiao: b.regiao as Input["regiao"], tipo: b.tipo as Input["tipo"], quartos, bairro: String(b.bairro ?? "").slice(0, 80) };
  const lead = b.lead ? validarLead(b.lead) : null;
  if (b.lead && !lead) return NextResponse.json({ tipo: "lead", erro: "Confira nome, e-mail, WhatsApp e o consentimento." }, { status: 422 });
  if (u.n >= 1 && !u.lead && !temCookie && !lead) return NextResponse.json({ tipo: "lead" }, { status: 403 });
  if (lead) await salvarLead(lead, h, input);
  await registrarUso(h, !!lead);
  const res = NextResponse.json(estimar(input));
  if (lead) res.cookies.set("wc_av_lead", "1", { httpOnly: true, sameSite: "lax", secure: true, maxAge: 60 * 60 * 24 * 365, path: "/" });
  return res;
}
