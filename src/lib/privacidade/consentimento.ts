"use client";

/** Escolha de cookies, no armazenamento local do próprio site. Não é cookie de terceiro. */

import { useSyncExternalStore } from "react";

export const CHAVE_CONSENTIMENTO = "wc_consent_v2";
export const EVENTO_ABRIR_PREFERENCIAS = "wc-open-cookie-prefs";
const EVENTO_CONSENTIMENTO = "wc-consent-changed";
const SNAPSHOT_SERVIDOR = "servidor";

export type EscolhaCookies = {
  medicao: boolean;
  marketing: boolean;
};

export type Consentimento = EscolhaCookies & {
  v: 2;
  necessary: true;
  updatedAt: string;
};

function lerBruto(): string {
  try {
    return localStorage.getItem(CHAVE_CONSENTIMENTO) ?? "";
  } catch {
    return "";
  }
}

export function interpretarConsentimento(bruto: string): Consentimento | null | undefined {
  if (bruto === SNAPSHOT_SERVIDOR) return undefined;
  if (!bruto) return null;
  try {
    const j = JSON.parse(bruto) as Partial<Consentimento> | null;
    if (!j || j.v !== 2 || typeof j.marketing !== "boolean" || typeof j.medicao !== "boolean") return null;
    return {
      v: 2,
      necessary: true,
      medicao: j.medicao,
      marketing: j.marketing,
      updatedAt: String(j.updatedAt ?? ""),
    };
  } catch {
    return null;
  }
}

export function lerConsentimento(): Consentimento | null {
  if (typeof window === "undefined") return null;
  return interpretarConsentimento(lerBruto()) ?? null;
}

function assinarConsentimento(atualizar: () => void) {
  window.addEventListener(EVENTO_CONSENTIMENTO, atualizar);
  window.addEventListener("storage", atualizar);
  return () => {
    window.removeEventListener(EVENTO_CONSENTIMENTO, atualizar);
    window.removeEventListener("storage", atualizar);
  };
}

/** `undefined` no servidor e na hidratação; `null` se a pessoa ainda não escolheu. */
export function useConsentimento(): Consentimento | null | undefined {
  const bruto = useSyncExternalStore(assinarConsentimento, lerBruto, () => SNAPSHOT_SERVIDOR);
  return interpretarConsentimento(bruto);
}

export function gravarConsentimento(escolha: EscolhaCookies): Consentimento {
  const consentimento: Consentimento = {
    v: 2,
    necessary: true,
    medicao: escolha.medicao,
    marketing: escolha.marketing,
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(CHAVE_CONSENTIMENTO, JSON.stringify(consentimento));
  window.dispatchEvent(new Event(EVENTO_CONSENTIMENTO));
  return consentimento;
}
