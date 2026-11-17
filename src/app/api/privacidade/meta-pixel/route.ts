import { connection } from "next/server";
import { NextResponse } from "next/server";
import { metaPixelId } from "@/lib/privacidade/meta-pixel";

export const runtime = "nodejs";

/** ID do Pixel para o navegador, só depois do consentimento de marketing. Sem ID, devolve vazio. */
export async function GET() {
  await connection();
  return NextResponse.json(
    { id: metaPixelId() },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
