import { parseStay, quoteStay, StayError } from "@/lib/reservas/booking";

export async function POST(request: Request) {
  try {
    const stay = parseStay(await request.json());
    const { quote } = await quoteStay(stay);
    return Response.json({ quote });
  } catch (err) {
    if (err instanceof StayError) return Response.json({ error: err.message }, { status: 422 });
    console.error("[reservas] cotacao failed", err);
    return Response.json({ error: "Não foi possível calcular o preço agora. Tente novamente em instantes." }, { status: 502 });
  }
}
