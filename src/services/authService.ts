import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { BadRequestError, InvalidCredentialsError } from "@/lib/http";

export async function registerUser(input: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new BadRequestError("An account with this email already exists.");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, passwordHash },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return user;
}

export async function authenticateUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new InvalidCredentialsError();

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) throw new InvalidCredentialsError();

  return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt };
}
