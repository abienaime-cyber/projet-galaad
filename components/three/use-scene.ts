"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type * as THREE_NS from "three";
import type * as Models from "@/lib/three/models";
import type { Stage } from "@/lib/three/stage";

// mod : le module de scène demandé par options.load (protocole, chaîne…), chargé avec Three.
export type SceneKit<T = undefined> = { THREE: typeof THREE_NS; stage: Stage; models: typeof Models; mod: T; reduced: boolean; invalidate: () => void };

// frame() renvoie true tant qu'il reste du mouvement : la boucle s'arrête d'elle-même ensuite.
export type SceneHandle = { frame?: (dt: number, time: number) => boolean; dispose?: () => void; resize?: () => void };

export type SceneState = "idle" | "ready" | "fallback";

// Monte une scène Three.js sur un canvas : Three n'est chargé que quand le canvas approche de l'écran,
// la boucle de rendu tourne seulement s'il est visible, et s'arrête quand plus rien ne bouge.
type Options<T> = { shadow?: number; exposure?: number; load?: () => Promise<T> };

export function useScene<T = undefined>(canvasRef: RefObject<HTMLCanvasElement | null>, setup: (kit: SceneKit<T>) => SceneHandle | void, options: Options<T> = {}) {
  const [state, setState] = useState<SceneState>("idle");
  const setupRef = useRef(setup);
  const invalidateRef = useRef<() => void>(() => {});
  const optionsRef = useRef(options);

  useEffect(() => {
    setupRef.current = setup;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let disposed = false;
    let teardown = () => {};

    const start = async () => {
      const [THREE, { createStage, webglAvailable }, models, { FONTS }, mod] = await Promise.all([
        import("three"),
        import("@/lib/three/stage"),
        import("@/lib/three/models"),
        import("@/lib/three/materials"),
        optionsRef.current.load?.() as Promise<T>,
        document.fonts.ready,
      ]);
      if (disposed) return;
      // Les textures écrites (étiquettes, plaque) prennent les polices chargées par next/font.
      const css = getComputedStyle(document.documentElement);
      FONTS.display = css.getPropertyValue("--font-barlow-condensed") || FONTS.display;
      FONTS.mono = css.getPropertyValue("--font-fragment-mono") || FONTS.mono;
      if (!webglAvailable()) {
        setState("fallback");
        return;
      }
      const stage = createStage(canvas, { shadow: optionsRef.current.shadow ?? 0.28, exposure: optionsRef.current.exposure ?? 1 });
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      let visible = true;
      let raf = 0;
      let last = performance.now();
      let handle: SceneHandle = {};

      const loop = (now: number) => {
        raf = 0;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        const more = handle.frame?.(dt, now / 1000) ?? false;
        stage.render();
        if (more && visible) raf = requestAnimationFrame(loop);
      };
      const invalidate = () => {
        if (!raf && visible) {
          last = performance.now();
          raf = requestAnimationFrame(loop);
        }
      };
      invalidateRef.current = invalidate;
      handle = setupRef.current({ THREE, stage, models, mod, reduced, invalidate }) ?? {};

      const resizer = new ResizeObserver(() => {
        stage.resize();
        handle.resize?.();
        invalidate();
      });
      resizer.observe(canvas);
      const watcher = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible) invalidate();
      });
      watcher.observe(canvas);
      setState("ready");
      invalidate();

      teardown = () => {
        cancelAnimationFrame(raf);
        resizer.disconnect();
        watcher.disconnect();
        handle.dispose?.();
        stage.dispose();
      };
    };

    // Chargement paresseux : rien n'est téléchargé tant que la scène est loin de l'écran.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        start().catch(() => setState("fallback"));
      },
      { rootMargin: "600px 0px" },
    );
    near.observe(canvas);
    return () => {
      disposed = true;
      near.disconnect();
      teardown();
    };
  }, [canvasRef]);

  return { state, invalidate: () => invalidateRef.current() };
}
