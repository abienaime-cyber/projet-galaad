"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ghostButton, primaryButton } from "@/components/field";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/components/gsap";
import { Powder } from "@/components/powder";

const CLOCKS = [
  { city: "Kyoto, Japon", zone: "Asia/Tokyo" },
  { city: "Paris, France", zone: "Europe/Paris" },
];

// Heure locale d'une ville et son décalage, calculés par le navigateur.
function useClock(zone: string) {
  const [now, setNow] = useState<string | null>(null);
  useEffect(() => {
    const format = new Intl.DateTimeFormat("fr-FR", { timeZone: zone, hour: "2-digit", minute: "2-digit", timeZoneName: "shortOffset" });
    const tick = () => setNow(format.format(new Date()).replace("UTC", "GMT"));
    tick();
    const id = setInterval(tick, 20_000);
    return () => clearInterval(id);
  }, [zone]);
  return now ?? "--:-- GMT";
}

function Clock({ city, zone }: { city: string; zone: string }) {
  const time = useClock(zone);
  return (
    <p className="mono flex flex-col gap-1 text-[12px] uppercase">
      <span aria-hidden className="size-2 bg-gunmetal" />
      <span>{city}</span>
      <span className="text-fog-dark">{time}</span>
    </p>
  );
}

type Props = { kitName: string; kitSlug: string; kitPrice: string };

// L'arrivée : fond noir, une vraie poudre de matcha qu'on touche, le titre et le kit.
export function Hero({ kitName, kitSlug, kitPrice }: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(".hero-title", { type: "lines", mask: "lines" });
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from(split.lines, { yPercent: 105, duration: 1.1, stagger: 0.09, delay: 0.5 })
          .from(".hero-fade", { y: 14, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, "-=0.7");
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-rail="Poudre" aria-labelledby="hero-title" data-theme="dark" className="relative isolate flex min-h-[calc(100svh-var(--header-h))] flex-col overflow-hidden bg-ink text-paper">
      <div className="relative z-10 mx-auto grid w-full max-w-[1440px] grid-cols-3 gap-4 px-4 pt-4 sm:px-6">
        {CLOCKS.map((c) => (
          <Clock key={c.zone} {...c} />
        ))}
        <p className="mono flex flex-col items-end gap-1 text-right text-[12px] uppercase">
          <span aria-hidden className="size-2 bg-matcha" />
          <span>Chez vous</span>
          <span className="text-matcha">maintenant</span>
        </p>
      </div>

      <Powder src="/photos/tin-quotidien.jpg" shape="tas" light className="absolute inset-x-0 top-[9%] -z-10 h-[58%] w-full touch-pan-y sm:inset-0 sm:h-full lg:left-[34%] lg:w-[66%]" />
      <p aria-hidden className="mono pointer-events-none absolute top-1/2 right-10 hidden -translate-y-1/2 text-[12px] text-fog-dark sm:block">
        (défiler)
      </p>

      <div className="pointer-events-none relative z-10 mx-auto mt-auto w-full max-w-[1440px] px-4 pb-6 sm:px-6 sm:pb-8">
        <p aria-hidden className="mono hero-fade mb-3 text-[12px] text-fog-dark">
          (touchez la poudre)
        </p>
        <h1 id="hero-title" className="hero-title display max-w-[13ch] text-[52px] sm:text-[88px] lg:text-[118px]">
          Le matcha du coffee shop, <span className="text-matcha">fouetté chez vous.</span>
        </h1>
        <div className="hero-fade pointer-events-auto mt-6 flex flex-wrap items-center gap-2">
          <Link href={`/produit/${kitSlug}`} className={`${primaryButton} whitespace-nowrap`}>
            {kitName} · {kitPrice}
          </Link>
          <Link href="/boutique" className={ghostButton}>
            Les 4 kits
          </Link>
        </div>
      </div>
    </section>
  );
}
