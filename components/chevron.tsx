// Chevron dessiné au même trait que les icônes de l'en-tête, à la place des glyphes « ‹ » et « › ».
export function Chevron({ back = false }: { back?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 10 10" className={`size-2.5 shrink-0 ${back ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={1.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 1.5 7 5 3.5 8.5" />
    </svg>
  );
}
