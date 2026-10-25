"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useRef, type ReactNode, type RefObject } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText, useGSAP };

// Mouvement seulement si le visiteur n'a pas demandé de le réduire. Sinon tout reste à sa place, visible.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

// Une section épinglée se cale sous l'en-tête collant, pas sous le bord de l'écran.
export const PINNED_HEIGHT = "calc(100svh - var(--header-h))";
export const pinStart = () => `top ${document.querySelector("header")?.offsetHeight ?? 0}px`;

// Les enfants [data-reveal] montent en fondu par paquets quand ils entrent à l'écran (ScrollTrigger.batch).
// Le contenu est visible sans JavaScript : l'état caché n'est posé qu'au montage, avant le premier rendu.
export function RevealGroup({ children, className, as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "ul" | "section" }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal], :scope > li", ref.current);
        gsap.set(items, { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(items, {
          start: "top 92%",
          once: true,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.07, overwrite: true }),
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  const Box = Tag as "div";
  return (
    <Box ref={ref as RefObject<HTMLDivElement>} className={className}>
      {children}
    </Box>
  );
}

// Titre qui se compose ligne à ligne, chaque ligne remontant de derrière un cache (SplitText + masque).
export function SplitHeading({ children, className, as: Tag = "h2", delay = 0 }: { children: ReactNode; className?: string; as?: "h1" | "h2" | "p"; delay?: number }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(ref.current!, { type: "lines", mask: "lines", linesClass: "split-line" });
        gsap.from(split.lines, {
          yPercent: 105,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.08,
          delay,
          scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
        });
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
