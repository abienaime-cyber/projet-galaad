"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, MOTION_OK, PINNED_HEIGHT, pinStart, useGSAP } from "@/components/gsap";
import { Powder } from "@/components/powder";

const STAGES = [
  { title: "Feuille", text: "Ces feuilles cultivées à l’ombre s’appellent tencha." },
  { title: "Mouture", text: "Elles sont moulues en poudre. Touchez-la." },
  { title: "Boîte", text: "La poudre craint l’air et la lumière : elle voyage en boîte fermée." },
];

// La chaîne du matcha, épinglée : la feuille se referme, se défait en poudre (qu'on peut toucher), puis la boîte s'ouvre.
export function Chain() {
  const section = useRef<HTMLElement>(null);
  const [stage, setStage] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.set(".chain-powder", { autoAlpha: 0 });
        gsap.set(".chain-tin", { clipPath: "circle(0% at 50% 50%)" });
        gsap
          .timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: section.current,
              start: pinStart,
              end: "+=240%",
              pin: true,
              scrub: 0.6,
              onUpdate: (self) => setStage(Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length))),
            },
          })
          .to(".chain-leaf", { scale: 1.08, duration: 0.6, ease: "none" })
          .to(".chain-leaf", { clipPath: "circle(0% at 50% 50%)", rotate: 25, duration: 0.5 })
          .to(".chain-powder", { autoAlpha: 1, duration: 0.3 }, "<0.2")
          .to({}, { duration: 0.6 })
          .to(".chain-powder", { autoAlpha: 0, scale: 0.6, duration: 0.4 })
          .to(".chain-tin", { clipPath: "circle(42% at 50% 50%)", duration: 0.6 }, "<0.1")
          .to(".chain-tin", { scale: 1.06, duration: 0.5, ease: "none" });
      });
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} data-rail="Chaîne" aria-labelledby="chain-title" className="relative overflow-hidden bg-paper" style={{ minHeight: PINNED_HEIGHT }}>
      <h2 id="chain-title" className="display grid grid-cols-3 px-4 pt-4 text-[34px] text-iron sm:px-6 sm:text-[64px]">
        <span>Feuille.</span>
        <span className="text-center">Poudre.</span>
        <span className="text-right">Boîte.</span>
      </h2>

      <div className="relative mx-auto mt-4 aspect-square w-[min(78vw,58svh)]">
        <div className="chain-leaf absolute inset-0 [clip-path:circle(42%_at_50%_50%)]">
          <Image src="/photos/chain-leaf.jpg" alt="Feuilles de thé sur le théier" fill sizes="(min-width: 768px) 58svh, 78vw" className="object-cover" />
        </div>
        <Powder src="/photos/tin-quotidien.jpg" shape="tas" light className="chain-powder absolute -inset-[15%] size-[130%] touch-pan-y" />
        <div className="chain-tin absolute inset-0 [clip-path:circle(42%_at_50%_50%)]">
          <Image src="/photos/chain-tin.jpg" alt="Boîte de matcha ouverte, vue de dessus" fill sizes="(min-width: 768px) 58svh, 78vw" className="object-cover" />
        </div>
      </div>

      <ol className="mono absolute top-1/2 left-4 hidden -translate-y-1/2 flex-col gap-2 text-[12px] uppercase sm:flex sm:left-6">
        {STAGES.map((s, i) => (
          <li key={s.title} className={`flex items-center gap-2 transition-colors ${i === stage ? "text-ink" : "text-steel-3"}`}>
            <span aria-hidden className={`size-1.5 ${i === stage ? "bg-matcha" : "bg-steel-2"}`} />
            {String(i + 1).padStart(2, "0")} {s.title}
          </li>
        ))}
      </ol>

      <div className="mx-auto grid max-w-[34rem] px-4 pt-4 pb-8 text-center sm:absolute sm:right-6 sm:bottom-10 sm:max-w-[20rem] sm:px-0 sm:text-left">
        {STAGES.map((s, i) => (
          <p key={s.title} aria-hidden={i !== stage} className={`col-start-1 row-start-1 transition-[opacity,translate] duration-500 ${i === stage ? "opacity-100" : "translate-y-2 opacity-0"}`}>
            <span className="mono block text-[12px] text-fog uppercase">
              {String(i + 1).padStart(2, "0")} / {s.title}
            </span>
            <span className="mt-1 block text-[17px]">{s.text}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
