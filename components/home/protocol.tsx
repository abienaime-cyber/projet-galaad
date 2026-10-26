"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, MOTION_OK, PINNED_HEIGHT, pinStart, useGSAP } from "@/components/gsap";

// Doses et gestes : méthode de la maison Ippodo (Kyoto). Photos : la même série, même bol, même lumière.
export const PROTOCOL = [
  { title: "Tamiser", text: "2 g de matcha à travers le tamis, dans le bol.", photo: "/photos/step-1.jpg" },
  { title: "Verser", text: "60 ml d’eau à 80 °C.", photo: "/photos/step-2.jpg" },
  { title: "Fouetter", text: "15 secondes, vite.", photo: "/photos/step-3.jpg" },
  { title: "Servir", text: "Tel quel. Pour un latte : 3 g de matcha, 100 ml d’eau et 100 ml de lait.", photo: "/photos/step-4.jpg" },
];

const two = (i: number) => String(i + 1).padStart(2, "0");

// La préparation épinglée : le défilement fait passer d'une photo à l'autre, dans les deux sens.
// Chaque photo se fond dans le noir par ses bords ; la suivante arrive en zoom arrière, la précédente s'efface en avançant.
export function Protocol() {
  const section = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [pinned, setPinned] = useState(true);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        setPinned(true);
        const photos = gsap.utils.toArray<HTMLElement>(".step-photo");
        gsap.set(photos.slice(1), { autoAlpha: 0, scale: 1.15 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section.current,
            start: pinStart,
            end: "+=320%",
            pin: true,
            scrub: 0.6,
            onUpdate: (self) => setStep(Math.min(PROTOCOL.length - 1, Math.floor(self.progress * PROTOCOL.length))),
          },
        });
        // Une respiration par étape : la photo avance lentement, puis cède la place à la suivante.
        photos.forEach((photo, i) => {
          tl.to(photo, { scale: i ? 1 : 1.06, duration: 1 }, i);
          const next = photos[i + 1];
          if (next) tl.to(photo, { autoAlpha: 0, scale: 0.94, duration: 0.35 }, i + 0.65).to(next, { autoAlpha: 1, duration: 0.35 }, i + 0.65);
        });
      });
      // Mouvement réduit : pas d'épinglage, les quatre étapes à plat.
      mm.add("(prefers-reduced-motion: reduce)", () => setPinned(false));
      return () => mm.revert();
    },
    { scope: section },
  );

  if (!pinned) {
    return (
      <section data-theme="dark" data-rail="Préparation" aria-labelledby="protocol-title" className="bg-ink px-4 py-16 text-paper sm:px-6">
        <h2 id="protocol-title" className="display text-[56px] sm:text-[80px]">
          Préparation
        </h2>
        <ol className="mt-8 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {PROTOCOL.map((s, i) => (
            <li key={s.title} className="bg-ink-2 p-5">
              <Image src={s.photo} alt="" width={600} height={800} sizes="(min-width: 1024px) 25vw, 50vw" className="aspect-[3/4] w-full object-cover" />
              <p className="mono mt-4 text-fog-dark">Étape {two(i)}</p>
              <p className="display text-[32px]">{s.title}</p>
              <p className="mt-1 text-paper/75">{s.text}</p>
            </li>
          ))}
        </ol>
        <p className="mono mt-6 text-[12px] text-fog-dark">Doses et température : méthode Ippodo, Kyoto.</p>
      </section>
    );
  }

  return (
    <section ref={section} data-theme="dark" data-rail="Préparation" aria-labelledby="protocol-title" className="relative overflow-hidden bg-ink text-paper" style={{ height: PINNED_HEIGHT }}>
      <div aria-hidden className="absolute inset-x-0 top-[13%] bottom-[24%] overflow-hidden sm:top-[10%] sm:bottom-[25%]">
        {PROTOCOL.map((s, i) => (
          <div key={s.photo} className="step-photo absolute inset-0 will-change-transform">
            <Image
              src={s.photo}
              alt=""
              fill
              priority={i === 0}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-contain"
            />
          </div>
        ))}
      </div>
      <h2 id="protocol-title" className="display absolute top-4 left-4 text-[40px] sm:left-6 sm:text-[56px]">
        Préparation
      </h2>
      <ol aria-label="Étapes" className="absolute top-5 right-4 flex flex-col gap-1.5 sm:right-6">
        {PROTOCOL.map((s, i) => (
          <li key={s.title} aria-current={i === step ? "step" : undefined} className={`size-3 transition-colors duration-300 ${i <= step ? "bg-matcha" : "shadow-[inset_0_0_0_1px_var(--color-fog-dark)]"}`}>
            <span className="sr-only">{s.title}</span>
          </li>
        ))}
      </ol>
      <p aria-hidden className="mono absolute top-1/2 left-4 text-[12px] text-fog-dark max-sm:hidden">
        (défiler)
      </p>
      <p aria-hidden className="mono absolute top-1/2 right-10 text-[12px] text-fog-dark max-sm:hidden">
        (défiler)
      </p>
      <ol className="absolute inset-x-4 bottom-8 grid text-center sm:bottom-10">
        {PROTOCOL.map((s, i) => (
          <li key={s.title} aria-hidden={i !== step} className={`col-start-1 row-start-1 transition-[opacity,translate] duration-500 ease-out ${i === step ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
            <p className="mono text-[15px] uppercase">Étape {two(i)}</p>
            <p className="mono text-[22px] uppercase">{s.title}</p>
            <p className="mx-auto mt-2 max-w-[26rem] text-[16px] text-paper/75">{s.text}</p>
          </li>
        ))}
      </ol>
      <p className="mono absolute right-4 bottom-3 text-[11px] text-fog-dark sm:right-6">Méthode Ippodo, Kyoto</p>
    </section>
  );
}
