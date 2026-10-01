"use client";
import { Star } from "lucide-react";
import type { Review } from "@/lib/reservas/types";
import { useT } from "./I18n";

export default function ReviewCard({ review, showStars }: { review: Review; showStars: boolean }) {
  const t = useT();
  const stars = Math.max(0, Math.min(5, Math.round(review.rating / 2)));
  const when = review.date ? t.date(review.date, { month: "long", year: "numeric" }) : "";
  return (
    <article className="rs-review">
      <header>
        <strong>{review.name || t.reviewGuest}</strong>
        <span>{[when, review.source ? t.reviewVia[review.source] : ""].filter(Boolean).join(" · ")}</span>
      </header>
      {showStars && (
        <div className="rs-review-stars" role="img" aria-label={`${stars}/5`}>
          {Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} fill={i < stars ? "currentColor" : "none"} />)}
        </div>
      )}
      <p>{review.text}</p>
    </article>
  );
}
