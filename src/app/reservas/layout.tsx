import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ReservasHeader from "@/components/reservas/ReservasHeader";
import { I18nProvider, MainFrame } from "@/components/reservas/I18n";
import { getT } from "@/lib/reservas/lang";
import "./reservas.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Reservas WeCare",
    default: "Reservas WeCare — Aluguel por temporada direto com a WeCare",
  },
};

export default async function ReservasLayout({ children }: { children: React.ReactNode }) {
  const { lang } = await getT();
  return (
    <I18nProvider lang={lang}>
      <div className="rs-root" lang={lang === "pt" ? "pt-BR" : lang}>
        <ReservasHeader />
        <MainFrame>{children}</MainFrame>
        <Footer />
      </div>
    </I18nProvider>
  );
}
