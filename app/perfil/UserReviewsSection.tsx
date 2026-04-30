"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

const SENIORITY_LABEL: Record<string, string> = { JR: "Júnior", PL: "Pleno", SR: "Sênior" };
const CONTRACT_LABEL: Record<string, string> = { CLT: "CLT", PJ: "PJ", ESTAGIO: "Estágio", FREELA: "Freelancer" };
const WORKMODE_LABEL: Record<string, string> = { REMOTO: "Remoto", HIBRIDO: "Híbrido", PRESENCIAL: "Presencial" };

interface ReviewCompany { id: string; name: string; slug: string }
interface UserReview {
  id: string;
  roleArea: string;
  seniority: string;
  contractType: string;
  workMode: string;
  year: number | null;
  ratingOverall: number;
  pros: string;
  cons: string;
  createdAt: string;
  company: ReviewCompany;
}

function ConfirmDeleteModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onCancel}>
      <div className="rounded-2xl border p-6 w-full max-w-sm shadow-xl bg-[var(--bg-surface)] border-[var(--border)]" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold mb-2 text-[var(--text-primary)]">Excluir review</h3>
        <p className="text-sm mb-5 text-[var(--text-secondary)]">Tem certeza que deseja excluir esta avaliação? Essa ação é irreversível.</p>
        <div className="flex gap-3">
          <Button variant="danger" size="sm" onClick={onConfirm} className="flex-1">Excluir</Button>
          <Button variant="secondary" size="sm" onClick={onCancel} className="flex-1">Cancelar</Button>
        </div>
      </div>
    </div>
  );
}

function EditReviewModal({ review, onSave, onCancel }: { review: UserReview; onSave: (updated: UserReview) => void; onCancel: () => void }) {
  const { showToast } = useToast();
  const [pros, setPros] = useState(review.pros);
  const [cons, setCons] = useState(review.cons);
  const [roleArea, setRoleArea] = useState(review.roleArea);
  const [ratingOverall, setRatingOverall] = useState(review.ratingOverall);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/user/reviews/${review.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: review.company.id,
          roleArea,
          seniority: review.seniority,
          contractType: review.contractType,
          workMode: review.workMode,
          year: review.year,
          ratingOverall,
          pros,
          cons,
        }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error ?? "Erro ao salvar", "error"); return; }
      showToast("Review atualizada! Será revisada pelos admins.", "success");
      onSave({ ...review, roleArea, ratingOverall, pros, cons });
    } catch {
      showToast("Erro de conexão.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onCancel}>
      <div className="rounded-2xl border w-full max-w-lg shadow-xl bg-[var(--bg-surface)] border-[var(--border)] overflow-y-auto max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 space-y-4">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">Editar review — {review.company.name}</h3>

          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Cargo/Área</label>
            <input value={roleArea} onChange={(e) => setRoleArea(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Avaliação geral</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map((s) => (
                <button key={s} type="button" onClick={() => setRatingOverall(s)} className="text-2xl">
                  <span className={s <= ratingOverall ? "text-yellow-400" : "text-gray-300"}>★</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Pontos Positivos</label>
            <textarea value={pros} onChange={(e) => setPros(e.target.value)} rows={3}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Pontos Negativos</label>
            <textarea value={cons} onChange={(e) => setCons(e.target.value)} rows={3}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20 resize-none" />
          </div>

          <p className="text-xs text-[var(--text-muted)]">Após salvar, a review ficará visível mas será enviada para revisão dos admins.</p>

          <div className="flex gap-3 pt-2">
            <Button variant="primary" size="sm" loading={saving} onClick={handleSave} className="flex-1">Salvar alterações</Button>
            <Button variant="secondary" size="sm" onClick={onCancel} disabled={saving} className="flex-1">Cancelar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserReviewsSection() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<UserReview | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/reviews")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setReviews(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/user/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) { showToast("Erro ao excluir review.", "error"); return; }
      setReviews((prev) => prev.filter((r) => r.id !== id));
      showToast("Review excluída.", "success");
    } catch {
      showToast("Erro de conexão.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1,2].map((i) => (
          <div key={i} className="h-24 rounded-xl animate-pulse bg-[var(--bg-subtle)] border border-[var(--border)]" />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] px-5 py-8 text-center">
        <p className="text-sm text-[var(--text-secondary)]">Você ainda não publicou nenhuma review.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] px-5 py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link
                  href={`/companies/${review.company.slug}#review-${review.id}`}
                  className="font-semibold text-[var(--text-primary)] hover:text-[var(--brand-primary)] transition-colors truncate block"
                >
                  {review.company.name}
                </Link>
                <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                  {review.roleArea} · {SENIORITY_LABEL[review.seniority]} · {CONTRACT_LABEL[review.contractType]} · {WORKMODE_LABEL[review.workMode]}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-yellow-400 text-sm">{"★".repeat(review.ratingOverall)}{"☆".repeat(5 - review.ratingOverall)}</span>
                  <span className="text-xs text-[var(--text-muted)]">{new Date(review.createdAt).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button variant="secondary" size="sm" onClick={() => setEditingReview(review)}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => setDeletingId(review.id)}>Excluir</Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onSave={(updated) => {
            setReviews((prev) => prev.map((r) => r.id === updated.id ? updated : r));
            setEditingReview(null);
          }}
          onCancel={() => setEditingReview(null)}
        />
      )}

      {deletingId && (
        <ConfirmDeleteModal
          onConfirm={() => handleDelete(deletingId)}
          onCancel={() => setDeletingId(null)}
        />
      )}
    </>
  );
}
