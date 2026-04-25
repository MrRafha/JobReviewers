"use client";

import { useEffect, useRef } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
}

const ICONS: Record<ToastProps["type"], string> = {
  success: "check_circle",
  error: "error",
  warning: "warning",
};

const STYLES: Record<
  ToastProps["type"],
  { bg: string; border: string; color: string }
> = {
  success: {
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.35)",
    color: "var(--brand-success)",
  },
  error: {
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.35)",
    color: "var(--error)",
  },
  warning: {
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.35)",
    color: "var(--warning)",
  },
};

export default function Toast({ message, type, onClose }: ToastProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  const { bg, border, color } = STYLES[type];

  return (
    <div
      ref={ref}
      role="alert"
      aria-live="assertive"
      style={{
        position: "fixed",
        top: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        opacity: 0,
        transform: "translateY(-8px)",
        transition: "opacity 250ms ease, transform 250ms ease",
        backgroundColor: bg,
        border: `1px solid ${border}`,
        color,
        borderRadius: "0.75rem",
        padding: "0.75rem 1rem",
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        minWidth: "280px",
        maxWidth: "420px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      <span
        className="material-symbols-rounded"
        translate="no"
        aria-hidden="true"
        style={{ fontSize: "1.25rem", flexShrink: 0 }}
      >
        {ICONS[type]}
      </span>
      <span
        style={{
          flex: 1,
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "var(--text-primary)",
        }}
      >
        {message}
      </span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Fechar notificação"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0.125rem",
          color: "var(--text-secondary)",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        <span
          className="material-symbols-rounded"
          translate="no"
          aria-hidden="true"
          style={{ fontSize: "1.125rem" }}
        >
          close
        </span>
      </button>
    </div>
  );
}
