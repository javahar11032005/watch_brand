import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/dal";
import { handleApiError } from "@/lib/http";

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
