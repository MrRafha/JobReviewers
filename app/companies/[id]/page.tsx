import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

interface CompanyPageProps {
  params: Promise<{ id: string }>;
}

const seniorityLabel: Record<string, string> = {
  JR: "Júnior",
  PL: "Pleno",
  SR: "Sênior",
};

const contractLabel: Record<string, string> = {
  CLT: "CLT",
  PJ: "PJ",
  ESTAGIO: "Estágio",
  FREELA: "Freelancer",
};

const workModeLabel: Record<string, string> = {
  REMOTO: "Remoto",
  HIBRIDO: "Híbrido",
  PRESENCIAL: "Presencial",
};

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="text-yellow-400 text-lg">
      {"★".repeat(rating)}
      {"☆".repeat(5 - rating)}
    </span>
  );
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { id } = await params;

  // Buscar por slug ou por id
  const company = await prisma.company.findFirst({
    where: {
      OR: [{ slug: id }, { id }],
    },
    include: {
      reviews: {
        where: { hidden: false },
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { handle: true } },
        },
      },
    },
  });

  if (!company) {
    notFound();
  }

  const avgRating =
    company.reviews.length > 0
      ? company.reviews.reduce((sum, r) => sum + r.ratingOverall, 0) /
        company.reviews.length
      : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header da empresa */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{company.name}</h1>
            {(company.city || company.state) && (
              <p className="text-gray-600">
                {[company.city, company.state].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
          <div className="text-right">
            {company.reviews.length > 0 ? (
              <>
                <div className="text-3xl font-bold text-yellow-500">
                  {avgRating.toFixed(1)}
                </div>
                <StarDisplay rating={Math.round(avgRating)} />
                <p className="text-sm text-gray-500 mt-1">
                  {company.reviews.length}{" "}
                  {company.reviews.length === 1 ? "review" : "reviews"}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">Sem avaliações</p>
            )}
          </div>
        </div>
      </div>

      {/* Botão para criar review */}
      <Link
        href={`/reviews/new?companyId=${company.id}`}
        className="inline-block bg-gradient-to-r from-green-500 to-orange-500 text-white px-6 py-3 rounded-lg mb-8 font-medium"
      >
        Avaliar Empresa
      </Link>

      {/* Lista de reviews */}
      <h2 className="text-2xl font-bold mb-4">Reviews</h2>

      {company.reviews.length === 0 ? (
        <p className="text-gray-500">
          Nenhuma review ainda. Seja o primeiro a avaliar!
        </p>
      ) : (
        <div className="space-y-4">
          {company.reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <StarDisplay rating={review.ratingOverall} />
                  <span className="font-semibold">{review.roleArea}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded">
                    {seniorityLabel[review.seniority] || review.seniority}
                  </span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded">
                    {contractLabel[review.contractType] || review.contractType}
                  </span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded">
                    {workModeLabel[review.workMode] || review.workMode}
                  </span>
                  {review.year && (
                    <span className="bg-gray-100 px-2 py-0.5 rounded">
                      {review.year}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                <div>
                  <h4 className="text-sm font-medium text-green-600 mb-1">
                    👍 Pontos Positivos
                  </h4>
                  <p className="text-sm text-gray-700">{review.pros}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-600 mb-1">
                    👎 Pontos Negativos
                  </h4>
                  <p className="text-sm text-gray-700">{review.cons}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t">
                <span>por @{review.user.handle}</span>
                <span>
                  {new Date(review.createdAt).toLocaleDateString("pt-BR")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
