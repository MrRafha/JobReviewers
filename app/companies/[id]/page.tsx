import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container, Footer, Navbar } from "@/components/layout";
import ErrorCard from "@/components/ui/ErrorCard";
import CompanyReviewsSection from "@/components/features/CompanyReviewsSection";
import { DB_UNAVAILABLE } from "@/lib/constants/error-messages";
import {
  getCompanyById,
  getCompanyBySlug,
  getCompanyStats,
} from "@/lib/services/companies";
import { isDatabaseUnavailableError } from "@/lib/services/db-errors";
import { getReviewsByCompany } from "@/lib/services/reviews";

interface CompanyPageProps {
  params: Promise<{ id: string }>;
}

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
  const { id } = await params;

  let companyById = null;
  let company = null;

  try {
    companyById = await getCompanyById(id);
    company = companyById ?? (await getCompanyBySlug(id));
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return (
        <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Container className="py-16">
              <ErrorCard
                title={DB_UNAVAILABLE.TITLE}
                description="Não foi possível carregar esta empresa agora. Tente novamente em alguns instantes."
              />
              <div className="mt-6 text-center">
                <Link
                  href="/"
                  className="inline-flex rounded-xl bg-[var(--brand-primary)] px-5 py-2.5 font-semibold text-white transition-all hover:bg-[var(--brand-primary-hover)]"
                >
                  Voltar para início
                </Link>
              </div>
            </Container>
          </main>
          <Footer />
        </div>
      );
    }
    throw error;
  }

  if (!company) {
    notFound();
  }

  const companyId = company.id;
  let stats;
  let reviews;

  try {
    stats = await getCompanyStats(companyId);
    ({ reviews } = await getReviewsByCompany(companyId, { limit: 10 }));
  } catch (error) {
    if (isDatabaseUnavailableError(error)) {
      return (
        <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Container className="py-16">
              <ErrorCard
                title={DB_UNAVAILABLE.TITLE}
                description="Não foi possível carregar as avaliações desta empresa neste momento."
              />
              <div className="mt-6 text-center">
                <Link
                  href={`/companies/${company.slug}`}
                  className="inline-flex rounded-xl bg-[var(--brand-primary)] px-5 py-2.5 font-semibold text-white transition-all hover:bg-[var(--brand-primary-hover)]"
                >
                  Tentar novamente
                </Link>
              </div>
            </Container>
          </main>
          <Footer />
        </div>
      );
    }
    throw error;
  }

  const formattedReviews = reviews.map((review) => ({
    rating: review.ratingOverall,
    position: review.roleArea,
    seniority: seniorityMap[review.seniority] || review.seniority,
    contractType: contractTypeMap[review.contractType] || review.contractType,
    positives: review.pros,
    negatives: review.cons,
    date: new Date(review.createdAt).toLocaleDateString("pt-BR"),
    helpfulCount: 0,
  }));

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col">
      <Navbar />

      <main className="flex-1">
        <div className="bg-gradient-to-r from-[var(--brand-primary)] to-[#1D4ED8] py-12">
          <Container>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="bg-white rounded-2xl p-4 w-24 h-24 flex items-center justify-center shadow-lg">
                <Image
                  src="/logo.png"
                  alt={company.name}
                  width={64}
                  height={64}
                  className="object-contain"
                />
              </div>

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

              <Link
                href={`/reviews/new?companyId=${companyId}&companyName=${encodeURIComponent(company.name)}`}
                className="bg-white/15 hover:bg-white/20 text-white border border-white/25 px-6 py-3 rounded-full font-semibold transition-all hover:scale-105 flex items-center gap-2"
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

        <Container className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-6 sticky top-24">
                <div className="text-center pb-6 border-b border-[#E2E8F0]">
                  <div className="text-5xl font-bold text-[var(--text-primary)] mb-2">
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
                  <p className="text-[var(--text-secondary)] text-sm">
                    Baseado em {stats.totalReviews} avaliações
                  </p>
                </div>

                <div className="pt-6">
                  <h3 className="font-semibold text-[var(--text-primary)] mb-4">
                    Distribuição de Avaliações
                  </h3>
                  <div className="space-y-3">
                    {stats.distribution.map((item) => (
                      <div key={item.stars} className="flex items-center gap-3">
                        <span className="text-sm text-[var(--text-secondary)] w-8">
                          {item.stars}★
                        </span>
                        <div className="flex-1 bg-[var(--bg-subtle)] rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#FCD34D] h-full rounded-full transition-all"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-[var(--text-secondary)] w-12 text-right">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <CompanyReviewsSection
              companySlug={company.slug}
              companyName={company.name}
              companyId={companyId}
              totalReviews={stats.totalReviews}
              initialReviews={formattedReviews}
            />
          </div>
        </Container>
      </main>

      <Footer />
    </div>
  );
}
