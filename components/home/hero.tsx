"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ghostButton, primaryButton } from "@/components/field";
import { gsap, MOTION_OK, SplitText, useGSAP } from "@/components/gsap";
import { useScene } from "@/components/three/use-scene";

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
      <span aria-hidden className="size-2 bg-steel-3" />
      <span>{city}</span>
      <span className="text-fog-dark">{time}</span>
    </p>
  );
}

type Props = { kitName: string; kitSlug: string; kitPrice: string; cupPrice: string };

export function Hero({ kitName, kitSlug, kitPrice, cupPrice }: Props) {
  const root = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // La plaque d'acier : elle monte à l'arrivée, puis s'incline vers le pointeur et flotte doucement.
  const { state: scene } = useScene(
    canvasRef,
    ({ THREE, stage, mod, reduced, invalidate }) => {
      const { root: plate } = mod.plateScene();
      stage.scene.add(plate);
      stage.ground.visible = false;
      stage.scene.environmentIntensity = 1.1;
      const light = new THREE.PointLight("#ffffff", 6, 8);
      light.position.set(0, 0, 2);
      stage.scene.add(light);
      const fit = () => {
        const aspect = stage.camera.aspect;
        stage.camera.fov = 30;
        const fitWidth = 3.6 / (2 * Math.tan(THREE.MathUtils.degToRad(15)) * aspect);
        const fitHeight = 1.7 / (2 * Math.tan(THREE.MathUtils.degToRad(15)));
        stage.camera.position.set(0, 0, Math.max(fitWidth, fitHeight));
        stage.camera.lookAt(0, 0, 0);
        stage.camera.updateProjectionMatrix();
      };
      fit();

      const intro = { t: reduced ? 1 : 0 };
      if (!reduced) gsap.to(intro, { t: 1, duration: 1.8, ease: "expo.out", delay: 0.15, onUpdate: invalidate });
      const pointer = { x: 0, y: 0 };
      const tilt = { x: 0, y: 0 };
      const section = root.current!;
      const move = (e: PointerEvent) => {
        const box = section.getBoundingClientRect();
        pointer.x = ((e.clientX - box.left) / box.width) * 2 - 1;
        pointer.y = ((e.clientY - box.top) / box.height) * 2 - 1;
        invalidate();
      };
      if (!reduced) section.addEventListener("pointermove", move);

      return {
        frame: (dt, time) => {
          // Rapprochement exponentiel vers la cible : l'inclinaison suit le pointeur sans à-coup.
          const k = 1 - Math.exp(-dt * 5);
          tilt.x += (pointer.y * 0.22 - tilt.x) * k;
          tilt.y += (pointer.x * 0.35 - tilt.y) * k;
          const t = intro.t;
          const float = reduced ? 0 : Math.sin(time * 0.8) * 0.04;
          plate.position.y = -1.4 * (1 - t) + float;
          plate.rotation.set(tilt.x + 0.9 * (1 - t), tilt.y - 0.5 * (1 - t), 0);
          plate.scale.setScalar(0.85 + 0.15 * t);
          light.position.set(pointer.x * 2.2, -pointer.y * 1.2, 2);
          return !reduced;
        },
        resize: fit,
        dispose: () => section.removeEventListener("pointermove", move),
      };
    },
    { shadow: 0, exposure: 1.05, load: () => import("@/lib/three/scenes/showcase") },
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(".hero-title", { type: "lines", mask: "lines" });
        gsap.timeline({ delay: 0.5 })
          .from(split.lines, { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.09 })
          .from(".hero-fade", { y: 14, duration: 0.7, ease: "expo.out", stagger: 0.08 }, "-=0.6");
        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-theme="dark" data-rail="Plaque" aria-labelledby="hero-title" className="relative flex min-h-[calc(100svh-3.5rem)] flex-col overflow-hidden bg-ink text-paper max-md:min-h-[calc(100svh-6rem)]">
      <div className="grid grid-cols-3 gap-4 px-4 pt-5 sm:px-6">
        {CLOCKS.map((c) => (
          <Clock key={c.zone} {...c} />
        ))}
        <p className="mono flex flex-col gap-1 text-[12px] uppercase">
          <span aria-hidden className="size-2 bg-matcha" />
          <span>Votre cuisine</span>
          <span className="text-matcha">Maintenant</span>
        </p>
      </div>

      <div className="relative min-h-[34vh] flex-1">
        <canvas ref={canvasRef} aria-hidden className={`absolute inset-0 size-full transition-opacity duration-700 ${scene === "ready" ? "opacity-100" : "opacity-0"}`} />
        {scene === "fallback" && <p className="display absolute inset-0 grid place-items-center text-[18vw] text-steel-3">Contrebande</p>}
      </div>

      <div className="relative z-10 grid gap-6 px-4 pb-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:pb-10">
        <h1 id="hero-title" className="hero-title display text-[15vw] leading-[0.86] sm:text-[11vw] lg:text-[8.6vw] xl:text-[128px]">
          Le matcha du coffee shop. <span className="text-matcha">Chez vous.</span>
        </h1>
        <div className="grid gap-3 lg:w-[25rem] lg:justify-items-start">
          <p className="hero-fade text-[17px] text-paper/80">
            Le fouet, la cuillère, le tamis et une boîte de matcha. La tasse revient à <span className="mono text-paper">{cupPrice}</span>, doses Ippodo.
          </p>
          <div className="hero-fade flex w-full flex-wrap gap-2">
            <Link href={`/produit/${kitSlug}`} className={`${primaryButton} flex-1 whitespace-nowrap`}>
              <span aria-hidden className="size-2 bg-ink" />
              Voir le {kitName} · {kitPrice}
            </Link>
            <Link href="/boutique?rayon=kits" className={`${ghostButton} flex-1 whitespace-nowrap`}>
              Les 4 kits
            </Link>
          </div>
          <Link href="/compte/profil" className="hero-fade text-[15px] text-paper/70 underline underline-offset-4 hover:text-paper">
            Pas sûr du kit ? Faites votre profil de goût.
          </Link>
        </div>
      </div>

      <p aria-hidden className="mono absolute top-1/2 left-4 text-[12px] text-fog-dark max-sm:hidden">
        (défiler)
      </p>
      <p aria-hidden className="mono absolute top-1/2 right-10 text-[12px] text-fog-dark max-sm:hidden">
        (défiler)
      </p>
    </section>
  );
}
