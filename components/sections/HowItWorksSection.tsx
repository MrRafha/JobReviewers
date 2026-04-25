"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout";

const steps = [
  {
    number: "1",
    icon: "person_add",
    title: "Crie sua Conta",
    description:
      "Cadastre-se de forma anônima com email verificado para garantir a autenticidade.",
  },
  {
    number: "2",
    icon: "travel_explore",
    title: "Explore Avaliações",
    description:
      "Busque por empresas e leia avaliações honestas de profissionais que já trabalharam lá.",
  },
  {
    number: "3",
    icon: "rate_review",
    title: "Compartilhe Sua Experiência",
    description:
      "Deixe sua avaliação e ajude outros profissionais a tomar melhores decisões.",
  },
];

/**
 * Timing strategy:
 * - Card 0 enters at t=0
 * - Card 1 enters at t=420ms  (after card 0 is ~87% through its 480ms transition)
 * - Card 2 enters at t=840ms
 * - Arrow 0→1 appears 120ms after card 1 is visible (t=540ms)
 * - Arrow 1→2 appears 120ms after card 2 is visible (t=960ms)
 *
 * Each card except the first starts displaced toward the previous card
 * (translateX: -40px on desktop, translateY: -28px on mobile) and at
 * reduced scale (0.80), giving the visual "born from the previous card"
 * effect. transform-origin is set so the scale expansion radiates from
 * the edge closest to the origin card.
 */

const CARD_DELAYS = [0, 420, 840];
const ARROW_DELAYS = [540, 960];

// Desktop: cards emerge from left (previous card's direction)
const desktopHidden = (i: number): React.CSSProperties =>
  i === 0
    ? { opacity: 0, transform: "scale(0.80)", transformOrigin: "center center" }
    : {
        opacity: 0,
        transform: "translateX(-36px) scale(0.80)",
        transformOrigin: "left center",
      };

const desktopVisible: React.CSSProperties = {
  opacity: 1,
  transform: "translateX(0px) scale(1)",
};

const desktopTransition =
  "opacity 420ms cubic-bezier(0.34, 1.2, 0.64, 1), transform 420ms cubic-bezier(0.34, 1.2, 0.64, 1)";

// Mobile: cards emerge from above (previous card's direction)
const mobileHidden = (i: number): React.CSSProperties =>
  i === 0
    ? { opacity: 0, transform: "scale(0.82)", transformOrigin: "center center" }
    : {
        opacity: 0,
        transform: "translateY(-24px) scale(0.82)",
        transformOrigin: "center top",
      };

const mobileVisible: React.CSSProperties = {
  opacity: 1,
  transform: "translateY(0px) scale(1)",
};

const mobileTransition =
  "opacity 400ms cubic-bezier(0.34, 1.15, 0.64, 1), transform 400ms cubic-bezier(0.34, 1.15, 0.64, 1)";

export default function HowItWorksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // cardVisible[i] = true once that card's entrance timer fires
  const [cardVisible, setCardVisible] = useState([false, false, false]);
  // arrowVisible[i] = true once that arrow's timer fires
  const [arrowVisible, setArrowVisible] = useState([false, false]);

  const triggered = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          observer.disconnect();

          CARD_DELAYS.forEach((delay, i) => {
            setTimeout(() => {
              setCardVisible((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, delay);
          });

          ARROW_DELAYS.forEach((delay, i) => {
            setTimeout(() => {
              setArrowVisible((prev) => {
                const next = [...prev];
                next[i] = true;
                return next;
              });
            }, delay);
          });
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="como-funciona" className="section-tint py-16 sm:py-20" ref={sectionRef}>
      <Container>
        <h2 className="text-center font-sora text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">
          Como Funciona
        </h2>

        {/* ── Desktop layout ─────────────────────────────────────────── */}
        <div className="mt-12 hidden lg:flex items-center">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-1 items-center">
              {/* Card */}
              <div
                className="flex-1 rounded-2xl"
                style={{
                  ...(cardVisible[i] ? desktopVisible : desktopHidden(i)),
                  transition: desktopTransition,
                  // willChange keeps the compositor layer warm for smooth animation
                  willChange: cardVisible[i] ? "auto" : "opacity, transform",
                }}
              >
                <div className="group h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 text-center shadow-sm transition-shadow hover:-translate-y-0.5 hover:shadow-md">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#DBEAFE] text-[var(--brand-primary)]">
                    <span
                      className="material-symbols-rounded"
                      aria-hidden="true"
                    >
                      {step.icon}
                    </span>
                  </div>

                  <div className="inline-flex items-center rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
                    Etapa {step.number}
                  </div>

                  <h3 className="mt-4 font-sora text-lg font-semibold text-[var(--text-primary)]">
                    {step.title}
                  </h3>

                  <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-[var(--text-secondary)] opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Arrow — appears after the destination card has settled */}
              {i < steps.length - 1 && (
                <div
                  className="mx-3 flex-shrink-0"
                  style={{
                    opacity: arrowVisible[i] ? 1 : 0,
                    transform: arrowVisible[i]
                      ? "scale(1) translateX(0px)"
                      : "scale(0.3) translateX(-8px)",
                    transition:
                      "opacity 280ms cubic-bezier(0.34, 1.4, 0.64, 1), transform 280ms cubic-bezier(0.34, 1.4, 0.64, 1)",
                  }}
                  aria-hidden="true"
                >
                  <span className="material-symbols-rounded text-2xl text-[var(--brand-primary)]">
                    trending_flat
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Mobile layout ──────────────────────────────────────────── */}
        <div className="mt-10 flex flex-col lg:hidden">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              {/* Card */}
              <div
                className="w-full rounded-2xl"
                style={{
                  ...(cardVisible[i] ? mobileVisible : mobileHidden(i)),
                  transition: mobileTransition,
                  willChange: cardVisible[i] ? "auto" : "opacity, transform",
                }}
              >
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 text-center shadow-sm">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#DBEAFE] text-[var(--brand-primary)]">
                    <span
                      className="material-symbols-rounded"
                      aria-hidden="true"
                    >
                      {step.icon}
                    </span>
                  </div>

                  <div className="inline-flex items-center rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--text-muted)]">
                    Etapa {step.number}
                  </div>

                  <h3 className="mt-4 font-sora text-lg font-semibold text-[var(--text-primary)]">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Arrow — appears between cards, after the next card is visible */}
              {i < steps.length - 1 && (
                <div
                  className="my-2"
                  style={{
                    opacity: arrowVisible[i] ? 1 : 0,
                    transform: arrowVisible[i]
                      ? "scale(1) translateY(0px)"
                      : "scale(0.3) translateY(-6px)",
                    transition:
                      "opacity 260ms cubic-bezier(0.34, 1.4, 0.64, 1), transform 260ms cubic-bezier(0.34, 1.4, 0.64, 1)",
                  }}
                  aria-hidden="true"
                >
                  <span className="material-symbols-rounded text-2xl text-[var(--brand-primary)]">
                    expand_more
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
