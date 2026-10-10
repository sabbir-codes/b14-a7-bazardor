export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-line bg-white p-4 animate-pulse" aria-hidden>
      <div className="flex items-start gap-3">
        <div className="h-14 w-14 rounded-xl bg-line" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 w-3/4 rounded bg-line" />
          <div className="h-3 w-1/3 rounded bg-line" />
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between border-t border-line pt-3">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-line" />
          <div className="h-5 w-24 rounded bg-line" />
        </div>
        <div className="h-6 w-16 rounded-full bg-line" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div role="status" aria-label="Loading…" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function Bar({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-line ${className}`} />;
}
