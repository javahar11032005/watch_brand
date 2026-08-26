import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ForbiddenError, UnauthorizedError } from "@/lib/dal";

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/**
 * Wraps a route handler so every failure mode (validation, auth, unexpected)
 * produces a consistent JSON error shape instead of an unhandled 500 with a
 * leaked stack trace.
 */
export function withErrorHandling<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>
) {
  return async (...args: Args): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof ZodError) {
        return jsonError(error.issues[0]?.message ?? "Invalid request.", 400);
      }
      if (error instanceof UnauthorizedError) {
        return jsonError("You must be signed in to do that.", 401);
      }
      if (error instanceof ForbiddenError) {
        return jsonError("You do not have permission to do that.", 403);
      }
      if (error instanceof KnownApiError) {
        return jsonError(error.message, error.status);
      }
      console.error(error);
      return jsonError("Something went wrong. Please try again.", 500);
    }
  };
}

export class KnownApiError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}
