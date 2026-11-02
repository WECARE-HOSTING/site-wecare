import { NextResponse } from "next/server";
import { estimar, linkWhatsapp, quartosValidos, resumoTexto, type Input, type Regiao, type TipoImovel } from "@/lib/avaliador";
import { hashIp, registrarUso, salvarLead, validarContato, enviarTexto } from "@/lib/avaliador-leads";
import { marcarCookies } from "@/lib/avaliador-cookies";
import { pdfEstimativa } from "@/lib/avaliador-pdf";

export const runtime = "nodejs";

const REGIOES: readonly Regiao[] = ["sp", "litoral", "bertioga", "guaruja", "outra"];
const TIPOS: readonly TipoImovel[] = ["apto", "casa"];
const CANAIS = ["pdf", "email", "whatsapp"] as const;

function jsonErro(erro: string, status: number) {
  return NextResponse.json({ erro }, { status });
}

export async function POST(req: Request) {
  const b = (await req.json().catch(() => null)) as (Partial<Input> & { canal?: string; contato?: unknown }) | null;
  if (!b || typeof b !== "object") return jsonErro("Dados inválidos.", 400);
  const quartos = quartosValidos(b.quartos);
  if (quartos == null) return jsonErro("Informe os quartos como um número inteiro de 1 a 20.", 400);
  if (!REGIOES.includes(b.regiao as Regiao) || !TIPOS.includes(b.tipo as TipoImovel)) return jsonErro("Dados inválidos.", 400);
  if (!CANAIS.includes(b.canal as (typeof CANAIS)[number])) return jsonErro("Dados inválidos.", 400);
  const canal = b.canal as (typeof CANAIS)[number];
  const contato = validarContato(b.contato, canal === "whatsapp" ? "telefone" : "email");
  if (!contato) {
    const erro = canal === "whatsapp"
      ? "Informe um WhatsApp com DDD e marque o consentimento."
      : "Informe um e-mail válido e marque o consentimento.";
    return jsonErro(erro, 422);
  }

  const input = { regiao: b.regiao as Regiao, tipo: b.tipo as TipoImovel, quartos, bairro: String(b.bairro ?? "").slice(0, 80) };
  const resultado = estimar(input);
  const ip = (req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0] || "0").trim();
  await salvarLead(contato, hashIp(ip), { ...input, canal });
  try {
    await registrarUso(hashIp(ip), true);
  } catch (err) {
    console.error("[avaliador] falha ao registrar uso na entrega", err);
  }

  const resumo = resumoTexto(input, resultado);
  if (canal === "pdf") {
    const bytes = await pdfEstimativa(input, resultado);
    const res = new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="estimativa-wecare.pdf"',
        "Cache-Control": "no-store",
      },
    });
    marcarCookies(res, req, { uso: true, lead: true });
    return res;
  }
  if (canal === "whatsapp") {
    const res = NextResponse.json({
      ok: true,
      url: linkWhatsapp(contato.telefone, resumo),
      mensagem: "Abrimos o WhatsApp com o resumo pronto para enviar.",
    });
    marcarCookies(res, req, { uso: true, lead: true });
    return res;
  }
  const envio = await enviarTexto(contato.email, "Sua estimativa WeCare Hosting", resumo);
  const mensagem = envio === "enviado"
    ? "Enviamos a estimativa para o seu e-mail."
    : envio === "sem-smtp"
      ? "Recebemos seu e-mail. O envio automático está desligado neste servidor até definirem AVALIADOR_SMTP_HOST; o contato fica registrado."
      : "Não foi possível enviar o e-mail agora. Seu contato foi registrado.";
  const res = NextResponse.json({ ok: true, enviado: envio === "enviado", mensagem });
  marcarCookies(res, req, { uso: true, lead: true });
  return res;
}
