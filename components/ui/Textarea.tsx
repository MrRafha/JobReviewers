"use client";

import { TextareaHTMLAttributes, forwardRef, useId } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  rows?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, rows = 4, className = "", id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-semibold text-[var(--text-primary)]"
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={[
            "w-full rounded-xl border px-4 py-3 text-[var(--text-primary)]",
            "placeholder:text-[var(--text-muted)] bg-[var(--bg-base)]",
            "focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-all resize-none",
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
              ? `${textareaId}-error`
              : hint
                ? `${textareaId}-hint`
                : undefined
          }
          {...props}
        />

        {hint && !error && (
          <p
            id={`${textareaId}-hint`}
            className="text-xs text-[var(--text-muted)]"
          >
            {hint}
          </p>
        )}

        {error && (
          <p
            id={`${textareaId}-error`}
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

Textarea.displayName = "Textarea";

export default Textarea;
