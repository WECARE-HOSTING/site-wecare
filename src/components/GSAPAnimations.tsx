"use client";

import { useEffect } from "react";

export default function GSAPAnimations() {
  useEffect(() => {
    // Synchronous early-exit — runs before any async GSAP import so no
    // gsap.set() call can leave elements invisible on reduced-motion screens
    // (also covers screenshot tools that emulate prefers-reduced-motion).
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const selectors = [
        "[data-reveal]",
        "[data-stagger] > *",
        "[data-parallax]",
        ".wc-card-hover",
        ".wc-mosaic-item",
        "details",
      ];
      selectors.forEach(sel =>
        document.querySelectorAll(sel).forEach(el => {
          const h = el as HTMLElement;
          h.style.opacity = "1";
          h.style.transform = "none";
          h.style.visibility = "visible";
        })
      );
      return;
    }

    let gsap: typeof import("gsap").gsap;
    let ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;

    const init = async () => {
      const gsapModule = await import("gsap");
      const stModule = await import("gsap/ScrollTrigger");
      gsap = gsapModule.gsap;
      ScrollTrigger = stModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      // ── Scroll reveal for [data-reveal] elements ──
      // Set initial state
      gsap.set("[data-reveal]", { opacity: 0, y: 28 });

      // Batch-reveal with stagger
      ScrollTrigger.batch("[data-reveal]", {
        onEnter: (batch) => {
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            stagger: 0.10,
          });
        },
        once: true,
        start: "top 88%",
      });

      // ── Hero headline letter-by-letter reveal (already in Hero via CSS, add a GSAP flourish) ──
      const heroH1 = document.querySelector("h1");
      if (heroH1) {
        gsap.from(heroH1, {
          opacity: 0,
          y: 40,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.1,
        });
      }

      // ── Proof bar counters count-up ──
      const proofNums = document.querySelectorAll("#prova [data-reveal]");
      proofNums.forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          onEnter: () => {
            gsap.from(el, {
              y: 30,
              opacity: 0,
              duration: 0.7,
              ease: "power2.out",
            });
          },
          once: true,
        });
      });

      // ── Portfolio mosaic: staggered pop-in ──
      const mosaicItems = document.querySelectorAll(".wc-mosaic-item");
      if (mosaicItems.length) {
        gsap.set(mosaicItems, { opacity: 0, scale: 0.94 });
        ScrollTrigger.create({
          trigger: ".wc-portfolio-mosaic",
          start: "top 80%",
          onEnter: () => {
            gsap.to(mosaicItems, {
              opacity: 1,
              scale: 1,
              duration: 0.7,
              ease: "power2.out",
              stagger: 0.08,
            });
          },
          once: true,
        });
      }

      // ── Service cards: cascade reveal ──
      const svcCards = document.querySelectorAll(".wc-card-hover");
      if (svcCards.length) {
        gsap.set(svcCards, { opacity: 0, y: 32 });
        ScrollTrigger.batch(svcCards, {
          onEnter: batch => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.75,
              ease: "power2.out",
              stagger: 0.09,
            });
          },
          start: "top 85%",
          once: true,
        });
      }

      // ── Historia: big number count-up feel ──
      const bigNumber = document.querySelector("#historia .font-serif");
      if (bigNumber) {
        gsap.from(bigNumber, {
          scrollTrigger: {
            trigger: "#historia",
            start: "top 70%",
          },
          opacity: 0,
          x: -40,
          duration: 0.9,
          ease: "power3.out",
        });
      }

      // ── Parallax on the historia photo ──
      const historiaImg = document.querySelector("#historia img") as HTMLElement;
      if (historiaImg) {
        gsap.to(historiaImg, {
          scrollTrigger: {
            trigger: "#historia",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
          y: -40,
          ease: "none",
        });
      }

      // ── Nav: subtle hide/show on scroll ──
      let lastY = 0;
      const header = document.querySelector("header") as HTMLElement;
      ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (!header) return;
          const currentY = self.scroll();
          if (currentY > lastY && currentY > 120) {
            gsap.to(header, { y: -80, duration: 0.3, ease: "power2.in" });
          } else {
            gsap.to(header, { y: 0, duration: 0.4, ease: "power2.out" });
          }
          lastY = currentY;
        },
      });

      // ── Pillar grid: stagger each cell ──
      const pillars = document.querySelectorAll(".wc-pillar-grid > [data-reveal]");
      if (pillars.length) {
        gsap.set(pillars, { opacity: 0, y: 20 });
        ScrollTrigger.create({
          trigger: ".wc-pillar-grid",
          start: "top 80%",
          onEnter: () => {
            gsap.to(pillars, {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power2.out",
              stagger: 0.07,
            });
          },
          once: true,
        });
      }

      // ── Gold line: draw in from left ──
      const goldLines = document.querySelectorAll(".wc-eyebrow::before");
      goldLines.forEach(line => {
        gsap.from(line, {
          scrollTrigger: { trigger: line, start: "top 85%" },
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.6,
          ease: "power2.out",
        });
      });

      // ── FAQ items slide in from left ──
      const faqItems = document.querySelectorAll("details");
      if (faqItems.length) {
        gsap.set(faqItems, { opacity: 0, x: -20 });
        ScrollTrigger.create({
          trigger: "#faq",
          start: "top 75%",
          onEnter: () => {
            gsap.to(faqItems, {
              opacity: 1,
              x: 0,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.07,
            });
          },
          once: true,
        });
      }

      // ── CTA Final: scale up slightly on enter ──
      const ctaHeading = document.querySelector("#avaliar h2");
      if (ctaHeading) {
        gsap.from(ctaHeading, {
          scrollTrigger: {
            trigger: "#avaliar",
            start: "top 75%",
          },
          opacity: 0,
          y: 32,
          duration: 0.9,
          ease: "power3.out",
        });
      }
    };

    init();

    return () => {
      // Cleanup on unmount
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().forEach(t => t.kill());
      });
    };
  }, []);

  return null;
}
