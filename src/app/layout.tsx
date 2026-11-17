import type { Metadata } from "next";
import GtagLeadTracker from "@/components/GtagLeadTracker";
import PrivacidadeSite from "@/components/PrivacidadeSite";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.wecarehosting.com.br"),
  title: "WeCare — Gestão de Imóveis por Temporada",
  description: "Cuidado de alto padrão para imóveis em locação por temporada. Renda passiva de verdade — sem abrir mão do ativo.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full">
        {process.env.SITE_ENV_LABEL && <div className="wc-env-banner">{process.env.SITE_ENV_LABEL}</div>}
        {children}
        <GtagLeadTracker />
        <PrivacidadeSite />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
