"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";

interface LoginFormProps {
  callbackUrl?: string;
  registered?: string;
}

export default function LoginForm({ callbackUrl, registered }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const resolvedCallbackUrl = callbackUrl || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        showToast("Email ou senha inválidos", "error");
        return;
      }

      router.push(resolvedCallbackUrl);
      router.refresh();
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
        <p className="text-[var(--text-secondary)]">
          Entre em sua conta para continuar
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

          <h2 className="font-sora text-2xl font-bold text-[var(--text-primary)] mb-6 text-center">
            Login
          </h2>

          {/* Success Message */}
          {registered && (
            <div className="mb-4 rounded-lg bg-[var(--brand-success-bg)] border border-[var(--brand-success)] p-3 text-sm text-[var(--brand-success)]">
              Conta criada com sucesso! Faça login.
            </div>
          )}

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

            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-[var(--text-secondary)] cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[var(--border)] bg-[var(--bg-base)] text-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20"
                />
                Lembrar-me
              </label>
              <Link
                href="/forgot-password"
                className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] transition-colors font-medium"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              fullWidth
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            Não tem conta?{" "}
            <Link
              href="/register"
              className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-semibold transition-colors"
            >
              Criar conta
            </Link>
          </p>
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
