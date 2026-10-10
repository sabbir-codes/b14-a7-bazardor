import { fmtPct } from "@/lib/bn";

export default function ChangeBadge({ pct, className = "" }: { pct: number; className?: string }) {
  const rounded = Math.round(pct * 10) / 10;
  const cfg =
    rounded > 0
      ? { cls: "bg-brand/10 text-brand-dark", label: `▲ ${fmtPct(rounded)}` }
      : rounded < 0
      ? { cls: "bg-danger/10 text-danger", label: `▼ ${fmtPct(rounded)}` }
      : { cls: "bg-ink/10 text-ink/60", label: `— ${fmtPct(0)}` };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold whitespace-nowrap ${cfg.cls} ${className}`}>
      {cfg.label}
    </span>
  );
}
