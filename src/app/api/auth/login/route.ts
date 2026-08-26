import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validation";
import { authenticateUser } from "@/services/authService";
import { createUserSession, getGuestCartToken, clearGuestCartToken } from "@/lib/session";
import { mergeGuestCartIntoUser } from "@/services/cartService";
import { handleApiError } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = loginSchema.parse(body);

    const user = await authenticateUser(input);
    await createUserSession({ userId: user.id, role: user.role });

    const guestToken = await getGuestCartToken();
    if (guestToken) {
      await mergeGuestCartIntoUser(guestToken, user.id);
      await clearGuestCartToken();
    }

    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
