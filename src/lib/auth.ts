import crypto from "crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "mtsd_admin_session";
const SECRET =
  process.env.ADMIN_SECRET || "mtsd-2026-internal-admin-secret-key";

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "mtsd2026",
  };
}

export function signSession(username: string): string {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  const payload = `${username}.${exp}`;
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(payload)
    .digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token?: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [username, expStr, sig] = parts;
  const exp = Number(expStr);
  if (!username || Number.isNaN(exp) || Date.now() > exp) return false;
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(`${username}.${expStr}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(sig, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

