import Link from "next/link";

interface CompanyCardProps {
  name: string;
  slug: string;
  location: string;
  rating: number;
  reviewCount: number;
}

export default function CompanyCard({
  name,
  slug,
  location,
  rating,
  reviewCount,
}: CompanyCardProps) {
  return (
    <Link
      href={`/companies/${slug}`}
      className="block h-full rounded-[20px] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(0,0,0,0.08)]"
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <h3 className="mb-2 font-sora text-xl font-semibold text-[var(--text-primary)]">
            {name}
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">{location}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-[var(--warning)]"
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
            <span className="text-lg font-bold text-[var(--text-primary)]">
              {rating.toFixed(1)}
            </span>
          </div>
          <span className="text-sm text-[var(--text-secondary)]">
            {reviewCount} avaliacoes
          </span>
        </div>
      </div>
    </Link>
  );
}
