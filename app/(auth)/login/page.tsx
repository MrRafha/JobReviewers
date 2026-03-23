"use client";

import { useState } from "react";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const registered = searchParams.get("registered");

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
        setError("Email ou senha inválidos");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2B2D31] px-4 relative overflow-hidden">
      {/* Glow sutil azul (esquerda) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#2563EB] opacity-[0.08] blur-[120px] rounded-full"></div>
      {/* Glow sutil verde (direita) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#22C55E] opacity-[0.08] blur-[120px] rounded-full"></div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <img
              src="/logo.png"
              alt="JobReviewers Logo"
              className="h-20 w-28 mx-auto transition-transform hover:scale-105"
            />
          </Link>
          <h1 className="font-sora text-3xl font-bold text-white mb-2">
            Job Reviewers
          </h1>
          <p className="text-white/70">Por favor faça login para continuar</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-xl relative">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="absolute top-6 left-6 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            aria-label="Voltar"
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

          <h2 className="font-sora text-2xl font-bold text-white mb-6 text-center">
            Login
          </h2>

          {registered && (
            <div className="mb-4 rounded-lg bg-green-500/15 border border-green-400/30 p-3 text-sm text-green-200">
              Conta criada com sucesso! Faça login.
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/15 border border-red-400/30 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#2563EB] focus:ring-[#2563EB]/20"
                />
                Lembrar-me
              </label>
              <Link
                href="/forgot-password"
                className="text-[#2563EB] hover:text-[#60A5FA] transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-sm text-white/70 mt-6">
            Não tem conta?{" "}
            <Link
              href="/register"
              className="text-[#60A5FA] hover:text-[#93C5FD] font-semibold transition-colors"
            >
              Criar conta
            </Link>
          </p>
        </div>

        {/* Security Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/50">
            Seus dados estão protegidos e nunca serão compartilhados
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <LoginForm />;
}
