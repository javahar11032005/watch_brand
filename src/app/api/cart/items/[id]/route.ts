import { NextRequest, NextResponse } from "next/server";
import { resolveCartIdentity } from "@/lib/cart-identity";
import { updateCartItemSchema } from "@/lib/validation";
import { updateItemQuantity, removeItem } from "@/services/cartService";
import { handleApiError } from "@/lib/http";

export async function PATCH(
  request: NextRequest,
  context: RouteContext<"/api/cart/items/[id]">
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { quantity } = updateCartItemSchema.parse(body);
    const identity = await resolveCartIdentity();
    const cart = await updateItemQuantity(identity, id, quantity);
    return NextResponse.json({ cart });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  context: RouteContext<"/api/cart/items/[id]">
) {
  try {
    const { id } = await context.params;
    const identity = await resolveCartIdentity();
    const cart = await removeItem(identity, id);
    return NextResponse.json({ cart });
  } catch (error) {
    return handleApiError(error);
  }
}
