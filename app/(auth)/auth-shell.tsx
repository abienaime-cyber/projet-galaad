import type { ReactNode } from "react";
import { SegmentedNav } from "@/components/segmented-nav";

const TABS = [
  { href: "/connexion", key: "connexion", label: "Se connecter" },
  { href: "/inscription", key: "inscription", label: "Créer un compte" },
] as const;

const POINTS = [
  { title: "Six réponses", text: "Tasses par semaine, pur ou latte, doux ou intense, ce que vous avez déjà. Une minute." },
  { title: "Un calcul, pas un avis", text: "Chaque article reçoit un score sur 100 et ses raisons. Quand deux se valent, le site le dit." },
  { title: "Le prix de votre tasse", text: "Calculé sur les prix de la boutique et les doses d’Ippodo, à votre rythme." },
];

export function AuthShell({ active, title, children }: { active: (typeof TABS)[number]["key"]; title: string; children: ReactNode }) {
  return (
    <div className="mx-auto grid max-w-[1200px] gap-px px-4 pt-10 pb-24 sm:px-6 md:pt-16 lg:grid-cols-2">
      <section aria-labelledby="auth-title" className="bg-paper/70 p-6 sm:p-10">
        <SegmentedNav label="Accès au compte" items={TABS.map((tab) => ({ href: tab.href, label: tab.label, current: tab.key === active }))} />
        <h1 id="auth-title" className="display mt-8 text-[52px] sm:text-[64px]">
          {title}
        </h1>
        {children}
      </section>

      <aside aria-labelledby="why-title" data-theme="dark" className="bg-ink p-6 text-paper sm:p-10">
        <h2 id="why-title" className="display text-[44px] sm:text-[52px]">
          Le bon kit, pas le plus cher
        </h2>
        <p className="mt-4 text-paper/75">
          Votre compte garde votre profil de goût. USUCHA le compare à chaque kit, chaque matcha et chaque ustensile, et classe la boutique pour vous.
        </p>
        <ol className="mt-10 grid gap-6">
          {POINTS.map(({ title, text }, i) => (
            <li key={title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] border-t border-line-dark pt-4">
              <span className="mono text-matcha">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="display text-[26px]">{title}</p>
                <p className="mt-1 text-[16px] text-paper/70">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </aside>
    </div>
  );
}
