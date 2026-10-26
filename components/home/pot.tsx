"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { primaryButton } from "@/components/field";
import { gsap } from "@/components/gsap";

type Props = { name: string; slug: string; grams: number; price: string; dose: number };

type Puff = { x: number; y: number; vx: number; vy: number; life: number; size: number; color: string };

const GREENS = ["#a2df46", "#79a83d", "#5c7e2a", "#8fc24a", "#b4ea64"];

// Une bouffée : 260 grains partent du centre de la boîte dans toutes les directions, un peu vers le haut.
function puff(canvas: HTMLCanvasElement): Puff[] {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = canvas.clientWidth * dpr;
  canvas.height = canvas.clientHeight * dpr;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = Math.min(canvas.width, canvas.height) * 0.22;
  return Array.from({ length: 260 }, (_, i) => {
    const a = Math.random() * Math.PI * 2;
    const speed = (2 + Math.random() * 9) * dpr;
    return {
      x: cx + Math.cos(a) * r * Math.random(),
      y: cy + Math.sin(a) * r * Math.random(),
      vx: Math.cos(a) * speed,
      vy: Math.sin(a) * speed - 4 * dpr,
      life: 0.6 + Math.random() * 0.6,
      size: (0.8 + Math.random() * 2.6) * dpr,
      color: GREENS[i % GREENS.length],
    };
  });
}

// La boîte qu'on ouvre du doigt : chaque appui sert une tasse. La boîte tressaute, une bouffée de poudre s'en échappe,
// et le compteur dit combien de tasses il reste dans la boîte (grammes de la boîte divisés par la dose).
export function Pot({ name, slug, grams, price, dose }: Props) {
  const tin = useRef<HTMLButtonElement>(null);
  const plus = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const puffs = useRef<Puff[]>([]);
  const raf = useRef(0);
  const [cups, setCups] = useState(0);
  const total = Math.floor(grams / dose);
  const left = total - cups;

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const draw = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    puffs.current = puffs.current.filter((p) => p.life > 0);
    for (const p of puffs.current) {
      p.vy += 0.12;
      p.vx *= 0.97;
      p.vy *= 0.97;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.012;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    raf.current = puffs.current.length ? requestAnimationFrame(draw) : 0;
  };

  const serve = () => {
    if (left <= 0) return;
    setCups((c) => c + 1);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(tin.current, { scale: 0.92, rotate: gsap.utils.random(-7, 7) }, { scale: 1, rotate: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" });
    gsap.fromTo(plus.current, { y: 0, autoAlpha: 1 }, { y: -70, autoAlpha: 0, duration: 1, ease: "power2.out" });
    puffs.current.push(...puff(canvasRef.current!));
    if (!raf.current) raf.current = requestAnimationFrame(draw);
  };

  return (
    <section data-rail="Boîte" aria-labelledby="pot-title" className="relative overflow-hidden bg-steel">
      <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
        <div>
          <h2 id="pot-title" className="display text-[56px] sm:text-[88px]">
            Une boîte, <span className="text-moss">{total} tasses.</span>
          </h2>
          <p className="mt-4 max-w-[30rem] text-[18px]">
            {name} : {grams} g dans la boîte, {dose} g par tasse. Appuyez sur la boîte pour servir une tasse.
          </p>
          <dl className="mono mt-8 grid max-w-[30rem] grid-cols-2 border-t border-ink">
            <div className="border-b border-line py-3">
              <dt className="text-fog">Tasses servies</dt>
              <dd className="display mt-1 text-[48px] leading-none" aria-live="polite">
                {cups}
              </dd>
            </div>
            <div className="border-b border-line py-3">
              <dt className="text-fog">Reste dans la boîte</dt>
              <dd className="display mt-1 text-[48px] leading-none">{grams - cups * dose} g</dd>
            </div>
          </dl>
          {left <= 0 ? (
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link href={`/produit/${slug}`} className={primaryButton}>
                Recharger · {price}
              </Link>
              <button type="button" onClick={() => setCups(0)} className="mono min-h-11 px-2 uppercase underline underline-offset-4">
                Nouvelle boîte
              </button>
            </div>
          ) : (
            <p className="mono mt-6 text-[12px] text-fog">(appuyez sur la boîte)</p>
          )}
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute -inset-[20%] z-20 size-[140%]" />
          <span ref={plus} aria-hidden className="mono pointer-events-none invisible absolute top-[18%] left-1/2 z-30 -translate-x-1/2 bg-matcha px-2 py-1 text-[13px] text-on-matcha">
            +1 tasse
          </span>
          <button
            ref={tin}
            type="button"
            onClick={serve}
            disabled={left <= 0}
            aria-label={left > 0 ? `Servir une tasse, il en reste ${left}` : "Boîte vide"}
            className="relative block size-full overflow-hidden rounded-full shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)] transition-[filter] duration-500 disabled:grayscale"
          >
            <Image src="/photos/tin.jpg" alt="" fill sizes="(min-width: 768px) 520px, 92vw" className="scale-[1.32] object-cover" />
          </button>
        </div>
      </div>
    </section>
  );
}
