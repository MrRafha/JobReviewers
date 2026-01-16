"use client";

import { useState } from "react";

import Link from "next/link";

import CompanyCard from "@/components/CompanyCard";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar busca de empresas
    console.log("Buscar:", searchQuery);
  };

  // Dados mockados
  const mockCompanies = [
    {
      name: "Nubank",
      location: "São Paulo, SP",
      rating: 4.5,
      reviewCount: 127,
    },
    { name: "IFPI", location: "Teresina, PI", rating: 3.8, reviewCount: 45 },
    { name: "Samsung", location: "Campinas, SP", rating: 4.2, reviewCount: 89 },
    {
      name: "Mercado Livre",
      location: "São Paulo, SP",
      rating: 4.1,
      reviewCount: 203,
    },
    { name: "iFood", location: "Osasco, SP", rating: 3.9, reviewCount: 156 },
    { name: "Ambev", location: "São Paulo, SP", rating: 4.0, reviewCount: 78 },
  ];

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* Seção Hero com background escuro */}
      <div className="bg-[#2B2D31] rounded-b-[40px] shadow-xl h-[380px] relative overflow-hidden">
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

            {/* Barra de pesquisa */}
            <form onSubmit={handleSearch} className="w-full max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pesquisar empresa (ex.: Nubank, IFPI, Samsung...)"
                  className="w-full px-6 py-6 pl-12 text-base bg-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2563EB] shadow-lg placeholder:text-[#64748B] text-[#0F172A] border border-[#E2E8F0]"
                />
                {/* Ícone de busca */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg
                    className="w-5 h-5 text-[#64748B]"
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
            </form>
          </div>
        </div>
      </div>

      {/* Seção de Cards de Empresas */}
      <div className="px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-6">
            Empresas recentes
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            style={{ filter: "drop-shadow(0 2px 8px rgba(37, 99, 235, 0.08))" }}
          >
            {mockCompanies.map((company, index) => (
              <CompanyCard
                key={index}
                name={company.name}
                location={company.location}
                rating={company.rating}
                reviewCount={company.reviewCount}
              />
            ))}
          </div>
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
