"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type * as THREE from "three";
import { useScene } from "./use-scene";

const VIEW = { elevation: 22, azimuth: 0, margin: 1.2 };

// Modèle 3D de l'article, à faire tourner au doigt ou à la souris.
// Le geste suit le doigt 1:1, puis l'objet garde la vitesse du lâcher et ralentit (inertie).
export function ProductViewer({ model, variant, image, name }: { model: string; variant?: string; image: string | null; name: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const swapRef = useRef<(variant?: string) => void>(() => {});

  const { state } = useScene(canvasRef, ({ THREE, stage, models, reduced, invalidate }) => {
    const pivot = new THREE.Group();
    stage.scene.add(pivot);
    let object: THREE.Object3D | null = null;

    const place = (v?: string) => {
      if (object) pivot.remove(object);
      object = models.buildModel(model, v);
      const box = new THREE.Box3().setFromObject(object);
      object.position.x -= (box.min.x + box.max.x) / 2;
      object.position.z -= (box.min.z + box.max.z) / 2;
      pivot.add(object);
      invalidate();
    };
    place(variant);
    stage.frame(pivot, VIEW);
    swapRef.current = place;

    let angle = 0.5;
    let velocity = reduced ? 0 : 0.25;
    let dragging = false;
    let lastX = 0;
    let lastT = 0;
    let idleAt = 0;
    const canvas = stage.renderer.domElement;

    const down = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      dragging = true;
      lastX = e.clientX;
      lastT = performance.now();
      velocity = 0;
      invalidate();
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dx = ((e.clientX - lastX) / canvas.clientWidth) * Math.PI * 1.6;
      angle += dx;
      // Vitesse lissée sur les derniers mouvements : c'est elle qui part au lâcher.
      velocity = 0.6 * velocity + 0.4 * (dx / Math.max((now - lastT) / 1000, 1 / 120));
      lastX = e.clientX;
      lastT = now;
      invalidate();
    };
    const up = () => {
      if (!dragging) return;
      dragging = false;
      if (performance.now() - lastT > 80) velocity = 0;
      idleAt = performance.now() + 2500;
      invalidate();
    };
    const key = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      velocity = (e.key === "ArrowLeft" ? -1 : 1) * 2.4;
      idleAt = performance.now() + 2500;
      invalidate();
    };
    const listeners = new AbortController();
    const { signal } = listeners;
    canvas.addEventListener("pointerdown", down, { signal });
    canvas.addEventListener("pointermove", move, { signal });
    canvas.addEventListener("pointerup", up, { signal });
    canvas.addEventListener("pointercancel", up, { signal });
    canvas.addEventListener("keydown", key, { signal });

    return {
      frame: (dt) => {
        if (!dragging) {
          angle += velocity * dt;
          // Décroissance exponentielle de la vitesse, puis reprise d'une rotation lente au repos.
          const idleSpin = reduced || performance.now() < idleAt ? 0 : 0.25;
          velocity = idleSpin + (velocity - idleSpin) * Math.exp(-dt * 2.2);
        }
        pivot.rotation.y = angle;
        return dragging || Math.abs(velocity) > 0.002;
      },
      resize: () => stage.frame(pivot, VIEW),
      dispose: () => listeners.abort(),
    };
  });

  useEffect(() => {
    swapRef.current(variant);
  }, [variant]);

  return (
    <div className="steel-light relative aspect-square w-full overflow-hidden">
      {/* Le rendu fixe s'affiche tant que la 3D charge, et reste si WebGL manque. */}
      {image && state !== "ready" && (
        <Image src={image} alt={`${name}, rendu 3D`} width={1200} height={1200} priority sizes="(min-width: 1024px) 50vw, 100vw" className="absolute inset-0 size-full object-contain p-6" />
      )}
      <canvas
        ref={canvasRef}
        tabIndex={state === "ready" ? 0 : -1}
        role="img"
        aria-label={`${name}, modèle 3D. Flèches gauche et droite pour le faire tourner.`}
        className={`absolute inset-0 size-full touch-pan-y transition-opacity duration-500 ${state === "ready" ? "cursor-grab opacity-100 active:cursor-grabbing" : "opacity-0"}`}
      />
      {state === "ready" && <p className="mono pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-[12px] text-fog">(faites tourner)</p>}
    </div>
  );
}
