import type { ReactNode } from "react";
import { SegmentedNav } from "@/components/segmented-nav";

const TABS = [
  { href: "/connexion", key: "connexion", label: "Se connecter" },
  { href: "/inscription", key: "inscription", label: "Créer un compte" },
] as const;

const POINTS = [
  {
    title: "Trois chiffres suffisent",
    text: "Taille, poids et âge. Votre tour de poitrine et votre tour de taille affinent le calcul si vous les connaissez.",
  },
  {
    title: "Une estimation, dite comme telle",
    text: "Chaque taille conseillée indique son niveau de confiance, et la taille voisine quand vous êtes entre deux.",
  },
  {
    title: "Vos données restent les vôtres",
    text: "Elles ne servent qu’au calcul de taille. Vous pouvez les effacer à tout moment.",
  },
];

export function AuthShell({ active, title, children }: { active: (typeof TABS)[number]["key"]; title: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[980px] px-4 pt-10 pb-16 sm:px-[22px] md:pt-16">
      <section aria-labelledby="auth-title" className="mx-auto max-w-[460px]">
        <SegmentedNav
          label="Accès au compte"
          className="mx-auto"
          items={TABS.map((tab) => ({ href: tab.href, label: tab.label, current: tab.key === active }))}
        />
        <h1 id="auth-title" className="mt-10 text-center text-[40px] font-semibold">
          {title}
        </h1>
        {children}
      </section>

      <aside aria-labelledby="why-title" className="mt-16 rounded-[28px] bg-tile px-6 py-10 sm:px-12 sm:py-12">
        <h2 id="why-title" className="text-center text-[28px] font-semibold">
          Votre taille, article par article
        </h2>
        <p className="mx-auto mt-3 max-w-[38rem] text-center text-label-2">
          Votre compte garde vos mensurations. Carrure les compare au tableau de tailles de chaque chemise et de chaque
          costume, et vous indique la taille à commander.
        </p>
        <dl className="mt-10 grid gap-8 text-sm sm:grid-cols-3 sm:gap-10">
          {POINTS.map((point) => (
            <div key={point.title}>
              <dt className="text-[17px] font-semibold">{point.title}</dt>
              <dd className="mt-1.5 text-label-2">{point.text}</dd>
            </div>
          ))}
        </dl>
      </aside>
    </div>
  );
}
