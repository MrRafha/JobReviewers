"use client";

import { useState } from "react";
import type { ReviewWithUser } from "@/lib/services/companies";

interface ReviewCardProps {
  review: ReviewWithUser;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const seniorityLabel = {
    jr: "Júnior",
    pl: "Pleno",
    sr: "Sênior",
  };

  const contractTypeLabel = {
    clt: "CLT",
    pj: "PJ",
    estagio: "Estágio",
    freela: "Freela",
  };

  const workModeLabel = {
    remoto: "Remoto",
    hibrido: "Híbrido",
    presencial: "Presencial",
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? "text-orange-400" : "text-gray-300"}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {review.user?.handle || "Usuário Anônimo"}
          </h3>
          <p className="text-sm text-gray-600">{review.roleArea}</p>
          <div className="flex gap-2 mt-2">
            <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
              {seniorityLabel[review.seniority as keyof typeof seniorityLabel]}
            </span>
            <span className="inline-block bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
              {
                contractTypeLabel[
                  review.contractType as keyof typeof contractTypeLabel
                ]
              }
            </span>
            <span className="inline-block bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
              {workModeLabel[review.workMode as keyof typeof workModeLabel]}
            </span>
          </div>
        </div>

        <div className="text-right">
          <div className="flex gap-1 justify-end mb-1">
            {renderStars(review.ratingOverall)}
          </div>
          <span className="text-sm text-gray-600">{review.year}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="space-y-2 text-sm text-gray-700">
          <div>
            <strong className="text-green-700">✓ Pontos positivos:</strong>
            <p className="text-gray-600">
              {isExpanded
                ? review.pros
                : `${review.pros.substring(0, 100)}${review.pros.length > 100 ? "..." : ""}`}
            </p>
          </div>
          <div>
            <strong className="text-red-700">✗ Pontos negativos:</strong>
            <p className="text-gray-600">
              {isExpanded
                ? review.cons
                : `${review.cons.substring(0, 100)}${review.cons.length > 100 ? "..." : ""}`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          {new Date(review.createdAt).toLocaleDateString("pt-BR")}
        </span>

        <div className="flex gap-2">
          {(review.pros.length > 100 || review.cons.length > 100) && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {isExpanded ? "Recolher" : "Expandir"}
            </button>
          )}

          <button className="text-sm text-red-600 hover:text-red-700 font-medium">
            Denunciar
          </button>
        </div>
      </div>
    </div>
  );
}