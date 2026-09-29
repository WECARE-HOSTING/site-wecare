import type { Metadata } from "next";
import Footer from "@/components/Footer";
import ReservasHeader from "@/components/reservas/ReservasHeader";
import "./reservas.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Reservas WeCare",
    default: "Reservas WeCare — Aluguel por temporada direto com a WeCare",
  },
};

export default function ReservasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="rs-root">
      <ReservasHeader />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
