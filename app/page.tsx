"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import CompanyCard from "@/components/CompanyCard";
import CompanyCardSkeleton from "@/components/CompanyCardSkeleton";
import { Container, Footer, Navbar } from "@/components/layout";
import ErrorCard from "@/components/ui/ErrorCard";
import FadeIn from "@/components/ui/FadeIn";
import FloatingCTA from "@/components/ui/FloatingCTA";
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
  ratingDistribution?: number[];
  recentlyActive?: boolean;
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
  const [activeLocation, setActiveLocation] = useState("");
  const [locations, setLocations] = useState<string[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [companiesUnavailable, setCompaniesUnavailable] = useState(false);
  const [featuredReview, setFeaturedReview] = useState<FeaturedReview | null>(
    null
  );

  useEffect(() => {
    fetch("/api/companies/locations")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setLocations(data); })
      .catch(() => {});
  }, []);

  // Fetch companies based on active search
  useEffect(() => {
    async function fetchCompanies() {
      setLoadingCompanies(true);
      setCompaniesUnavailable(false);

      try {
        const params = new URLSearchParams();
        if (activeSearch.trim()) {
          params.set("search", activeSearch.trim());
        } else {
          params.set("limit", "6");
          if (activeLocation) params.set("location", activeLocation);
        }
        const res = await fetch(`/api/companies?${params.toString()}`);

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
  }, [activeSearch, activeLocation]);

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
    const params = new URLSearchParams();
    if (activeSearch.trim()) {
      params.set("search", activeSearch.trim());
    } else {
      params.set("limit", "6");
      if (activeLocation) params.set("location", activeLocation);
    }
    fetch(`/api/companies?${params.toString()}`)
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
        {/* Hero — sem FadeIn, aparece imediatamente */}
        <HeroSection
          onSearch={handleHeroSearch}
          searchValue={searchInput}
          onSearchInputChange={setSearchInput}
        />

        <FadeIn direction="up" delay={0} duration={700}>
          <BenefitsSection />
        </FadeIn>

        <FadeIn direction="up" delay={0} duration={700}>
          <SolutionSection />
        </FadeIn>

        <FadeIn direction="up" delay={0} duration={700}>
          <HowItWorksSection />
        </FadeIn>

        <FadeIn direction="up" delay={0} duration={700}>
          <SocialProofSection featuredReview={featuredReview} />
        </FadeIn>

        {/* Companies Section */}
        <FadeIn direction="up" delay={0} duration={700}>
          <section id="empresas" className="py-16 sm:py-20">
            <Container>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                <FadeIn direction="left" delay={100} duration={600}>
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
                </FadeIn>
                <FadeIn direction="right" delay={200} duration={600}>
                  <div className="flex flex-wrap items-center gap-3">
                    {locations.length > 0 && !activeSearch.trim() && (
                      <select
                        value={activeLocation}
                        onChange={(e) => setActiveLocation(e.target.value)}
                        className="h-10 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] px-3 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20 focus:border-[var(--brand-primary)] transition-all"
                      >
                        <option value="">Todas as cidades</option>
                        {locations.map((loc) => (
                          <option key={loc} value={loc}>{loc}</option>
                        ))}
                      </select>
                    )}
                    <Link
                      href="/companies"
                      className="group text-sm font-semibold text-[var(--brand-primary)] transition hover:text-[var(--brand-primary-hover)] flex items-center gap-1"
                    >
                      Ver todas as empresas
                      <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </FadeIn>
              </div>

              {loadingCompanies ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <CompanyCardSkeleton key={i} />
                  ))}
                </div>
              ) : companiesUnavailable ? (
                <FadeIn direction="up" delay={100} duration={500}>
                  <ErrorCard
                    title="Serviço temporariamente indisponível"
                    description="Não foi possível carregar as empresas neste momento. Tente novamente em alguns instantes."
                    onRetry={handleRetryCompanies}
                    retryLabel="Tentar novamente"
                  />
                </FadeIn>
              ) : companies.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {companies.map((company, i) => (
                    <div
                      key={company.id}
                      className="company-card-enter"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <CompanyCard {...company} />
                    </div>
                  ))}
                </div>
              ) : (
                <FadeIn direction="up" delay={100} duration={500}>
                  <div className="rounded-[20px] border border-[var(--border)] bg-[var(--bg-surface)] py-14 text-center shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                    <p className="font-semibold text-[var(--text-primary)]">
                      Nenhuma empresa encontrada
                    </p>
                    <p className="mt-2 text-sm text-[var(--text-secondary)]">
                      Tente outro termo de busca ou explore a listagem completa.
                    </p>
                  </div>
                </FadeIn>
              )}
            </Container>
          </section>
        </FadeIn>

        <FadeIn direction="up" delay={0} duration={700}>
          <CTASection />
        </FadeIn>
      </main>

      <FloatingCTA />
      <Footer />
    </div>
  );
}
