"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout";

interface FeaturedReview {
  id: string;
  rating: number;
  position: string;
  positives: string;
  negatives: string;
  date: string;
  companyName: string;
  authorHandle: string;
  workMode: string;
}

interface SocialProofSectionProps {
  featuredReview: FeaturedReview | null;
}

function resolveWorkModeLabel(workMode: string) {
  if (workMode === "REMOTO") return "Remoto";
  if (workMode === "PRESENCIAL") return "Presencial";
  return "Híbrido";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ReviewTickerItem({ review }: { review: FeaturedReview }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 shadow-sm flex-shrink-0">
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-base ${
              i < Math.round(review.rating) ? "text-[#fbbf24]" : "text-[#e5e7eb]"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <p className="font-sora text-sm font-semibold text-[var(--text-primary)] mb-0.5">
        {review.companyName}
      </p>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-[var(--text-secondary)]">{review.position}</span>
        <span className="inline-flex items-center rounded-full bg-[#DBEAFE] px-2 py-0.5 text-xs font-medium text-[var(--brand-primary)]">
          {resolveWorkModeLabel(review.workMode)}
        </span>
      </div>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        {review.positives.length > 100
          ? review.positives.slice(0, 100) + "…"
          : review.positives}
      </p>
    </div>
  );
}

const securityFeatures = [
  {
    icon: "lock",
    title: "Anonimato Total",
    description: "Suas avaliações são 100% anônimas",
  },
  {
    icon: "verified",
    title: "Verificado",
    description: "Apenas profissionais autênticos",
  },
  {
    icon: "shield",
    title: "Seguro",
    description: "LGPD compliant e criptografado",
  },
];

const CARD_DELAYS = [0, 380, 720];

const hiddenStyle = (i: number): React.CSSProperties =>
  i === 0
    ? { opacity: 0, transform: "scale(0.82)", transformOrigin: "center center" }
    : { opacity: 0, transform: "translateY(-28px) scale(0.82)", transformOrigin: "center top" };

const visibleStyle: React.CSSProperties = {
  opacity: 1,
  transform: "translateY(0px) scale(1)",
};

const transition =
  "opacity 420ms cubic-bezier(0.34, 1.2, 0.64, 1), transform 420ms cubic-bezier(0.34, 1.2, 0.64, 1)";

export default function SocialProofSection({
  featuredReview,
}: SocialProofSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [cardVisible, setCardVisible] = useState([false, false, false]);
  const triggered = useRef(false);
  const [tickerReviews, setTickerReviews] = useState<FeaturedReview[]>([]);

  useEffect(() => {
    async function fetchTickerReviews() {
      try {
        const res = await fetch("/api/reviews?limit=12");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setTickerReviews(data);
        }
      } catch {
      }
    }
    fetchTickerReviews();
  }, []);

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
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="seguranca" className="bg-[var(--bg-subtle)] py-8 sm:py-12" ref={sectionRef}>
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div>
            <h3 className="font-sora text-2xl font-semibold text-[var(--text-primary)] mb-6">
              O que Profissionais Dizem
            </h3>

            {tickerReviews.length > 0 ? (
              <div
                className="review-ticker-wrapper"
                style={{ height: "360px", overflow: "hidden", position: "relative" }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "40px",
                    background: "linear-gradient(to bottom, var(--bg-subtle), transparent)",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "40px",
                    background: "linear-gradient(to top, var(--bg-subtle), transparent)",
                    zIndex: 1,
                    pointerEvents: "none",
                  }}
                />
                <div className="review-ticker flex flex-col gap-3">
                  {[...tickerReviews, ...tickerReviews].map((review, i) => (
                    <ReviewTickerItem key={`${review.id}-${i}`} review={review} />
                  ))}
                </div>
              </div>
            ) : featuredReview ? (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${
                        i < Math.round(featuredReview.rating)
                          ? "text-[#fbbf24]"
                          : "text-[#e5e7eb]"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <p className="font-sora text-lg font-semibold text-[var(--text-primary)] mb-1">
                  {featuredReview.companyName}
                </p>
                <p className="text-sm text-[var(--text-secondary)] mb-4">
                  {featuredReview.position} • {resolveWorkModeLabel(featuredReview.workMode)}
                </p>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-semibold text-[var(--success)] mb-1">
                      Pontos Positivos
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {featuredReview.positives}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--error)] mb-1">
                      Pontos Negativos
                    </p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {featuredReview.negatives}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-[var(--brand-primary)] bg-opacity-10" />
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {featuredReview.authorHandle}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {formatDate(featuredReview.date)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6 text-center">
                <p className="text-[var(--text-secondary)]">
                  Nenhuma avaliação disponível no momento
                </p>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-sora text-2xl font-semibold text-[var(--text-primary)] mb-6">
              Segurança Garantida
            </h3>
            <div className="space-y-4">
              {securityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4 flex gap-4"
                  style={{
                    ...(cardVisible[index] ? visibleStyle : hiddenStyle(index)),
                    transition,
                    willChange: cardVisible[index] ? "auto" : "opacity, transform",
                  }}
                >
                  <span
                    className="material-symbols-rounded flex-shrink-0 text-[var(--brand-primary)]"
                    aria-hidden="true"
                    translate="no"
                  >
                    {feature.icon}
                  </span>
                  <div>
                    <h4 className="font-semibold text-[var(--text-primary)]">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
