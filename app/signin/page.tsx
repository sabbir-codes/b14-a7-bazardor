"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";
import AuthCard, { Divider } from "@/components/AuthCard";
import SocialButtons from "@/components/SocialButtons";
import { signIn, useSession } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";

const safePath = (p: string | null) => (p && p.startsWith("/") && !p.startsWith("//") ? p : "/");

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = safePath(params.get("redirect"));
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.get("reason") === "protected") toast.error("এই পাতাটি দেখতে আগে সাইন ইন করুন", { id: "protected" });
    if (params.get("registered")) toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন", { id: "registered" });
  }, [params]);

  useEffect(() => {
    if (session?.user) router.replace(redirect);
  }, [session, router, redirect]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      const msg = "ইমেইল ও পাসওয়ার্ড দিন";
      setError(msg);
      return toast.error(msg);
    }
    setLoading(true);
    const { error } = await signIn.email({ email: email.trim(), password });
    setLoading(false);
    if (error) {
      const msg = authErrorMessage(error, "সাইন ইন করা যায়নি");
      setError(msg);
      return toast.error(msg);
    }
    toast.success("সফলভাবে সাইন ইন হয়েছে");
    router.push(redirect);
    router.refresh();
  }

  return (
    <AuthCard title="সাইন ইন করুন" subtitle="বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <label className="form-control">
          <span className="label-text mb-1 font-medium">ইমেইল</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" className="input input-bordered w-full bg-white focus:border-brand focus:outline-brand" />
        </label>
        <label className="form-control">
          <span className="label-text mb-1 font-medium">পাসওয়ার্ড</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" className="input input-bordered w-full bg-white focus:border-brand focus:outline-brand" />
        </label>
        {error && <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full text-white">
          {loading ? <span className="loading loading-spinner loading-sm" /> : "সাইন ইন"}
        </button>
      </form>
      <Divider />
      <SocialButtons />
      <p className="mt-6 text-center text-sm text-ink/70">
        অ্যাকাউন্ট নেই?{" "}
        <Link href="/signup" className="font-semibold text-brand-dark hover:underline">সাইন আপ করুন</Link>
      </p>
    </AuthCard>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="mx-auto h-96 max-w-md animate-pulse rounded-2xl bg-line/60 mt-14" />}>
      <SignInForm />
    </Suspense>
  );
}
