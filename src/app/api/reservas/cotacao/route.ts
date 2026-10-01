import { getT } from "@/lib/reservas/lang";
import { parseStay, quoteStay, StayError } from "@/lib/reservas/booking";

export async function POST(request: Request) {
  const t = await getT();
  try {
    const stay = parseStay(await request.json(), t);
    const { quote } = await quoteStay(stay, t);
    return Response.json({ quote });
  } catch (err) {
    if (err instanceof StayError) return Response.json({ error: err.message }, { status: 422 });
    console.error("[reservas] cotacao failed", err);
    return Response.json({ error: t.errQuoteFailed }, { status: 502 });
  }
}
