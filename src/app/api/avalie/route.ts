import { NextResponse } from "next/server";
import { estimar, type Input } from "@/lib/avaliador";
export async function POST(req: Request) {
  const b = (await req.json().catch(() => null)) as Partial<Input> | null;
  const quartos = Number(b?.quartos);
  if (!b || !["sp", "litoral", "bertioga", "guaruja", "outra"].includes(String(b.regiao)) || !["apto", "casa"].includes(String(b.tipo)) || !(quartos >= 0 && quartos <= 20))
    return NextResponse.json({ erro: "Dados inválidos" }, { status: 400 });
  return NextResponse.json(estimar({ regiao: b.regiao as Input["regiao"], tipo: b.tipo as Input["tipo"], quartos, bairro: String(b.bairro ?? "").slice(0, 80) }));
}
