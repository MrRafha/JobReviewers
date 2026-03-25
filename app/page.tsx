"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import CompanyCard from "@/components/CompanyCard";
import { Container, Footer, Navbar } from "@/components/layout";
import ErrorCard from "@/components/ui/ErrorCard";
import {
  HeroSection,
  BenefitsSection,
  SolutionSection,
  HowItWorksSection,
  SocialProofSection,
  CTASection,
} from "@/components/sections";

interface Company {
  id: string;
  name: string;
  slug: string;
  location: string;
  rating: number;
  reviewCount: number;
}

interface FeaturedReview {
  id: string;
  rating: number;
  position: string;
  positives: string;
  negatives: string;
  date: string;
  companyName: string;
  authorHandle: string;
  workMode: string;
}

const fallbackReview: FeaturedReview = {
  id: "fallback",
  rating: 5,
  position: "Analista de Sistemas",
  positives: "Ótimo ambiente de trabalho e boa colaboração entre as equipes.",
  negatives: "Nada relevante a apontar no momento.",
  date: new Date().toISOString(),
  companyName: "TechSoft Solutions",
  authorHandle: "Anônimo",
  workMode: "HIBRIDO",
};

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [companiesUnavailable, setCompaniesUnavailable] = useState(false);
  const [featuredReview, setFeaturedReview] = useState<FeaturedReview | null>(
    null
  );

  // Fetch companies based on active search
  useEffect(() => {
    async function fetchCompanies() {
      setLoadingCompanies(true);
      setCompaniesUnavailable(false);

      try {
        const query = activeSearch.trim()
          ? `?search=${encodeURIComponent(activeSearch.trim())}`
          : "?limit=6";
        const res = await fetch(`/api/companies${query}`);

        if (!res.ok) {
          if (res.status === 503) {
            setCompaniesUnavailable(true);
          }
          throw new Error("Falha ao buscar empresas");
        }

        const data = await res.json();
        setCompanies(data);
      } catch {
        setCompanies([]);
      } finally {
        setLoadingCompanies(false);
      }
    }

    fetchCompanies();
  }, [activeSearch]);

  // Fetch featured review on mount
  useEffect(() => {
    async function fetchFeaturedReview() {
      try {
        const res = await fetch("/api/reviews?limit=1");

        if (!res.ok) {
          throw new Error("Falha ao buscar review em destaque");
        }

        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setFeaturedReview(data[0]);
          return;
        }

        setFeaturedReview(fallbackReview);
      } catch {
        setFeaturedReview(fallbackReview);
      }
    }

    fetchFeaturedReview();
  }, []);

  const handleHeroSearch = (query: string) => {
    setActiveSearch(query);
    const companiesSection = document.getElementById("empresas");
    if (companiesSection) {
      companiesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleRetryCompanies = () => {
    const query = activeSearch.trim()
      ? `?search=${encodeURIComponent(activeSearch.trim())}`
      : "?limit=6";
    fetch(`/api/companies${query}`)
      .then((res) => res.json())
      .then((data) => {
        setCompanies(data);
        setCompaniesUnavailable(false);
      })
      .catch(() => setCompaniesUnavailable(true));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Navbar />

      <main>
        {/* Hero Section */}
        <HeroSection
          onSearch={handleHeroSearch}
          searchValue={searchInput}
          onSearchInputChange={setSearchInput}
        />

        {/* Benefits Section */}
        <BenefitsSection />

        {/* Solution Section */}
        <SolutionSection />

        {/* How It Works Section */}
        <HowItWorksSection />

        {/* Social Proof & Security Section */}
        <SocialProofSection featuredReview={featuredReview} />

        {/* Companies Section */}
        <section id="empresas" className="py-16 sm:py-20">
          <Container>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-sora text-3xl font-semibold text-[var(--text-primary)] sm:text-4xl">
                  {activeSearch.trim() ? "Resultados da Busca" : "Empresas em Destaque"}
                </h2>
                <p className="mt-2 text-sm text-[var(--text-secondary)] sm:text-base">
                  {activeSearch.trim()
                    ? `Mostrando empresas para "${activeSearch.trim()}".`
                    : "Pesquise e descubra as melhores empresas para trabalhar."}
                </p>
              </div>
              <Link
                href="/companies"
                className="text-sm font-semibold text-[var(--brand-primary)] transition hover:text-[var(--brand-primary-hover)]"
              >
                Ver todas as empresas
              </Link>
            </div>

            {loadingCompanies ? (
              <div className="rounded-[20px] border border-[var(--border)] bg-[var(--bg-surface)] py-14 text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-[#bfdbfe] border-b-[var(--brand-primary)]" />
                <p className="mt-4 text-[var(--text-secondary)]">
                  Carregando empresas...
                </p>
              </div>
            ) : companiesUnavailable ? (
              <ErrorCard
                title="Serviço temporariamente indisponível"
                description="Não foi possível carregar as empresas neste momento. Tente novamente em alguns instantes."
                onRetry={handleRetryCompanies}
                retryLabel="Tentar novamente"
              />
            ) : companies.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {companies.map((company) => (
                  <CompanyCard key={company.id} {...company} />
                ))}
              </div>
            ) : (
              <div className="rounded-[20px] border border-[var(--border)] bg-[var(--bg-surface)] py-14 text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                <p className="font-semibold text-[var(--text-primary)]">
                  Nenhuma empresa encontrada
                </p>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Tente outro termo de busca ou explore a listagem completa.
                </p>
              </div>
            )}
          </Container>
        </section>

        {/* CTA Final Section */}
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
