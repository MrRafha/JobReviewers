"use client";

import Link from "next/link";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: string;
  variant: "success" | "danger" | "neutral";
  href?: string;
  description?: string;
}

const VARIANT_STYLES = {
  success: {
    bg: "rgba(16,185,129,0.06)",
    border: "rgba(16,185,129,0.25)",
    iconColor: "var(--brand-success)",
    valuColor: "var(--brand-success)",
  },
  danger: {
    bg: "rgba(239,68,68,0.06)",
    border: "rgba(239,68,68,0.25)",
    iconColor: "var(--error)",
    valuColor: "var(--error)",
  },
  neutral: {
    bg: "var(--bg-surface)",
    border: "var(--border)",
    iconColor: "var(--text-muted)",
    valuColor: "var(--text-primary)",
  },
};

export default function StatCard({ title, value, icon, variant, href, description }: StatCardProps) {
  const styles = VARIANT_STYLES[variant];

  const inner = (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-3 h-full transition-all duration-150"
      style={{
        backgroundColor: styles.bg,
        borderColor: styles.border,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-sm font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          {title}
        </span>
        <span
          className="material-symbols-rounded"
          translate="no"
          aria-hidden="true"
          style={{ fontSize: "1.25rem", color: styles.iconColor }}
        >
          {icon}
        </span>
      </div>

      <span
        className="text-3xl font-bold tabular-nums"
        style={{ color: styles.valuColor }}
      >
        {value}
      </span>

      {description && (
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          {description}
        </span>
      )}

      {href && (
        <span
          className="text-xs font-medium mt-auto"
          style={{ color: styles.iconColor }}
        >
          Ver detalhes →
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block hover:scale-[1.01] active:scale-[0.99] transition-transform duration-150">
        {inner}
      </Link>
    );
  }

  return inner;
}
