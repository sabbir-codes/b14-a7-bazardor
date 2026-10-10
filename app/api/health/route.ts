import { databaseMode, ensureSchema } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Open /api/health to see what is missing (shows only true/false, never secrets). */
export async function GET() {
  const env = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: !!process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: !!process.env.BETTER_AUTH_URL,
    GOOGLE: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    GITHUB: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
  };
  try {
    await ensureSchema();
    return Response.json({ ok: true, database: "connected, tables ready", mode: databaseMode, env });
  } catch (e) {
    return Response.json({ ok: false, database: e instanceof Error ? e.message : String(e), env }, { status: 500 });
  }
}
