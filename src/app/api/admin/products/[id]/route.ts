import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/dal";
import { productInputSchema } from "@/lib/validation";
import { updateProduct, deleteProduct, getProductById } from "@/services/productService";
import { handleApiError } from "@/lib/http";

export async function GET(_request: NextRequest, context: RouteContext<"/api/admin/products/[id]">) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const product = await getProductById(id);
    return NextResponse.json({ product });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, context: RouteContext<"/api/admin/products/[id]">) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const body = await request.json();
    const input = productInputSchema.parse(body);
    const product = await updateProduct(id, input);
    return NextResponse.json({ product });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext<"/api/admin/products/[id]">) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
