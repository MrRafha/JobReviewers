interface ReviewCardProps {
  rating: number;
  position: string;
  seniority: string;
  contractType: string;
  positives: string;
  negatives: string;
  date: string;
  helpfulCount?: number;
}

export default function ReviewCard({
  rating,
  position,
  seniority,
  contractType,
  positives,
  negatives,
  date,
  helpfulCount = 0,
}: ReviewCardProps) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header com Rating e Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Rating */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-5 h-5 ${
                  star <= rating ? "text-[#FCD34D] fill-[#FCD34D]" : "text-[#E2E8F0]"
                }`}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
            ))}
            <span className="ml-2 font-semibold text-[#0F172A]">{rating}.0</span>
          </div>
        </div>
        
        {/* Data */}
        <span className="text-sm text-[#94A3B8]">{date}</span>
      </div>

      {/* Informações do Cargo */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="px-3 py-1 bg-[#F1F5F9] text-[#475569] text-sm rounded-full">
          {position}
        </span>
        <span className="px-3 py-1 bg-[#DBEAFE] text-[#1E40AF] text-sm rounded-full">
          {seniority}
        </span>
        <span className="px-3 py-1 bg-[#E0F2FE] text-[#0369A1] text-sm rounded-full">
          {contractType}
        </span>
      </div>

      {/* Pontos Positivos */}
      {positives && (
        <div className="mb-4">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-[#22C55E] mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-[#0F172A] text-sm mb-1">
                Pontos Positivos
              </h4>
              <p className="text-[#64748B] text-sm leading-relaxed">{positives}</p>
            </div>
          </div>
        </div>
      )}

      {/* Pontos Negativos */}
      {negatives && (
        <div className="mb-4">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-[#EF4444] mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <div>
              <h4 className="font-semibold text-[#0F172A] text-sm mb-1">
                Pontos Negativos
              </h4>
              <p className="text-[#64748B] text-sm leading-relaxed">{negatives}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer com ações */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
        <button className="flex items-center gap-2 text-[#64748B] hover:text-[#22C55E] transition-colors text-sm">
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
              d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
            />
          </svg>
          <span>Útil ({helpfulCount})</span>
        </button>

        <button className="flex items-center gap-2 text-[#64748B] hover:text-[#EF4444] transition-colors text-sm">
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
              d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
            />
          </svg>
          <span>Denunciar</span>
        </button>
      </div>
    </div>
  );
}
