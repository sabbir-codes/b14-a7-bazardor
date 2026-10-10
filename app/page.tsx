"use client";
import { useMemo } from "react";
import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import { GridSkeleton } from "@/components/Skeletons";
import { useCategories, useProducts } from "@/lib/api";
import { toBnDigits } from "@/lib/bn";

export default function HomePage() {
  const { data: products, loading, error } = useProducts();
  const { data: categories } = useCategories();

  const { risers, fallers, marketCount } = useMemo(() => {
    const list = products ?? [];
    return {
      risers: [...list].filter((p) => p.changePct > 0).sort((a, b) => b.changePct - a.changePct).slice(0, 6),
      fallers: [...list].filter((p) => p.changePct < 0).sort((a, b) => a.changePct - b.changePct).slice(0, 6),
      marketCount: new Set(list.flatMap((p) => p.markets.map((m) => m.name))).size,
    };
  }, [products]);

  const loaded = !loading && !error;

  return (
    <>
      <Hero products={loaded ? products?.length : undefined} categories={categories?.length} markets={loaded ? marketCount : undefined} />

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10">
        {error && (
          <div role="alert" className="alert alert-error text-white">
            ডেটা লোড করা যায়নি। অনুগ্রহ করে পেজটি রিলোড করুন।
          </div>
        )}

        <section aria-labelledby="risers">
          <h2 id="risers" className="mb-4 text-xl font-bold sm:text-2xl">
            আজ দাম বেড়েছে <span className="text-brand-dark">▲</span>
          </h2>
          {loading ? <GridSkeleton count={6} /> : <ProductGrid products={risers} cols="" />}
          {loaded && risers.length === 0 && <p className="text-ink/60">আজ কোনো পণ্যের দাম বাড়েনি।</p>}
        </section>

        <section aria-labelledby="fallers">
          <h2 id="fallers" className="mb-4 text-xl font-bold sm:text-2xl">
            আজ দাম কমেছে <span className="text-danger">▼</span>
          </h2>
          {loading ? <GridSkeleton count={6} /> : <ProductGrid products={fallers} cols="" />}
          {loaded && fallers.length === 0 && <p className="text-ink/60">আজ কোনো পণ্যের দাম কমেনি।</p>}
        </section>

        <section id="সব-পণ্য" className="section-anchor" aria-labelledby="all">
          <h2 id="all" className="text-xl font-bold sm:text-2xl">সব পণ্য</h2>
          <p className="mb-4 text-sm text-ink/60">
            {loaded ? `মোট ${toBnDigits(products?.length ?? 0)}টি পণ্য দেখানো হচ্ছে` : "পণ্যের তালিকা লোড হচ্ছে…"}
          </p>
          {loading ? <GridSkeleton count={8} /> : <ProductGrid products={products ?? []} />}
        </section>
      </div>
    </>
  );
}
