"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!visible}
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 50,
        transform: visible ? "translateY(0)" : "translateY(calc(100% + 1.5rem))",
        opacity: visible ? 1 : 0,
        transition: "transform 300ms cubic-bezier(0.34,1.2,0.64,1), opacity 250ms ease",
      }}
    >
      <Link
        href="/reviews/new"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: hovered ? "0.5rem" : "0",
          maxWidth: hovered ? "220px" : "48px",
          overflow: "hidden",
          height: "48px",
          borderRadius: "24px",
          backgroundColor: "var(--brand-primary)",
          color: "white",
          paddingLeft: "14px",
          paddingRight: hovered ? "16px" : "14px",
          fontWeight: 600,
          fontSize: "0.875rem",
          boxShadow: "0 4px 14px rgba(37,99,235,0.4)",
          transition: "max-width 300ms ease, gap 300ms ease, padding-right 300ms ease, box-shadow 200ms ease",
          whiteSpace: "nowrap",
          textDecoration: "none",
        }}
      >
        <span
          className="material-symbols-rounded"
          aria-hidden="true"
          translate="no"
          style={{ fontSize: "20px", flexShrink: 0 }}
        >
          edit
        </span>
        <span style={{
          opacity: hovered ? 1 : 0,
          transition: "opacity 200ms ease 100ms",
          pointerEvents: "none",
        }}>
          Avaliar empresa
        </span>
      </Link>
      {hovered && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 8px)",
          right: 0,
          background: "var(--text-primary)",
          color: "white",
          fontSize: "11px",
          padding: "4px 10px",
          borderRadius: "8px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
        }}>
          Sua opinião é anônima.
        </div>
      )}
    </div>
  );
}
