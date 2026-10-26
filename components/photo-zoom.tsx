"use client";

import Image from "next/image";
import { useRef, useState } from "react";

// Photo produit qu'on inspecte : à la souris, la loupe suit le pointeur ; au doigt, un appui zoome, glisser déplace, un second appui revient.
// La photo zoomée suit le point visé, sans saut : l'origine du zoom est le point sous le doigt.
export function PhotoZoom({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  const frame = useRef<HTMLDivElement>(null);
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  const aim = (clientX: number, clientY: number) => {
    const rect = frame.current!.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100));
    setOrigin(`${x}% ${y}%`);
  };

  return (
    <figure>
      <div
        ref={frame}
        role="button"
        tabIndex={0}
        aria-pressed={zoomed}
        aria-label={zoomed ? "Revenir à la photo entière" : "Zoomer sur la photo"}
        onPointerMove={(e) => (e.pointerType === "mouse" || zoomed) && aim(e.clientX, e.clientY)}
        onPointerEnter={(e) => e.pointerType === "mouse" && setZoomed(true)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setZoomed(false)}
        onClick={(e) => {
          aim(e.clientX, e.clientY);
          setZoomed((z) => !z);
        }}
        onKeyDown={(e) => {
          if (e.key !== "Enter" && e.key !== " ") return;
          e.preventDefault();
          setZoomed((z) => !z);
        }}
        className={`relative aspect-[4/5] overflow-hidden bg-ink ${zoomed ? "cursor-zoom-out touch-none" : "cursor-zoom-in"}`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 55vw, 100vw"
          style={{ transformOrigin: origin }}
          className={`object-cover transition-transform duration-500 ease-[var(--ease-out)] ${zoomed ? "scale-[2.2]" : "scale-100"}`}
        />
        <span className="corners pointer-events-none absolute inset-3 text-paper/80" aria-hidden />
      </div>
      <figcaption className="mono mt-2 flex justify-between text-[12px] text-fog">
        <span>{zoomed ? "(glissez pour inspecter)" : "(touchez pour zoomer)"}</span>
        <span>Photo non contractuelle</span>
      </figcaption>
    </figure>
  );
}
