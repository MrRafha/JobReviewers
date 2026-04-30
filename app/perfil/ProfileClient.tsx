"use client";

import { useState } from "react";
import Image from "next/image";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";
import UserReviewsSection from "./UserReviewsSection";

interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  color: string;
}

interface ProfileData {
  id: string;
  email: string;
  handle: string;
  createdAt: string;
  _count: { reviews: number };
  badges: Badge[];
}

export default function ProfileClient({ profile }: { profile: ProfileData }) {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [handle, setHandle] = useState(profile.handle);
  const [inputValue, setInputValue] = useState(profile.handle);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");
    if (inputValue === handle) { setEditing(false); return; }

    setSaving(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ handle: inputValue }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Erro ao salvar apelido"); return; }
      setHandle(data.handle);
      setEditing(false);
      showToast("Apelido atualizado com sucesso!", "success");
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setInputValue(handle);
    setError("");
    setEditing(false);
  }

  const joinedAt = new Date(profile.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Card principal */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm space-y-8">

        {/* Avatar + info */}
        <div className="flex items-start gap-5">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full bg-[var(--brand-primary)] flex items-center justify-center text-white text-2xl font-bold select-none">
              {handle.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-sora text-xl font-bold text-[var(--text-primary)]">@{handle}</p>
              {profile.badges.map((badge) => (
                <div key={badge.id} className="group relative shrink-0 cursor-default">
                  {/* Círculo da badge */}
                  <div
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center overflow-hidden"
                    style={{ borderColor: badge.color, backgroundColor: `${badge.color}20` }}
                  >
                    <Image src={badge.iconUrl} alt={badge.name} width={22} height={22} className="object-contain" />
                  </div>
                  {/* Tooltip */}
                  <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
                    <div className="rounded-lg px-2.5 py-1.5 text-xs shadow-lg bg-[#1e293b]">
                      <p className="font-semibold text-white">{badge.name}</p>
                      <p className="font-normal text-slate-300 mt-0.5">{badge.description}</p>
                    </div>
                    <div className="w-2 h-2 rotate-45 mx-auto -mt-1 bg-[#1e293b]" />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Membro desde {joinedAt}</p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--bg-subtle)] rounded-xl px-5 py-4 text-center">
            <p className="text-2xl font-bold text-[var(--brand-primary)]">{profile._count.reviews}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {profile._count.reviews === 1 ? "Review publicada" : "Reviews publicadas"}
            </p>
          </div>
          <div className="bg-[var(--bg-subtle)] rounded-xl px-5 py-4 text-center">
            <p className="text-sm font-medium text-[var(--text-primary)] break-all">{profile.email}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">E-mail</p>
          </div>
        </div>

        {/* Edição de apelido */}
        <div>
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Apelido</h2>
          {editing ? (
            <div className="space-y-3">
              <Input
                value={inputValue}
                onChange={(e) => { setInputValue(e.target.value.toLowerCase()); setError(""); }}
                error={error}
                hint="Apenas letras minúsculas, números e _"
                autoFocus
              />
              <div className="flex gap-2">
                <Button variant="primary" size="sm" loading={saving} onClick={handleSave}>Salvar</Button>
                <Button variant="ghost" size="sm" onClick={handleCancel} disabled={saving}>Cancelar</Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-primary)] font-mono">@{handle}</span>
              <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>Alterar apelido</Button>
            </div>
          )}
        </div>
      </div>

      {/* Seção de reviews */}
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm">
        <h2 className="font-sora text-lg font-bold text-[var(--text-primary)] mb-5">Minhas Reviews</h2>
        <UserReviewsSection />
      </div>
    </div>
  );
}
