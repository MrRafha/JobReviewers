"use client";

import React from "react";

interface ErrorCardProps {
  title?: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
}

/**
 * Standardized error card component for displaying database unavailability
 * and other system-wide errors in a consistent visual format
 */
export default function ErrorCard({
  title = "Oops!",
  description,
  onRetry,
  retryLabel = "Tentar novamente",
}: ErrorCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 text-center shadow-sm">
      {/* Error Icon */}
      <div className="mb-6 flex justify-center">
        <div className="rounded-full bg-[var(--error)] bg-opacity-10 p-4">
          <svg
            className="h-8 w-8 text-[var(--error)]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className="font-sora text-2xl font-semibold text-[var(--text-primary)] mb-3">
        {title}
      </h2>

      {/* Description */}
      <p className="text-[var(--text-secondary)] text-base leading-relaxed mb-6 max-w-sm mx-auto">
        {description}
      </p>

      {/* Retry Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center justify-center h-11 px-6 rounded-xl bg-[var(--brand-primary)] text-white font-semibold transition hover:bg-[var(--brand-primary-hover)] active:scale-95"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
