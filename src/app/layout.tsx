import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
      <body className="min-h-full">{children}</body>
    </html>
  );
}
