"use client";

import { SelectHTMLAttributes, forwardRef, useId } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className = "", id, children, ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-semibold text-[var(--text-primary)]"
          >
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          className={[
            "w-full rounded-xl border px-4 py-3 text-[var(--text-primary)] bg-[var(--bg-base)]",
            "focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all",
            error
              ? "border-[var(--error)] focus:border-[var(--error)] focus:ring-[var(--error)]"
              : "border-[var(--border)] focus:border-[var(--brand-primary)] focus:ring-[var(--brand-primary)]",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${selectId}-error`
              : hint
                ? `${selectId}-hint`
                : undefined
          }
          {...props}
        >
          {children}
        </select>

        {hint && !error && (
          <p
            id={`${selectId}-hint`}
            className="text-xs text-[var(--text-muted)]"
          >
            {hint}
          </p>
        )}

        {error && (
          <p
            id={`${selectId}-error`}
            role="alert"
            className="text-xs text-[var(--error)]"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
