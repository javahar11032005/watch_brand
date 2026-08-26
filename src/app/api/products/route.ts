import { NextRequest, NextResponse } from "next/server";
import { listProducts } from "@/services/productService";
import { handleApiError } from "@/lib/http";

export async function GET(request: NextRequest) {
  try {
    const collectionKey = request.nextUrl.searchParams.get("collection") ?? undefined;
    const products = await listProducts({ collectionKey });
    return NextResponse.json({ products });
  } catch (error) {
    return handleApiError(error);
  }
}
