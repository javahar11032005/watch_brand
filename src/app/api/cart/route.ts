import { NextResponse } from "next/server";
import { readCartIdentity } from "@/lib/cart-identity";
import { getCart } from "@/services/cartService";
import { handleApiError } from "@/lib/http";

export async function GET() {
  try {
    const identity = await readCartIdentity();
    if (!identity) {
      return NextResponse.json({ cart: { id: null, items: [], subtotal: 0, itemCount: 0 } });
    }
    const cart = await getCart(identity);
    return NextResponse.json({ cart });
  } catch (error) {
    return handleApiError(error);
  }
}
