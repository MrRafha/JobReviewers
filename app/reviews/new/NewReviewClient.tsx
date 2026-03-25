"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Container, Footer, Navbar } from "@/components/layout";
import ErrorCard from "@/components/ui/ErrorCard";
import { DB_UNAVAILABLE } from "@/lib/constants/error-messages";

interface Company {
  id: string;
  name: string;
  location?: string;
}

interface NewReviewClientProps {
  initialCompanyId?: string;
  initialCompanyName?: string;
}

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-3xl transition-colors focus:outline-none cursor-pointer"
        >
          <span
            className={
              star <= (hover || value) ? "text-yellow-400" : "text-gray-300"
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

export default function NewReviewClient({
  initialCompanyId,
  initialCompanyName,
}: NewReviewClientProps) {
  const router = useRouter();
  const { status } = useSession();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [companySearch, setCompanySearch] = useState(initialCompanyName ?? "");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(
    initialCompanyId && initialCompanyName
      ? { id: initialCompanyId, name: initialCompanyName }
      : null
  );
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [roleArea, setRoleArea] = useState("");
  const [seniority, setSeniority] = useState("JR");
  const [contractType, setContractType] = useState("CLT");
  const [workMode, setWorkMode] = useState("REMOTO");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [ratingOverall, setRatingOverall] = useState(0);
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [companiesUnavailable, setCompaniesUnavailable] = useState(false);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/companies");
        if (res.status === 503) {
          setCompaniesUnavailable(true);
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setCompanies(data);
          setCompaniesUnavailable(false);

          if (!selectedCompany && initialCompanyId && !initialCompanyName) {
            const found = data.find((c: Company) => c.id === initialCompanyId);
            if (found) {
              setSelectedCompany(found);
              setCompanySearch(found.name);
            }
          }
        }
      } catch {
        console.error("Erro ao buscar empresas");
        setCompaniesUnavailable(true);
      }
    }
    fetchCompanies();
  }, [initialCompanyId, initialCompanyName, selectedCompany]);

  const filteredCompanies = useMemo(() => {
    if (!companySearch.trim()) {
      return companies;
    }

    const query = companySearch.toLowerCase();
    return companies.filter((c) => c.name.toLowerCase().includes(query));
  }, [companySearch, companies]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const normalizedCompanyName = companySearch.trim();

    if (!selectedCompany && !normalizedCompanyName) {
      setError("Informe o nome da empresa.");
      return;
    }
    if (!roleArea.trim()) {
      setError("Preencha o cargo/area.");
      return;
    }
    if (ratingOverall < 1 || ratingOverall > 5) {
      setError("Selecione uma avaliacao de 1 a 5 estrelas.");
      return;
    }
    if (!pros.trim() || !cons.trim()) {
      setError("Preencha os pontos positivos e negativos.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: selectedCompany?.id,
          companyName: selectedCompany ? undefined : normalizedCompanyName,
          roleArea,
          seniority,
          contractType,
          workMode,
          year,
          ratingOverall,
          pros,
          cons,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao publicar review.");
        setSubmitting(false);
        return;
      }

      const review = await res.json();
      const companyIdentifier = review.company?.slug ?? selectedCompany?.id;

      if (!companyIdentifier) {
        setError("Review criada, mas nao foi possivel redirecionar a empresa.");
        setSubmitting(false);
        return;
      }

      router.push(`/companies/${companyIdentifier}`);
    } catch {
      setError("Erro de conexao. Tente novamente.");
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center px-4">
        <p className="text-[var(--text-secondary)]">Carregando...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Container className="py-16" size="md">
            <ErrorCard
              title="Acesso restrito"
              description="Você precisa estar logado para criar uma avaliação."
            />
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push("/login")}
                className="inline-flex bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white px-6 py-2 rounded-xl font-semibold transition-all"
              >
                Fazer Login
              </button>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  if (companiesUnavailable) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Container className="py-16" size="md">
            <ErrorCard
              title={DB_UNAVAILABLE.TITLE}
              description={DB_UNAVAILABLE.MESSAGE}
              onRetry={() => window.location.reload()}
              retryLabel={DB_UNAVAILABLE.RETRY_BUTTON}
            />
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <Container size="md">
          <div className="text-center mb-8">
            <h1 className="font-sora text-4xl font-bold text-[var(--text-primary)] mb-3">
              Escrever Review
            </h1>
            <p className="text-[var(--text-secondary)] text-lg">
              Compartilhe sua experiência de forma anônima e ajude outros
              profissionais
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] px-4 py-3 text-[var(--error)]">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8 shadow-sm space-y-6"
          >
            <div ref={dropdownRef} className="relative">
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Empresa *
              </label>
              <input
                type="text"
                value={companySearch}
                onChange={(e) => {
                  setCompanySearch(e.target.value);
                  setSelectedCompany(null);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Digite o nome da empresa..."
                className="w-full border border-[var(--border)] rounded-xl px-4 py-3 bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-opacity-20 focus:border-[var(--brand-primary)] transition-all"
              />

              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCompanies.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-[var(--text-secondary)] space-y-1">
                      <p>Nenhuma empresa encontrada.</p>
                      {companySearch.trim() && (
                        <p className="text-[var(--brand-primary)]">
                          Ao publicar, vamos criar essa empresa automaticamente.
                        </p>
                      )}
                    </div>
                  ) : (
                    filteredCompanies.map((company) => (
                      <button
                        key={company.id}
                        type="button"
                        onClick={() => {
                          setSelectedCompany(company);
                          setCompanySearch(company.name);
                          setShowDropdown(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-[var(--bg-subtle)] transition-colors border-b border-[var(--border)] last:border-b-0"
                      >
                        <span className="font-medium">{company.name}</span>
                        {company.location && (
                          <span className="text-sm text-[var(--text-secondary)] ml-2">
                            {company.location}
                          </span>
                        )}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Cargo/Area *
                </label>
                <input
                  type="text"
                  value={roleArea}
                  onChange={(e) => setRoleArea(e.target.value)}
                  placeholder="Frontend Developer"
                  className="w-full border border-[var(--border)] rounded-xl px-4 py-3 bg-[var(--bg-base)] text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Senioridade
                </label>
                <select
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-xl px-4 py-3 bg-[var(--bg-base)] text-[var(--text-primary)]"
                >
                  <option value="JR">Junior</option>
                  <option value="PL">Pleno</option>
                  <option value="SR">Senior</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Tipo de Contrato
                </label>
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-xl px-4 py-3 bg-[var(--bg-base)] text-[var(--text-primary)]"
                >
                  <option value="CLT">CLT</option>
                  <option value="PJ">PJ</option>
                  <option value="ESTAGIO">Estagio</option>
                  <option value="FREELA">Freelancer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                  Modo de Trabalho
                </label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full border border-[var(--border)] rounded-xl px-4 py-3 bg-[var(--bg-base)] text-[var(--text-primary)]"
                >
                  <option value="REMOTO">Remoto</option>
                  <option value="HIBRIDO">Hibrido</option>
                  <option value="PRESENCIAL">Presencial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Ano de experiencia
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2000"
                max={new Date().getFullYear()}
                className="w-full border border-[var(--border)] rounded-xl px-4 py-3 bg-[var(--bg-base)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Avaliacao Geral
              </label>
              <StarRating value={ratingOverall} onChange={setRatingOverall} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Pontos Positivos *
              </label>
              <textarea
                rows={4}
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                placeholder="O que voce gostou..."
                className="w-full border border-[var(--border)] rounded-xl px-4 py-3 bg-[var(--bg-base)] text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
                Pontos Negativos *
              </label>
              <textarea
                rows={4}
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                placeholder="O que precisa melhorar..."
                className="w-full border border-[var(--border)] rounded-xl px-4 py-3 bg-[var(--bg-base)] text-[var(--text-primary)]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] text-white py-4 rounded-xl font-semibold text-lg transition-all hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Publicando..." : "Publicar Review"}
            </button>
          </form>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
