"use client";

import { useRef, useState } from "react";
import { gsap, MOTION_OK, PINNED_HEIGHT, pinStart, ScrollTrigger, useGSAP } from "@/components/gsap";
import { useScene } from "@/components/three/use-scene";

// Faits sourcés : AFP (26 juin 2025) pour la culture et la fabrication, Ippodo pour les doses.
const STAGES = [
  { title: "Feuilles à l’ombre", text: "Les théiers sont cultivés à l’ombre pendant les dernières semaines avant la récolte." },
  { title: "Tencha", text: "Ces feuilles cultivées à l’ombre s’appellent tencha." },
  { title: "La meule", text: "Elles sont moulues en poudre. Il faut jusqu’à une heure pour produire 40 g de matcha." },
  { title: "La boîte", text: "30 g chez nous : 15 matchas purs ou 10 lattes, aux doses d’Ippodo." },
];

// La feuille devient brisures, puis poudre autour de la meule, puis boîte. Épinglé, piloté par le défilement.
export function Chain() {
  const section = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progress = useRef(0);
  const [stage, setStage] = useState(0);
  const [pinned, setPinned] = useState(true);

  const { invalidate } = useScene(
    canvasRef,
    ({ stage: s, mod, reduced }) => {
      const { root, apply } = mod.chainScene();
      s.scene.add(root);
      s.camera.fov = 32;
      if (reduced) progress.current = 1;
      let shown = -1;
      return {
        frame: () => {
          if (shown === progress.current) return false;
          shown = progress.current;
          apply(shown, s.camera);
          s.camera.updateProjectionMatrix();
          return false;
        },
        // Nouveau format d'écran : recadrer à la prochaine image.
        resize: () => {
          shown = -1;
        },
      };
    },
    { shadow: 0.18, load: () => import("@/lib/three/scenes/chain") },
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        setPinned(true);
        ScrollTrigger.create({
          trigger: section.current,
          start: pinStart,
          end: "+=280%",
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            progress.current = self.progress;
            setStage(Math.min(STAGES.length - 1, Math.round(self.progress * (STAGES.length - 1))));
            invalidate();
          },
        });
      });
      mm.add("(prefers-reduced-motion: reduce)", () => setPinned(false));
      return () => mm.revert();
    },
    { scope: section },
  );

  return (
    <section ref={section} data-rail="Fabrication" aria-labelledby="chain-title" className={`relative overflow-hidden bg-paper ${pinned ? "" : "pb-16"}`} style={pinned ? { height: PINNED_HEIGHT } : undefined}>
      <h2 id="chain-title" className="display relative z-10 flex justify-between gap-3 px-4 pt-5 text-[13vw] leading-[0.85] text-fog sm:px-6 lg:text-[9vw] xl:text-[136px]">
        <span>La</span> <span>chaîne</span> <span>du matcha.</span>
      </h2>
      {pinned && <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />}
      <ol className={`z-10 grid gap-1 px-4 sm:px-6 ${pinned ? "absolute top-1/2 left-0 w-64 -translate-y-1/2 max-md:hidden" : "mt-10 md:grid-cols-4 md:gap-6"}`}>
        {STAGES.map((s, i) => (
          <li key={s.title} aria-current={pinned && i === stage ? "step" : undefined} className={`grid grid-cols-[2.25rem_minmax(0,1fr)] py-1 transition-colors duration-300 ${!pinned || i === stage ? "text-ink" : "text-fog/60"}`}>
            <span className="mono">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <span className="mono uppercase">{s.title}</span>
              {!pinned && <span className="mt-1 block text-[16px] text-fog">{s.text}</span>}
            </span>
          </li>
        ))}
      </ol>
      {pinned && (
        <div aria-live="polite" className="absolute inset-x-4 bottom-10 z-10 sm:right-6 sm:left-auto sm:w-[22rem]">
          <p className="display text-[40px]">{STAGES[stage].title}</p>
          <p className="mt-1 text-[16px] text-fog">{STAGES[stage].text}</p>
        </div>
      )}
      <p className={`mono z-10 px-4 text-[11px] text-fog sm:px-6 ${pinned ? "absolute bottom-3 left-0" : "mt-8"}`}>Sources : AFP, 26 juin 2025 ; Ippodo, Kyoto.</p>
    </section>
  );
}
