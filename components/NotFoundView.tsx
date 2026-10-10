import Link from "next/link";

export default function NotFoundView({
  title = "৪০৪ — পাতাটি খুঁজে পাওয়া যায়নি",
  message = "আপনি যে পাতাটি খুঁজছেন সেটি নেই বা সরিয়ে নেওয়া হয়েছে।",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <div className="text-6xl">🛒</div>
      <h1 className="mt-4 text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-ink/60">{message}</p>
      <Link href="/" className="btn btn-primary mt-6 text-white">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
