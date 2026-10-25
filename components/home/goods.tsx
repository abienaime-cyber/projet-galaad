"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/components/gsap";
import { Tag } from "@/components/tag";
import { useScene } from "@/components/three/use-scene";

export type Exhibit = { id: string; index: string; label: string; slug: string; name: string; price: string; image: string | null };

// Les ustensiles posés sur la table d'inspection, chacun avec son étiquette numérotée.
// Les étiquettes sont du HTML (liens accessibles au clavier), recalées sur l'objet 3D à chaque image.
export function Goods({ exhibits }: { exhibits: Exhibit[] }) {
  const section = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labels = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [active, setActive] = useState<string | null>(null);
  const activeRef = useRef<string | null>(null);

  const { state, invalidate } = useScene(
    canvasRef,
    ({ THREE, stage, mod, reduced, invalidate }) => {
      const { root, exhibits: pieces, layout } = mod.goodsScene();
      stage.scene.add(root);
      const projected = new THREE.Vector3();
      const lift = Object.fromEntries(pieces.map((p) => [p.id, 0]));

      const frame = () => {
        const narrow = stage.camera.aspect < 0.9;
        layout(narrow ? "narrow" : "wide");
        stage.frame(root, { elevation: narrow ? 50 : 40, azimuth: 0, margin: narrow ? 0.72 : 0.78 });
      };
      frame();

      // Entrée : les pièces tombent sur la table une à une quand la section arrive.
      const drop = { t: reduced ? 1 : 0 };
      if (!reduced) {
        ScrollTrigger.create({
          trigger: section.current,
          start: "top 70%",
          once: true,
          onEnter: () => gsap.to(drop, { t: 1, duration: 1.6, ease: "power2.out", onUpdate: invalidate }),
        });
      }

      return {
        frame: (dt) => {
          let moving = false;
          pieces.forEach((p, i) => {
            const local = Math.min(1, Math.max(0, drop.t * 1.6 - i * 0.09));
            // Chute puis petit rebond, comme un objet lâché.
            const fall = local < 1 ? 1 - Math.pow(1 - local, 3) : 1;
            const target = activeRef.current === p.id ? 0.12 : 0;
            lift[p.id] += (target - lift[p.id]) * (1 - Math.exp(-dt * 10));
            if (Math.abs(target - lift[p.id]) > 0.001) moving = true;
            p.object.position.y = p.rest.y + 1.6 * (1 - fall) + lift[p.id];
            p.object.visible = local > 0;
            const el = labels.current[p.id];
            if (el) {
              projected.copy(p.anchor).setY(p.anchor.y + p.object.position.y).project(stage.camera);
              const x = (projected.x * 0.5 + 0.5) * stage.renderer.domElement.clientWidth;
              const y = (-projected.y * 0.5 + 0.5) * stage.renderer.domElement.clientHeight;
              el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%)`;
              el.style.opacity = String(Math.min(1, Math.max(0, local * 2 - 1)));
            }
          });
          return moving || (drop.t > 0 && drop.t < 1);
        },
        resize: frame,
      };
    },
    { load: () => import("@/lib/three/scenes/showcase") },
  );

  const focus = (id: string | null) => {
    activeRef.current = id;
    setActive(id);
    invalidate();
  };

  return (
    <section ref={section} data-rail="Pièces" aria-labelledby="goods-title" className="grid lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="steel-light relative min-h-[620px] overflow-hidden lg:min-h-[760px]">
        <h2 id="goods-title" className="display absolute top-5 left-4 z-10 text-[56px] sm:left-6 sm:text-[80px]">
          Pièces saisies
        </h2>
        <p className="mono absolute top-7 left-1/2 z-10 -translate-x-1/2 text-[12px] text-fog max-md:hidden">(inspectez les étiquettes)</p>
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
        {/* Sans 3D, les étiquettes restent lisibles en liste, dans la colonne de droite. */}
        {state === "ready" &&
          exhibits.map((e) => (
            <Link
              key={e.id}
              href={`/produit/${e.slug}`}
              ref={(el) => {
                labels.current[e.id] = el;
              }}
              onPointerEnter={() => focus(e.id)}
              onPointerLeave={() => focus(null)}
              onFocus={() => focus(e.id)}
              onBlur={() => focus(null)}
              className="absolute top-0 left-0 z-10 opacity-0 transition-[filter] will-change-transform"
            >
              <Tag index={e.index} tone={active === e.id ? "matcha" : "light"}>
                {e.label}
              </Tag>
              {active === e.id && e.image && (
                <span className="absolute bottom-full left-0 mb-2 block w-40 bg-paper p-2 shadow-[0_12px_30px_rgb(0_0_0/0.18)]">
                  <Image src={e.image} alt="" width={160} height={160} className="aspect-square w-full object-contain" />
                  <span className="mono mt-1 block text-[12px]">{e.price}</span>
                </span>
              )}
            </Link>
          ))}
      </div>

      <aside data-theme="dark" className="bg-ink p-5 text-paper sm:p-6 lg:pr-10">
        <h3 className="display text-[44px]">Protocole d’assemblage</h3>
        <p className="mt-2 text-[16px] text-paper/70">Sept pièces pour un matcha fait maison. Les kits en réunissent quatre à neuf.</p>
        <ol className="mt-6 border-t border-line-dark">
          {exhibits.map((e) => (
            <li key={e.id}>
              <Link
                href={`/produit/${e.slug}`}
                onPointerEnter={() => focus(e.id)}
                onPointerLeave={() => focus(null)}
                className={`mono flex min-h-11 items-center justify-between gap-3 border-b border-line-dark text-[13px] uppercase transition-colors ${active === e.id ? "text-matcha" : "hover:text-matcha"}`}
              >
                <span>
                  {e.index}. {e.label}
                </span>
                <span className="text-fog-dark">{e.price}</span>
              </Link>
            </li>
          ))}
        </ol>
        <Link href="/boutique?rayon=ustensiles" className="mono mt-6 inline-flex min-h-11 items-center uppercase underline underline-offset-4 hover:text-matcha">
          Tous les ustensiles
        </Link>
      </aside>
    </section>
  );
}
