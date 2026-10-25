"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, MOTION_OK, PINNED_HEIGHT, pinStart, ScrollTrigger, useGSAP } from "@/components/gsap";
import { useScene } from "@/components/three/use-scene";

// Doses et gestes : méthode de la maison Ippodo (Kyoto).
export const PROTOCOL = [
  { title: "Tamiser", text: "2 g de matcha à travers le tamis, dans le bol." },
  { title: "Verser", text: "60 ml d’eau à 80 °C." },
  { title: "Fouetter", text: "15 secondes, vite." },
  { title: "Servir", text: "Tel quel. Pour un latte : 3 g de matcha, 100 ml d’eau et 100 ml de lait." },
];

// Le protocole épinglé : le défilement fait avancer la scène 3D, image par image, dans les deux sens.
export function Protocol() {
  const section = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progress = useRef(0);
  const [step, setStep] = useState(0);
  const [pinned, setPinned] = useState(true);

  const { state, invalidate } = useScene(
    canvasRef,
    ({ stage, mod }) => {
      const { root, apply } = mod.protocolScene();
      stage.scene.add(root);
      stage.scene.environmentIntensity = 0.45;
      stage.camera.fov = 30;
      // Projecteur au-dessus du bol, comme sur une table d'interrogatoire.
      stage.key.position.set(0.5, 6, 2.5);
      stage.key.intensity = 2.6;
      let shown = -1;
      return {
        frame: () => {
          if (shown === progress.current) return false;
          shown = progress.current;
          apply(shown, stage.camera);
          stage.camera.updateProjectionMatrix();
          return false;
        },
        // Nouveau format d'écran : recadrer à la prochaine image.
        resize: () => {
          shown = -1;
        },
      };
    },
    { shadow: 0, load: () => import("@/lib/three/scenes/protocol") },
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        setPinned(true);
        ScrollTrigger.create({
          trigger: section.current,
          start: pinStart,
          end: "+=320%",
          pin: true,
          scrub: 0.6,
          onUpdate: (self) => {
            progress.current = self.progress;
            setStep(Math.min(PROTOCOL.length - 1, Math.floor(self.progress * PROTOCOL.length)));
            invalidate();
          },
        });
      });
      // Mouvement réduit : pas d'épinglage, les quatre étapes à plat avec leur image fixe.
      mm.add("(prefers-reduced-motion: reduce)", () => setPinned(false));
      return () => mm.revert();
    },
    { scope: section },
  );

  if (!pinned || state === "fallback") {
    return (
      <section data-theme="dark" data-rail="Protocole" aria-labelledby="protocol-title" className="bg-ink px-4 py-16 text-paper sm:px-6">
        <h2 id="protocol-title" className="display text-[56px] sm:text-[80px]">
          Protocole de préparation
        </h2>
        <ol className="mt-8 grid gap-px sm:grid-cols-2 lg:grid-cols-4">
          {PROTOCOL.map((s, i) => (
            <li key={s.title} className="bg-ink-2 p-5">
              <Image src={`/renders/protocole-${i + 1}.png`} alt="" width={600} height={400} className="w-full" />
              <p className="mono mt-4 text-fog-dark">Étape {String(i + 1).padStart(2, "0")}</p>
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
    <section ref={section} data-theme="dark" data-rail="Protocole" aria-labelledby="protocol-title" className="relative overflow-hidden bg-ink text-paper" style={{ height: PINNED_HEIGHT }}>
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
      <h2 id="protocol-title" className="display absolute top-5 left-4 text-[44px] sm:left-6 sm:text-[64px]">
        Protocole de préparation
      </h2>
      <ol aria-label="Étapes" className="absolute top-6 right-4 flex flex-col gap-1.5 sm:right-6">
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
      <ol className="absolute inset-x-4 bottom-8 grid text-center sm:bottom-12">
        {PROTOCOL.map((s, i) => (
          <li key={s.title} aria-hidden={i !== step} className={`col-start-1 row-start-1 transition-[opacity,translate] duration-500 ease-out ${i === step ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
            <p className="mono text-[15px] uppercase">Étape {String(i + 1).padStart(2, "0")}</p>
            <p className="mono text-[22px] uppercase">{s.title}</p>
            <p className="mx-auto mt-3 max-w-[26rem] text-[16px] text-paper/75">{s.text}</p>
          </li>
        ))}
      </ol>
      <p className="mono absolute right-4 bottom-3 text-[11px] text-fog-dark sm:right-6">Méthode Ippodo, Kyoto</p>
    </section>
  );
}
