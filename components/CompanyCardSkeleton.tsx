export default function CompanyCardSkeleton() {
  return (
    <div className="block h-full rounded-[20px] border border-[var(--border)] bg-[var(--bg-surface)] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
      <div className="flex flex-col h-full justify-between animate-pulse">
        {/* Title and subtitle */}
        <div>
          <div className="mb-2 h-6 w-3/5 rounded-md bg-[var(--bg-subtle)]" />
          <div className="h-4 w-2/5 rounded-md bg-[var(--bg-subtle)]" />
        </div>

        {/* Rating row */}
        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Star icon placeholder */}
            <div className="h-5 w-5 rounded-sm bg-[var(--bg-subtle)]" />
            {/* Rating number placeholder */}
            <div className="h-5 w-8 rounded-md bg-[var(--bg-subtle)]" />
          </div>
          {/* Review count placeholder */}
          <div className="h-4 w-20 rounded-md bg-[var(--bg-subtle)]" />
        </div>
      </div>
    </div>
  );
}
