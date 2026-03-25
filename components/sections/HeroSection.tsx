import React from "react";
import { Container } from "@/components/layout";

interface HeroSectionProps {
  onSearch: (query: string) => void;
  searchValue: string;
  onSearchInputChange: (value: string) => void;
}

export default function HeroSection({
  onSearch,
  searchValue,
  onSearchInputChange,
}: HeroSectionProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_0%,#e0e7ff,transparent_38%),radial-gradient(circle_at_80%_20%,#ede9fe,transparent_36%),#fafafa]" />

      <Container className="grid items-center gap-12 lg:grid-cols-2">
        {/* Left: Content */}
        <div>
          <h1 className="font-sora text-4xl font-bold leading-tight text-[var(--text-primary)] sm:text-5xl lg:text-[52px]">
            Descubra a Verdade Sobre Empresas
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
            Leia avaliações reais de profissionais e entenda como é o dia a dia
            nas empresas antes de tomar sua próxima decisão.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-3">
            <label htmlFor="hero-company-search" className="sr-only">
              Pesquisar empresas
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                id="hero-company-search"
                type="text"
                value={searchValue}
                onChange={(event) => onSearchInputChange(event.target.value)}
                placeholder="Pesquise por empresa, cidade ou estado"
                className="h-12 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-4 text-[15px] text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[rgba(37,99,235,0.2)]"
              />
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[var(--brand-primary)] px-6 font-semibold text-white transition hover:bg-[var(--brand-primary-hover)]"
              >
                Pesquisar Empresas
              </button>
            </div>
          </form>

          {/* CTAs */}
          <div className="mt-4 flex flex-wrap gap-3">
            <a
              href="/reviews/new"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-6 font-semibold text-[var(--text-primary)] transition hover:bg-[var(--bg-subtle)]"
            >
              Faça sua Avaliação
            </a>
            <a
              href="#como-funciona"
              className="inline-flex h-12 items-center justify-center rounded-xl border border-transparent px-3 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
            >
              Como funciona
            </a>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="relative">
          <div className="rounded-[26px] border border-[var(--border)] bg-[var(--bg-surface)] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-4">
              {/* Bolinhas no canto esquerdo */}
              <div className="mb-4 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#ef4444]" aria-hidden="true" />
                <span className="h-3 w-3 rounded-full bg-[#f59e0b]" aria-hidden="true" />
                <span className="h-3 w-3 rounded-full bg-[#22c55e]" aria-hidden="true" />
                <div className="ml-2 h-2 w-24 rounded-full bg-[#dbeafe]" />
              </div>
              <div className="space-y-2">
                <div className="h-2 rounded-full bg-[#d1d5db]" />
                <div className="h-2 w-10/12 rounded-full bg-[#d1d5db]" />
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl border border-[#dbeafe] bg-white p-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    Classificação em tempo real
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Avaliações anônimas
                  </p>
                </div>
                <div className="text-2xl font-bold text-[#fbbf24]">★ 4.8</div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
