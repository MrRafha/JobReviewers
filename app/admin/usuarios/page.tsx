"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

interface AdminUser {
  id: string;
  email: string;
  handle: string;
  name: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;
  _count: { reviews: number };
}

interface UsersResponse {
  users: AdminUser[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

function formatDatePtBR(isoString: string): string {
  return new Date(isoString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function UserRowSkeleton() {
  return (
    <tr>
      {Array.from({ length: 5 }, (_, i) => (
        <td key={i} className="px-4 py-3">
          <div
            className="h-4 rounded animate-pulse"
            style={{ backgroundColor: "var(--bg-subtle)", width: i === 0 ? "80px" : i === 1 ? "140px" : "60px" }}
          />
        </td>
      ))}
    </tr>
  );
}

function ConfirmModal({
  handle,
  onConfirm,
  onCancel,
}: {
  handle: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onCancel}
    >
      <div
        className="rounded-2xl border p-6 w-full max-w-sm shadow-xl"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
          Excluir usuário
        </h3>
        <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
          Tem certeza que deseja excluir <strong>@{handle}</strong>? Essa ação é irreversível.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" size="sm" onClick={onConfirm} className="flex-1">
            Excluir
          </Button>
          <Button variant="secondary" size="sm" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsuariosPage() {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<AdminUser | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearchDebounced(search);
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (searchDebounced) params.set("search", searchDebounced);

    fetch(`/api/admin/users?${params}`)
      .then((r) => r.ok ? r.json() : Promise.reject())
      .then((d: UsersResponse) => setData(d))
      .catch(() => showToast("Erro ao carregar usuários.", "error"))
      .finally(() => setLoading(false));
  }, [page, searchDebounced, showToast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  async function handleRoleChange(user: AdminUser) {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    setActionLoading(`role-${user.id}`);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }
      setData((prev) =>
        prev
          ? { ...prev, users: prev.users.map((u) => u.id === user.id ? { ...u, role: newRole } : u) }
          : prev
      );
      showToast(`@${user.handle} agora é ${newRole === "ADMIN" ? "Admin" : "Usuário"}.`, "success");
    } catch (err) {
      showToast((err as Error).message || "Erro ao alterar role.", "error");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(user: AdminUser) {
    setConfirmDelete(null);
    setActionLoading(`delete-${user.id}`);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }
      setData((prev) =>
        prev
          ? { ...prev, users: prev.users.filter((u) => u.id !== user.id), totalCount: prev.totalCount - 1 }
          : prev
      );
      showToast(`@${user.handle} excluído com sucesso.`, "success");
    } catch (err) {
      showToast((err as Error).message || "Erro ao excluir usuário.", "error");
    } finally {
      setActionLoading(null);
    }
  }

  const isSelf = (id: string) => id === session?.user?.id;

  return (
    <>
      {confirmDelete && (
        <ConfirmModal
          handle={confirmDelete.handle}
          onConfirm={() => handleDelete(confirmDelete)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
              Usuários
            </h1>
            {data && (
              <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                {data.totalCount} {data.totalCount === 1 ? "usuário" : "usuários"} cadastrados
              </p>
            )}
          </div>

          <div
            className="flex items-center gap-2 rounded-xl border px-3 py-2"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-surface)" }}
          >
            <span
              className="material-symbols-rounded"
              translate="no"
              aria-hidden="true"
              style={{ fontSize: "1rem", color: "var(--text-muted)" }}
            >
              search
            </span>
            <input
              type="text"
              placeholder="Buscar por handle ou email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none text-sm bg-transparent w-52"
              style={{ color: "var(--text-primary)" }}
            />
          </div>
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
                <th className="px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Handle</th>
                <th className="px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Email</th>
                <th className="px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Role</th>
                <th className="px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Reviews</th>
                <th className="px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Cadastro</th>
                <th className="px-4 py-3 font-semibold" style={{ color: "var(--text-secondary)" }}>Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
              {loading && Array.from({ length: 5 }, (_, i) => <UserRowSkeleton key={i} />)}

              {!loading && data?.users.map((user) => (
                <tr key={user.id} style={{ opacity: isSelf(user.id) ? 0.6 : 1 }}>
                  <td className="px-4 py-3 font-medium" style={{ color: "var(--text-primary)" }}>
                    @{user.handle}
                    {isSelf(user.id) && (
                      <span className="ml-1.5 text-xs" style={{ color: "var(--text-muted)" }}>(você)</span>
                    )}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-medium px-2 py-1 rounded-full border"
                      style={
                        user.role === "ADMIN"
                          ? {
                              backgroundColor: "rgba(37,99,235,0.08)",
                              color: "var(--brand-primary)",
                              borderColor: "rgba(37,99,235,0.25)",
                            }
                          : {
                              backgroundColor: "var(--bg-subtle)",
                              color: "var(--text-muted)",
                              borderColor: "var(--border)",
                            }
                      }
                    >
                      {user.role === "ADMIN" ? "Admin" : "Usuário"}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    {user._count.reviews}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>
                    {formatDatePtBR(user.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRoleChange(user)}
                        disabled={isSelf(user.id) || actionLoading === `role-${user.id}`}
                        className="text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-opacity disabled:opacity-40"
                        style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
                        title={isSelf(user.id) ? "Você não pode alterar sua própria role" : undefined}
                      >
                        {actionLoading === `role-${user.id}`
                          ? "…"
                          : user.role === "ADMIN"
                          ? "Rebaixar"
                          : "Promover"}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(user)}
                        disabled={isSelf(user.id) || !!actionLoading}
                        className="text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-opacity disabled:opacity-40"
                        style={{
                          borderColor: "rgba(239,68,68,0.3)",
                          color: "var(--error)",
                          backgroundColor: "rgba(239,68,68,0.04)",
                        }}
                        title={isSelf(user.id) ? "Você não pode excluir a si mesmo" : undefined}
                      >
                        {actionLoading === `delete-${user.id}` ? "…" : "Excluir"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && data?.users.length === 0 && (
            <div className="p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
              Nenhum usuário encontrado.
            </div>
          )}
        </div>

        {data && data.totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
            >
              ← Anterior
            </Button>
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>
              {page} / {data.totalPages}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((p) => p + 1)}
              disabled={page === data.totalPages}
            >
              Próxima →
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
