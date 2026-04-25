"use client";

import { useEffect, useRef, useState } from "react";

interface AdminNote {
  id: string;
  content: string;
  createdAt: string;
  author: { handle: string };
}

function formatDatePtBR(isoString: string): string {
  return new Date(isoString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function PinnedNotesPanel({ currentAdminHandle }: { currentAdminHandle: string }) {
  const [notes, setNotes] = useState<AdminNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    fetch("/api/admin/notes")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data: unknown) => { if (Array.isArray(data)) setNotes(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });
      if (!res.ok) return;
      const note: AdminNote = await res.json();
      setNotes((prev) => [note, ...prev]);
      setContent("");
      textareaRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/admin/notes/${id}`, { method: "DELETE" });
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-4"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      <div className="flex items-center gap-2">
        <span
          className="material-symbols-rounded"
          translate="no"
          aria-hidden="true"
          style={{ fontSize: "1.1rem", color: "var(--text-muted)" }}
        >
          push_pin
        </span>
        <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          Notas fixadas
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Adicionar nota para a equipe..."
          rows={2}
          maxLength={500}
          className="w-full rounded-xl px-3 py-2 text-sm resize-none outline-none border transition-colors"
          style={{
            backgroundColor: "var(--bg-subtle)",
            borderColor: "var(--border)",
            color: "var(--text-primary)",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit(e as unknown as React.FormEvent);
          }}
        />
        <button
          type="submit"
          disabled={!content.trim() || submitting}
          className="self-end text-xs font-medium px-3 py-1.5 rounded-lg transition-opacity disabled:opacity-40"
          style={{
            backgroundColor: "var(--brand-primary)",
            color: "#fff",
          }}
        >
          {submitting ? "Salvando…" : "Fixar nota"}
        </button>
      </form>

      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {loading && (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-14 rounded-xl animate-pulse"
                style={{ backgroundColor: "var(--bg-subtle)" }}
              />
            ))}
          </div>
        )}

        {!loading && notes.length === 0 && (
          <p className="text-xs text-center py-4" style={{ color: "var(--text-muted)" }}>
            Nenhuma nota fixada ainda.
          </p>
        )}

        {notes.map((note) => (
          <div
            key={note.id}
            className="rounded-xl px-3 py-2.5 text-sm group relative"
            style={{
              backgroundColor: "var(--bg-subtle)",
              borderLeft: "3px solid var(--brand-primary)",
            }}
          >
            <p style={{ color: "var(--text-primary)" }} className="leading-snug break-words">
              {note.content}
            </p>
            <div className="flex items-center justify-between mt-1.5">
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                @{note.author.handle} · {formatDatePtBR(note.createdAt)}
              </span>
              <button
                onClick={() => handleDelete(note.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remover nota"
              >
                <span
                  className="material-symbols-rounded"
                  translate="no"
                  aria-hidden="true"
                  style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}
                >
                  close
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
