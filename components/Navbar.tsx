"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { banglaDate } from "@/lib/bn";
import { useCategories } from "@/lib/api";
import { signOut, useSession } from "@/lib/auth-client";
import Ticker from "./Ticker";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { data: categories, loading } = useCategories();
  const [date, setDate] = useState("");
  useEffect(() => setDate(banglaDate()), []);

  const chip = (active: boolean) =>
    `whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
      active ? "bg-brand text-white shadow-sm" : "text-ink/75 hover:bg-brand-soft hover:text-brand-dark"
    }`;

  async function handleSignOut() {
    const { error } = await signOut();
    if (error) return toast.error(error.message || "সাইন আউট করা যায়নি");
    toast.success("সফলভাবে সাইন আউট হয়েছে");
    router.push("/");
    router.refresh();
  }

  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="mx-auto max-w-6xl px-4">
        {/* row 1: logo + auth */}
        <div className="flex items-center justify-between gap-3 py-3">
          <Link href="/" className="flex flex-col leading-tight">
            <span className="flex items-center gap-2 text-xl font-bold text-brand-dark">
              <span aria-hidden>🛒</span> বাজার দর
            </span>
            <span className="min-h-4 text-xs text-ink/55">{date}</span>
          </Link>

          <div className="flex items-center gap-2">
            {isPending ? (
              <div className="flex gap-2" aria-label="Loading…">
                <div className="h-8 w-20 animate-pulse rounded-lg bg-line" />
                <div className="hidden h-8 w-20 animate-pulse rounded-lg bg-line sm:block" />
              </div>
            ) : user ? (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="flex items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 hover:border-brand">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.image} alt="" className="h-8 w-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                      {user.name?.trim().charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                  <span className="hidden max-w-28 truncate text-sm font-medium sm:block">{user.name}</span>
                  <span className="text-xs text-ink/50">▾</span>
                </div>
                <ul tabIndex={0} className="menu dropdown-content z-50 mt-2 w-52 rounded-xl border border-line bg-white p-2 shadow-lg">
                  <li className="menu-title truncate text-xs">{user.email}</li>
                  <li>
                    <Link href="/profile">👤 আমার প্রোফাইল</Link>
                  </li>
                  <li>
                    <button onClick={handleSignOut}>↩ সাইন আউট</button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link href="/signin" className="btn btn-sm sm:btn-md btn-outline border-brand text-brand-dark hover:bg-brand hover:border-brand hover:text-white">
                  সাইন ইন
                </Link>
                <Link href="/signup" className="btn btn-sm sm:btn-md btn-primary text-white">
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>

        {/* row 2: category links */}
        <nav aria-label="বিভাগ" className="no-scrollbar -mx-4 flex gap-1.5 overflow-x-auto px-4 pb-3">
          <Link href="/" className={chip(pathname === "/")}>
            হোম
          </Link>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-8 w-16 shrink-0 animate-pulse rounded-full bg-line" />)
            : categories?.map((c) => (
                <Link key={c.slug} href={`/category/${encodeURIComponent(c.slug)}`} className={chip(pathname === `/category/${c.slug}` || pathname === `/category/${encodeURIComponent(c.slug)}`)}>
                  {c.emoji ? `${c.emoji} ` : ""}
                  {c.name}
                </Link>
              ))}
        </nav>
      </div>
      <Ticker />
    </header>
  );
}
