"use client";

import { useCallback, useState, useTransition } from "react";
import Link from "next/link";

import ReviewCard from "@/components/ReviewCard";
import { useToast } from "@/components/ui/ToastProvider";

type SortBy = "recent" | "rating-high" | "rating-low";

interface FormattedReview {
  reviewId: string;
  rating: number;
  position: string;
  seniority: string;
  contractType: string;
  positives: string;
  negatives: string;
  date: string;
  helpfulCount: number;
}

interface CompanyReviewsSectionProps {
  companySlug: string;
  companyName: string;
  companyId: string;
  totalReviews: number;
  initialReviews: FormattedReview[];
}

const seniorityMap: Record<string, string> = {
  JR: "Júnior",
  PL: "Pleno",
  SR: "Sênior",
};

const contractTypeMap: Record<string, string> = {
  CLT: "CLT",
  PJ: "PJ",
  ESTAGIO: "Estágio",
  FREELA: "Freelancer",
};

function formatReviewsFromApi(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  raw: any[]
): FormattedReview[] {
  return raw.map((review) => ({
    reviewId: review.id,
    rating: review.ratingOverall,
    position: review.roleArea,
    seniority: seniorityMap[review.seniority] ?? review.seniority,
    contractType: contractTypeMap[review.contractType] ?? review.contractType,
    positives: review.pros,
    negatives: review.cons,
    date: new Date(review.createdAt).toLocaleDateString("pt-BR"),
    helpfulCount: 0,
  }));
}

export default function CompanyReviewsSection({
  companySlug,
  companyName,
  companyId,
  totalReviews,
  initialReviews,
}: CompanyReviewsSectionProps) {
  const { showToast } = useToast();
  const [sortBy, setSortBy] = useState<SortBy>("recent");
  const [reviews, setReviews] = useState<FormattedReview[]>(initialReviews);
  const [count, setCount] = useState(totalReviews);
  const [isPending, startTransition] = useTransition();
  const [reportingReviewId, setReportingReviewId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  const fetchReviews = useCallback(
    async (newSortBy: SortBy) => {
      try {
        const params = new URLSearchParams({
          company: companySlug,
          sortBy: newSortBy,
          limit: "10",
          page: "1",
        });

        const res = await fetch(`/api/reviews?${params.toString()}`);
        if (!res.ok) return;

        const data = await res.json();
        setReviews(formatReviewsFromApi(data.reviews ?? []));
        setCount(data.totalCount ?? 0);
      } catch {
        // Keep current reviews on network error
      }
    },
    [companySlug]
  );

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as SortBy;
    setSortBy(value);
    startTransition(() => {
      fetchReviews(value);
    });
  }

  function openReportForm(reviewId: string) {
    setReportingReviewId(reviewId);
    setReportReason("");
  }

  function cancelReport() {
    setReportingReviewId(null);
    setReportReason("");
  }

  async function submitReport(reviewId: string) {
    if (reportReason.length < 10) {
      showToast("O motivo deve ter pelo menos 10 caracteres.", "error");
      return;
    }

    setIsSubmittingReport(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, reason: reportReason }),
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Denúncia enviada. Obrigado pela contribuição!", "success");
        setReportingReviewId(null);
        setReportReason("");
      } else if (res.status === 401) {
        showToast("Você precisa estar logado para denunciar.", "warning");
      } else {
        showToast(data.error || "Erro ao enviar denúncia.", "error");
      }
    } catch {
      showToast("Erro ao enviar denúncia.", "error");
    } finally {
      setIsSubmittingReport(false);
    }
  }

  return (
    <div className="lg:col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-sora text-2xl font-bold text-[var(--text-primary)]">
          Avaliações ({count})
        </h2>

        <select
          value={sortBy}
          onChange={handleSortChange}
          disabled={isPending}
          className="border border-[var(--border)] rounded-xl px-4 py-2 text-sm text-[var(--text-secondary)] bg-[var(--bg-surface)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20 focus:border-[var(--brand-primary)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <option value="recent">Mais Recentes</option>
          <option value="rating-high">Maior Avaliação</option>
          <option value="rating-low">Menor Avaliação</option>
        </select>
      </div>

      {reviews.length > 0 ? (
        <div
          className={`space-y-6 transition-opacity duration-200 ${isPending ? "opacity-50" : "opacity-100"}`}
        >
          {reviews.map((review, index) => (
            <div key={index} id={`review-${review.reviewId}`}>
              <ReviewCard {...review} />

              {reportingReviewId === review.reviewId ? (
                <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] p-4">
                  <p className="mb-2 text-sm font-semibold text-[var(--text-primary)]">
                    Motivo da denúncia
                  </p>
                  <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    minLength={10}
                    maxLength={500}
                    rows={3}
                    placeholder="Descreva o motivo (mín. 10, máx. 500 caracteres)"
                    className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20"
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => submitReport(review.reviewId)}
                      disabled={isSubmittingReport || reportReason.length < 10}
                      className="rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[var(--brand-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmittingReport ? "Enviando..." : "Enviar denúncia"}
                    </button>
                    <button
                      onClick={cancelReport}
                      disabled={isSubmittingReport}
                      className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition-all hover:bg-[var(--bg-subtle)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-1 flex justify-end">
                  <button
                    onClick={() => openReportForm(review.reviewId)}
                    className="flex items-center gap-1 text-xs text-[var(--text-muted)] transition-colors hover:text-[#EF4444]"
                  >
                    <span
                      className="material-symbols-outlined text-base leading-none"
                      translate="no"
                      aria-hidden="true"
                    >
                      flag
                    </span>
                    Denunciar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl">
          <svg
            className="w-16 h-16 mx-auto text-[var(--text-muted)] mb-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
            />
          </svg>
          <p className="text-[var(--text-secondary)] font-semibold mb-2">
            Ainda não há avaliações
          </p>
          <p className="text-[var(--text-muted)] text-sm mb-4">
            Seja o primeiro a avaliar {companyName}
          </p>
          <Link
            href={`/reviews/new?companyId=${companyId}&companyName=${encodeURIComponent(companyName)}`}
            className="inline-block bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white px-6 py-2 rounded-full font-semibold transition-all"
          >
            Escrever Primeira Review
          </Link>
        </div>
      )}
    </div>
  );
}
