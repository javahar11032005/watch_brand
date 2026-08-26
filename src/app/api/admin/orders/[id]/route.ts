import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/dal";
import { updateOrderStatusSchema } from "@/lib/validation";
import { updateOrderStatus } from "@/services/orderService";
import { handleApiError } from "@/lib/http";

export async function PATCH(request: NextRequest, context: RouteContext<"/api/admin/orders/[id]">) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const body = await request.json();
    const input = updateOrderStatusSchema.parse(body);
    const order = await updateOrderStatus(id, input);
    return NextResponse.json({ order });
  } catch (error) {
    return handleApiError(error);
  }
}
