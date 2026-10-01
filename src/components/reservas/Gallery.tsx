"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Grid3x3, X } from "lucide-react";
import type { ListingImage } from "@/lib/reservas/types";
import { useT } from "./I18n";

export default function Gallery({ images, name }: { images: ListingImage[]; name: string }) {
  const t = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open]);

  const hero = images.slice(0, 5);
  return (
    <>
      <div className={`rs-gallery rs-gallery-${Math.min(hero.length, 5)}`}>
        {hero.map((img, i) => (
          <button key={img.url} type="button" className={`rs-gallery-cell${i === 0 ? " is-main" : ""}`} onClick={() => setOpen(true)} aria-label={t.viewPhoto(i + 1)}>
            <Image src={img.url} alt={img.caption || name} fill priority={i === 0} sizes={i === 0 ? "(max-width: 880px) 100vw, 640px" : "320px"} />
          </button>
        ))}
        {images.length > 1 && (
          <button type="button" className="rs-gallery-all" onClick={() => setOpen(true)}>
            <Grid3x3 size={15} /> {t.showAllPhotos}
          </button>
        )}
      </div>

      {open && (
        <div className="rs-photos" role="dialog" aria-modal="true" aria-label={t.photosOf(name)}>
          <div className="rs-photos-bar">
            <button type="button" onClick={() => setOpen(false)} aria-label={t.close}><X size={20} /></button>
            <span>{t.photoCount(images.length)}</span>
          </div>
          <div className="rs-photos-list">
            {images.map((img) => (
              <figure key={img.url}>
                <Image src={img.url} alt={img.caption || name} width={1200} height={800} sizes="(max-width: 880px) 100vw, 860px" />
                {img.caption && <figcaption>{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
