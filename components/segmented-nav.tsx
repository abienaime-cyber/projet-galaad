import Link from "next/link";

// Contrôle segmenté : pages sœurs sur une piste grise, la page en cours en carte blanche.
export function SegmentedNav({ label, items, className = "" }: { label: string; items: { href: string; label: string; current: boolean }[]; className?: string }) {
  return (
    <nav aria-label={label} className={`flex w-fit gap-1 rounded-lg bg-muted p-1 ${className}`}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.current ? "page" : undefined}
          className="inline-flex min-h-11 items-center rounded-md px-4 text-[14px] font-semibold whitespace-nowrap text-muted-foreground transition-[color,background-color,box-shadow] duration-200 hover:text-foreground aria-[current=page]:bg-card aria-[current=page]:text-foreground aria-[current=page]:shadow-sm"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
