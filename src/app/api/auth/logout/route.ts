import { NextResponse } from "next/server";
import { destroyUserSession } from "@/lib/session";
import { handleApiError } from "@/lib/http";

export async function POST() {
  try {
    await destroyUserSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
