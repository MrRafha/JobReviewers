"use client";

import Link from "next/link";
import type { CompanyWithReviews } from "@/lib/services/companies";

interface CompanyHeaderProps {
  company: CompanyWithReviews;
  averageRating: number;
}


export function CompanyHeader({
  company,
  averageRating,
}: CompanyHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-8 mb-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {company.name}
          </h1>
          {company.city && company.state && (
            <p className="text-lg text-gray-600">
              📍 {company.city}, {company.state}
            </p>
          )}
        </div>

        {/* Rating */}
        <div className="text-right">
          <div className="text-5xl font-bold text-orange-500">
            {averageRating.toFixed(1)}
          </div>
          <div className="text-gray-600 mt-1">
            ⭐ {company.reviews.length} avaliações
          </div>
        </div>
      </div>

      {/* Botão de avaliar */}
      <Link
        href={`/reviews/new?companyId=${company.id}`}
        className="inline-block bg-gradient-to-r from-green-500 to-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition"
      >
        + Avaliar Empresa
      </Link>
    </div>
  );
}