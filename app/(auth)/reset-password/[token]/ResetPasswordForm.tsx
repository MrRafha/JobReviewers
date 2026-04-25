"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!password || !confirmPassword) {
      setError("Todos os campos são obrigatórios");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Erro ao redefinir senha", "error");
        return;
      }

      showToast("Senha redefinida com sucesso! Redirecionando...", "success");
      setSuccess(true);
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch {
      showToast("Erro de conexão. Tente novamente.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-base)] px-4 py-12">
      {/* Logo and Header */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block mb-6">
          <Image
            src="/logo.png"
            alt="JobReviewers Logo"
            width={112}
            height={80}
            className="h-20 w-28 mx-auto transition-transform hover:scale-105"
          />
        </Link>
        <h1 className="font-sora text-3xl font-bold text-[var(--text-primary)] mb-2">
          JobReviewers
        </h1>
        <p className="text-[var(--text-secondary)]">Defina uma nova senha</p>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-8 shadow-sm">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="mb-6 p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-lg transition-all"
            aria-label="Voltar"
            type="button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
          </button>

          <h2 className="font-sora text-2xl font-bold text-[var(--text-primary)] mb-3 text-center">
            Redefinir Senha
          </h2>
          <p className="text-center text-sm text-[var(--text-secondary)] mb-6">
            Digite uma nova senha segura
          </p>

          {/* Success State */}
          {success ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-[var(--brand-success-bg)] border border-[var(--brand-success)] p-4 text-center">
                <p className="font-semibold text-[var(--brand-success)] mb-2">
                  ✓ Senha redefinida com sucesso!
                </p>
                <p className="text-sm text-[var(--brand-success)]">
                  Você será redirecionado para a página de login em alguns instantes.
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center h-11 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white rounded-xl font-semibold transition-all"
                >
                  Ir para o Login
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Error Message */}
              {error && (
                <div className="mb-4 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] p-3 text-sm text-[var(--error)]">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Nova Senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  hint="Mínimo 8 caracteres"
                  required
                />

                <Input
                  label="Confirmar Senha"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading}
                  fullWidth
                >
                  {loading ? "Redefinindo..." : "Redefinir Senha"}
                </Button>
              </form>

              {/* Back to Login */}
              <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
                <Link
                  href="/login"
                  className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-semibold transition-colors"
                >
                  Voltar ao login
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            Seus dados estão protegidos e nunca serão compartilhados
          </p>
        </div>
      </div>
    </div>
  );
}
