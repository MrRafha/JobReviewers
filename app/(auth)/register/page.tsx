"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useToast } from "@/components/ui/ToastProvider";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showToast } = useToast();

  const calculateAge = (date: string): number => {
    const today = new Date();
    const birthDate = new Date(date);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    if (!birthdate) {
      setError("Por favor, insira sua data de nascimento");
      return;
    }

    const age = calculateAge(birthdate);
    if (age < 18) {
      setError("Você precisa ter pelo menos 18 anos para se cadastrar.");
      return;
    }

    if (age > 120) {
      setError("Por favor, insira uma data de nascimento válida.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Erro ao criar conta", "error");
        return;
      }

      router.push("/login?registered=true");
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
          Crie sua conta e comece a avaliar
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
            Criar Conta
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] p-3 text-sm text-[var(--error)]">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
            />

            <Input
              label="Data de Nascimento"
              type="date"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
              hint="Você deve ter pelo menos 18 anos"
              required
            />

            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              hint="Mínimo de 8 caracteres"
              required
            />

            <Input
              label="Confirmar Senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              fullWidth
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            Já tem conta?{" "}
            <Link
              href="/login"
              className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] font-semibold transition-colors"
            >
              Fazer login
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
