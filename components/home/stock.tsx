"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/components/gsap";
import { Logo } from "@/components/logo";

const TILES: [string, string][] = [
  ["tin-quotidien", "Poudre"],
  ["chain-leaf", "Feuille"],
  ["tin-recolte", "Mouture"],
  ["step-3", "Mousse"],
  ["chasen", "Chasen"],
  ["tin-latte", "Grains"],
  ["chain-field", "Champ"],
  ["furui", "Tamis"],
  ["tin-ceremonie", "Bol"],
  ["chain-tin", "Boîte"],
  ["step-1", "Tamisage"],
  ["kusenaoshi", "Support"],
];

// Planche de repérage : douze vignettes numérotées sur la grille. Toucher une vignette l'agrandit dans sa case.
export function Stock() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".stock-thumb", {
          scale: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: { each: 0.05, from: "random" },
          scrollTrigger: { trigger: ".stock-grid", start: "top 80%", once: true },
        });
        gsap.fromTo(".stock-logo", { yPercent: 40 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: ".stock-logo", start: "top bottom", end: "bottom bottom", scrub: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-rail="Stock" aria-labelledby="stock-title" className="relative overflow-hidden bg-steel">
      <h2 id="stock-title" className="sr-only">
        Le stock USUCHA
      </h2>
      <ul className="stock-grid mx-auto grid max-w-[1440px] grid-cols-3 border-t border-l border-line sm:grid-cols-4 lg:grid-cols-6">
        {TILES.map(([photo, label], i) => {
          const expanded = open === i;
          return (
            <li key={photo} className="relative aspect-square border-r border-b border-line">
              {/* Croix de repérage au coin de chaque case. */}
              <span aria-hidden className="absolute -top-[5px] -left-[5px] z-10 text-[10px] leading-none text-fog">
                +
              </span>
              <button
                type="button"
                aria-expanded={expanded}
                aria-label={`${label}, agrandir`}
                onClick={() => setOpen(expanded ? null : i)}
                className="group absolute inset-0 grid place-items-center"
              >
                <span className="mono absolute top-2 left-2 text-[11px] text-fog">({String(i + 1).padStart(2, "0")})</span>
                <span
                  className={`stock-thumb relative block overflow-hidden transition-[width,height] duration-500 ease-[var(--ease-out)] ${expanded ? "size-full" : "size-[42%] group-hover:size-[52%]"}`}
                >
                  <Image src={`/photos/${photo}.jpg`} alt="" fill sizes="(min-width: 1024px) 240px, 33vw" className="object-cover" />
                </span>
                <span className={`mono absolute bottom-2 left-2 bg-ink px-1.5 py-0.5 text-[11px] text-paper uppercase transition-opacity duration-200 ${expanded ? "opacity-100" : "opacity-0"}`}>
                  {label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mx-auto grid max-w-[1440px] gap-6 px-4 pt-10 pb-6 sm:grid-cols-2 sm:px-6">
        <p className="display text-[26px] text-fog sm:text-[34px]">Moulu au Japon. Tamisé, fouetté, bu chez vous.</p>
        <p className="mono self-end text-fog sm:text-right">2 g de poudre · 60 ml d’eau à 80 °C · 15 secondes de fouet</p>
      </div>
      <div className="stock-logo mx-auto max-w-[1440px] px-4 pb-4 text-gunmetal sm:px-6">
        <Logo className="h-auto w-full opacity-90" />
      </div>
      <p className="mono mx-auto max-w-[1440px] px-4 pb-6 text-right text-[12px] text-fog sm:px-6">(défiler)</p>
    </section>
  );
}
