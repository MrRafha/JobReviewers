"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface ForgotPasswordFormProps {
  success?: boolean;
}

export default function ForgotPasswordForm({
  success: initialSuccess,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(initialSuccess || false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao enviar email de recuperação");
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch {
      setError("Erro de conexão. Tente novamente.");
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
        <p className="text-[var(--text-secondary)]">
          Recuperar sua senha de forma segura
        </p>
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
            Recuperar Senha
          </h2>
          <p className="text-center text-sm text-[var(--text-secondary)] mb-6">
            Digite o email associado à sua conta
          </p>

          {/* Success State */}
          {success ? (
            <div className="space-y-4">
              <div className="rounded-lg bg-[var(--brand-success-bg)] border border-[var(--brand-success)] p-4 text-center">
                <p className="font-semibold text-[var(--brand-success)] mb-2">
                  ✓ Email enviado com sucesso!
                </p>
                <p className="text-sm text-[var(--brand-success)]">
                  Verifique sua caixa de entrada para as instruções de recuperação de senha. O link válido por 1 hora.
                </p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center h-11 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white rounded-xl font-semibold transition-all"
                >
                  Voltar ao Login
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
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  loading={loading}
                  fullWidth
                >
                  {loading ? "Enviando..." : "Enviar Link de Recuperação"}
                </Button>
              </form>

              {/* Back to Login */}
              <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
                Lembrou sua senha?{" "}
                <Link
                  href="/login"
                  className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-semibold transition-colors"
                >
                  Fazer login
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
