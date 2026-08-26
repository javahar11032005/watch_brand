import { NextRequest, NextResponse } from "next/server";
import { resolveCartIdentity } from "@/lib/cart-identity";
import { addCartItemSchema } from "@/lib/validation";
import { addItem } from "@/services/cartService";
import { handleApiError } from "@/lib/http";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = addCartItemSchema.parse(body);
    const identity = await resolveCartIdentity();
    const cart = await addItem(identity, input);
    return NextResponse.json({ cart });
  } catch (error) {
    return handleApiError(error);
  }
}
