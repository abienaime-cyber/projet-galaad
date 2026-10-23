import type { InputHTMLAttributes } from "react";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  unit?: string;
  hint?: string;
  error?: string;
};

export function Field({ name, label, unit, hint, error, className, ...input }: FieldProps) {
  const describedBy = [hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {hint && (
        <p id={`${name}-hint`} className="mt-0.5 text-sm text-ink-2">
          {hint}
        </p>
      )}
      <div className="relative mt-1.5">
        <input
          id={name}
          name={name}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`h-11 w-full rounded-[3px] border bg-white px-3 text-base text-ink placeholder:text-ink-2/70 focus:border-navy focus:shadow-[0_0_0_1px_var(--color-navy)] focus:outline-none ${
            error ? "border-tape-red" : "border-rule hover:border-ink-2"
          } ${unit ? "pr-12" : ""}`}
          {...input}
        />
        {unit && (
          <span aria-hidden className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-ink-2">
            {unit}
          </span>
        )}
      </div>
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-tape-red">
          {error}
        </p>
      )}
    </div>
  );
}

export const primaryButton =
  "inline-flex h-11 cursor-pointer items-center justify-center rounded-[3px] bg-navy px-5 text-sm font-semibold text-chalk transition-[background-color,transform] duration-150 ease-out hover:bg-navy-2 active:scale-[0.97] disabled:cursor-default disabled:opacity-60 disabled:active:scale-100";
