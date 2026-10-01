"use server";
import { cookies } from "next/headers";
import { LANG_COOKIE, normalizeLang } from "./i18n";

/** Remembers the guest's language for a year. Setting a cookie in an action re-renders the current page with it. */
export async function setLang(lang: string): Promise<void> {
  (await cookies()).set(LANG_COOKIE, normalizeLang(lang), { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
}
