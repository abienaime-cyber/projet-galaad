// Indicateur d'activité à 12 branches, d'après « lds-spinner » de timlmit sur Uiverse.io (licence MIT).
export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`relative inline-block size-4 shrink-0 ${className}`}>
      {Array.from({ length: 12 }, (_, i) => (
        <span
          key={i}
          className="absolute inset-0 animate-spinner"
          style={{ transform: `rotate(${i * 30}deg)`, animationDelay: `${(i - 12) / 12}s` }}
        >
          <span className="absolute top-0 left-1/2 h-[28%] w-[2px] -translate-x-1/2 rounded-full bg-current" />
        </span>
      ))}
    </span>
  );
}
