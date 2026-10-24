import Link from "next/link";

// Onglets soulignés : pages sœurs, un seul geste pour passer de l'une à l'autre.
export function SegmentedNav({ label, items, className = "" }: { label: string; items: { href: string; label: string; current: boolean }[]; className?: string }) {
  return (
    <nav aria-label={label} className={`flex w-fit gap-6 ${className}`}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.current ? "page" : undefined}
          className="eyebrow inline-flex min-h-11 items-center border-b border-transparent whitespace-nowrap text-label-2 transition-[color,border-color] duration-150 ease-[ease] hover:text-label aria-[current=page]:border-label aria-[current=page]:text-label"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
