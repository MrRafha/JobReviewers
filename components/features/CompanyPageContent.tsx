import { CompanyHeader } from "@/components/features/CompanyHeader";
import { ReviewCard } from "@/components/features/ReviewCard";
import { calculateAverageRating } from "@/lib/services/companies";
import type { CompanyWithReviews } from "@/lib/services/companies";

interface Props {
  company: CompanyWithReviews;
}

export function CompanyPageContent({ company }: Props) {
  const averageRating = calculateAverageRating(company.reviews);

  return (
    <div className="container mx-auto px-4 py-8">
      <CompanyHeader company={company} averageRating={averageRating} />

      <h2 className="text-2xl font-bold mb-6">
        Avaliações ({company.reviews.length})
      </h2>

      <div className="space-y-4">
        {company.reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
