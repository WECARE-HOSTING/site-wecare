"use client";
import { createContext, useContext, useMemo } from "react";
import { getMessages, type Lang, type T } from "@/lib/reservas/i18n";

const Ctx = createContext<T | null>(null);

/** Receives only the language code (functions can't cross the server/client boundary) and rebuilds the messages here. */
export function I18nProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const t = useMemo(() => getMessages(lang), [lang]);
  return <Ctx.Provider value={t}>{children}</Ctx.Provider>;
}

export function useT(): T {
  const t = useContext(Ctx);
  if (!t) throw new Error("useT must be used inside <I18nProvider>");
  return t;
}
