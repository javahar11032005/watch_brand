import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/dal";
import { listAllOrdersForAdmin } from "@/services/orderService";
import { handleApiError } from "@/lib/http";

export async function GET() {
  try {
    await requireAdmin();
    const orders = await listAllOrdersForAdmin();
    return NextResponse.json({ orders });
  } catch (error) {
    return handleApiError(error);
  }
}
