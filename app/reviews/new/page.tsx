"use client";

import { useEffect, useRef, useState } from "react";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

interface Company {
  id: string;
  name: string;
  city?: string;
  state?: string;
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
  const { data: session, status } = useSession();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [companySearch, setCompanySearch] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [roleArea, setRoleArea] = useState("");
  const [seniority, setSeniority] = useState("jr");
  const [contractType, setContractType] = useState("clt");
  const [workMode, setWorkMode] = useState("remoto");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [ratingOverall, setRatingOverall] = useState(0);
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Buscar empresas ao montar
  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/companies");
        if (res.ok) {
          const data = await res.json();
          setCompanies(data);
        }
      } catch {
        console.error("Erro ao buscar empresas");
      }
    }
    fetchCompanies();
  }, []);

  // Pré-selecionar empresa via query param
  useEffect(() => {
    const companyId = searchParams.get("companyId");
    if (companyId && companies.length > 0) {
      const found = companies.find((c) => c.id === companyId);
      if (found) {
        setSelectedCompany(found);
        setCompanySearch(found.name);
      }
    }
  }, [searchParams, companies]);

  // Filtrar empresas conforme digitação
  useEffect(() => {
    if (!companySearch.trim()) {
      setFilteredCompanies(companies);
    } else {
      const query = companySearch.toLowerCase();
      setFilteredCompanies(
        companies.filter((c) => c.name.toLowerCase().includes(query))
      );
    }
  }, [companySearch, companies]);

  // Fechar dropdown ao clicar fora
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

    if (!selectedCompany) {
      setError("Selecione uma empresa da lista.");
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
          companyId: selectedCompany.id,
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
      router.push(`/companies/${review.company?.slug || selectedCompany.id}`);
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
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Criar Review</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >
        {/* Empresa com Autocomplete */}
        <div ref={dropdownRef} className="relative">
          <label className="block text-sm font-medium mb-2">Empresa</label>
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
            className={`w-full border rounded-lg px-4 py-2 ${
              selectedCompany
                ? "border-green-400 bg-green-50"
                : "border-gray-300"
            }`}
          />
          {selectedCompany && (
            <span className="absolute right-3 top-9 text-green-500 text-lg">
              ✓
            </span>
          )}

          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {filteredCompanies.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Nenhuma empresa encontrada.
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
                    {(company.city || company.state) && (
                      <span className="text-sm text-gray-500 ml-2">
                        {[company.city, company.state]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Cargo e Senioridade */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Cargo/Área</label>
            <input
              type="text"
              value={roleArea}
              onChange={(e) => setRoleArea(e.target.value)}
              placeholder="Frontend Developer"
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Senioridade
            </label>
            <select
              value={seniority}
              onChange={(e) => setSeniority(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="jr">Júnior</option>
              <option value="pl">Pleno</option>
              <option value="sr">Sênior</option>
            </select>
          </div>
        </div>

        {/* Tipo de Contrato e Modelo de Trabalho */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Tipo de Contrato
            </label>
            <select
              value={contractType}
              onChange={(e) => setContractType(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="clt">CLT</option>
              <option value="pj">PJ</option>
              <option value="estagio">Estágio</option>
              <option value="freela">Freelancer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Modelo de Trabalho
            </label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full border rounded-lg px-4 py-2"
            >
              <option value="remoto">Remoto</option>
              <option value="hibrido">Híbrido</option>
              <option value="presencial">Presencial</option>
            </select>
          </div>
        </div>

        {/* Ano */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Ano de experiência
          </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="2000"
            max={new Date().getFullYear()}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Avaliação com Estrelas */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Avaliação Geral
          </label>
          <StarRating value={ratingOverall} onChange={setRatingOverall} />
        </div>

        {/* Pontos Positivos */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Pontos Positivos
          </label>
          <textarea
            rows={4}
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            placeholder="O que você gostou..."
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        {/* Pontos Negativos */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Pontos Negativos
          </label>
          <textarea
            rows={4}
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            placeholder="O que precisa melhorar..."
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-green-500 to-orange-500 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition-opacity cursor-pointer"
        >
          {submitting ? "Publicando..." : "Publicar Review"}
        </button>
      </form>
    </div>
  );
}
