/**
 * The market API is third-party, so every field is read defensively:
 * we accept several common key names and Bengali/English numerals.
 * If your API uses different keys, add them to the alias lists below.
 */
import { parseNum } from "./bn";
import type { Category, MarketPrice, Product } from "./types";

type Obj = Record<string, unknown>;
const isObj = (v: unknown): v is Obj => typeof v === "object" && v !== null && !Array.isArray(v);

function pick(o: Obj, keys: string[]): unknown {
  for (const k of keys) if (o[k] !== undefined && o[k] !== null && o[k] !== "") return o[k];
  return undefined;
}
const str = (v: unknown, fallback = ""): string =>
  typeof v === "string" ? v : typeof v === "number" ? String(v) : fallback;

/** Accepts [..], {products:[..]}, {data:[..]}, {items:[..]}, or a single-key wrapper. */
export function unwrapList(json: unknown): unknown[] {
  if (Array.isArray(json)) return json;
  if (isObj(json)) {
    for (const k of ["products", "categories", "data", "items", "results", "result"]) {
      if (Array.isArray(json[k])) return json[k] as unknown[];
      if (isObj(json[k])) {
        const inner = unwrapList(json[k]);
        if (inner.length) return inner;
      }
    }
    const arr = Object.values(json).find(Array.isArray);
    if (arr) return arr as unknown[];
  }
  return [];
}

export function unwrapOne(json: unknown): unknown {
  if (isObj(json)) {
    for (const k of ["product", "category", "data", "item", "result"]) {
      if (isObj(json[k])) return json[k];
    }
  }
  return json;
}

const UNIT_MAP: Record<string, string> = {
  kg: "কেজি", kilogram: "কেজি", liter: "লিটার", litre: "লিটার", l: "লিটার",
  dozen: "ডজন", dzn: "ডজন", ltr: "লিটার", liters: "লিটার", litres: "লিটার", hali: "হালি", piece: "পিস", pcs: "পিস", pc: "পিস", gram: "গ্রাম", g: "গ্রাম",
};
function normUnit(raw: string): string {
  const t = raw.trim();
  if (!t) return "প্রতি কেজি";
  if (t.startsWith("প্রতি")) return t;
  const mapped = UNIT_MAP[t.toLowerCase().replace(/^per\s+/, "").replace(/^\//, "")];
  return `প্রতি ${mapped ?? t}`;
}

function normMarkets(raw: unknown): MarketPrice[] {
  const out: MarketPrice[] = [];
  const push = (name: string, division: string, min: number | null, max: number | null, price: number | null) => {
    const lo = min ?? price ?? max;
    const hi = max ?? price ?? min;
    if (!name || lo === null || hi === null) return;
    out.push({ name, division, min: lo, max: hi, price: price ?? Math.round(((lo + hi) / 2) * 100) / 100 });
  };
  if (Array.isArray(raw)) {
    for (const m of raw) {
      if (!isObj(m)) continue;
      push(
        str(pick(m, ["market", "name", "bazar", "bazaar", "marketName", "location", "title"])),
        str(pick(m, ["division", "region", "area", "city"])),
        parseNum(pick(m, ["min", "minPrice", "min_price", "low"])),
        parseNum(pick(m, ["max", "maxPrice", "max_price", "high"])),
        parseNum(pick(m, ["price", "todayPrice", "value", "amount", "rate"]))
      );
    }
  } else if (isObj(raw)) {
    for (const [name, v] of Object.entries(raw)) {
      if (isObj(v)) push(name, "", parseNum(pick(v, ["min"])), parseNum(pick(v, ["max"])), parseNum(pick(v, ["price", "value", "amount"])));
      else push(name, "", null, null, parseNum(v));
    }
  }
  return out;
}

export function normalizeProduct(raw: unknown): Product | null {
  if (!isObj(raw)) return null;
  const o = raw;

  const id = str(pick(o, ["id", "_id", "productId"]));
  const slug = str(pick(o, ["slug", "id", "_id", "productId"]));
  const name = str(pick(o, ["name", "nameBn", "name_bn", "title", "productName"]));
  if (!name && !id) return null;

  const markets = normMarkets(
    pick(o, ["markets", "bazars", "bazaars", "marketPrices", "market_prices", "prices", "bazarPrices", "marketwise", "marketWise"])
  );

  let price = parseNum(pick(o, ["price", "today", "todayPrice", "today_price", "currentPrice", "current_price", "avgPrice", "averagePrice"]));
  const prevPrice = parseNum(pick(o, ["previousPrice", "prevPrice", "yesterday", "yesterdayPrice", "previous_price", "oldPrice", "lastPrice"]));

  const mMin = markets.length ? Math.min(...markets.map((m) => m.min)) : null;
  const mMax = markets.length ? Math.max(...markets.map((m) => m.max)) : null;
  const mAvg = markets.length ? Math.round((markets.reduce((a, m) => a + m.price, 0) / markets.length) * 100) / 100 : null;

  const rawMin = parseNum(pick(o, ["minPrice", "min_price", "min", "minimum", "lowestPrice"]));
  const rawMax = parseNum(pick(o, ["maxPrice", "max_price", "max", "maximum", "highestPrice"]));
  const rawAvg = parseNum(pick(o, ["avgPrice", "averagePrice", "avg_price", "avg", "average"]));

  if (price === null) price = rawAvg ?? mAvg ?? rawMin ?? rawMax ?? 0;

  const min = rawMin ?? mMin ?? price;
  const max = rawMax ?? mMax ?? price;
  const avg = rawAvg ?? mAvg ?? price;

  // --- change -------------------------------------------------------------
  const chg = isObj(o.change) ? o.change : null; // API shape: { dir: "up" | "down" | "flat", pct: 2.1 }
  const dirRaw = str(chg?.dir ?? pick(o, ["trend", "direction", "changeType", "change_type", "status", "movement"])).toLowerCase();
  const pctField = chg ? chg.pct : pick(o, ["changePercent", "change_percent", "percentChange", "percent_change", "changePct", "percentage", "percent", "pct", "change"]);
  let changePct = parseNum(pctField);
  let changeAmount = parseNum(pick(o, ["changeAmount", "change_amount", "diff", "difference", "priceChange", "price_change"]));

  if (changePct === null && prevPrice && prevPrice > 0) {
    changePct = Math.round(((price - prevPrice) / prevPrice) * 1000) / 10;
  }
  changePct = changePct ?? 0;

  // sign from symbols / direction words when the number itself is unsigned
  const pctText = typeof pctField === "string" ? pctField : "";
  const down = /▼|down|fall|decrease|drop|কম/.test(pctText.toLowerCase() + " " + dirRaw);
  const up = /▲|\bup\b|rise|increase|বেড়/.test(pctText.toLowerCase() + " " + dirRaw);
  if (/flat|same|unchanged/.test(dirRaw)) changePct = 0;
  if (down && changePct > 0) changePct = -changePct;
  if (up && changePct < 0) changePct = -changePct;

  if (changeAmount === null && prevPrice !== null) changeAmount = price - prevPrice;
  if (changeAmount !== null) changeAmount = Math.sign(changePct || changeAmount) * Math.abs(changeAmount);

  // --- category -----------------------------------------------------------
  const catRaw = pick(o, ["category", "categorySlug", "category_slug", "categoryId", "category_id", "type"]);
  let category = "";
  let categoryName = "";
  if (isObj(catRaw)) {
    category = str(pick(catRaw, ["slug", "id", "key"]));
    categoryName = str(pick(catRaw, ["name", "nameBn", "title", "label"]));
  } else {
    category = str(catRaw);
    categoryName = str(pick(o, ["categoryNameBn", "categoryName", "category_name", "categoryBn"]));
  }

  return {
    id: id || slug,
    slug: slug || id,
    name: name || slug,
    emoji: str(pick(o, ["emoji", "image", "icon", "thumbnail"]), "🛒"),
    unit: normUnit(str(pick(o, ["unit", "unitName", "unit_name", "per"]))),
    price,
    prevPrice,
    changePct,
    changeAmount,
    category,
    categoryName: categoryName || category,
    description: str(pick(o, ["description", "summary", "subtitle", "details", "desc"])),
    markets,
    min,
    max,
    avg,
  };
}

export function normalizeProducts(json: unknown): Product[] {
  return unwrapList(json)
    .map(normalizeProduct)
    .filter((p): p is Product => p !== null);
}

export function normalizeCategory(raw: unknown): Category | null {
  if (typeof raw === "string") return { slug: raw, name: raw, emoji: "" };
  if (!isObj(raw)) return null;
  const slug = str(pick(raw, ["slug", "id", "key", "_id"]));
  const name = str(pick(raw, ["name", "nameBn", "name_bn", "title", "label"]), slug);
  if (!slug) return null;
  return { slug, name, emoji: str(pick(raw, ["emoji", "icon", "image"])) };
}

export function normalizeCategories(json: unknown): Category[] {
  return unwrapList(json)
    .map(normalizeCategory)
    .filter((c): c is Category => c !== null);
}
