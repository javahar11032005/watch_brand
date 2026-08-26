import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/dal";
import { productInputSchema } from "@/lib/validation";
import { listAllProductsForAdmin, createProduct } from "@/services/productService";
import { handleApiError } from "@/lib/http";

export async function GET() {
  try {
    await requireAdmin();
    const products = await listAllProductsForAdmin();
    return NextResponse.json({ products });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();
    const input = productInputSchema.parse(body);
    const product = await createProduct(input);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
