import { jwtVerify } from "jose";
import type { Role } from "@/generated/prisma/enums";

/**
 * Shared with proxy.ts, which runs outside the normal request lifecycle
 * (no `next/headers`, no `server-only` guarantee) — this file must stay
 * free of both so it can be imported from either place.
 */

export type SessionPayload = {
  userId: string;
  role: Role;
};

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error("SESSION_SECRET environment variable is not set");
}
const encodedKey = new TextEncoder().encode(secretKey);

export { encodedKey };

export async function decryptSessionCookie(
  token: string | undefined
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, encodedKey, { algorithms: ["HS256"] });
    if (typeof payload.userId !== "string" || typeof payload.role !== "string") {
      return null;
    }
    return { userId: payload.userId, role: payload.role as Role };
  } catch {
    return null;
  }
}
