import Image from "next/image";
import { toBnDigits } from "@/lib/bn";

export default function Hero({ products, categories, markets }: { products?: number; categories?: number; markets?: number }) {
  const stat = (n: number | undefined, label: string) => (
    <div>
      <p className="text-2xl font-bold text-brand-dark">{n === undefined ? <span className="inline-block h-7 w-8 animate-pulse rounded bg-line align-middle" /> : toBnDigits(n)}</p>
      <p className="text-xs text-ink/60 sm:text-sm">{label}</p>
    </div>
  );
  return (
    <section className="bg-gradient-to-b from-brand-soft to-canvas">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-14">
        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-white px-3 py-1 text-xs font-medium text-brand-dark sm:text-sm">
            🟢 আজকের হালনাগাদ বাজার দর
          </span>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">আজকের বাজারের দাম এক নজরে</h1>
          <p className="mt-3 text-ink/70 sm:text-lg">চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — কোন বাজারে কত, দেখে নিন এক জায়গায়।</p>
          <a href="#সব-পণ্য" className="btn btn-primary mt-6 text-white">
            সব পণ্য দেখুন ↓
          </a>
          <div className="mt-8 flex justify-center gap-8 md:justify-start">
            {stat(products, "টি নিত্যদিনের পণ্য")}
            {stat(categories, "টি বিভাগের তথ্য")}
            {stat(markets, "টি বাজার অন্তর্ভুক্ত")}
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <Image src="/bazar-hero.png" alt="বাজারের সবজি ও পণ্য" width={315} height={263} priority className="h-auto w-full max-w-sm drop-shadow-lg" />
        </div>
      </div>
    </section>
  );
}
