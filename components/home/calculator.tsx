"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/components/gsap";
import { costPerCupCents, DOSE_G, type Drink } from "@/lib/reco";
import { price } from "@/lib/shop";
import { Smoke } from "./smoke";

const CAFE_CHOICES = [400, 500, 600, 700, 800];
const DAYS_PER_MONTH = 30;

type Props = {
  // Matcha Quotidien, plus petit format : la recharge de référence.
  refill: { name: string; priceCents: number; grams: number };
  kit: { name: string; slug: string; priceCents: number };
};

// Ce que coûte une tasse : le visiteur donne le prix de son coffee shop, le calcul fait le reste.
// Aucun prix de coffee shop n'est affiché comme un fait : tant qu'il n'a pas choisi, rien n'est comparé.
export function Calculator({ refill, kit }: Props) {
  const section = useRef<HTMLElement>(null);
  const [cafe, setCafe] = useState<number | null>(null);
  const [drink, setDrink] = useState<Exclude<Drink, "les_deux">>("latte");
  const home = costPerCupCents(refill.priceCents, refill.grams, drink);
  const gap = cafe === null ? null : cafe - home;

  // Le panneau vert remonte et s'élargit en recouvrant la section précédente (rideau au défilement).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ".curtain",
          { clipPath: "inset(18% 7% 0% 7%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: { trigger: section.current, start: "top bottom", end: "top 15%", scrub: true } },
        );
        gsap.from(".spread > *", { yPercent: 60, autoAlpha: 0, stagger: 0.08, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: section.current, start: "top 55%", once: true } });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} data-rail="Calcul" aria-labelledby="calc-title" className="relative bg-paper">
      <div className="curtain relative flex min-h-svh flex-col overflow-hidden bg-celadon text-ink">
        <Smoke className="absolute inset-0 size-full" />
        <h2 id="calc-title" className="spread display relative flex flex-wrap justify-between gap-x-4 px-4 pt-5 text-[15vw] sm:text-[17vw] leading-[0.82] sm:px-6 lg:text-[11vw] xl:text-[170px]">
          <span>Votre</span> <span>tasse</span> <span>maison.</span>
        </h2>

        <div data-theme="dark" className="relative mt-auto grid bg-ink/90 text-paper md:grid-cols-3">
          <div className="border-line-dark p-5 sm:p-6 md:border-r">
            <p className="mono text-matcha">01</p>
            <h3 className="display mt-1 text-[34px]">Au coffee shop</h3>
            <p className="mt-1 text-[15px] text-paper/70">Combien payez-vous votre matcha ?</p>
            <div role="radiogroup" aria-label="Prix de votre matcha en coffee shop" className="mt-4 flex flex-wrap gap-1.5">
              {CAFE_CHOICES.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={cafe === c}
                  onClick={() => setCafe(c)}
                  className="mono min-h-11 min-w-14 px-3 shadow-[inset_0_0_0_1px_rgb(35_49_40/0.5)] transition-colors hover:bg-paper/10 aria-checked:bg-matcha aria-checked:text-on-matcha aria-checked:shadow-none"
                >
                  {price(c)}
                </button>
              ))}
            </div>
          </div>

          <div className="border-line-dark p-5 sm:p-6 max-md:border-t md:border-r">
            <p className="mono text-matcha">02</p>
            <h3 className="display mt-1 text-[34px]">Chez vous</h3>
            <div role="radiogroup" aria-label="Façon de le boire" className="mt-2 flex gap-1.5">
              {(["pur", "latte"] as const).map((d) => (
                <button
                  key={d}
                  type="button"
                  role="radio"
                  aria-checked={drink === d}
                  onClick={() => setDrink(d)}
                  className="mono min-h-11 px-4 uppercase shadow-[inset_0_0_0_1px_rgb(35_49_40/0.5)] transition-colors hover:bg-paper/10 aria-checked:bg-paper aria-checked:text-ink aria-checked:shadow-none"
                >
                  {d}
                </button>
              ))}
            </div>
            <p className="mt-4 flex items-baseline gap-3">
              <span className="display text-[64px] leading-none">{price(home)}</span>
              <span className="mono text-fog-dark">la tasse</span>
            </p>
            <p className="mono mt-2 text-[12px] text-fog-dark">
              {refill.name}, {refill.grams} g à {price(refill.priceCents)}, {DOSE_G[drink]} g par tasse (Ippodo). Lait non compté.
            </p>
          </div>

          <div className="border-line-dark p-5 sm:p-6 max-md:border-t">
            <p className="mono text-matcha">03</p>
            <h3 className="display mt-1 text-[34px]">La différence</h3>
            {gap === null ? (
              <p className="mt-3 text-paper/70">Choisissez votre prix en 01 : l’écart par tasse et le remboursement du kit s’affichent ici.</p>
            ) : gap <= 0 ? (
              <p className="mt-3 text-paper/80">À ce prix, votre coffee shop est déjà moins cher que la tasse maison. Gardez-le.</p>
            ) : (
              <>
                <p className="mt-3 flex items-baseline gap-3">
                  <span className="display text-[64px] leading-none text-matcha">{price(gap)}</span>
                  <span className="mono text-fog-dark">de moins par tasse</span>
                </p>
                <p className="mt-2 text-[15px] text-paper/80">
                  Le {kit.name} à {price(kit.priceCents)} est remboursé après <span className="mono text-paper">{Math.ceil(kit.priceCents / gap)}</span> tasses. À une tasse par jour :{" "}
                  <span className="mono text-paper">{price(Math.round((gap * DAYS_PER_MONTH) / 100) * 100)}</span> de moins par mois.
                </p>
                <Link href={`/produit/${kit.slug}`} className="mono mt-3 inline-flex min-h-11 items-center uppercase underline underline-offset-4 hover:text-matcha">
                  Voir le {kit.name}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
