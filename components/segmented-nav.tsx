import Link from "next/link";

// Onglets : pages sœurs sur un filet, la page en cours passe au noir.
export function SegmentedNav({ label, items, className = "" }: { label: string; items: { href: string; label: string; current: boolean }[]; className?: string }) {
  return (
    <nav aria-label={label} className={`flex w-fit max-w-full overflow-x-auto shadow-[inset_0_0_0_1px_var(--color-ink)] ${className}`}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.current ? "page" : undefined}
          className="mono inline-flex min-h-11 items-center px-4 text-[13px] whitespace-nowrap uppercase transition-[color,background-color] duration-150 hover:bg-ink/8 aria-[current=page]:bg-ink aria-[current=page]:text-paper"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
