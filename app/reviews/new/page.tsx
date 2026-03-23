"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar, Footer, Container } from "@/components/layout";

interface Company {
  id: string;
  name: string;
}

export default function NewReviewPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const companyId = searchParams.get("companyId");
  const companyName = searchParams.get("companyName");

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(
    companyId && companyName ? { id: companyId, name: companyName } : null
  );
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Campos do formulário
  const [formData, setFormData] = useState({
    roleArea: "",
    seniority: "",
    contractType: "",
    workMode: "",
    year: "",
    pros: "",
    cons: "",
  });

  // Buscar empresas quando o usuário digitar
  useEffect(() => {
    async function searchCompanies() {
      if (searchQuery.length < 2) {
        setCompanies([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/companies?search=${encodeURIComponent(searchQuery)}`
        );
        if (response.ok) {
          const data = await response.json();
          setCompanies(data);
        }
      } catch (error) {
        console.error("Error searching companies:", error);
      } finally {
        setIsSearching(false);
      }
    }

    const timeoutId = setTimeout(searchCompanies, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!selectedCompany) {
      alert("Por favor, selecione uma empresa");
      return;
    }

    if (rating === 0) {
      alert("Por favor, dê uma avaliação geral");
      return;
    }

    if (!formData.roleArea || !formData.seniority || !formData.contractType || !formData.workMode) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (!formData.pros.trim() || !formData.cons.trim()) {
      alert("Por favor, preencha os pontos positivos e negativos");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: selectedCompany.id,
          roleArea: formData.roleArea,
          seniority: formData.seniority,
          contractType: formData.contractType,
          workMode: formData.workMode,
          year: formData.year || undefined,
          ratingOverall: rating,
          pros: formData.pros,
          cons: formData.cons,
        }),
      });

      if (response.ok) {
        alert("Review publicada com sucesso! ✅");
        router.push(`/companies/${selectedCompany.id}`);
      } else {
        const error = await response.json();
        alert(`Erro ao publicar review: ${error.error || "Tente novamente"}`);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Erro ao publicar review. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <Navbar />

      <main className="flex-1 py-12">
        <Container size="md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-sora text-4xl font-bold text-[#0F172A] mb-3">
              Escrever Review
            </h1>
            <p className="text-[#64748B] text-lg">
              Compartilhe sua experiência de forma anônima e ajude outros profissionais
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Card principal do formulário */}
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-8 shadow-sm">
              {/* Empresa */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Empresa *
                </label>
                {selectedCompany ? (
                  <div className="flex items-center justify-between border border-[#E2E8F0] rounded-xl px-4 py-3 bg-[#F8FAFC]">
                    <span className="text-[#0F172A] font-medium">
                      {selectedCompany.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedCompany(null)}
                      className="text-[#64748B] hover:text-[#EF4444] transition-colors"
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Digite o nome da empresa"
                      className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                    />
                    {isSearching && (
                      <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#2563EB]"></div>
                      </div>
                    )}
                    {companies.length > 0 && (
                      <div className="absolute z-10 w-full mt-2 bg-white border border-[#E2E8F0] rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {companies.map((company) => (
                          <button
                            key={company.id}
                            type="button"
                            onClick={() => {
                              setSelectedCompany(company);
                              setSearchQuery("");
                              setCompanies([]);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-[#F8FAFC] transition-colors text-[#0F172A]"
                          >
                            {company.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Cargo e Senioridade */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                    Cargo/Área *
                  </label>
                  <input
                    type="text"
                    value={formData.roleArea}
                    onChange={(e) => setFormData({ ...formData, roleArea: e.target.value })}
                    placeholder="Ex: Frontend Developer"
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                    Senioridade *
                  </label>
                  <select
                    value={formData.seniority}
                    onChange={(e) => setFormData({ ...formData, seniority: e.target.value })}
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="JR">Júnior</option>
                    <option value="PL">Pleno</option>
                    <option value="SR">Sênior</option>
                  </select>
                </div>
              </div>

              {/* Tipo de Contrato e Modo de Trabalho */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                    Tipo de Contrato *
                  </label>
                  <select
                    value={formData.contractType}
                    onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="CLT">CLT</option>
                    <option value="PJ">PJ</option>
                    <option value="ESTAGIO">Estágio</option>
                    <option value="FREELA">Freelancer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                    Modo de Trabalho *
                  </label>
                  <select
                    value={formData.workMode}
                    onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                    className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="REMOTO">Remoto</option>
                    <option value="HIBRIDO">Híbrido</option>
                    <option value="PRESENCIAL">Presencial</option>
                  </select>
                </div>
              </div>

              {/* Ano (Opcional) */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Ano (Opcional)
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  placeholder="Ex: 2024"
                  min="2000"
                  max="2030"
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                />
              </div>

              {/* Avaliação com Estrelas */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#0F172A] mb-3">
                  Avaliação Geral
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <svg
                        className={`w-10 h-10 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "text-[#FCD34D] fill-[#FCD34D]"
                            : "text-[#E2E8F0]"
                        }`}
                        fill={star <= (hoveredRating || rating) ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                        />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-3 text-lg font-semibold text-[#0F172A]">
                    {rating > 0 ? `${rating}.0` : ""}
                  </span>
                </div>
              </div>

              {/* Pontos Positivos */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Pontos Positivos *
                </label>
                <textarea
                  value={formData.pros}
                  onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
                  rows={5}
                  placeholder="O que você gostou na empresa? (benefícios, cultura, ambiente, etc.)"
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#22C55E]/20 focus:border-[#22C55E] transition-all resize-none"
                  required
                />
              </div>

              {/* Pontos Negativos */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-[#0F172A] mb-2">
                  Pontos Negativos *
                </label>
                <textarea
                  value={formData.cons}
                  onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
                  rows={5}
                  placeholder="O que precisa melhorar? (seja construtivo)"
                  className="w-full border border-[#E2E8F0] rounded-xl px-4 py-3 text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] transition-all resize-none"
                  required
                />
              </div>

              {/* Aviso de Anonimato */}
              <div className="bg-[#2563EB]/5 border border-[#2563EB]/20 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-[#2563EB] text-sm mb-1">
                      Sua identidade está protegida
                    </h4>
                    <p className="text-[#64748B] text-sm">
                      Esta review será publicada de forma 100% anônima. Não solicitamos nenhum dado pessoal identificável.
                    </p>
                  </div>
                </div>
              </div>

              {/* Botão de Submissão */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white py-4 rounded-xl font-semibold text-lg transition-all hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? "Publicando..." : "Publicar Review Anonimamente"}
              </button>
            </div>
          </form>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
