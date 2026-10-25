// Mise en page commune aux pages légales : une colonne de lecture, des titres de section ancrables.
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-[692px] px-4 pt-10 pb-24 sm:px-8 md:pt-16 [&_a]:underline [&_h2]:display [&_h2]:mt-12 [&_h2]:scroll-mt-20 [&_h2]:text-[34px] [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
      <h1 className="display text-[56px] md:text-[80px]">{title}</h1>
      <p className="mono mt-4 text-fog">Mise à jour le {updated}.</p>
      {children}
    </article>
  );
}
