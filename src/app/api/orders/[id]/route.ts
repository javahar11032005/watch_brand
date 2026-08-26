import { NextResponse } from "next/server";
import { getOrderById, canViewOrder } from "@/services/orderService";
import { getSession } from "@/lib/session";
import { handleApiError } from "@/lib/http";
import { UnauthorizedError } from "@/lib/dal";

export async function GET(_request: Request, context: RouteContext<"/api/orders/[id]">) {
  try {
    const { id } = await context.params;
    const order = await getOrderById(id);
    const session = await getSession();

    if (!canViewOrder(order, { userId: session?.userId ?? null })) {
      throw new UnauthorizedError();
    }

    return NextResponse.json({ order });
  } catch (error) {
    return handleApiError(error);
  }
}
