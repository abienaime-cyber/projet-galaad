import Link from "next/link";

// Contrôle segmenté iOS : pages sœurs, un seul geste pour passer de l'une à l'autre.
export function SegmentedNav({ label, items, className = "" }: { label: string; items: { href: string; label: string; current: boolean }[]; className?: string }) {
  return (
    <nav aria-label={label} className={`grid w-fit auto-cols-fr grid-flow-col rounded-[10px] bg-fill p-[3px] ${className}`}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.current ? "page" : undefined}
          className="inline-flex min-h-9 items-center justify-center rounded-[8px] px-5 text-sm whitespace-nowrap text-label-2 transition-colors duration-150 ease-[ease] hover:text-label aria-[current=page]:bg-white aria-[current=page]:font-medium aria-[current=page]:text-label aria-[current=page]:shadow-[0_3px_8px_rgb(0_0_0/0.12),0_1px_1px_rgb(0_0_0/0.04)]"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
