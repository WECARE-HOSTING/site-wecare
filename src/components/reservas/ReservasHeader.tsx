import Link from "next/link";
import { WHATSAPP_RESERVAS } from "@/lib/reservas/contact";

export default function ReservasHeader() {
  return (
    <header className="rs-header">
      <div className="rs-wrap rs-header-in">
        <Link href="/reservas" className="rs-logo" aria-label="WeCare Reservas">
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG, same as Nav */}
          <img src="/brand/wecare-logo-horizontal.svg" alt="WeCare" width={108} height={30} />
          <span>Reservas</span>
        </Link>
        <nav className="rs-header-nav">
          <Link href="/">Para proprietários</Link>
          <a href={WHATSAPP_RESERVAS} target="_blank" rel="noopener noreferrer" className="rs-header-cta">Fale conosco</a>
        </nav>
      </div>
    </header>
  );
}
