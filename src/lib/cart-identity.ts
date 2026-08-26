import { getSession, getGuestCartToken, getOrCreateGuestCartToken } from "@/lib/session";
import type { CartIdentity } from "@/types";

/** Read-only resolution — never sets a cookie. Used for GET /api/cart. */
export async function readCartIdentity(): Promise<CartIdentity | null> {
  const session = await getSession();
  if (session) return { kind: "user", userId: session.userId };

  const guestToken = await getGuestCartToken();
  return guestToken ? { kind: "guest", guestToken } : null;
}

/** Mutating resolution — issues a guest cart cookie if none exists yet. */
export async function resolveCartIdentity(): Promise<CartIdentity> {
  const session = await getSession();
  if (session) return { kind: "user", userId: session.userId };

  const guestToken = await getOrCreateGuestCartToken();
  return { kind: "guest", guestToken };
}
