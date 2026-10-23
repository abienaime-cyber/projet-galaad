// Mise en page commune aux pages légales : une colonne de lecture, des titres de section ancrables.
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-[692px] px-4 pt-10 pb-24 sm:px-[22px] md:pt-16 [&_a]:text-link [&_a]:underline [&_h2]:mt-12 [&_h2]:scroll-mt-20 [&_h2]:text-[21px] [&_h2]:font-semibold [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5">
      <h1 className="text-[40px] font-semibold md:text-5xl">{title}</h1>
      <p className="text-sm text-label-2">Mise à jour le {updated}.</p>
      {children}
    </article>
  );
}
