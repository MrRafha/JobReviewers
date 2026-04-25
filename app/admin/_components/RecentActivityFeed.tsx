"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface LogEntry {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  createdAt: string;
  admin: { handle: string };
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

function formatRelativeDate(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `há ${days}d`;
  if (hours > 0) return `há ${hours}h`;
  if (minutes > 0) return `há ${minutes}min`;
  return "agora";
}

export default function RecentActivityFeed() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/logs?limit=10")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data: { logs: LogEntry[] }) => setLogs(data.logs))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-3"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
          Atividade Recente
        </h2>
        <Link
          href="/admin/logs"
          className="text-xs font-medium hover:underline"
          style={{ color: "var(--brand-primary)" }}
        >
          Ver todos →
        </Link>
      </div>

      {loading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="h-10 rounded-xl animate-pulse"
              style={{ backgroundColor: "var(--bg-subtle)" }}
            />
          ))}
        </div>
      )}

      {!loading && logs.length === 0 && (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Nenhuma atividade registrada.
        </p>
      )}

      {!loading && logs.length > 0 && (
        <div className="divide-y" style={{ borderColor: "var(--border)" }}>
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-3 py-2.5">
              <span
                className="material-symbols-rounded mt-0.5 shrink-0"
                translate="no"
                aria-hidden="true"
                style={{ fontSize: "1rem", color: "var(--text-muted)" }}
              >
                {ACTION_ICONS[log.action] ?? "info"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>
                  <span className="font-medium">@{log.admin.handle}</span>{" "}
                  <span style={{ color: "var(--text-secondary)" }}>
                    {ACTION_LABELS[log.action] ?? log.action}
                  </span>
                </p>
                <p className="text-xs mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                  {log.targetType} {log.targetId.slice(0, 8)}…
                </p>
              </div>
              <span className="text-xs shrink-0 mt-0.5" style={{ color: "var(--text-muted)" }}>
                {formatRelativeDate(log.createdAt)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
