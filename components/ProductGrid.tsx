import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, cols = "xl:grid-cols-4" }: { products: Product[]; cols?: string }) {
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ${cols}`}>
      {products.map((p) => (
        <ProductCard key={p.id || p.slug} p={p} />
      ))}
    </div>
  );
}
