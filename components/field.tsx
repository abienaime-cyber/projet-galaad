import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  unit?: string;
  hint?: string;
  error?: string;
};

// Champ à libellé flottant, comme les formulaires de l'Apple Store : le libellé monte quand on saisit.
export function Field({ name, label, unit, hint, error, className, ...input }: FieldProps) {
  const describedBy = [hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <div className="relative">
        <input
          id={name}
          name={name}
          placeholder=" "
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`peer h-14 w-full rounded-xl border px-4 pt-[18px] text-[17px] text-label transition-[border-color,box-shadow] duration-150 ease-[ease] focus:border-accent focus:shadow-[0_0_0_4px_rgb(0_113_227/0.25)] focus:outline-none ${
            error ? "border-danger bg-danger-tint" : "border-control bg-white"
          } ${unit ? "pr-12" : ""}`}
          {...input}
        />
        <label
          htmlFor={name}
          className="pointer-events-none absolute top-7 left-4 origin-left -translate-y-1/2 text-[17px] leading-none text-label-2 transition-[translate,scale] duration-150 ease-out motion-reduce:transition-none peer-focus:-translate-y-[calc(50%+10px)] peer-focus:scale-[0.7] peer-[:not(:placeholder-shown)]:-translate-y-[calc(50%+10px)] peer-[:not(:placeholder-shown)]:scale-[0.7]"
        >
          {label}
        </label>
        {unit && (
          <span aria-hidden className="pointer-events-none absolute right-4 bottom-[9px] text-[17px] text-label-2">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-2 flex items-start gap-1.5 text-xs text-danger">
          <svg aria-hidden viewBox="0 0 16 16" className="mt-px size-3.5 shrink-0">
            <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8 4.5v4.5M8 11.2v.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
      {hint && (
        <p id={`${name}-hint`} className="mt-2 px-1 text-xs text-label-2">
          {hint}
        </p>
      )}
    </div>
  );
}

export const primaryButton =
  "inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-accent px-[22px] text-[17px] text-white transition-[background-color,transform] duration-150 ease-out hover:bg-accent-hover active:scale-[0.97] disabled:cursor-default disabled:opacity-60 disabled:active:scale-100";
