# 🛒 বাজার দর (BazarDor)

> প্রয়োজনীয় পণ্যের দাম এক নজরে — চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার আজকের বাজার দর, বাজারভিত্তিক তুলনাসহ।

**Live:** https://b14-a7-bazardor.vercel.app/ · **Repo:** https://github.com/sabbir-codes/b14-a7-bazardor
## 🧰 Technologies

- [Next.js 15](https://nextjs.org/) (App Router) + TypeScript
- Tailwind CSS 3 + [DaisyUI 4](https://daisyui.com/)
- [Better Auth](https://better-auth.com/) — email/password, Google, GitHub
- PostgreSQL (`pg`) for Better Auth storage (Neon / Supabase / Vercel Postgres)
- react-hot-toast

## ✨ Key Features

1. **Live price ticker & navbar** — Bangla date, active category chips, infinite marquee of today's prices (▲/▼ %).
2. **Top risers & fallers** — "আজ দাম বেড়েছে ▲" / "আজ দাম কমেছে ▼" with top 6 each, plus the full "সব পণ্য" grid.
3. **Category pages with numeric sort** — Bengali numerals are parsed to numbers, so sorting is by value, never by string.
4. **Protected product details** — min / max / average price and a market-wise price table with cheapest & priciest markets.
5. **Authentication** — Better Auth email/password + Google + GitHub, toasts on every action, protected-route redirects.
6. **Update profile** — change your name via Better Auth `updateUser`.
7. **Fully responsive** with skeleton loaders, empty states and a friendly 404 PAGE.

## 🚀 Getting started

```bash
npm install
cp .env.example .env.local     # fill in the values (DATABASE_URL is required for sign in / sign up)
npm run dev
```

**Local testing needs no database:** leave `DATABASE_URL` empty and users are stored in a local SQLite file (`.data/auth.sqlite`, needs Node 22.13+). **Production (Vercel) needs `DATABASE_URL`** (free Neon / Supabase Postgres) - tables are created automatically on first use. If sign up / sign in fails, open `/api/health` to see what is missing.

### Environment variables

| Name | Description |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (required on Vercel; optional locally) |
| `BETTER_AUTH_SECRET` | long random string (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | app URL (`http://localhost:3000` locally, your Vercel URL in production) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth (redirect URI: `<URL>/api/auth/callback/google`) |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | GitHub OAuth (callback: `<URL>/api/auth/callback/github`) |

### Deploy to Vercel

Import the repo, add the env variables above, deploy. Dynamic routes (`/product/[slug]`, `/category/[slug]`) work on refresh. Tables are created automatically on first use. `BETTER_AUTH_URL` is optional on Vercel (the Vercel URL is detected automatically).

## 🔌 Data

Market data comes from `https://api.api-store.workers.dev/api/bazardor` (fallback `https://api.abcz.workers.dev/api/bazardor`) through a server-side proxy at `/api/bazar/*`. Field-name handling lives in `lib/normalize.ts`.

