"use client";

import { useEffect, useRef, useState } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface FadeInProps {
  children: React.ReactNode;
  direction?: Direction;
  delay?: number;       // ms
  duration?: number;    // ms
  distance?: number;    // px
  threshold?: number;   // 0-1
  className?: string;
}

const directionMap: Record<Direction, string> = {
  up:    "translateY(VALpx)",
  down:  "translateY(-VALpx)",
  left:  "translateX(VALpx)",
  right: "translateX(-VALpx)",
  none:  "translateY(0)",
};

export default function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 600,
  distance = 32,
  threshold = 0.15,
  className = "",
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const initialTransform = directionMap[direction].replace("VAL", String(distance));

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0, 0)" : initialTransform,
        transition: `opacity ${duration}ms cubic-bezier(0.4,0,0.2,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
