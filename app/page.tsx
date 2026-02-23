"use client";

import { useEffect, useState } from "react";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

import CompanyCard from "@/components/CompanyCard";

interface CompanyData {
  id: string;
  name: string;
  slug: string;
  city?: string;
  state?: string;
  reviewCount: number;
  averageRating: number;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isNewReviewExpanded, setIsNewReviewExpanded] = useState(false);
  const { data: session } = useSession();
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);

  // Buscar empresas reais da API
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const query = searchQuery.trim()
          ? `?search=${encodeURIComponent(searchQuery.trim())}`
          : "?limit=12";
        const res = await fetch(`/api/companies${query}`);
        if (res.ok) {
          const data = await res.json();
          setCompanies(data);
        }
      } catch {
        console.error("Erro ao buscar empresas");
      } finally {
        setLoading(false);
      }
    }

    const debounce = setTimeout(fetchCompanies, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Seção Hero com background escuro */}
      <div className="bg-[#2B2D31] rounded-b-[40px] shadow-xl h-[380px] relative overflow-hidden">
        {/* Botão Sair */}
        {session?.user && (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="absolute top-5 right-5 z-20 cursor-pointer rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white/90 backdrop-blur-md transition-all hover:bg-white/20"
          >
            Sair
          </button>
        )}

        {/* Glow sutil azul (esquerda) */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2563EB] opacity-[0.08] blur-[120px] rounded-full"></div>
        {/* Glow sutil verde (direita) */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#22C55E] opacity-[0.08] blur-[120px] rounded-full"></div>

        <div className="flex flex-col items-center justify-center px-4 pt-10 h-full relative z-10">
          <div className="w-full max-w-3xl flex flex-col items-center">
            {/* Logo JR - Clicável */}
            <Link
              href="/"
              className="mb-6 transition-transform hover:scale-105"
            >
              <img
                src="/logo.png"
                alt="JobReviewers Logo"
                className="h-20 w-28"
              />
            </Link>

            {/* Nome do Produto */}
            <h1 className="font-sora text-4xl font-bold text-white mb-3">
              Job Reviewers
            </h1>

            {/* Subtítulo forte */}
            <p
              className="text-center text-white text-xl font-normal tracking-wide mb-8"
              style={{ opacity: 0.85 }}
            >
              Reviews anônimas e moderadas sobre empresas.
            </p>

            {/* Barra de pesquisa e botão de nova review - Centralizados e dinâmicos */}
            <div className="w-full max-w-2xl flex items-center justify-center gap-3">
              {/* Barra de pesquisa - Compacta e expansível */}
              <form
                onSubmit={handleSearch}
                className={`transition-all duration-600 ease-in-out ${
                  isSearchExpanded ? "flex-1" : "flex-none"
                }`}
              >
                <div
                  className={`relative transition-all duration-600 ease-in-out ${
                    isSearchExpanded ? "w-full" : "w-16"
                  }`}
                  onMouseEnter={() => {
                    setIsSearchExpanded(true);
                    setIsNewReviewExpanded(false);
                  }}
                  onMouseLeave={() => {
                    if (!searchQuery) setIsSearchExpanded(false);
                  }}
                >
                  {/* Ícone de busca - Aparece quando compactado */}
                  {!isSearchExpanded && (
                    <button
                      type="button"
                      onClick={() => setIsSearchExpanded(true)}
                      className="w-16 h-16 bg-white/[0.01] backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center shadow-lg hover:scale-105 hover:bg-white/[0.08] transition-all"
                    >
                      <svg
                        className="w-7 h-7 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Input expandido */}
                  {isSearchExpanded && (
                    <div className="relative animate-in fade-in slide-in-from-left-2 duration-800">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Pesquisar empresa (ex.: Nubank, IFPI, Samsung...)"
                        className="w-full px-5 py-4 pl-12 text-base bg-white/10 backdrop-blur-md rounded-full focus:outline-none focus:ring-2 focus:ring-white/30 shadow-lg placeholder:text-white/60 text-white border border-white/20"
                        autoFocus
                      />
                      {/* Ícone de busca dentro do input */}
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <svg
                          className="w-5 h-5 text-white/70"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </form>

              {/* Botão de Nova Review - Expansível */}
              <Link
                href="/reviews/new"
                className={`transition-all duration-600 ease-in-out ${
                  isNewReviewExpanded ? "flex-1" : "flex-none"
                }`}
              >
                <div
                  className={`relative transition-all duration-800 ease-in-out ${
                    isNewReviewExpanded ? "w-full" : "w-16"
                  }`}
                  onMouseEnter={() => {
                    setIsNewReviewExpanded(true);
                    setIsSearchExpanded(false);
                  }}
                  onMouseLeave={() => setIsNewReviewExpanded(false)}
                >
                  {/* Ícone compacto */}
                  {!isNewReviewExpanded && (
                    <div className="w-16 h-16 bg-[#22C55E]/[0.01] backdrop-blur-sm border border-[#22C55E]/20 rounded-full flex items-center justify-center shadow-lg hover:scale-105 hover:bg-[#22C55E]/[0.08] transition-all cursor-pointer">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Botão expandido */}
                  {isNewReviewExpanded && (
                    <div className="w-full h-16 bg-[#22C55E]/[0.03] backdrop-blur-md border border-[#22C55E]/20 rounded-full flex items-center px-5 shadow-lg hover:bg-[#22C55E]/[0.08] transition-all cursor-pointer overflow-hidden">
                      <svg
                        className="w-5 h-5 text-white flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      <span className="text-white font-medium text-base whitespace-nowrap ml-3 animate-in fade-in slide-in-from-left-3 duration-500 delay-100">
                        Escrever nova review
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Cards de Empresas */}
      <div className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
            {searchQuery.trim() ? "Resultados da busca" : "Empresas recentes"}
          </h2>
          {loading ? (
            <p className="text-gray-500">Carregando empresas...</p>
          ) : companies.length === 0 ? (
            <p className="text-gray-500">Nenhuma empresa encontrada.</p>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              style={{ filter: "drop-shadow(0 2px 8px rgba(37, 99, 235, 0.08))" }}
            >
              {companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  name={company.name}
                  slug={company.slug}
                  location={[company.city, company.state].filter(Boolean).join(", ")}
                  rating={company.averageRating}
                  reviewCount={company.reviewCount}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Seção Garantias de Segurança */}
      <div className="bg-[#2B2D31] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Garantias de Segurança
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 - Anonimato Total */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center transition-all hover:bg-white/15">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#2563EB]/[0.03] rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-sora text-xl font-semibold text-white mb-3">
                Anônimo
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Sua identidade nunca será revelada. Sistema 100% anônimo.
              </p>
            </div>

            {/* Card 2 - Moderado */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center transition-all hover:bg-white/15">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#22C55E]/[0.03] rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-sora text-xl font-semibold text-white mb-3">
                Moderado
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Todas as reviews passam por moderação antes de serem publicadas.
              </p>
            </div>

            {/* Card 3 - Sem expor pessoas */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center transition-all hover:bg-white/15">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-[#2563EB]/[0.03] rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="font-sora text-xl font-semibold text-white mb-3">
                Sem expor pessoas
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Nunca expomos dados pessoais de quem fez a review ou de pessoas
                citadas nas reviews.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
