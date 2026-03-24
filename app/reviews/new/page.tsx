"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

import { Container, Footer, Navbar } from "@/components/layout";

interface Company {
  id: string;
  name: string;
  location?: string;
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

export default function NewReviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const initialCompanyId = searchParams.get("companyId");
  const initialCompanyName = searchParams.get("companyName");

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

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/companies");
        if (res.ok) {
          const data = await res.json();
          setCompanies(data);

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
      setError("Preencha o cargo/área.");
      return;
    }
    if (ratingOverall < 1 || ratingOverall > 5) {
      setError("Selecione uma avaliação de 1 a 5 estrelas.");
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
        setError("Review criada, mas não foi possível redirecionar a empresa.");
        setSubmitting(false);
        return;
      }

      router.push(`/companies/${companyIdentifier}`);
    } catch {
      setError("Erro de conexão. Tente novamente.");
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <p className="text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl text-center">
        <h1 className="text-2xl font-bold mb-4">Acesso restrito</h1>
        <p className="text-gray-600 mb-4">
          Você precisa estar logado para criar uma review.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="bg-gradient-to-r from-green-500 to-orange-500 text-white px-6 py-2 rounded-lg font-medium"
        >
          Fazer Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <Container size="md">
          <div className="text-center mb-8">
            <h1 className="font-sora text-4xl font-bold text-[#0F172A] mb-3">
              Escrever Review
            </h1>
            <p className="text-[#64748B] text-lg">
              Compartilhe sua experiência de forma anônima e ajude outros
              profissionais
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm space-y-6"
          >
            <div ref={dropdownRef} className="relative">
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
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
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
              />

              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredCompanies.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500 space-y-1">
                      <p>Nenhuma empresa encontrada.</p>
                      {companySearch.trim() && (
                        <p className="text-[#2563EB]">
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
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <span className="font-medium">{company.name}</span>
                        {company.location && (
                          <span className="text-sm text-gray-500 ml-2">
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
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Cargo/Área *
                </label>
                <input
                  type="text"
                  value={roleArea}
                  onChange={(e) => setRoleArea(e.target.value)}
                  placeholder="Frontend Developer"
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Senioridade
                </label>
                <select
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value)}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3"
                >
                  <option value="JR">Júnior</option>
                  <option value="PL">Pleno</option>
                  <option value="SR">Sênior</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Tipo de Contrato
                </label>
                <select
                  value={contractType}
                  onChange={(e) => setContractType(e.target.value)}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3"
                >
                  <option value="CLT">CLT</option>
                  <option value="PJ">PJ</option>
                  <option value="ESTAGIO">Estágio</option>
                  <option value="FREELA">Freelancer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Modo de Trabalho
                </label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value)}
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3"
                >
                  <option value="REMOTO">Remoto</option>
                  <option value="HIBRIDO">Híbrido</option>
                  <option value="PRESENCIAL">Presencial</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                Ano de experiência
              </label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min="2000"
                max={new Date().getFullYear()}
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                Avaliação Geral
              </label>
              <StarRating value={ratingOverall} onChange={setRatingOverall} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                Pontos Positivos *
              </label>
              <textarea
                rows={4}
                value={pros}
                onChange={(e) => setPros(e.target.value)}
                placeholder="O que você gostou..."
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                Pontos Negativos *
              </label>
              <textarea
                rows={4}
                value={cons}
                onChange={(e) => setCons(e.target.value)}
                placeholder="O que precisa melhorar..."
                className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
