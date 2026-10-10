import Link from "next/link";
import type { Product } from "@/lib/types";
import { fmtTaka } from "@/lib/bn";
import ChangeBadge from "./ChangeBadge";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      href={`/product/${encodeURIComponent(p.slug)}`}
      className="group block rounded-2xl border border-line bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-3xl">{p.emoji}</div>
        <div className="min-w-0">
          <h3 className="font-semibold leading-snug text-ink group-hover:text-brand-dark break-words">{p.name}</h3>
          <p className="text-sm text-ink/60">{p.unit}</p>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-2 border-t border-line pt-3">
        <div>
          <p className="text-xs text-ink/50">আজকের দাম</p>
          <p className="text-lg font-bold text-ink">{fmtTaka(p.price)}</p>
        </div>
        <ChangeBadge pct={p.changePct} />
      </div>
    </Link>
  );
}
