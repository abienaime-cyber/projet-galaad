"use client";

import { MotionConfig, motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

// Motion (ex-Framer Motion). Réglages tirés de UI UX Pro Max, preset « Stagger List (Standard) » :
// montée de 16 px, 300 à 450 ms, 60 ms entre deux éléments. Courbe « ease-out » forte, jamais de rebond sur une entrée.
export const EASE = [0.23, 1, 0.32, 1] as const;
const HIDDEN = { opacity: 0, transform: "translateY(16px)" };
const SHOWN = { opacity: 1, transform: "translateY(0px)" };

// Mouvement réduit (réglage système) : Motion coupe les déplacements et ne garde que les fondus.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

// Le déplacement est retiré ici aussi : on ne dépend pas de MotionConfig pour une « transform » écrite en entier.
function useVariants(): Variants {
  const reduce = useReducedMotion();
  return reduce ? { hidden: { opacity: 0 }, shown: { opacity: 1 } } : { hidden: HIDDEN, shown: SHOWN };
}

// Un bloc qui monte en fondu quand il entre à l'écran, une seule fois.
export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      data-reveal
      className={className}
      variants={useVariants()}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

// Une liste dont les éléments (StaggerItem) arrivent l'un après l'autre.
export function Stagger({ children, className, onMount = false }: { children: ReactNode; className?: string; onMount?: boolean }) {
  const trigger = onMount ? { animate: "shown" } : { whileInView: "shown", viewport: { once: true, amount: 0.1 } };
  return (
    <motion.ul className={className} initial="hidden" {...trigger} transition={{ staggerChildren: 0.06 }}>
      {children}
    </motion.ul>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.li data-reveal className={className} variants={useVariants()} transition={{ duration: 0.4, ease: EASE }}>
      {children}
    </motion.li>
  );
}
