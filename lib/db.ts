import { Pool } from "pg";
import Database from "better-sqlite3";

/**
 * Single shared Postgres pool + automatic creation of the Better Auth tables.
 * No manual migration is needed: the first auth request creates the tables if they are missing.
 */
import fs from "node:fs";
import path from "node:path";

const g = globalThis as unknown as { __bazarPool?: Pool; __bazarSchema?: Promise<void>; __bazarSqlite?: Database.Database };

const rawUrl = process.env.DATABASE_URL;
/** true when a real Postgres connection string is provided */
export const usePostgres = !!rawUrl && !rawUrl.startsWith("PASTE_");

function makePool() {
  const remote = usePostgres && !/localhost|127\.0\.0\.1/.test(rawUrl!);
  return new Pool({
    connectionString: usePostgres ? rawUrl : undefined,
    max: 5,
    // hosted Postgres (Neon / Supabase / Vercel) needs SSL
    ssl: remote ? { rejectUnauthorized: false } : undefined,
  });
}

export const pool: Pool = g.__bazarPool ?? (g.__bazarPool = makePool());

/**
 * Zero-setup local mode: when DATABASE_URL is empty (and we are NOT on Vercel) the app stores users in a
 * local SQLite file (.data/auth.sqlite) using Node's built-in node:sqlite (Node 22.13+).
 * Production (Vercel) must use DATABASE_URL because serverless disk is not persistent.
 */
let sqliteError = "";
function makeSqlite(): Database.Database | null {
  if (usePostgres || process.env.VERCEL) return null;
  if (g.__bazarSqlite) return g.__bazarSqlite;
  try {
    const dir = path.join(process.cwd(), ".data");
    fs.mkdirSync(dir, { recursive: true });
    const db = new Database(path.join(dir, "auth.sqlite"));
    db.pragma("foreign_keys = ON");
    db.exec(SQLITE_SCHEMA);
    g.__bazarSqlite = db;
    return db;
  } catch (e) {
    sqliteError = e instanceof Error ? e.message : String(e);
    return null;
  }
}

const SCHEMA = `
create table if not exists "user" (
  "id" text primary key,
  "name" text not null,
  "email" text not null unique,
  "emailVerified" boolean not null default false,
  "image" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create table if not exists "session" (
  "id" text primary key,
  "expiresAt" timestamptz not null,
  "token" text not null unique,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now(),
  "ipAddress" text,
  "userAgent" text,
  "userId" text not null references "user" ("id") on delete cascade
);
create table if not exists "account" (
  "id" text primary key,
  "accountId" text not null,
  "providerId" text not null,
  "userId" text not null references "user" ("id") on delete cascade,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamptz,
  "refreshTokenExpiresAt" timestamptz,
  "scope" text,
  "password" text,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create table if not exists "verification" (
  "id" text primary key,
  "identifier" text not null,
  "value" text not null,
  "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default now(),
  "updatedAt" timestamptz not null default now()
);
create index if not exists "session_userId_idx" on "session" ("userId");
create index if not exists "account_userId_idx" on "account" ("userId");
`;

const SQLITE_SCHEMA = `
create table if not exists "user" (
  "id" text not null primary key,
  "name" text not null,
  "email" text not null unique,
  "emailVerified" integer not null,
  "image" text,
  "createdAt" date not null,
  "updatedAt" date not null
);
create table if not exists "session" (
  "id" text not null primary key,
  "expiresAt" date not null,
  "token" text not null unique,
  "createdAt" date not null,
  "updatedAt" date not null,
  "ipAddress" text,
  "userAgent" text,
  "userId" text not null references "user" ("id") on delete cascade
);
create table if not exists "account" (
  "id" text not null primary key,
  "accountId" text not null,
  "providerId" text not null,
  "userId" text not null references "user" ("id") on delete cascade,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" date,
  "refreshTokenExpiresAt" date,
  "scope" text,
  "password" text,
  "createdAt" date not null,
  "updatedAt" date not null
);
create table if not exists "verification" (
  "id" text not null primary key,
  "identifier" text not null,
  "value" text not null,
  "expiresAt" date not null,
  "createdAt" date not null,
  "updatedAt" date not null
);
`;

const sqlite = makeSqlite();
/** The database object handed to Better Auth: Postgres pool, or the local SQLite fallback. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const database: any = usePostgres ? pool : sqlite;
export const databaseMode: "postgres" | "sqlite-local" | "missing" = usePostgres ? "postgres" : sqlite ? "sqlite-local" : "missing";

export function ensureSchema(): Promise<void> {
  if (databaseMode === "sqlite-local") return Promise.resolve(); // tables are created when the file is opened
  if (databaseMode === "missing" && !usePostgres) {
    return Promise.reject(
      new Error(
        process.env.VERCEL
          ? "DATABASE_URL সেট করা নেই — Vercel Environment Variables-এ Neon/Supabase এর DATABASE_URL দিন এবং Redeploy করুন।"
          : `লোকাল ডেটাবেস চালু করা যায়নি (${sqliteError || "Node 22.13+ দরকার"}) — Node আপডেট করুন অথবা .env.local-এ DATABASE_URL দিন।`
      )
    );
  }
  if (!g.__bazarSchema) {
    g.__bazarSchema = pool.query(SCHEMA).then(() => undefined);
    g.__bazarSchema.catch(() => {
      g.__bazarSchema = undefined; // retry on the next request
    });
  }
  return g.__bazarSchema;
}
