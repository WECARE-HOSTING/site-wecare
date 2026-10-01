import "server-only";
import { cookies } from "next/headers";
import { LANG_COOKIE, getMessages, normalizeLang, type T } from "./i18n";

/** The guest's language, from the cookie the header switcher sets; Portuguese when unset. */
export async function getT(): Promise<T> {
  return getMessages(normalizeLang((await cookies()).get(LANG_COOKIE)?.value));
}
