"use client";
import { useEffect, useState } from "react";
import { normalizeCategories, normalizeProduct, normalizeProducts, unwrapOne } from "./normalize";
import type { Category, Product } from "./types";

async function getJson(path: string): Promise<unknown> {
  const res = await fetch(`/api/bazar/${path}`);
  if (res.status === 404) throw Object.assign(new Error("not_found"), { notFound: true });
  if (!res.ok) throw new Error("fetch_failed");
  return res.json();
}

// tiny in-memory cache so navigating between pages feels instant
const cache = new Map<string, Promise<unknown>>();
function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (!cache.has(key)) {
    const p = load().catch((e) => {
      cache.delete(key);
      throw e;
    });
    cache.set(key, p);
  }
  return cache.get(key) as Promise<T>;
}

export const fetchProducts = (category?: string) =>
  cached<Product[]>(`products:${category ?? "all"}`, async () =>
    normalizeProducts(await getJson(category ? `products?category=${encodeURIComponent(category)}` : "products"))
  );

export const fetchCategories = () =>
  cached<Category[]>("categories", async () => normalizeCategories(await getJson("categories")));

export const fetchProduct = (slug: string) =>
  cached<Product | null>(`product:${slug}`, async () => {
    try {
      const p = normalizeProduct(unwrapOne(await getJson(`products/${encodeURIComponent(slug)}`)));
      if (p && p.name) return p;
    } catch (e) {
      if (!(e as { notFound?: boolean }).notFound) throw e;
    }
    // fallback: look it up in the full list by slug or id
    const all = await fetchProducts();
    return all.find((x) => x.slug === slug || x.id === slug) ?? null;
  });

export interface AsyncState<T> {
  data: T | undefined;
  loading: boolean;
  error: boolean;
}

export function useAsync<T>(loader: () => Promise<T>, deps: unknown[]): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ data: undefined, loading: true, error: false });
  useEffect(() => {
    let alive = true;
    setState({ data: undefined, loading: true, error: false });
    loader()
      .then((data) => alive && setState({ data, loading: false, error: false }))
      .catch(() => alive && setState({ data: undefined, loading: false, error: true }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return state;
}

export const useProducts = (category?: string) => useAsync(() => fetchProducts(category), [category]);
export const useCategories = () => useAsync(fetchCategories, []);
export const useProduct = (slug: string) => useAsync(() => fetchProduct(slug), [slug]);
