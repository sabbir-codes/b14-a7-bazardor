"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bar } from "@/components/Skeletons";
import { updateUser, useSession } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setName(user.name ?? "");
  }, [user]);

  useEffect(() => {
    if (!isPending && !user) {
      toast.error("এই পাতাটি দেখতে আগে সাইন ইন করুন", { id: "protected" });
      router.replace("/signin?redirect=/profile/update");
    }
  }, [isPending, user, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return toast.error("নাম খালি রাখা যাবে না");
    setLoading(true);
    // https://better-auth.com/docs/concepts/users-accounts#update-user
    const { error } = await updateUser({ name: name.trim() });
    setLoading(false);
    if (error) return toast.error(error.message || "তথ্য আপডেট করা যায়নি");
    toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
    router.push("/profile");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <Link href="/profile" className="text-sm text-ink/60 hover:text-brand-dark">← প্রোফাইলে ফিরে যান</Link>
      <div className="mt-3 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">তথ্য আপডেট করুন</h1>
        {isPending || !user ? (
          <div role="status" aria-label="Loading…" className="mt-6 space-y-3">
            <Bar className="h-4 w-16" />
            <Bar className="h-12 w-full" />
            <Bar className="h-12 w-full" />
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <label className="form-control">
              <span className="label-text mb-1 font-medium">নাম</span>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="আপনার নাম লিখুন" className="input input-bordered w-full bg-white focus:border-brand focus:outline-brand" />
            </label>
            <button type="submit" disabled={loading} className="btn btn-primary w-full text-white">
              {loading ? <span className="loading loading-spinner loading-sm" /> : "তথ্য আপডেট করুন"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
