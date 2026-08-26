import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

/**
 * Centralized auth check, memoized per request. Route handlers, Server
 * Components, and Server Actions should all go through this rather than
 * reading the cookie/session directly, so authorization logic lives in one
 * place (see Next.js Data Access Layer guidance).
 */
export const verifySession = cache(async () => {
  const session = await getSession();
  if (!session) return null;
  return session;
});

export const getCurrentUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return user;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new UnauthorizedError();
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    throw new ForbiddenError();
  }
  return user;
}

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super("Forbidden");
    this.name = "ForbiddenError";
  }
}
