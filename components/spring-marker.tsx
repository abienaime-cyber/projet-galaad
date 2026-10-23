"use client";

import { useLayoutEffect, useRef, useState } from "react";

// Ressort à amortissement critique (1,0) et réponse de 0,4 s, les réglages d'Apple pour un déplacement.
// À chaque nouvelle valeur, le repère repart de sa position et de sa vitesse actuelles : pas d'à-coup.
const OMEGA = (2 * Math.PI) / 0.4;

export function SpringMarker({ to, className, children }: { to: number; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const motion = useRef({ x: to, v: 0, frame: 0 });
  // Le style React reste figé sur la valeur initiale : c'est le ressort qui écrit la position ensuite.
  const [initial] = useState(to);

  useLayoutEffect(() => {
    const el = ref.current;
    const s = motion.current;
    if (!el) return;
    const place = (x: number) => {
      el.style.transform = `translateX(${x}%)`;
    };

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      Object.assign(s, { x: to, v: 0 });
      place(to);
      return;
    }

    const x0 = s.x - to;
    const v0 = s.v;
    const b = v0 + OMEGA * x0;
    const start = performance.now();
    const step = (now: number) => {
      const t = (now - start) / 1000;
      const decay = Math.exp(-OMEGA * t);
      s.x = to + (x0 + b * t) * decay;
      s.v = (v0 - OMEGA * b * t) * decay;
      if (Math.abs(s.x - to) < 0.01 && Math.abs(s.v) < 0.01) {
        Object.assign(s, { x: to, v: 0 });
      } else {
        s.frame = requestAnimationFrame(step);
      }
      place(s.x);
    };
    s.frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(s.frame);
  }, [to]);

  return (
    <div ref={ref} aria-hidden className={className} style={{ transform: `translateX(${initial}%)` }}>
      {children}
    </div>
  );
}
