"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/components/gsap";

export type Piece = { index: string; label: string; slug: string; name: string; price: string; photo: string };

// Les pièces saisies : la photo de la pièce choisie à gauche, l'inventaire numéroté à droite sur le noir.
// Survoler ou toucher une ligne change la photo ; elle entre par un volet et un léger zoom.
export function Pieces({ pieces }: { pieces: Piece[] }) {
  const root = useRef<HTMLElement>(null);
  const [current, setCurrent] = useState(0);
  const piece = pieces[current];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(".piece-photo", { clipPath: "inset(0 0 100% 0)", scale: 1.12 }, { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 0.8, ease: "expo.out" });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [current] },
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(".piece-row", { x: 30, autoAlpha: 0, duration: 0.7, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  if (!piece) return null;
  return (
    <section ref={root} data-rail="Pièces" aria-labelledby="pieces-title" className="grid bg-steel lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-[1fr_minmax(320px,30%)]">
      <div className="steel-light relative flex min-h-[62svh] flex-col p-4 sm:p-6">
        <h2 id="pieces-title" className="display relative z-10 text-[44px] text-paper mix-blend-difference sm:text-[64px]">
          Pièces saisies
        </h2>
        <p className="mono relative z-10 mt-1 text-[12px] text-fog">(inspectez les étiquettes)</p>
        <figure className="relative mx-auto mt-6 w-full max-w-[520px] flex-1">
          {/* Cadre de visée : quatre coins, comme sur une fiche d'inventaire. */}
          <span aria-hidden className="corners pointer-events-none absolute -inset-3 z-10" />
          <div className="piece-photo relative aspect-[4/5] overflow-hidden bg-ink">
            <Image key={piece.photo} src={piece.photo} alt={piece.name} fill sizes="(min-width: 1024px) 520px, 92vw" className="object-cover" />
          </div>
          <figcaption className="mt-3 flex items-stretch">
            <span className="mono grid w-10 place-items-center bg-gunmetal text-[12px] text-ink">{piece.index}</span>
            <span className="mono flex flex-1 items-center bg-paper px-3 text-[13px] uppercase">{piece.name}</span>
            <Link href={`/produit/${piece.slug}`} className="mono inline-flex min-h-11 items-center bg-ink px-3 text-[13px] text-paper transition-colors hover:bg-matcha hover:text-ink">
              {piece.price} →
            </Link>
          </figcaption>
        </figure>
      </div>

      <div data-theme="dark" className="flex flex-col bg-ink p-4 text-paper sm:p-6">
        <p className="display text-[34px] sm:text-[44px]">Protocole d’assemblage</p>
        <ol className="mt-6 lg:mt-auto">
          {pieces.map((p, i) => (
            <li key={p.slug} className="piece-row">
              <button
                type="button"
                aria-pressed={i === current}
                onClick={() => setCurrent(i)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setCurrent(i)}
                className="mono flex min-h-11 w-full items-center gap-3 border-b border-line-dark text-left text-[13px] uppercase transition-colors aria-pressed:text-matcha"
              >
                <span className="text-fog-dark">{p.index}.</span>
                <span className="flex-1">{p.label}</span>
                <span aria-hidden className={`size-2.5 ${i === current ? "bg-matcha" : "shadow-[inset_0_0_0_1px_rgb(255_255_255/0.6)]"}`} />
              </button>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
