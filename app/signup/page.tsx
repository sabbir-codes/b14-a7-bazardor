"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import AuthCard, { Divider } from "@/components/AuthCard";
import SocialButtons from "@/components/SocialButtons";
import { signUp } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-errors";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    let msg = "";
    if (!name.trim()) msg = "আপনার নাম লিখুন";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) msg = "সঠিক ইমেইল দিন";
    else if (password.length < 8) msg = "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
    else if (password !== confirm) msg = "দুটি পাসওয়ার্ড মেলেনি";
    if (msg) {
      setError(msg);
      return toast.error(msg);
    }
    setLoading(true);
    const { error } = await signUp.email({ name: name.trim(), email: email.trim(), password });
    setLoading(false);
    if (error) {
      const m = authErrorMessage(error, "রেজিস্ট্রেশন করা যায়নি");
      setError(m);
      return toast.error(m);
    }
    toast.success("অ্যাকাউন্ট তৈরি হয়েছে! এখন সাইন ইন করুন");
    router.push("/signin?registered=1");
  }

  return (
    <AuthCard title="অ্যাকাউন্ট তৈরি করুন" subtitle="বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <label className="form-control">
          <span className="label-text mb-1 font-medium">নাম</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="যেমন: রহিম উদ্দিন" autoComplete="name" className="input input-bordered w-full bg-white focus:border-brand focus:outline-brand" />
        </label>
        <label className="form-control">
          <span className="label-text mb-1 font-medium">ইমেইল</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" className="input input-bordered w-full bg-white focus:border-brand focus:outline-brand" />
        </label>
        <label className="form-control">
          <span className="label-text mb-1 font-medium">পাসওয়ার্ড</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="কমপক্ষে ৮ অক্ষর" autoComplete="new-password" className="input input-bordered w-full bg-white focus:border-brand focus:outline-brand" />
        </label>
        <label className="form-control">
          <span className="label-text mb-1 font-medium">পাসওয়ার্ড নিশ্চিত করুন</span>
          <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="আবার লিখুন" autoComplete="new-password" className="input input-bordered w-full bg-white focus:border-brand focus:outline-brand" />
        </label>
        {error && <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full text-white">
          {loading ? <span className="loading loading-spinner loading-sm" /> : "অ্যাকাউন্ট তৈরি করুন"}
        </button>
      </form>
      <Divider />
      <SocialButtons />
      <p className="mt-6 text-center text-sm text-ink/70">
        অ্যাকাউন্ট আছে?{" "}
        <Link href="/signin" className="font-semibold text-brand-dark hover:underline">সাইন ইন করুন</Link>
      </p>
    </AuthCard>
  );
}
