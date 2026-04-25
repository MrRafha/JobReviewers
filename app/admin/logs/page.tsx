"use client";

import { useCallback, useEffect, useState } from "react";

interface LogEntry {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  meta: string | null;
  createdAt: string;
  admin: { handle: string };
}

interface LogsResponse {
  logs: LogEntry[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

const ACTION_LABELS: Record<string, string> = {
  hide_review: "ocultou review",
  unhide_review: "reexibiu review",
  resolve_report: "resolveu denúncia",
  dismiss_report: "ignorou denúncia",
  approve_report: "aprovou review",
  claim_report: "pegou denúncia",
  unclaim_report: "liberou denúncia",
  change_user_role: "alterou role de usuário",
  delete_user: "excluiu usuário",
};

const ACTION_ICONS: Record<string, string> = {
  hide_review: "visibility_off",
  unhide_review: "visibility",
  resolve_report: "check",
  dismiss_report: "remove_circle",
  approve_report: "verified",
  claim_report: "assignment_ind",
  unclaim_report: "assignment_return",
  change_user_role: "manage_accounts",
  delete_user: "person_remove",
};

function formatDateFull(isoString: string): string {
  return new Date(isoString).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function LogRowSkeleton() {
  return (
    <tr>
      {Array.from({ length: 5 }, (_, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-4 rounded animate-pulse"
            style={{ backgroundColor: "var(--bg-subtle)", width: i === 0 ? "80px" : i === 2 ? "140px" : "60px" }}
          />
        </td>
      ))}
    </tr>
  );
}

export default function AdminLogsPage() {
  const [data, setData] = useState<LogsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchLogs = useCallback(() => {
    setLoading(true);
    fetch(`/api/admin/logs?page=${page}&limit=30`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d: LogsResponse) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          Logs de Atividade
        </h1>
        {data && (
          <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
            {data.totalCount} {data.totalCount === 1 ? "registro" : "registros"}
          </p>
        )}
      </div>

      <div
        className="rounded-2xl border overflow-hidden"
        style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              className="border-b text-left"
              style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-subtle)" }}
            >
              <th className="px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Admin</th>
              <th className="px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Ação</th>
              <th className="px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Alvo</th>
              <th className="px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Detalhes</th>
              <th className="px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Data</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
            {loading && Array.from({ length: 10 }, (_, i) => <LogRowSkeleton key={i} />)}

            {!loading && data?.logs.map((log) => (
              <tr key={log.id}>
                <td className="px-4 py-3 font-medium" style={{ color: "var(--text-primary)" }}>
                  @{log.admin.handle}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="material-symbols-rounded"
                      translate="no"
                      aria-hidden="true"
                      style={{ fontSize: "1rem", color: "var(--text-muted)" }}
                    >
                      {ACTION_ICONS[log.action] ?? "info"}
                    </span>
                    <span style={{ color: "var(--text-secondary)" }}>
                      {ACTION_LABELS[log.action] ?? log.action}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                  {log.targetType} · {log.targetId.slice(0, 8)}…
                </td>
                <td className="px-4 py-3 max-w-xs">
                  {log.meta ? (
                    <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                      {log.meta.slice(0, 60)}{log.meta.length > 60 ? "…" : ""}
                    </span>
                  ) : (
                    <span style={{ color: "var(--text-muted)" }}>—</span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                  {formatDateFull(log.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && data?.logs.length === 0 && (
          <div className="p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
            Nenhum registro de atividade.
          </div>
        )}
      </div>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="text-sm font-medium px-3 py-1.5 rounded-lg border disabled:opacity-40 transition-opacity"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            ← Anterior
          </button>
          <span className="text-sm" style={{ color: "var(--text-muted)" }}>
            {page} / {data.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === data.totalPages}
            className="text-sm font-medium px-3 py-1.5 rounded-lg border disabled:opacity-40 transition-opacity"
            style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
          >
            Próxima →
          </button>
        </div>
      )}
    </div>
  );
}
