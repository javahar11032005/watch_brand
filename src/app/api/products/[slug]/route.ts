import { NextResponse } from "next/server";
import { getProductBySlug } from "@/services/productService";
import { handleApiError } from "@/lib/http";

export async function GET(_request: Request, context: RouteContext<"/api/products/[slug]">) {
  try {
    const { slug } = await context.params;
    const product = await getProductBySlug(slug);
    return NextResponse.json({ product });
  } catch (error) {
    return handleApiError(error);
  }
}
