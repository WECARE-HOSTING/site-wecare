import type { NextRequest } from "next/server";
import { getCalendar, getListing } from "@/lib/reservas/hostaway";
import { addDays, isIsoDate, todayInBrazil } from "@/lib/reservas/dates";

// Live availability for the date picker on a listing page. Capped at ~4 months
// per request so one visitor can't make us pull a year of calendar at a time.
export async function GET(request: NextRequest, ctx: RouteContext<"/api/reservas/calendario/[id]">) {
  const { id } = await ctx.params;
  const listing = await getListing(Number(id));
  if (!listing) return Response.json({ error: "Imóvel não encontrado." }, { status: 404 });

  const today = todayInBrazil();
  const from = request.nextUrl.searchParams.get("from");
  const start = isIsoDate(from) && from > today ? from : today;
  if (start > addDays(today, 540)) return Response.json({ days: [] });
  const days = await getCalendar(listing.id, start, addDays(start, 124));

  return Response.json(
    { days: days.map((d) => ({ date: d.date, available: d.available, price: d.price, minimumStay: d.minimumStay, closedOnArrival: d.closedOnArrival, closedOnDeparture: d.closedOnDeparture })) },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120" } },
  );
}
