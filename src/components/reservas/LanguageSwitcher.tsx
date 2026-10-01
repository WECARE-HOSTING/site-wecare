"use client";
import { useTransition } from "react";
import { Globe } from "lucide-react";
import { LANGS, type Lang } from "@/lib/reservas/i18n";
import { setLang } from "@/lib/reservas/set-lang";
import { useT } from "./I18n";

export default function LanguageSwitcher() {
  const t = useT();
  const [pending, start] = useTransition();

  const choose = (lang: Lang) => {
    if (lang === t.lang) return;
    start(() => setLang(lang));
  };

  return (
    <div className="rs-lang" role="group" aria-label={t.language} data-pending={pending || undefined}>
      <Globe size={15} aria-hidden="true" />
      {LANGS.map((l) => (
        <button key={l.code} type="button" className={l.code === t.lang ? "is-on" : ""} aria-pressed={l.code === t.lang} title={l.label} lang={l.code} onClick={() => choose(l.code)}>
          {l.short}
        </button>
      ))}
    </div>
  );
}
