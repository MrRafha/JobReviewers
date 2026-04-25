"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import StatCard from "./_components/StatCard";
import RecentActivityFeed from "./_components/RecentActivityFeed";
import PinnedNotesPanel from "./_components/PinnedNotesPanel";

interface AdminStats {
  reports: {
    resolved: number;
    dismissed: number;
    approved: number;
    pending: number;
    claimed: number;
  };
  companies: {
    total: number;
    withPendingReports: number;
  };
}

function StatCardSkeleton() {
  return (
    <div
      className="rounded-2xl border p-5 animate-pulse"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
    >
      <div className="flex justify-between mb-3">
        <div className="h-4 w-32 rounded" style={{ backgroundColor: "var(--bg-subtle)" }} />
        <div className="h-5 w-5 rounded" style={{ backgroundColor: "var(--bg-subtle)" }} />
      </div>
      <div className="h-9 w-20 rounded-lg" style={{ backgroundColor: "var(--bg-subtle)" }} />
    </div>
  );
}

export default function AdminPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((data: AdminStats) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pendingTotal = (stats?.reports.pending ?? 0) + (stats?.reports.claimed ?? 0);
  const resolvedTotal = (stats?.reports.resolved ?? 0) + (stats?.reports.approved ?? 0) + (stats?.reports.dismissed ?? 0);
  const handle = session?.user?.name ?? "";

  return (
    <div className="flex gap-6 items-start">
      <div className="flex-[2] min-w-0 flex flex-col gap-6">
        <div>
          <h1 className="text-xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
            Dashboard
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Visão geral da moderação
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            Denúncias
          </p>
          <div className="grid grid-cols-2 gap-4">
            {loading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  title="Finalizadas"
                  value={resolvedTotal}
                  icon="check_circle"
                  variant="success"
                  description={`${stats?.reports.resolved ?? 0} resolvidas · ${stats?.reports.approved ?? 0} aprovadas · ${stats?.reports.dismissed ?? 0} ignoradas`}
                />
                <StatCard
                  title="Pendentes / Em análise"
                  value={pendingTotal}
                  icon="flag"
                  variant={pendingTotal > 0 ? "danger" : "success"}
                  href={pendingTotal > 0 ? "/admin/denuncias" : undefined}
                  description={`${stats?.reports.pending ?? 0} aguardando · ${stats?.reports.claimed ?? 0} em análise`}
                />
              </>
            )}
          </div>
        </div>

        <div
          className="border-t"
          style={{ borderColor: "var(--border)" }}
        />

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            Empresas
          </p>
          <div className="grid grid-cols-2 gap-4">
            {loading ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <StatCard
                  title="Cadastradas"
                  value={stats?.companies.total ?? 0}
                  icon="business"
                  variant="success"
                  description="Total de empresas na plataforma"
                />
                <StatCard
                  title="Com denúncias ativas"
                  value={stats?.companies.withPendingReports ?? 0}
                  icon="warning"
                  variant={
                    (stats?.companies.withPendingReports ?? 0) > 0 ? "danger" : "success"
                  }
                  href={
                    (stats?.companies.withPendingReports ?? 0) > 0
                      ? "/admin/denuncias"
                      : undefined
                  }
                  description="Empresas com pelo menos 1 denúncia pendente"
                />
              </>
            )}
          </div>
        </div>
      </div>

      <aside className="flex-1 min-w-0 flex flex-col gap-4 sticky top-6">
        <RecentActivityFeed />
        <PinnedNotesPanel currentAdminHandle={handle} />
      </aside>
    </div>
  );
}
