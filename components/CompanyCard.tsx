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
          <div className="flex items-center gap-1">
            <span className="text-2xl">⭐</span>
            <span className="text-lg font-bold text-[#0F172A]">
              {rating.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-[#475569]">{reviewCount} reviews</span>
        </div>
      </div>
    </div>
  );
}
