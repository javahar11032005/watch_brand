import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { markOrderPaidFromSession } from "@/services/paymentService";

// Stripe's own request must be trusted over the platform's cached/route
// config; keep this handler fully dynamic and reading the raw body.
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  const rawBody = await request.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook signature verification failed: ${message}` }, {
      status: 400,
    });
  }

  // Only trust the payment state after Stripe itself confirms it here —
  // the frontend redirect alone is never sufficient to mark an order paid.
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    await markOrderPaidFromSession(session);
  }

  return NextResponse.json({ received: true });
}
