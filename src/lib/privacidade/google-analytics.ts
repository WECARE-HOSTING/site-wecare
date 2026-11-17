/** Google Analytics 4. O script só é inserido depois do aceite da categoria Medição. */

export const GA_MEASUREMENT_ID = "G-SSEV44PYET";

const SCRIPT_ID = "wc-ga4";

let ativo = false;
let caminhoVisto = "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function desligarFlag(desligado: boolean) {
  (window as unknown as Record<string, boolean>)[`ga-disable-${GA_MEASUREMENT_ID}`] = desligado;
}

function injetar() {
  if (document.getElementById(SCRIPT_ID)) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID);
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
}

export function medicaoEstaAtiva(): boolean {
  return ativo;
}

/** Liga ou desliga a medição. Não baixa o script do Google quando está desligada. */
export function definirMedicaoAtiva(ligada: boolean) {
  ativo = ligada;
  desligarFlag(!ligada);
}

/**
 * Insere o gtag.js uma vez e registra a página.
 * Em navegações seguintes, só o page_view — o script não entra de novo.
 */
export function ativarMedicao(pathname: string) {
  if (!ativo) return;
  desligarFlag(false);
  if (!document.getElementById(SCRIPT_ID)) {
    injetar();
    caminhoVisto = pathname;
    return;
  }
  if (caminhoVisto === pathname) return;
  caminhoVisto = pathname;
  window.gtag?.("event", "page_view", {
    page_path: pathname,
    page_location: window.location.href,
  });
}
