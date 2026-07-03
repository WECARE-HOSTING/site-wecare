import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import GSAPAnimations from "@/components/GSAPAnimations";

export const metadata: Metadata = {
  title: {
    template: "%s | Blog WeCare",
    default: "Blog WeCare — Gestão de Imóveis por Temporada",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface-page)", overflowX: "hidden" }}>
      <Nav />
      {children}
      <Footer />
      <GSAPAnimations />
    </div>
  );
}
