// All stay dates are plain calendar dates (YYYY-MM-DD) in the property's local
// time. We do the arithmetic in UTC so no timezone can shift a day.

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: unknown): value is string {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function nightsBetween(checkin: string, checkout: string): number {
  const ms = Date.parse(`${checkout}T00:00:00Z`) - Date.parse(`${checkin}T00:00:00Z`);
  return Math.round(ms / 86_400_000);
}

/** Every night of the stay: checkin inclusive, checkout exclusive. */
export function stayNights(checkin: string, checkout: string): string[] {
  const out: string[] = [];
  for (let d = checkin; d < checkout; d = addDays(d, 1)) out.push(d);
  return out;
}

/** Today in São Paulo, which is where every WeCare property is operated from. */
export function todayInBrazil(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
}

export function formatDateBR(date: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }): string {
  return new Intl.DateTimeFormat("pt-BR", { ...opts, timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

export function formatMoney(value: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency, maximumFractionDigits: value % 1 === 0 ? 0 : 2 }).format(value);
}

export function plural(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}
