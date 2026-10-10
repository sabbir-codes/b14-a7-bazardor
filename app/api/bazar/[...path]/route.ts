import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side proxy for the market API.
 * - avoids browser CORS problems
 * - automatically falls back to the alternative base URL
 */
const BASES = [
  process.env.BAZAR_API_1 || "https://api.api-store.workers.dev/api/bazardor",
  process.env.BAZAR_API_2 || "https://api.abcz.workers.dev/api/bazardor",
];

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  const search = req.nextUrl.search;
  const tail = path.map(encodeURIComponent).join("/");

  for (const base of BASES) {
    try {
      const res = await fetch(`${base}/${tail}${search}`, {
        headers: { accept: "application/json" },
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(8000),
      });
      if (res.status === 404) return NextResponse.json({ error: "not_found" }, { status: 404 });
      if (!res.ok) continue;
      const data = await res.json();
      return NextResponse.json(data, {
        headers: { "cache-control": "public, s-maxage=60, stale-while-revalidate=300" },
      });
    } catch {
      // try next base
    }
  }
  return NextResponse.json({ error: "upstream_unavailable" }, { status: 502 });
}
