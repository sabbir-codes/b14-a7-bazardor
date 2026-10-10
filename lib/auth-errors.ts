const BN: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "ইমেইল বা পাসওয়ার্ড সঠিক নয়",
  USER_ALREADY_EXISTS: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে। সাইন ইন করুন।",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে। সাইন ইন করুন।",
  INVALID_EMAIL: "সঠিক ইমেইল দিন",
  PASSWORD_TOO_SHORT: "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে",
  INVALID_PASSWORD: "পাসওয়ার্ড সঠিক নয়",
};

/** Turns a Better Auth client error into a readable Bengali message (never an empty one). */
export function authErrorMessage(error: { message?: string; code?: string; status?: number } | null | undefined, fallback: string) {
  if (!error) return fallback;
  if (error.code && BN[error.code]) return BN[error.code];
  if (error.message) return error.message;
  return `${fallback} (কোড: ${error.status ?? "নেটওয়ার্ক ত্রুটি"})`;
}
