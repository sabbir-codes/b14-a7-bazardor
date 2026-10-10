"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import ChangeBadge from "@/components/ChangeBadge";
import NotFoundView from "@/components/NotFoundView";
import { Bar } from "@/components/Skeletons";
import { useCategories, useProduct } from "@/lib/api";
import { fmtNum, fmtTaka, toBnDigits } from "@/lib/bn";
import { useSession } from "@/lib/auth-client";

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="text-sm text-ink/60">{label}</p>
      <p className={`mt-1 text-xl font-bold sm:text-2xl ${tone ?? ""}`}>{value}</p>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div role="status" aria-label="Loading…" className="space-y-6">
      <Bar className="h-4 w-48" />
      <div className="rounded-2xl border border-line bg-white p-6 space-y-4">
        <div className="flex gap-4">
          <Bar className="h-16 w-16 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <Bar className="h-7 w-1/2" />
            <Bar className="h-4 w-3/4" />
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Bar key={i} className="h-20" />
          ))}
        </div>
      </div>
      <Bar className="h-56 rounded-2xl" />
    </div>
  );
}

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(params.slug);
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { data: p0, loading, error } = useProduct(slug);
  const { data: cats } = useCategories();
  const catName = cats?.find((c) => c.slug === p0?.category)?.name;
  const p = p0 ? { ...p0, categoryName: catName ?? p0.categoryName } : p0;

  // client-side guard (the middleware already blocks users with no session cookie)
  useEffect(() => {
    if (!isPending && !session?.user) {
      toast.error("পণ্যের বিস্তারিত দেখতে অনুগ্রহ করে সাইন ইন করুন", { id: "protected" });
      router.replace(`/signin?redirect=${encodeURIComponent(`/product/${slug}`)}`);
    }
  }, [isPending, session, router, slug]);

  if (isPending || !session?.user || loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !p) {
    return <NotFoundView title="পণ্যটি খুঁজে পাওয়া যায়নি" message="এই লিংকে কোনো পণ্য নেই অথবা সরিয়ে নেওয়া হয়েছে।" />;
  }

  const cheapest = p.markets.length ? p.markets.reduce((a, m) => (m.min < a.min ? m : a)) : null;
  const priciest = p.markets.length ? p.markets.reduce((a, m) => (m.max > a.max ? m : a)) : null;
  const summaryLine =
    p.description ||
    (p.markets.length
      ? `${toBnDigits(p.markets.length)}টি বাজারে ${p.unit} দাম ${fmtNum(p.min)} থেকে ${fmtNum(p.max)} টাকার মধ্যে।`
      : "");
  const r = Math.round(p.changePct * 10) / 10;
  const amount = p.changeAmount !== null ? Math.abs(p.changeAmount) : null;
  const changeLine =
    r > 0
      ? `গতকালের তুলনায় আজ দাম বেড়েছে${amount ? ` · ${fmtNum(amount)} টাকা` : ""}`
      : r < 0
      ? `গতকালের তুলনায় আজ দাম কমেছে${amount ? ` · ${fmtNum(amount)} টাকা` : ""}`
      : "গতকালের তুলনায় দামে কোনো পরিবর্তন নেই";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-ink/60">
        <Link href="/" className="hover:text-brand-dark">হোম</Link>
        <span>›</span>
        {p.category && (
          <>
            <Link href={`/category/${encodeURIComponent(p.category)}`} className="hover:text-brand-dark">{p.categoryName}</Link>
            <span>›</span>
          </>
        )}
        <span className="font-medium text-ink">{p.name}</span>
      </nav>

      {/* Summary */}
      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-4xl">{p.emoji}</div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{p.name}</h1>
              {summaryLine && <p className="mt-1 text-ink/65">{summaryLine}</p>}
              <div className="mt-3 flex flex-wrap gap-2 text-sm">
                {p.categoryName && <span className="rounded-full bg-brand-soft px-3 py-1 font-medium text-brand-dark">{p.categoryName}</span>}
                <span className="rounded-full bg-canvas px-3 py-1 text-ink/70">{p.unit}</span>
              </div>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-ink/60">আজকের দাম</p>
            <p className="text-3xl font-bold">{fmtTaka(p.price)}</p>
            <ChangeBadge pct={p.changePct} className="mt-1" />
            <p className="mt-1 text-xs text-ink/55">{changeLine}</p>
          </div>
        </div>

        <h2 className="mb-3 mt-7 text-lg font-bold">দামের সারসংক্ষেপ</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Stat label="সর্বনিম্ন দাম" value={fmtTaka(p.min)} tone="text-brand-dark" />
          <Stat label="সর্বাধিক দাম" value={fmtTaka(p.max)} tone="text-danger" />
          <Stat label="গড় দাম" value={fmtTaka(p.avg)} />
        </div>
      </section>

      {/* Market wise */}
      <section className="rounded-2xl border border-line bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-lg font-bold">বাজারভিত্তিক আজকের দাম</h2>
        <p className="mb-4 text-sm text-ink/60">
          {p.markets.length ? `${toBnDigits(p.markets.length)}টি বাজার অন্তর্ভুক্ত · ${p.unit}-এর হিসাবে` : "এই পণ্যের বাজারভিত্তিক তথ্য পাওয়া যায়নি।"}
        </p>

        {p.markets.length > 0 && cheapest && priciest && (
          <>
            <div className="mb-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-brand/30 bg-brand-soft p-4">
                <p className="text-sm text-ink/60">সবচেয়ে কম দামের বাজার</p>
                <p className="font-semibold">{cheapest.name}{cheapest.division && ` (${cheapest.division})`}</p>
                <p className="font-bold text-brand-dark">সর্বনিম্ন {fmtTaka(cheapest.min)}</p>
              </div>
              <div className="rounded-xl border border-danger/30 bg-danger/5 p-4">
                <p className="text-sm text-ink/60">সবচেয়ে বেশি দামের বাজার</p>
                <p className="font-semibold">{priciest.name}{priciest.division && ` (${priciest.division})`}</p>
                <p className="font-bold text-danger">সর্বোচ্চ {fmtTaka(priciest.max)}</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-line">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead className="bg-canvas text-ink/70">
                  <tr>
                    <th className="px-4 py-3 font-medium">বিভাগ</th>
                    <th className="px-4 py-3 font-medium">বাজার</th>
                    <th className="px-4 py-3 text-right font-medium">সর্বনিম্ন</th>
                    <th className="px-4 py-3 text-right font-medium">সর্বোচ্চ</th>
                  </tr>
                </thead>
                <tbody>
                  {p.markets.map((m) => (
                    <tr key={`${m.division}-${m.name}`} className="border-t border-line">
                      <td className="px-4 py-3 text-ink/70">{m.division || "—"}</td>
                      <td className="px-4 py-3 font-medium">{m.name}</td>
                      <td className="px-4 py-3 text-right font-semibold text-brand-dark">{fmtTaka(m.min)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-danger">{fmtTaka(m.max)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
