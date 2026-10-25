"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/components/gsap";

// Colonne de carrés à droite : un carré par section de l'accueil, vert jusqu'à celle qu'on lit.
// sections : les valeurs data-rail des sections, dans l'ordre de la page.
export function Rail({ sections }: { sections: string[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const nodes = [...document.querySelectorAll<HTMLElement>("[data-rail]")];
    const triggers = nodes.map((node, i) =>
      ScrollTrigger.create({
        trigger: node,
        start: "top 50%",
        end: "bottom 50%",
        onToggle: (self) => self.isActive && setCurrent(i),
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <nav aria-label="Sections de la page" className="fixed top-1/2 right-2 z-30 hidden -translate-y-1/2 flex-col gap-1 lg:flex">
      {sections.map((label, i) => (
        <button
          key={label}
          type="button"
          aria-label={`Aller à : ${label}`}
          aria-current={i === current ? "location" : undefined}
          onClick={() => document.querySelectorAll<HTMLElement>("[data-rail]")[i]?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
          className="group grid size-6 place-items-center"
        >
          {/* Filet noir et fond clair ou vert : lisible sur le noir comme sur l'acier. */}
          <span className={`size-2.5 shadow-[0_0_0_1px_var(--color-ink)] transition-colors duration-300 ${i <= current ? "bg-matcha" : "bg-paper"} group-hover:bg-matcha-hover`} />
        </button>
      ))}
    </nav>
  );
}
