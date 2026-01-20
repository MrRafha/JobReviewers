interface CompanyCardProps {
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
}

export default function CompanyCard({
  name,
  location,
  rating,
  reviewCount,
}: CompanyCardProps) {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 h-48 transition-all hover:scale-105 hover:shadow-lg cursor-pointer">
      <div className="flex flex-col h-full justify-between">
        <div>
          <h3 className="text-xl font-semibold text-[#0F172A] mb-2">{name}</h3>
          <p className="text-sm text-[#94A3B8]">{location}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-[#64748B]"
              fill="none"
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
            <span className="text-lg font-bold text-[#0F172A]">
              {rating.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-[#64748B]">{reviewCount} reviews</span>
        </div>
      </div>
    </div>
  );
}
