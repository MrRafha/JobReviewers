"use client";

import { useEffect, useState } from "react";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import CompanyCard from "@/components/CompanyCard";
import { Footer } from "@/components/layout";

interface Company {
  id: string;
  name: string;
  slug: string;
  location: string;
  rating: number;
  reviewCount: number;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isNewReviewExpanded, setIsNewReviewExpanded] = useState(false);
  const { data: session } = useSession();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

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

    setLoading(true);
    const debounce = setTimeout(fetchCompanies, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <div className="bg-[#2B2D31] rounded-b-[40px] shadow-xl h-[380px] relative overflow-hidden">
        {session?.user && (
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="absolute top-5 right-5 z-20 cursor-pointer rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium text-white/90 backdrop-blur-md transition-all hover:bg-white/20"
          >
            Sair
          </button>
        )}

        <div className="absolute top-0 left-0 w-96 h-96 bg-[#2563EB] opacity-[0.08] blur-[120px] rounded-full"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#22C55E] opacity-[0.08] blur-[120px] rounded-full"></div>

        <div className="flex flex-col items-center justify-center px-4 pt-10 h-full relative z-10">
          <div className="w-full max-w-3xl flex flex-col items-center">
            <Link href="/" className="mb-6 transition-transform hover:scale-105">
              <Image
                src="/logo.png"
                alt="JobReviewers Logo"
                width={112}
                height={80}
                className="h-20 w-28"
              />
            </Link>

            <h1 className="font-sora text-4xl font-bold text-white mb-3">
              Job Reviewers
            </h1>

            <p
              className="text-center text-white text-xl font-normal tracking-wide mb-8"
              style={{ opacity: 0.85 }}
            >
              Reviews anônimas e moderadas sobre empresas.
            </p>

            <div className="w-full max-w-2xl flex items-center justify-center gap-3">
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

      <div className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
            {searchQuery.trim() ? "Resultados da busca" : "Empresas melhor avaliadas"}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB]"></div>
              <p className="mt-4 text-[#64748B]">Carregando empresas...</p>
            </div>
          ) : companies.length > 0 ? (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              style={{
                filter: "drop-shadow(0 2px 8px rgba(37, 99, 235, 0.08))",
              }}
            >
              {companies.map((company) => (
                <CompanyCard key={company.id} {...company} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white border border-[#E2E8F0] rounded-2xl">
              <svg
                className="w-16 h-16 mx-auto text-[#94A3B8] mb-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              <p className="text-[#64748B] font-semibold mb-2">
                Nenhuma empresa encontrada
              </p>
              <p className="text-[#94A3B8] text-sm">
                {searchQuery
                  ? "Tente buscar por outro nome ou localização"
                  : "Seja o primeiro a adicionar uma empresa"}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-[#2B2D31] py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Garantias de Segurança
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <Footer />
    </div>
  );
}
