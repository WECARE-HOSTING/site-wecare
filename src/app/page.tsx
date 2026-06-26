import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProofBar from "@/components/ProofBar";
import Visibilidade from "@/components/Visibilidade";
import Servicos from "@/components/Servicos";
import Portfolio from "@/components/Portfolio";
import ComoFunciona from "@/components/ComoFunciona";
import Historia from "@/components/Historia";
import Depoimentos from "@/components/Depoimentos";
import PadraoWeCare from "@/components/PadraoWeCare";
import Planos from "@/components/Planos";
import FAQ from "@/components/FAQ";
import CTAFinal from "@/components/CTAFinal";
import Footer from "@/components/Footer";
import GSAPAnimations from "@/components/GSAPAnimations";

export default function Home() {
  return (
    <main style={{ background: "var(--surface-page)", overflowX: "hidden" }}>
      <Nav />
      <Hero />
      <ProofBar />
      <Visibilidade />
      <Servicos />
      <Portfolio />
      <ComoFunciona />
      <Historia />
      <Depoimentos />
      <PadraoWeCare />
      <Planos />
      <FAQ />
      <CTAFinal />
      <Footer />
      <GSAPAnimations />
    </main>
  );
}
