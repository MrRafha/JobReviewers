"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const router = useRouter();

  const calculateAge = (birthdate: string): number => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de senha
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    // Validação de data de nascimento
    if (!birthdate) {
      alert("Por favor, insira sua data de nascimento");
      return;
    }

    const age = calculateAge(birthdate);
    
    if (age < 18) {
      alert("Você precisa ter pelo menos 18 anos para se cadastrar.");
      return;
    }

    if (age > 120) {
      alert("Por favor, insira uma data de nascimento válida.");
      return;
    }

    // TODO: Implementar cadastro com NextAuth
    console.log("Cadastro:", { email, password, birthdate, age });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2B2D31] px-4 relative overflow-hidden py-8">
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
          <p className="text-white/70">Crie sua conta e comece a avaliar</p>
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
            Criar Conta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                Data de Nascimento
              </label>
              <input
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all [color-scheme:dark]"
                max={new Date().toISOString().split('T')[0]}
                required
              />
              <p className="text-xs text-white/50 mt-1">Você deve ter pelo menos 18 anos</p>
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
                minLength={8}
                required
              />
              <p className="text-xs text-white/50 mt-1">Mínimo de 8 caracteres</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/50 focus:border-[#2563EB] transition-all"
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>

            <div className="pt-2">
              <label className="flex items-start gap-2 text-white/70 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-white/20 bg-white/10 text-[#2563EB] focus:ring-[#2563EB]/20 mt-0.5"
                  required
                />
                <span>
                  Eu concordo com os{" "}
                  <Link href="/terms" className="text-[#60A5FA] hover:text-[#93C5FD] underline">
                    Termos de Uso
                  </Link>{" "}
                  e{" "}
                  <Link href="/privacy" className="text-[#60A5FA] hover:text-[#93C5FD] underline">
                    Política de Privacidade
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg"
            >
              Criar Conta
            </button>
          </form>

          <p className="text-center text-sm text-white/70 mt-6">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-[#60A5FA] hover:text-[#93C5FD] font-semibold transition-colors"
            >
              Fazer login
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
