import Link from "next/link";

export default function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 text-center">
          <div className="text-3xl">🛒</div>
          <h1 className="mt-2 text-2xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-ink/60">{subtitle}</p>}
        </div>
        {children}
      </div>
      <Link href="/" className="mt-5 block text-center text-sm text-ink/55 hover:text-brand-dark">← হোম পেজে ফিরে যান</Link>
    </div>
  );
}

export function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-sm text-ink/50">
      <span className="h-px flex-1 bg-line" /> অথবা <span className="h-px flex-1 bg-line" />
    </div>
  );
}
