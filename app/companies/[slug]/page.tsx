import Link from "next/link";
import { notFound } from "next/navigation";

import { CompanyHeader } from "@/components/features/CompanyHeader";
import { ReviewCard } from "@/components/features/ReviewCard";
import {
  getCompanyBySlug,
  calculateAverageRating,
} from "@/lib/services/companies";

interface CompanyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params; // ✅ ISSO É O PONTO-CHAVE

  const company = await getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  const averageRating = calculateAverageRating(company.reviews);

  return (
    <div className="container mx-auto px-4 py-8">
      <CompanyHeader company={company} averageRating={averageRating} />

      <h2 className="text-2xl font-bold mb-6">
        Avaliações ({company.reviews.length})
      </h2>

      {company.reviews.length === 0 ? (
        <p className="text-gray-500">Nenhuma avaliação ainda.</p>
      ) : (
        <div className="space-y-4">
          {company.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
