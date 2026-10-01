"use client";
import Link from "next/link";
import { whatsappLink } from "@/lib/reservas/contact";
import { useT } from "./I18n";
import LanguageSwitcher from "./LanguageSwitcher";

export default function ReservasHeader() {
  const t = useT();
  return (
    <header className="rs-header">
      <div className="rs-wrap rs-header-in">
        <Link href="/reservas" className="rs-logo" aria-label={`WeCare ${t.headerBookings}`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static brand SVG, same as Nav */}
          <img src="/brand/wecare-logo-horizontal.svg" alt="WeCare" width={108} height={30} />
          <span>{t.headerBookings}</span>
        </Link>
        <nav className="rs-header-nav">
          <LanguageSwitcher />
          <Link href="/">{t.forOwners}</Link>
          <a href={whatsappLink(t.whatsappGreeting)} target="_blank" rel="noopener noreferrer" className="rs-header-cta">{t.contactUs}</a>
        </nav>
      </div>
    </header>
  );
}
