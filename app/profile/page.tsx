"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Bar } from "@/components/Skeletons";
import { useSession } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;

  useEffect(() => {
    if (!isPending && !user) {
      toast.error("প্রোফাইল দেখতে আগে সাইন ইন করুন", { id: "protected" });
      router.replace("/signin?redirect=/profile");
    }
  }, [isPending, user, router]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold">আমার প্রোফাইল</h1>
      <p className="mb-6 text-sm text-ink/60">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>

      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        {isPending || !user ? (
          <div role="status" aria-label="Loading…" className="space-y-4">
            <div className="flex items-center gap-4">
              <Bar className="h-20 w-20 rounded-full" />
              <div className="flex-1 space-y-2">
                <Bar className="h-6 w-1/2" />
                <Bar className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" referrerPolicy="no-referrer" className="h-20 w-20 rounded-full object-cover" />
              ) : (
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand text-3xl font-bold text-white">
                  {user.name?.trim().charAt(0).toUpperCase() || "U"}
                </span>
              )}
              <div className="text-center sm:text-left">
                <p className="text-xl font-bold">{user.name}</p>
                <p className="text-ink/60">{user.email}</p>
              </div>
            </div>
            <dl className="mt-6 divide-y divide-line rounded-xl border border-line text-sm">
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-ink/60">নাম</dt>
                <dd className="font-medium">{user.name}</dd>
              </div>
              <div className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-ink/60">ইমেইল</dt>
                <dd className="font-medium break-all text-right">{user.email}</dd>
              </div>
            </dl>
            <Link href="/profile/update" className="btn btn-primary mt-6 w-full text-white sm:w-auto">
              ✏️ তথ্য আপডেট করুন
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
