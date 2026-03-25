"use client";

import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        setError(data.error || "Erro ao criar conta");
        return;
      }

      router.push("/login?registered=true");
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
            {/* Email Input */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20 focus:border-[var(--brand-primary)] transition-all bg-[var(--bg-base)]"
                placeholder="seu@email.com"
                required
              />
            </div>

            {/* Birthdate Input */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20 focus:border-[var(--brand-primary)] transition-all bg-[var(--bg-base)]"
                max={new Date().toISOString().split("T")[0]}
                required
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Você deve ter pelo menos 18 anos
              </p>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20 focus:border-[var(--brand-primary)] transition-all bg-[var(--bg-base)]"
                placeholder="••••••••"
                minLength={8}
                required
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Mínimo de 8 caracteres
              </p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20 focus:border-[var(--brand-primary)] transition-all bg-[var(--bg-base)]"
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white py-3 rounded-xl font-semibold transition-all hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </button>
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
