"use client";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import NotFoundView from "@/components/NotFoundView";
import ProductGrid from "@/components/ProductGrid";
import { GridSkeleton } from "@/components/Skeletons";
import SortSelect, { SortKey } from "@/components/SortSelect";
import { useCategories, useProducts } from "@/lib/api";
import { toBnDigits } from "@/lib/bn";

export default function CategoryPage() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(params.slug);
  const [sort, setSort] = useState<SortKey>("default");

  const { data: products, loading, error } = useProducts(slug);
  const { data: categories } = useCategories();
  const category = categories?.find((c) => c.slug === slug);

  // sorting is on the numeric price (already parsed from Bengali digits), never on strings
  const sorted = useMemo(() => {
    const list = [...(products ?? [])];
    if (sort === "asc") list.sort((a, b) => a.price - b.price);
    if (sort === "desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [products, sort]);

  if (!loading && (error || !products || products.length === 0)) {
    return (
      <NotFoundView
        title="এই বিভাগে কোনো পণ্য পাওয়া যায়নি"
        message="বিভাগটি নেই অথবা এখানে এখনো কোনো পণ্য যোগ হয়নি।"
      />
    );
  }

  const title = category?.name ?? products?.[0]?.categoryName ?? "";
  const icon = category?.emoji || products?.[0]?.emoji || "🛒";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-3xl">{icon}</span>
          <div>
            {loading && !title ? <div className="h-7 w-32 animate-pulse rounded bg-line" /> : <h1 className="text-2xl font-bold">{title}</h1>}
            <p className="text-sm text-ink/60">
              {loading ? "লোড হচ্ছে…" : `${toBnDigits(sorted.length)}টি পণ্যের আজকের দাম ও পরিবর্তন`}
            </p>
          </div>
        </div>
        <SortSelect value={sort} onChange={setSort} />
      </div>
      {loading ? <GridSkeleton count={8} /> : <ProductGrid products={sorted} />}
    </div>
  );
}
