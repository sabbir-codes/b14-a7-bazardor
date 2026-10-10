"use client";
import { useProducts } from "@/lib/api";
import { fmtPct, fmtNum } from "@/lib/bn";
import type { Product } from "@/lib/types";

function Item({ p }: { p: Product }) {
  const r = Math.round(p.changePct * 10) / 10;
  const color = r > 0 ? "text-brand-dark" : r < 0 ? "text-danger" : "text-ink/50";
  const arrow = r > 0 ? "▲" : r < 0 ? "▼" : "—";
  return (
    <span className="mx-5 inline-flex items-center gap-1.5 whitespace-nowrap text-sm">
      <span>{p.emoji}</span>
      <span className="font-medium">{p.name}</span>
      <span className="text-ink/70">
        {fmtNum(p.price)} টাকা/{p.unit.replace("প্রতি ", "")}
      </span>
      <span className={`font-semibold ${color}`}>
        {arrow} {fmtPct(r)}
      </span>
    </span>
  );
}

export default function Ticker() {
  const { data, loading } = useProducts();
  return (
    <div className="ticker overflow-hidden border-b border-line bg-brand-soft py-2" aria-label="দামের টিকার">
      {loading || !data?.length ? (
        <div className="mx-auto h-5 max-w-6xl animate-pulse rounded bg-line/70 mx-4" />
      ) : (
        <div className="flex w-max animate-marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0" aria-hidden={k === 1}>
              {data.map((p) => (
                <Item key={`${k}-${p.id}`} p={p} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
