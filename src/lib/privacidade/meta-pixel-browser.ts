const SCRIPT_ID = "wc-meta-pixel";
const SRC = "https://connect.facebook.net/pt_BR/fbevents.js";
/** Mesmo critério de `metaPixelId` em meta-pixel.ts: só dígitos, sem ID inventado. */
const ID_PIXEL = /^\d{5,20}$/;

let caminhoVisto = "";
let bloqueado = true;
let idCarregado = "";
let consultado = false;
let pedido: Promise<string> | null = null;

type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: Fbq;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

function injetar(id: string) {
  if (document.getElementById(SCRIPT_ID)) return;
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.textContent = `
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
${JSON.stringify(SRC)});
fbq('init', ${JSON.stringify(id)});
fbq('track', 'PageView');
`;
  document.head.appendChild(script);
}

/** Liga ou desliga o disparo. Não injeta o script da Meta. */
export function definirPixelAtivo(ativo: boolean) {
  bloqueado = !ativo;
  if (!window.fbq) return;
  window.fbq("consent", ativo ? "grant" : "revoke");
}

/** Busca o ID no servidor uma vez. Vazio se não houver Pixel configurado. */
export function obterPixelId(): Promise<string> {
  if (consultado) return Promise.resolve(idCarregado);
  if (!pedido) {
    pedido = fetch("/api/privacidade/meta-pixel", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { id: "" }))
      .then((corpo: { id?: unknown }) => {
        const id = typeof corpo?.id === "string" ? corpo.id.trim() : "";
        consultado = true;
        idCarregado = ID_PIXEL.test(id) ? id : "";
        return idCarregado;
      })
      .catch(() => {
        pedido = null;
        return "";
      });
  }
  return pedido;
}

export function ativarPixel(id: string, pathname: string) {
  if (bloqueado || !ID_PIXEL.test(id)) return;
  if (!document.getElementById(SCRIPT_ID)) {
    injetar(id);
    idCarregado = id;
    caminhoVisto = pathname;
    return;
  }
  if (caminhoVisto === pathname) return;
  caminhoVisto = pathname;
  window.fbq?.("track", "PageView");
}

export function rastrearLead(contentName: "whatsapp_captacao" | "formulario_avaliacao") {
  if (bloqueado || !window.fbq) return;
  window.fbq("track", "Lead", { content_name: contentName });
}
