import { settlePayment } from "@/lib/reservas/payments";
import { verifyWebhookSignature } from "@/lib/reservas/infinitepay";

// InfinitePay retries on any 400. The body is not signed by them, so the webhook URL we gave
// them carries our own per-order signature (see infinitepay.ts); the body is then only used to
// know *which* order to look up — settlePayment re-checks the payment itself.
export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 10_000) return Response.json({ ok: false }, { status: 413 });
  const body = (await request.json().catch(() => null)) as { order_nsu?: string; transaction_nsu?: string; invoice_slug?: string } | null;
  if (typeof body?.order_nsu !== "string") return Response.json({ ok: false }, { status: 400 });

  // 401, not 400: a forged call must not be retried, and costs us no outbound request.
  if (!verifyWebhookSignature(body.order_nsu, new URL(request.url).searchParams.get("sig"))) {
    return Response.json({ ok: false }, { status: 401 });
  }

  try {
    const result = await settlePayment({ orderNsu: body.order_nsu, transactionNsu: body.transaction_nsu, slug: body.invoice_slug });
    // "pending" usually means InfinitePay hasn't settled yet: ask for a retry.
    return Response.json({ ok: result.state !== "pending", state: result.state }, { status: result.state === "pending" ? 400 : 200 });
  } catch (err) {
    console.error("[reservas] webhook failed", err);
    return Response.json({ ok: false }, { status: 400 });
  }
}
