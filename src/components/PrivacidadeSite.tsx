"use client";

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  EVENTO_ABRIR_PREFERENCIAS,
  gravarConsentimento,
  lerConsentimento,
  useConsentimento,
} from "@/lib/privacidade/consentimento";
import { ativarPixel, definirPixelAtivo, obterPixelId, rastrearLead } from "@/lib/privacidade/meta-pixel-browser";
import { aplicarUtmNoDocumento, capturarUtmFirstTouch, ehLinkCaptacao } from "@/lib/privacidade/utm";

export default function PrivacidadeSite() {
  const pathname = usePathname();
  const tituloPrefs = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const consent = useConsentimento();
  const [prefsAbertas, setPrefsAbertas] = useState(false);
  const [rascunhoMarketing, setRascunhoMarketing] = useState(false);

  const mostrarBanner = consent === null && !prefsAbertas;
  const aguardando = consent === undefined;
  const marketing = consent?.marketing === true;

  useLayoutEffect(() => {
    const utm = capturarUtmFirstTouch();
    aplicarUtmNoDocumento(document, utm);
  }, []);

  useEffect(() => {
    let aplicando = false;
    const aplicar = () => {
      if (aplicando) return;
      aplicando = true;
      try {
        aplicarUtmNoDocumento(document, capturarUtmFirstTouch());
      } finally {
        aplicando = false;
      }
    };
    aplicar();
    const obs = new MutationObserver(aplicar);
    obs.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["href"] });
    return () => obs.disconnect();
  }, [pathname]);

  useEffect(() => {
    function aoClicar(event: MouseEvent) {
      const alvo = event.target as HTMLElement | null;
      const ancora = alvo?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!ancora || !ehLinkCaptacao(ancora.href)) return;
      aplicarUtmNoDocumento(document, capturarUtmFirstTouch());
      if (lerConsentimento()?.marketing) rastrearLead("whatsapp_captacao");
    }
    function aoEnviar(event: Event) {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.closest("[data-avaliador]")) return;
      aplicarUtmNoDocumento(document, capturarUtmFirstTouch());
      if (lerConsentimento()?.marketing) rastrearLead("formulario_avaliacao");
    }
    document.addEventListener("click", aoClicar, true);
    document.addEventListener("submit", aoEnviar, true);
    return () => {
      document.removeEventListener("click", aoClicar, true);
      document.removeEventListener("submit", aoEnviar, true);
    };
  }, []);

  useEffect(() => {
    function abrir() {
      setRascunhoMarketing(lerConsentimento()?.marketing ?? false);
      setPrefsAbertas(true);
    }
    window.addEventListener(EVENTO_ABRIR_PREFERENCIAS, abrir);
    return () => window.removeEventListener(EVENTO_ABRIR_PREFERENCIAS, abrir);
  }, []);

  useEffect(() => {
    if (!mostrarBanner) {
      document.documentElement.style.removeProperty("--wc-consent-h");
      return;
    }
    const el = bannerRef.current;
    if (!el) return;
    const medir = () => document.documentElement.style.setProperty("--wc-consent-h", `${el.offsetHeight + 28}px`);
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--wc-consent-h");
    };
  }, [mostrarBanner]);

  useEffect(() => {
    if (aguardando) return;
    if (!marketing) {
      definirPixelAtivo(false);
      return;
    }
    definirPixelAtivo(true);
    let cancelado = false;
    obterPixelId().then((id) => {
      if (!cancelado) ativarPixel(id, pathname);
    });
    return () => {
      cancelado = true;
    };
  }, [aguardando, marketing, pathname]);

  useEffect(() => {
    if (!prefsAbertas) return;
    const antes = document.activeElement as HTMLElement | null;
    const dialog = dialogRef.current;
    const focoInicial = dialog?.querySelector<HTMLElement>("#wc-marketing");
    focoInicial?.focus();
    function aoTeclar(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setPrefsAbertas(false);
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const itens = [...dialog.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), a[href]")];
      if (!itens.length) return;
      const primeiro = itens[0];
      const ultimo = itens[itens.length - 1];
      if (event.shiftKey && document.activeElement === primeiro) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primeiro.focus();
      }
    }
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", aoTeclar);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", aoTeclar);
      antes?.focus?.();
    };
  }, [prefsAbertas]);

  function salvar(aceitaMarketing: boolean) {
    gravarConsentimento(aceitaMarketing);
    setPrefsAbertas(false);
  }

  function abrirPrefs() {
    setRascunhoMarketing(consent?.marketing ?? false);
    setPrefsAbertas(true);
  }

  return (
    <>
      {mostrarBanner && (
        <div ref={bannerRef} className="wc-consent" role="region" aria-label="Consentimento de cookies">
          <p className="wc-label" style={{ color: "var(--gold-300)", margin: 0 }}>
            Cookies
          </p>
          <p>
            Usamos um registro necessário para lembrar esta escolha. Se você permitir, o Meta Pixel mede a visita e o
            interesse em falar com a gente. Dá para aceitar, recusar o marketing ou ajustar as preferências.{" "}
            <a href="/politica-de-privacidade">Política de Privacidade</a>
          </p>
          <div className="wc-consent-actions">
            <button type="button" className="wc-consent-prefs" onClick={abrirPrefs}>
              Preferências
            </button>
            <button type="button" className="wc-consent-reject" onClick={() => salvar(false)}>
              Recusar
            </button>
            <button type="button" className="wc-consent-accept" onClick={() => salvar(true)}>
              Aceitar
            </button>
          </div>
        </div>
      )}

      {prefsAbertas && (
        <div
          className="wc-consent-modal"
          onClick={() => setPrefsAbertas(false)}
        >
          <div
            ref={dialogRef}
            className="wc-consent-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={tituloPrefs}
            onClick={(event) => event.stopPropagation()}
          >
            <p className="wc-label" style={{ color: "var(--gold-700)", margin: "0 0 8px" }}>
              Privacidade
            </p>
            <h2 id={tituloPrefs}>Preferências de cookies</h2>
            <p className="wc-consent-lead">
              Os necessários ficam sempre ligados. Marketing só entra se você aceitar — e o script da Meta não carrega
              antes disso.
            </p>

            <fieldset>
              <legend className="wc-sr">Categorias</legend>
              <label className="wc-consent-row">
                <input type="checkbox" checked disabled />
                <span>
                  <strong>Necessários</strong>
                  <span>
                    Lembram esta escolha, o idioma da área de reservas e, nesta sessão, a origem da visita para o pedido
                    de contato. Não são cookies de terceiros.
                  </span>
                </span>
              </label>
              <label className="wc-consent-row">
                <input
                  id="wc-marketing"
                  type="checkbox"
                  checked={rascunhoMarketing}
                  onChange={(event) => setRascunhoMarketing(event.target.checked)}
                />
                <span>
                  <strong>Marketing</strong>
                  <span>
                    Meta Pixel. Mede a página vista e o Lead quando você clica no WhatsApp de captação ou envia o
                    formulário de avaliação. Se o Pixel não estiver configurado, nada é carregado.
                  </span>
                </span>
              </label>
            </fieldset>

            <div className="wc-consent-actions wc-consent-actions-light">
              <button type="button" className="wc-consent-ghost" onClick={() => setPrefsAbertas(false)}>
                Cancelar
              </button>
              <button type="button" className="wc-consent-accept" onClick={() => salvar(rascunhoMarketing)}>
                Salvar
              </button>
            </div>
            <p className="wc-consent-note">
              <a href="/politica-de-privacidade">Política de Privacidade</a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
