"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

interface Report {
  id: string;
  reason: string;
  status: "PENDING" | "CLAIMED" | "RESOLVED" | "DISMISSED" | "APPROVED";
  claimedAt: string | null;
  claimedBy: { handle: string } | null;
  createdAt: string;
  review: {
    id: string;
    pros: string;
    cons: string;
    ratingOverall: number;
    roleArea: string;
    hidden: boolean;
  };
  company: { name: string; slug: string };
  reporter: { handle: string };
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + "…";
}

function formatDatePtBR(isoString: string): string {
  return new Date(isoString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className="material-symbols-rounded"
          translate="no"
          aria-hidden="true"
          style={{ fontSize: "0.9rem", color: i < rating ? "var(--warning)" : "var(--border)" }}
        >
          star
        </span>
      ))}
    </span>
  );
}

function ReportCardSkeleton() {
  return (
    <div
      className="rounded-2xl border p-5 animate-pulse"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-32 rounded-lg" style={{ backgroundColor: "var(--bg-subtle)" }} />
        <div className="h-5 w-20 rounded-full" style={{ backgroundColor: "var(--bg-subtle)" }} />
      </div>
      <div className="h-4 w-48 rounded mb-3" style={{ backgroundColor: "var(--bg-subtle)" }} />
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded" style={{ backgroundColor: "var(--bg-subtle)" }} />
        <div className="h-3 w-5/6 rounded" style={{ backgroundColor: "var(--bg-subtle)" }} />
      </div>
      <div className="h-10 w-full rounded-xl mb-4" style={{ backgroundColor: "var(--bg-subtle)" }} />
      <div className="flex gap-3">
        <div className="h-9 flex-1 rounded-xl" style={{ backgroundColor: "var(--bg-subtle)" }} />
        <div className="h-9 flex-1 rounded-xl" style={{ backgroundColor: "var(--bg-subtle)" }} />
      </div>
    </div>
  );
}

function ReportCard({
  report,
  currentHandle,
  onUpdate,
}: {
  report: Report;
  currentHandle: string;
  onUpdate: (id: string, updates: Partial<Report>) => void;
}) {
  const { showToast } = useToast();
  const [claimLoading, setClaimLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const isClaimedByMe = report.status === "CLAIMED" && report.claimedBy?.handle === currentHandle;
  const isClaimedByOther = report.status === "CLAIMED" && report.claimedBy?.handle !== currentHandle;

  async function handleClaim() {
    setClaimLoading(true);
    try {
      const res = await fetch(`/api/admin/reports/${report.id}/claim`, { method: "PATCH" });
      const data = await res.json();
      if (res.status === 409) {
        showToast(data.error ?? "Denúncia já foi pega por outro admin.", "error");
        onUpdate(report.id, { status: "CLAIMED", claimedBy: data.claimedBy });
        return;
      }
      if (!res.ok) throw new Error();
      onUpdate(report.id, { status: "CLAIMED", claimedBy: { handle: currentHandle }, claimedAt: new Date().toISOString() });
      showToast("Denúncia reservada para você.", "success");
    } catch {
      showToast("Erro ao pegar denúncia. Tente novamente.", "error");
    } finally {
      setClaimLoading(false);
    }
  }

  async function handleUnclaim() {
    setClaimLoading(true);
    try {
      const res = await fetch(`/api/admin/reports/${report.id}/claim`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      onUpdate(report.id, { status: "PENDING", claimedBy: null, claimedAt: null });
      showToast("Denúncia liberada.", "success");
    } catch {
      showToast("Erro ao liberar denúncia.", "error");
    } finally {
      setClaimLoading(false);
    }
  }

  async function handleAction(action: "resolve" | "dismiss" | "approve") {
    setActionLoading(action);
    try {
      if (action === "resolve") {
        const hideRes = await fetch(`/api/admin/reviews/${report.review.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hidden: true }),
        });
        if (!hideRes.ok) throw new Error("Falha ao ocultar review");
      }

      const res = await fetch(`/api/admin/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error();

      const messages: Record<string, string> = {
        resolve: "Review ocultada e denúncia resolvida.",
        dismiss: "Denúncia ignorada.",
        approve: "Review aprovada — denúncia encerrada.",
      };
      showToast(messages[action], "success");
      onUpdate(report.id, null as unknown as Partial<Report>);
    } catch {
      showToast("Erro ao processar ação. Tente novamente.", "error");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <article
      className="rounded-2xl border p-5 shadow-sm transition-opacity duration-200"
      style={{
        borderColor: isClaimedByOther ? "var(--border)" : isClaimedByMe ? "rgba(37,99,235,0.35)" : "var(--border)",
        backgroundColor: "var(--bg-surface)",
        opacity: isClaimedByOther ? 0.7 : 1,
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <Link
          href={`/companies/${report.company.slug}`}
          className="text-base font-semibold hover:underline truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {report.company.name}
        </Link>

        {report.status === "PENDING" && (
          <span
            className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border"
            style={{
              backgroundColor: "rgba(245,158,11,0.1)",
              color: "var(--warning)",
              borderColor: "rgba(245,158,11,0.3)",
            }}
          >
            Pendente
          </span>
        )}

        {isClaimedByMe && (
          <span
            className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border"
            style={{
              backgroundColor: "rgba(37,99,235,0.1)",
              color: "var(--brand-primary)",
              borderColor: "rgba(37,99,235,0.3)",
            }}
          >
            Em análise por você
          </span>
        )}

        {isClaimedByOther && (
          <span
            className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border"
            style={{
              backgroundColor: "var(--bg-subtle)",
              color: "var(--text-muted)",
              borderColor: "var(--border)",
            }}
          >
            @{report.claimedBy?.handle} analisando
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          {report.review.roleArea}
        </span>
        <span style={{ color: "var(--border)" }}>·</span>
        <StarRating rating={report.review.ratingOverall} />
        {report.review.hidden && (
          <>
            <span style={{ color: "var(--border)" }}>·</span>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>oculta</span>
          </>
        )}
      </div>

      <div className="space-y-2 mb-3">
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          <span className="font-medium" style={{ color: "var(--text-primary)" }}>Prós: </span>
          {truncate(report.review.pros, 120)}
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          <span className="font-medium" style={{ color: "var(--text-primary)" }}>Contras: </span>
          {truncate(report.review.cons, 120)}
        </p>
      </div>

      <div
        className="rounded-xl px-4 py-3 mb-4 text-sm font-medium"
        style={{
          backgroundColor: "rgba(245,158,11,0.08)",
          color: "var(--text-primary)",
          borderLeft: "3px solid var(--warning)",
        }}
      >
        <span style={{ color: "var(--warning)" }}>Motivo: </span>
        {report.reason}
      </div>

      <div className="flex items-center justify-between mb-4 text-xs" style={{ color: "var(--text-muted)" }}>
        <span>@{report.reporter.handle}</span>
        <span>{formatDatePtBR(report.createdAt)}</span>
      </div>

      {report.status === "PENDING" && (
        <Button
          variant="primary"
          size="sm"
          loading={claimLoading}
          onClick={handleClaim}
          className="w-full active:scale-95"
        >
          Pegar denúncia
        </Button>
      )}

      {isClaimedByMe && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Button
              variant="danger"
              size="sm"
              loading={actionLoading === "resolve"}
              disabled={!!actionLoading && actionLoading !== "resolve"}
              onClick={() => handleAction("resolve")}
              className="flex-1 active:scale-95"
            >
              Ocultar review
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={actionLoading === "approve"}
              disabled={!!actionLoading && actionLoading !== "approve"}
              onClick={() => handleAction("approve")}
              className="flex-1 active:scale-95"
            >
              Aprovar review
            </Button>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              loading={actionLoading === "dismiss"}
              disabled={!!actionLoading && actionLoading !== "dismiss"}
              onClick={() => handleAction("dismiss")}
              className="flex-1 active:scale-95"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              Ignorar denúncia
            </Button>
            <Button
              variant="secondary"
              size="sm"
              loading={claimLoading}
              disabled={!!actionLoading}
              onClick={handleUnclaim}
              className="flex-1 active:scale-95"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
            >
              Liberar
            </Button>
          </div>
        </div>
      )}

      {isClaimedByOther && (
        <p className="text-xs text-center py-2" style={{ color: "var(--text-muted)" }}>
          Sendo analisada por @{report.claimedBy?.handle}
        </p>
      )}
    </article>
  );
}

export default function AdminDenunciasPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentHandle = session?.user?.name ?? "";

  useEffect(() => {
    fetch("/api/admin/reports")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao carregar denúncias");
        return res.json();
      })
      .then((data: Report[]) => setReports(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function updateReport(id: string, updates: Partial<Report> | null) {
    if (updates === null) {
      setReports((prev) => prev.filter((r) => r.id !== id));
      return;
    }
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  }

  return (
    <div className="flex gap-6 items-start">
      <section className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Denúncias pendentes
          </h1>
          {!loading && !error && (
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              {reports.length} {reports.length === 1 ? "denúncia" : "denúncias"}
            </span>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ReportCardSkeleton />
            <ReportCardSkeleton />
            <ReportCardSkeleton />
          </div>
        )}

        {error && !loading && (
          <div
            className="rounded-2xl border p-6 text-sm text-center"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)", color: "var(--error)" }}
          >
            {error}
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div
            className="rounded-2xl border p-12 flex flex-col items-center gap-3 text-center"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <span
              className="material-symbols-rounded"
              translate="no"
              aria-hidden="true"
              style={{ fontSize: "3rem", color: "var(--brand-success)" }}
            >
              check_circle
            </span>
            <p className="text-base font-medium" style={{ color: "var(--text-secondary)" }}>
              Nenhuma denúncia pendente
            </p>
          </div>
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                currentHandle={currentHandle}
                onUpdate={updateReport}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
