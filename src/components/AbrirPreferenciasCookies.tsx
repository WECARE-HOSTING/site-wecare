"use client";

import { EVENTO_ABRIR_PREFERENCIAS } from "@/lib/privacidade/consentimento";

/** Botão no meio do texto da política, com cara de link. */
export default function AbrirPreferenciasCookies({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="wc-inline-prefs"
      onClick={() => window.dispatchEvent(new Event(EVENTO_ABRIR_PREFERENCIAS))}
    >
      {children}
    </button>
  );
}
