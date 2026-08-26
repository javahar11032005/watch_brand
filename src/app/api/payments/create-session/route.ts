import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createCheckoutSession } from "@/services/paymentService";
import { isStripeConfigured } from "@/lib/stripe";
import { handleApiError, BadRequestError } from "@/lib/http";

const bodySchema = z.object({ orderId: z.string().min(1) });

export async function POST(request: NextRequest) {
  try {
    if (!isStripeConfigured) {
      throw new BadRequestError(
        "Stripe test keys are not configured yet. Add STRIPE_SECRET_KEY to .env to enable payments."
      );
    }

    const body = await request.json();
    const { orderId } = bodySchema.parse(body);
    const origin = request.nextUrl.origin;

    const session = await createCheckoutSession(orderId, origin);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return handleApiError(error);
  }
}
