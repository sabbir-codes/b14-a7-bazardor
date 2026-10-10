import { auth } from "@/lib/auth";
import { ensureSchema } from "@/lib/db";
import { toNextJsHandler } from "better-auth/next-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const handler = toNextJsHandler(auth);

/** Makes sure the tables exist and always returns a readable JSON error instead of an empty 500. */
async function guarded(fn: (req: Request) => Promise<Response>, req: Request) {
  try {
    await ensureSchema();
    return await fn(req);
  } catch (e) {
    console.error("[auth]", e);
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json({ message: `সার্ভার ত্রুটি: ${msg}` }, { status: 500 });
  }
}

export const GET = (req: Request) => guarded(handler.GET, req);
export const POST = (req: Request) => guarded(handler.POST, req);
