"use client";

import { InputHTMLAttributes, forwardRef, useId } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-[var(--text-primary)]"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          className={[
            "w-full rounded-xl border px-4 py-3 text-[var(--text-primary)]",
            "placeholder:text-[var(--text-muted)] bg-[var(--bg-base)]",
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
              ? `${inputId}-error`
              : hint
                ? `${inputId}-hint`
                : undefined
          }
          {...props}
        />

        {hint && !error && (
          <p
            id={`${inputId}-hint`}
            className="text-xs text-[var(--text-muted)]"
          >
            {hint}
          </p>
        )}

        {error && (
          <p
            id={`${inputId}-error`}
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

Input.displayName = "Input";

export default Input;
