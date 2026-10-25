"use client";

import Link from "next/link";
import { useActionState, useRef } from "react";
import { addToCart, type AddState } from "@/app/panier/actions";
import { primaryButton, textLink } from "@/components/field";
import { gsap, ScrollTrigger } from "@/components/gsap";
import { Spinner } from "@/components/spinner";
import { Tag } from "@/components/tag";
import { useScene } from "@/components/three/use-scene";

export type VaultPiece = { index: string; label: string; slug: string };

type Props = { name: string; slug: string; variantId: string | null; price: string; separate: string | null; pieces: VaultPiece[]; description: string };

// Le Coffre : la valise s'ouvre au défilement, les pièces portent leur étiquette.
export function Vault({ name, slug, variantId, price, separate, pieces, description }: Props) {
  const section = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labels = useRef<(HTMLAnchorElement | null)[]>([]);
  const [state, action, pending] = useActionState<AddState, FormData>(addToCart, {});

  const { state: scene } = useScene(
    canvasRef,
    ({ THREE, stage, mod, reduced, invalidate }) => {
      const { root, anchors, open } = mod.vaultScene();
      stage.scene.add(root);
      const fit = () => stage.frame(root, { elevation: stage.camera.aspect < 1 ? 62 : 50, azimuth: 0, margin: stage.camera.aspect < 1 ? 0.85 : 0.98 });
      fit();
      const lid = { t: reduced ? 1 : 0 };
      const trigger = reduced
        ? null
        : ScrollTrigger.create({
            trigger: section.current,
            start: "top 75%",
            end: "top 10%",
            scrub: 0.6,
            onUpdate: (self) => {
              lid.t = self.progress;
              invalidate();
            },
          });
      const projected = new THREE.Vector3();
      return {
        frame: () => {
          open(gsap.parseEase("power2.inOut")(lid.t));
          anchors.forEach((anchor, i) => {
            const el = labels.current[i];
            if (!el) return;
            projected.copy(anchor).project(stage.camera);
            const x = (projected.x * 0.5 + 0.5) * stage.renderer.domElement.clientWidth;
            const y = (-projected.y * 0.5 + 0.5) * stage.renderer.domElement.clientHeight;
            el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -100%)`;
            el.style.opacity = String(Math.min(1, Math.max(0, lid.t * 3 - 1.6 - i * 0.06)));
          });
          return false;
        },
        resize: fit,
        dispose: () => trigger?.kill(),
      };
    },
    { load: () => import("@/lib/three/scenes/showcase") },
  );

  return (
    <section ref={section} data-rail="Coffre" aria-labelledby="vault-title" className="steel-light relative grid min-h-svh lg:grid-cols-[minmax(0,1fr)_24rem]">
      <div className="relative min-h-[560px]">
        <h2 id="vault-title" className="display absolute inset-x-4 top-5 z-10 flex justify-between text-[18vw] leading-[0.82] sm:inset-x-6 lg:text-[10vw] xl:text-[150px]">
          <span>Le</span> <span>Coffre</span>
        </h2>
        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
        {scene === "ready" &&
          pieces.map((p, i) => (
            <Link
              key={p.slug + i}
              href={`/produit/${p.slug}`}
              ref={(el) => {
                labels.current[i] = el;
              }}
              className="absolute top-0 left-0 z-10 opacity-0 will-change-transform"
            >
              <Tag index={p.index}>{p.label}</Tag>
            </Link>
          ))}
        <p className="mono absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-[12px] text-fog">(cliquez sur les étiquettes)</p>
      </div>

      <aside className="flex flex-col justify-end gap-5 p-5 sm:p-6 lg:pb-12">
        <p className="mono text-fog uppercase">{pieces.length} pièces · valise aluminium</p>
        <h3 className="display text-[56px]">{name}</h3>
        <p className="text-[17px]">{description}</p>
        <p className="mono text-[15px]">
          {price}
          {separate && <span className="text-fog"> · {separate} pièce par pièce</span>}
        </p>
        <form action={action} className="grid gap-2">
          {variantId && <input type="hidden" name="variant_id" value={variantId} />}
          <input type="hidden" name="slug" value={slug} />
          <button type="submit" disabled={pending || !variantId} className={`${primaryButton} w-full`}>
            {pending && <Spinner />}
            {variantId ? `Ouvrir le coffre · ${price}` : "Épuisé"}
          </button>
          <p aria-live="polite" className="min-h-6 text-[15px]">
            {state.added && (
              <>
                <span className="font-medium text-matcha-ink">Ajouté au panier.</span>{" "}
                <Link href="/panier" className="underline underline-offset-4">
                  Voir le panier
                </Link>
              </>
            )}
            {state.error && <span className="text-danger">{state.error}</span>}
          </p>
        </form>
        <Link href={`/produit/${slug}`} className={textLink}>
          Le détail du coffre
        </Link>
      </aside>
    </section>
  );
}
