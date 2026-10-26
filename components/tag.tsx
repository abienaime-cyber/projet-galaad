import type { ReactNode } from "react";

// Étiquette de pièce à conviction : un numéro sur gris foncé, un nom sur gris clair.
export function Tag({ index, children, tone = "light", className = "" }: { index?: string; children: ReactNode; tone?: "light" | "dark" | "matcha"; className?: string }) {
  const label = { light: "bg-paper text-ink", dark: "bg-ink-2 text-paper", matcha: "bg-matcha text-ink" }[tone];
  return (
    <span className={`mono inline-flex items-stretch text-[12px] uppercase ${className}`}>
      {index && <span className="flex items-center bg-iron px-2 py-1 text-paper">{index}</span>}
      <span className={`flex items-center px-2.5 py-1 whitespace-nowrap ${label}`}>{children}</span>
    </span>
  );
}
