import "server-only";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import { encodedKey, decryptSessionCookie, type SessionPayload } from "@/lib/proxy-session";

const SESSION_COOKIE = "kestrel_session";
const GUEST_CART_COOKIE = "kestrel_guest_cart";
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 30; // 30 days

export type { SessionPayload };

export async function encryptSession(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(encodedKey);
}

export const decryptSession = decryptSessionCookie;

export async function createUserSession(payload: SessionPayload) {
  const token = await encryptSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return decryptSession(token);
}

export async function destroyUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

/**
 * Guests get an opaque, unguessable cart token (no price/product data,
 * just an id) so the cart itself always lives server-side in Postgres.
 */
export async function getOrCreateGuestCartToken(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(GUEST_CART_COOKIE)?.value;
  if (existing) return existing;

  const token = crypto.randomUUID();
  cookieStore.set(GUEST_CART_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
  return token;
}

export async function getGuestCartToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(GUEST_CART_COOKIE)?.value ?? null;
}

export async function clearGuestCartToken() {
  const cookieStore = await cookies();
  cookieStore.delete(GUEST_CART_COOKIE);
}
