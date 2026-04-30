"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, DragEvent } from "react";

import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  color: string;
  autoRule: "NEW_ACCOUNT" | null;
  createdAt: string;
  _count: { userBadges: number };
}

interface UserResult {
  id: string;
  handle: string | null;
  email: string;
  name: string | null;
}

interface UserBadgeEntry {
  userId: string;
  badgeId: string;
  grantedAt: string;
  user: { id: string; handle: string | null; email: string };
}

const AUTO_RULE_LABEL: Record<string, string> = { NEW_ACCOUNT: "Conta nova (≤7 dias)" };

const PRESET_COLORS = [
  "#2563eb", "#7c3aed", "#db2777", "#dc2626",
  "#ea580c", "#ca8a04", "#16a34a", "#0891b2",
  "#475569", "#1e293b",
];

function BadgeRowSkeleton() {
  return (
    <tr>
      {Array.from({ length: 6 }, (_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded animate-pulse bg-[var(--bg-subtle)]" style={{ width: i === 0 ? "32px" : i === 1 ? "120px" : "80px" }} />
        </td>
      ))}
    </tr>
  );
}

function ConfirmModal({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onCancel}>
      <div className="rounded-2xl border p-6 w-full max-w-sm shadow-xl bg-[var(--bg-surface)] border-[var(--border)]" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold mb-2 text-[var(--text-primary)]">Excluir badge</h3>
        <p className="text-sm mb-5 text-[var(--text-secondary)]">
          Tem certeza que deseja excluir o badge <strong>{name}</strong>? Ele será removido de todos os usuários.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" size="sm" onClick={onConfirm} className="flex-1">Excluir</Button>
          <Button variant="secondary" size="sm" onClick={onCancel} className="flex-1">Cancelar</Button>
        </div>
      </div>
    </div>
  );
}

function IconDropzone({
  preview,
  color,
  dragging,
  fileRef,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileChange,
}: {
  preview: string | null;
  color: string;
  dragging: boolean;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <input ref={fileRef} type="file" accept="image/png,image/svg+xml,image/webp,image/jpeg" onChange={onFileChange} className="hidden" />
      <div
        onClick={() => fileRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className="relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors px-6 py-8"
        style={{ borderColor: dragging ? "var(--brand-primary)" : "var(--border)", backgroundColor: dragging ? "rgba(37,99,235,0.04)" : "var(--bg-base)" }}
      >
        {preview ? (
          <>
            <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center overflow-hidden shadow-sm" style={{ borderColor: color }}>
              <Image src={preview} alt="preview" width={48} height={48} className="object-contain" unoptimized={preview.startsWith("data:")} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--text-primary)]">Imagem selecionada</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">Clique ou arraste para trocar</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-full bg-[var(--bg-subtle)] border border-[var(--border)] flex items-center justify-center">
              <span className="material-symbols-rounded text-2xl text-[var(--text-muted)]">upload</span>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Arraste a imagem aqui ou <span className="text-[var(--brand-primary)]">clique para selecionar</span>
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">PNG, SVG, WebP ou JPEG · máx 2MB</p>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function ColorPicker({ color, dominantColors, loadingColors, onChange }: { color: string; dominantColors: string[]; loadingColors: boolean; onChange: (c: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Cor da borda</label>
      {loadingColors && <p className="text-xs text-[var(--text-muted)] mb-2">Extraindo cores da imagem…</p>}
      <div className="flex flex-wrap gap-2">
        {[...new Set([...dominantColors, ...PRESET_COLORS])].map((c) => (
          <button key={c} type="button" onClick={() => onChange(c)}
            className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
            style={{ backgroundColor: c, borderColor: color === c ? "#000" : "transparent", outline: color === c ? `2px solid ${c}` : "none", outlineOffset: "2px" }}
            title={c}
          />
        ))}
        <input type="color" value={color} onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded-full border border-[var(--border)] cursor-pointer" title="Cor personalizada" />
      </div>
    </div>
  );
}

// ── Edit Badge Modal ──────────────────────────────────────────────────────────

function EditBadgeModal({ badge, onClose, onUpdated }: { badge: Badge; onClose: () => void; onUpdated: (b: Badge) => void }) {
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(badge.name);
  const [description, setDescription] = useState(badge.description);
  const [color, setColor] = useState(badge.color);
  const [autoRule, setAutoRule] = useState<"NEW_ACCOUNT" | "">(badge.autoRule ?? "");
  const [preview, setPreview] = useState<string | null>(badge.iconUrl);
  const [iconBase64, setIconBase64] = useState<string | null>(null);
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [loadingColors, setLoadingColors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function processFile(file: File) {
    if (!file.type.startsWith("image/")) { showToast("Selecione uma imagem válida.", "error"); return; }
    if (file.size > 2 * 1024 * 1024) { showToast("A imagem deve ter no máximo 2MB.", "error"); return; }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setIconBase64(base64);
      setPreview(base64);
      setDominantColors([]);
      setLoadingColors(true);
      try {
        const res = await fetch("/api/admin/badges/upload-preview", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ iconBase64: base64 }) });
        const data = await res.json();
        if (Array.isArray(data.dominantColors)) { setDominantColors(data.dominantColors); if (data.dominantColors[0]) setColor(data.dominantColors[0]); }
      } catch { showToast("Erro ao extrair cores.", "error"); } finally { setLoadingColors(false); }
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const body: Record<string, unknown> = { name, description, color, autoRule: autoRule || null };
      if (iconBase64) body.iconBase64 = iconBase64;
      const res = await fetch(`/api/admin/badges/${badge.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { showToast(data.error ?? "Erro ao atualizar badge.", "error"); return; }
      showToast("Badge atualizado!", "success");
      onUpdated({ ...data, _count: badge._count });
      onClose();
    } catch { showToast("Erro de conexão.", "error"); } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="rounded-2xl border w-full max-w-lg shadow-xl bg-[var(--bg-surface)] border-[var(--border)] my-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <h3 className="text-base font-semibold text-[var(--text-primary)]">Editar badge</h3>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <span className="material-symbols-rounded text-xl">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Nome</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} maxLength={50}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Regra automática</label>
              <select value={autoRule} onChange={(e) => setAutoRule(e.target.value as "NEW_ACCOUNT" | "")}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none">
                <option value="">Nenhuma (manual)</option>
                <option value="NEW_ACCOUNT">Conta nova (≤7 dias)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Descrição</label>
            <input required value={description} onChange={(e) => setDescription(e.target.value)} maxLength={200}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Ícone <span className="font-normal text-[var(--text-muted)]">(opcional — troca apenas se selecionar nova imagem)</span></label>
            <IconDropzone preview={preview} color={color} dragging={dragging} fileRef={fileRef}
              onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); }}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onFileChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
            />
          </div>
          <ColorPicker color={color} dominantColors={dominantColors} loadingColors={loadingColors} onChange={setColor} />
          <div className="flex gap-3 pt-2">
            <Button type="submit" variant="primary" size="sm" loading={saving} className="flex-1">Salvar</Button>
            <Button type="button" variant="secondary" size="sm" onClick={onClose} className="flex-1">Cancelar</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Manage Users Modal ────────────────────────────────────────────────────────

function ManageUsersModal({ badge, onClose, onCountChange }: { badge: Badge; onClose: () => void; onCountChange: (delta: number) => void }) {
  const { showToast } = useToast();
  const [members, setMembers] = useState<UserBadgeEntry[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [grantingId, setGrantingId] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchMembers = useCallback(async () => {
    setLoadingMembers(true);
    try {
      const res = await fetch(`/api/admin/badges/${badge.id}/users`);
      const data = await res.json();
      if (Array.isArray(data)) setMembers(data);
    } catch { showToast("Erro ao carregar usuários.", "error"); } finally { setLoadingMembers(false); }
  }, [badge.id, showToast]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!search.trim()) { setSearchResults([]); return; }
    searchTimeout.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/admin/users?search=${encodeURIComponent(search)}&limit=10`);
        const data = await res.json();
        if (Array.isArray(data.users)) setSearchResults(data.users);
      } catch { /* silently ignore */ } finally { setSearching(false); }
    }, 350);
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [search]);

  const memberIds = new Set(members.map((m) => m.userId));

  async function handleGrant(user: UserResult) {
    setGrantingId(user.id);
    try {
      const res = await fetch(`/api/admin/badges/${badge.id}/users`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id }) });
      if (!res.ok) { showToast("Erro ao conceder badge.", "error"); return; }
      showToast(`Badge concedido a ${user.handle ?? user.email}!`, "success");
      onCountChange(1);
      await fetchMembers();
    } catch { showToast("Erro de conexão.", "error"); } finally { setGrantingId(null); }
  }

  async function handleRevoke(userId: string, label: string) {
    setRevokingId(userId);
    try {
      const res = await fetch(`/api/admin/badges/${badge.id}/users`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId }) });
      if (!res.ok) { showToast("Erro ao revogar badge.", "error"); return; }
      showToast(`Badge revogado de ${label}.`, "success");
      onCountChange(-1);
      setMembers((prev) => prev.filter((m) => m.userId !== userId));
    } catch { showToast("Erro de conexão.", "error"); } finally { setRevokingId(null); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose}>
      <div className="rounded-2xl border w-full max-w-lg shadow-xl bg-[var(--bg-surface)] border-[var(--border)] flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 overflow-hidden flex items-center justify-center shrink-0" style={{ borderColor: badge.color }}>
              <Image src={badge.iconUrl} alt={badge.name} width={24} height={24} className="object-contain" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--text-primary)]">{badge.name}</h3>
              <p className="text-xs text-[var(--text-muted)]">Gerenciar usuários com este badge</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            <span className="material-symbols-rounded text-xl">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Search section */}
          <div className="px-6 pt-5 pb-4 border-b border-[var(--border)]">
            <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">Conceder badge a usuário</label>
            <div className="relative">
              <span className="material-symbols-rounded absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-lg">search</span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por handle ou e-mail…"
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] pl-9 pr-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20"
              />
            </div>

            {(searching || searchResults.length > 0) && (
              <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] overflow-hidden">
                {searching ? (
                  <div className="px-4 py-3 text-sm text-[var(--text-muted)]">Buscando…</div>
                ) : searchResults.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-[var(--text-muted)]">Nenhum usuário encontrado.</div>
                ) : (
                  searchResults.map((user) => {
                    const hasBadge = memberIds.has(user.id);
                    return (
                      <div key={user.id} className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-subtle)] transition-colors">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                            {user.handle ? `@${user.handle}` : user.email}
                          </p>
                          {user.handle && <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>}
                        </div>
                        {hasBadge ? (
                          <span className="text-xs text-[var(--brand-success)] font-medium shrink-0 ml-3">Já possui</span>
                        ) : (
                          <Button variant="primary" size="sm" loading={grantingId === user.id} onClick={() => handleGrant(user)} className="shrink-0 ml-3">
                            Conceder
                          </Button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Members list */}
          <div className="px-6 py-4">
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-3">
              Usuários com este badge <span className="font-normal text-[var(--text-muted)]">({members.length})</span>
            </p>
            {loadingMembers ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="h-10 rounded-xl animate-pulse bg-[var(--bg-subtle)]" />
                ))}
              </div>
            ) : members.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-6">Nenhum usuário possui este badge ainda.</p>
            ) : (
              <div className="space-y-1">
                {members.map((m) => {
                  const label = m.user.handle ? `@${m.user.handle}` : m.user.email;
                  return (
                    <div key={m.userId} className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-[var(--bg-subtle)] transition-colors">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{label}</p>
                        {m.user.handle && <p className="text-xs text-[var(--text-muted)] truncate">{m.user.email}</p>}
                      </div>
                      <Button
                        variant="danger"
                        size="sm"
                        loading={revokingId === m.userId}
                        onClick={() => handleRevoke(m.userId, label)}
                        className="shrink-0 ml-3"
                      >
                        Revogar
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Create Badge Form ─────────────────────────────────────────────────────────

function BadgeForm({ onCreated }: { onCreated: (badge: Badge) => void }) {
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [autoRule, setAutoRule] = useState<"NEW_ACCOUNT" | "">("");
  const [preview, setPreview] = useState<string | null>(null);
  const [iconBase64, setIconBase64] = useState<string | null>(null);
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [loadingColors, setLoadingColors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function processFile(file: File) {
    if (!file.type.startsWith("image/")) { showToast("Selecione uma imagem válida.", "error"); return; }
    if (file.size > 2 * 1024 * 1024) { showToast("A imagem deve ter no máximo 2MB.", "error"); return; }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = ev.target?.result as string;
      setIconBase64(base64);
      setPreview(base64);
      setDominantColors([]);
      setLoadingColors(true);
      try {
        const res = await fetch("/api/admin/badges/upload-preview", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ iconBase64: base64 }) });
        const data = await res.json();
        if (Array.isArray(data.dominantColors)) { setDominantColors(data.dominantColors); if (data.dominantColors[0]) setColor(data.dominantColors[0]); }
      } catch { showToast("Erro ao extrair cores da imagem.", "error"); } finally { setLoadingColors(false); }
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!iconBase64) { showToast("Selecione um ícone.", "error"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/badges", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, description, iconBase64, color, autoRule: autoRule || null }) });
      const data = await res.json();
      if (!res.ok) { showToast(data.error ?? "Erro ao criar badge.", "error"); return; }
      showToast("Badge criado com sucesso!", "success");
      onCreated(data);
      setName(""); setDescription(""); setColor(PRESET_COLORS[0]); setAutoRule(""); setPreview(null); setIconBase64(null); setDominantColors([]);
      if (fileRef.current) fileRef.current.value = "";
    } catch { showToast("Erro de conexão.", "error"); } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-6 space-y-5">
      <h2 className="text-base font-semibold text-[var(--text-primary)]">Novo badge</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Nome</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} maxLength={50}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Regra automática</label>
          <select value={autoRule} onChange={(e) => setAutoRule(e.target.value as "NEW_ACCOUNT" | "")}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none">
            <option value="">Nenhuma (manual)</option>
            <option value="NEW_ACCOUNT">Conta nova (≤7 dias)</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Descrição</label>
        <input required value={description} onChange={(e) => setDescription(e.target.value)} maxLength={200}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20" />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[var(--text-primary)] mb-1">Ícone</label>
        <IconDropzone preview={preview} color={color} dragging={dragging} fileRef={fileRef}
          onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) processFile(f); }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onFileChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); }}
        />
      </div>
      <ColorPicker color={color} dominantColors={dominantColors} loadingColors={loadingColors} onChange={setColor} />
      <Button type="submit" variant="primary" size="sm" loading={saving}>Criar badge</Button>
    </form>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminBadgesPage() {
  const { showToast } = useToast();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingBadge, setDeletingBadge] = useState<Badge | null>(null);
  const [editingBadge, setEditingBadge] = useState<Badge | null>(null);
  const [managingBadge, setManagingBadge] = useState<Badge | null>(null);

  const fetchBadges = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/badges");
      const data = await res.json();
      if (Array.isArray(data)) setBadges(data);
    } catch { showToast("Erro ao carregar badges.", "error"); } finally { setLoading(false); }
  }, [showToast]);

  useEffect(() => { fetchBadges(); }, [fetchBadges]);

  async function handleDelete(badge: Badge) {
    try {
      const res = await fetch(`/api/admin/badges/${badge.id}`, { method: "DELETE" });
      if (!res.ok) { showToast("Erro ao excluir badge.", "error"); return; }
      setBadges((prev) => prev.filter((b) => b.id !== badge.id));
      showToast("Badge excluído.", "success");
    } catch { showToast("Erro de conexão.", "error"); } finally { setDeletingBadge(null); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Badges</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Gerencie os badges da plataforma</p>
      </div>

      <BadgeForm onCreated={(badge) => setBadges((prev) => [badge, ...prev])} />

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--bg-subtle)]">
                {["Ícone", "Nome", "Descrição", "Regra", "Usuários", "Ações"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {loading ? (
                Array.from({ length: 3 }, (_, i) => <BadgeRowSkeleton key={i} />)
              ) : badges.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-[var(--text-muted)]">Nenhum badge criado ainda.</td>
                </tr>
              ) : (
                badges.map((badge) => (
                  <tr key={badge.id} className="hover:bg-[var(--bg-subtle)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="w-8 h-8 rounded-full border-2 overflow-hidden flex items-center justify-center" style={{ borderColor: badge.color }}>
                        <Image src={badge.iconUrl} alt={badge.name} width={24} height={24} className="object-contain" />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{badge.name}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] max-w-xs truncate">{badge.description}</td>
                    <td className="px-4 py-3">
                      {badge.autoRule ? (
                        <span className="rounded-full bg-[rgba(37,99,235,0.1)] px-2 py-0.5 text-xs font-medium text-[var(--brand-primary)]">
                          {AUTO_RULE_LABEL[badge.autoRule]}
                        </span>
                      ) : (
                        <span className="text-[var(--text-muted)] text-xs">Manual</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setManagingBadge(badge)}
                        className="inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-primary)] hover:underline"
                      >
                        {badge._count?.userBadges ?? 0}
                        <span className="material-symbols-rounded text-base">group</span>
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingBadge(badge)}
                          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                          title="Editar"
                        >
                          <span className="material-symbols-rounded text-base">edit</span>
                        </button>
                        <button
                          onClick={() => setManagingBadge(badge)}
                          className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                          title="Gerenciar usuários"
                        >
                          <span className="material-symbols-rounded text-base">manage_accounts</span>
                        </button>
                        <button
                          onClick={() => setDeletingBadge(badge)}
                          className="p-1.5 rounded-lg text-[var(--error)] hover:bg-[rgba(239,68,68,0.08)] transition-colors"
                          title="Excluir"
                        >
                          <span className="material-symbols-rounded text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deletingBadge && (
        <ConfirmModal
          name={deletingBadge.name}
          onConfirm={() => handleDelete(deletingBadge)}
          onCancel={() => setDeletingBadge(null)}
        />
      )}

      {editingBadge && (
        <EditBadgeModal
          badge={editingBadge}
          onClose={() => setEditingBadge(null)}
          onUpdated={(updated) => {
            setBadges((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
            setEditingBadge(null);
          }}
        />
      )}

      {managingBadge && (
        <ManageUsersModal
          badge={managingBadge}
          onClose={() => setManagingBadge(null)}
          onCountChange={(delta) => {
            setBadges((prev) => prev.map((b) =>
              b.id === managingBadge.id
                ? { ...b, _count: { userBadges: (b._count?.userBadges ?? 0) + delta } }
                : b
            ));
          }}
        />
      )}
    </div>
  );
}
