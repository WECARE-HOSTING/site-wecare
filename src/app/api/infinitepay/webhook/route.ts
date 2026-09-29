import { settlePayment } from "@/lib/reservas/payments";

// InfinitePay retries on any 400. The body is not signed, so it is only used to
// know *which* order to look up — settlePayment re-checks the payment itself.
export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { order_nsu?: string; transaction_nsu?: string; invoice_slug?: string } | null;
  if (!body?.order_nsu) return Response.json({ ok: false }, { status: 400 });

  try {
    const result = await settlePayment({ orderNsu: body.order_nsu, transactionNsu: body.transaction_nsu, slug: body.invoice_slug });
    // "pending" usually means InfinitePay hasn't settled yet: ask for a retry.
    return Response.json({ ok: result.state !== "pending", state: result.state }, { status: result.state === "pending" ? 400 : 200 });
  } catch (err) {
    console.error("[reservas] webhook failed", err);
    return Response.json({ ok: false }, { status: 400 });
  }
}
