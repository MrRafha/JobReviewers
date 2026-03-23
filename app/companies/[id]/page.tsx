import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Navbar, Footer, Container } from "@/components/layout";
import ReviewCard from "@/components/ReviewCard";
import { getCompanyById, getCompanyStats } from "@/lib/services/companies";
import { getReviewsByCompany } from "@/lib/services/reviews";

// Página de empresa
// URL: /companies/[id]

interface CompanyPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Mapeamento de enum para texto legível
const seniorityMap: Record<string, string> = {
  JR: "Júnior",
  PL: "Pleno",
  SR: "Sênior",
};

const contractTypeMap: Record<string, string> = {
  CLT: "CLT",
  PJ: "PJ",
  ESTAGIO: "Estágio",
  FREELA: "Freelancer",
};

export default async function CompanyPage({ params }: CompanyPageProps) {
  // No Next.js 15+, params é uma Promise
  const { id } = await params;
  
  // Buscar empresa e reviews do banco
  const company = await getCompanyById(id);
  
  if (!company) {
    notFound();
  }

  const stats = await getCompanyStats(id);
  const { reviews } = await getReviewsByCompany(id, { limit: 10 });

  // Formatar reviews para o componente
  const formattedReviews = reviews.map((review) => ({
    rating: review.ratingOverall,
    position: review.roleArea,
    seniority: seniorityMap[review.seniority] || review.seniority,
    contractType: contractTypeMap[review.contractType] || review.contractType,
    positives: review.pros,
    negatives: review.cons,
    date: new Date(review.createdAt).toLocaleDateString("pt-BR"),
    helpfulCount: 0, // TODO: Implementar sistema de votos
  }));

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header da Empresa */}
        <div className="bg-[#2B2D31] py-12">
          <Container>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Logo da Empresa */}
              <div className="bg-white rounded-2xl p-4 w-24 h-24 flex items-center justify-center shadow-lg">
                <Image
                  src="/logo.png"
                  alt={company.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>

              {/* Info da Empresa */}
              <div className="flex-1">
                <h1 className="font-sora text-4xl font-bold text-white mb-2">
                  {company.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/70">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                      />
                    </svg>
                    <span>
                      {company.city && company.state
                        ? `${company.city}, ${company.state}`
                        : "Localização não informada"}
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Link
                href={`/reviews/new?companyId=${id}&companyName=${encodeURIComponent(company.name)}`}
                className="bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-white border border-[#22C55E]/30 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 flex items-center gap-2"
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Escrever Review
              </Link>
            </div>
          </Container>
        </div>

        {/* Estatísticas e Reviews */}
        <Container className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sidebar com Estatísticas */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sticky top-24">
                {/* Rating Geral */}
                <div className="text-center pb-6 border-b border-[#E2E8F0]">
                  <div className="text-5xl font-bold text-[#0F172A] mb-2">
                    {stats.averageRating.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-6 h-6 ${
                          star <= Math.round(stats.averageRating)
                            ? "text-[#FCD34D] fill-[#FCD34D]"
                            : "text-[#E2E8F0]"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-[#64748B] text-sm">
                    Baseado em {stats.totalReviews} avaliações
                  </p>
                </div>

                {/* Distribuição de Estrelas */}
                <div className="pt-6">
                  <h3 className="font-semibold text-[#0F172A] mb-4">
                    Distribuição de Avaliações
                  </h3>
                  <div className="space-y-3">
                    {stats.distribution.map((item) => (
                      <div key={item.stars} className="flex items-center gap-3">
                        <span className="text-sm text-[#64748B] w-8">
                          {item.stars}★
                        </span>
                        <div className="flex-1 bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#FCD34D] h-full rounded-full transition-all"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-[#64748B] w-12 text-right">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Lista de Reviews */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-sora text-2xl font-bold text-[#0F172A]">
                  Avaliações ({stats.totalReviews})
                </h2>
                
                {/* Filtro */}
                <select className="border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm text-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all">
                  <option value="recent">Mais Recentes</option>
                  <option value="helpful">Mais Úteis</option>
                  <option value="rating-high">Maior Avaliação</option>
                  <option value="rating-low">Menor Avaliação</option>
                </select>
              </div>

              {/* Reviews */}
              {formattedReviews.length > 0 ? (
                <div className="space-y-6">
                  {formattedReviews.map((review, index) => (
                    <ReviewCard key={index} {...review} />
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
                      d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                    />
                  </svg>
                  <p className="text-[#64748B] font-semibold mb-2">
                    Ainda não há avaliações
                  </p>
                  <p className="text-[#94A3B8] text-sm mb-4">
                    Seja o primeiro a avaliar {company.name}
                  </p>
                  <Link
                    href={`/reviews/new?companyId=${id}&companyName=${encodeURIComponent(company.name)}`}
                    className="inline-block bg-[#22C55E] hover:bg-[#16A34A] text-white px-6 py-2 rounded-full font-semibold transition-all"
                  >
                    Escrever Primeira Review
                  </Link>
                </div>
              )}

              {/* Paginação Placeholder */}
              <div className="mt-8 flex justify-center">
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
                    Anterior
                  </button>
                  <button className="px-4 py-2 bg-[#2563EB] text-white rounded-lg font-medium">
                    1
                  </button>
                  <button className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
                    2
                  </button>
                  <button className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
                    3
                  </button>
                  <button className="px-4 py-2 border border-[#E2E8F0] rounded-lg text-[#64748B] hover:bg-[#F1F5F9] transition-colors">
                    Próximo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
