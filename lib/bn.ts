const BN_DIGITS = "০১২৩৪৫৬৭৮৯";

/** Convert any latin digits in a string to Bengali digits. */
export function toBnDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

/** Parse numbers written in Bengali or English digits ("১,২৫০", "৬৩.৫০ টাকা", "▼ 2.9%"). */
export function parseNum(v: unknown): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v !== "string") return null;
  const s = v
    .replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
    .replace(/,/g, "")
    .replace(/−|–/g, "-");
  const m = s.match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
}

/** 1850 -> "১,৮৫০", 63.5 -> "৬৩.৫০" */
export function fmtNum(n: number): string {
  const hasFraction = !Number.isInteger(Math.round(n * 100) / 100);
  const s = n.toLocaleString("en-US", {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return toBnDigits(s);
}

export const fmtTaka = (n: number) => `${fmtNum(n)} টাকা`;
export const fmtPct = (n: number) => `${toBnDigits(Math.abs(n).toFixed(1))}%`;

const DAYS = ["রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার", "শনিবার"];
const MONTHS = [
  "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
  "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর",
];

/** "মঙ্গলবার, ৬ অক্টোবর, ২০২৬" */
export function banglaDate(d: Date = new Date()): string {
  return `${DAYS[d.getDay()]}, ${toBnDigits(d.getDate())} ${MONTHS[d.getMonth()]}, ${toBnDigits(d.getFullYear())}`;
}
