import { NextRequest, NextResponse } from "next/server";
import { createOrderSchema } from "@/lib/validation";
import { createOrderFromCart, listOrdersForUser } from "@/services/orderService";
import { registerUser } from "@/services/authService";
import { resolveCartIdentity } from "@/lib/cart-identity";
import { getSession, createUserSession, getGuestCartToken, clearGuestCartToken } from "@/lib/session";
import { mergeGuestCartIntoUser } from "@/services/cartService";
import { handleApiError, BadRequestError } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = createOrderSchema.parse(body);

    let session = await getSession();
    let userId: string | null = session?.userId ?? null;

    if (!session && input.createAccount) {
      if (!input.password) {
        throw new BadRequestError("A password is required to create an account.");
      }
      const user = await registerUser({
        name: input.shipping.name,
        email: input.shipping.email,
        password: input.password,
      });
      await createUserSession({ userId: user.id, role: user.role });
      session = { userId: user.id, role: user.role };
      userId = user.id;

      const guestToken = await getGuestCartToken();
      if (guestToken) {
        await mergeGuestCartIntoUser(guestToken, user.id);
        await clearGuestCartToken();
      }
    }

    const identity = session ? { kind: "user" as const, userId: session.userId } : await resolveCartIdentity();
    const order = await createOrderFromCart(identity, input.shipping, userId);

    return NextResponse.json({ order });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ orders: [] });
    }
    const orders = await listOrdersForUser(session.userId);
    return NextResponse.json({ orders });
  } catch (error) {
    return handleApiError(error);
  }
}
