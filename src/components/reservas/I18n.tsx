"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { getMessages, type Lang, type T } from "@/lib/reservas/i18n";

type Ctx = { t: T; choose: (lang: Lang) => void; switching: boolean };
const I18nCtx = createContext<Ctx | null>(null);

/**
 * Receives only the language code (functions can't cross the server/client boundary) and rebuilds
 * the messages here. `choose` flips every client-rendered string at once; the server-rendered
 * parts of the page follow when the server catches up (`switching` is true in between).
 */
export function I18nProvider({ lang: serverLang, children }: { lang: Lang; children: React.ReactNode }) {
  const [chosen, setChosen] = useState<{ from: Lang; lang: Lang } | null>(null);
  // A choice only applies on top of the language the server rendered when it was made.
  const lang = chosen && chosen.from === serverLang ? chosen.lang : serverLang;
  const value = useMemo<Ctx>(
    () => ({ t: getMessages(lang), switching: lang !== serverLang, choose: (next) => setChosen({ from: serverLang, lang: next }) }),
    [lang, serverLang],
  );
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

function useI18n(): Ctx {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useT must be used inside <I18nProvider>");
  return ctx;
}

export const useT = (): T => useI18n().t;
export const useLangSwitch = () => {
  const { choose, switching } = useI18n();
  return { choose, switching };
};

/** The page body: dims slightly while a language change is still loading. */
export function MainFrame({ children }: { children: React.ReactNode }) {
  const { switching } = useI18n();
  return <main className={switching ? "rs-switching" : undefined} aria-busy={switching}>{children}</main>;
}
