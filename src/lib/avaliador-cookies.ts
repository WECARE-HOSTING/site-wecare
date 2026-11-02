import { NextResponse } from "next/server";

const UM_ANO = 60 * 60 * 24 * 365;

export function lerCookiesAvaliador(header: string | null) {
  const bruto = header ?? "";
  const tem = (nome: string) => new RegExp(`(?:^|;\\s*)${nome}=1(?:;|$)`).test(bruto);
  return { uso: tem("wc_av_uso"), lead: tem("wc_av_lead") };
}

function https(req: Request) {
  const proto = req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  if (proto) return proto === "https";
  try {
    return new URL(req.url).protocol === "https:";
  } catch {
    return false;
  }
}

/** O cookie httpOnly segura a 2ª simulação mesmo quando o disco da release não grava. */
export function marcarCookies(res: NextResponse, req: Request, quais: { uso?: boolean; lead?: boolean }) {
  const base = { httpOnly: true, sameSite: "lax" as const, secure: https(req), path: "/", maxAge: UM_ANO };
  if (quais.uso) res.cookies.set("wc_av_uso", "1", base);
  if (quais.lead) res.cookies.set("wc_av_lead", "1", base);
}
