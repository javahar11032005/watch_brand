import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { NotFoundError, BadRequestError } from "@/lib/http";
import { labelCaseMaterial, labelDialColor, labelStrapMaterial } from "@/lib/format";
import Stripe from "stripe";

export async function createCheckoutSession(orderId: string, origin: string) {
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) throw new NotFoundError("Order not found.");
  if (order.paymentStatus === "PAID") {
    throw new BadRequestError("This order has already been paid.");
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = order.items.map((item) => ({
    quantity: item.quantity,
    price_data: {
      currency: order.currency,
      unit_amount: item.unitPrice,
      product_data: {
        name: `Kestrel ${item.productName}`,
        description: `${labelCaseMaterial(item.caseMaterial)} · ${labelDialColor(
          item.dialColor
        )} Dial · ${labelStrapMaterial(item.strapMaterial)}`,
        images: item.imageUrl.startsWith("http") ? [item.imageUrl] : undefined,
      },
    },
  }));

  if (order.shipping > 0) {
    lineItems.push({
      quantity: 1,
      price_data: {
        currency: order.currency,
        unit_amount: order.shipping,
        product_data: { name: "Insured White-Glove Shipping" },
      },
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    customer_email: order.shippingEmail,
    success_url: `${origin}/checkout/success?orderId=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/checkout?orderId=${order.id}`,
    metadata: { orderId: order.id, orderNumber: order.orderNumber },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return session;
}

export async function markOrderPaidFromSession(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!orderId) return;

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order || order.paymentStatus === "PAID") return;

  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

  await prisma.$transaction([
    prisma.order.update({
      where: { id: order.id },
      data: { paymentStatus: "PAID", status: "CONFIRMED" },
    }),
    prisma.payment.upsert({
      where: { orderId: order.id },
      create: {
        orderId: order.id,
        provider: "stripe",
        stripePaymentIntentId: paymentIntentId ?? null,
        amount: session.amount_total ?? order.total,
        currency: session.currency ?? order.currency,
        status: "succeeded",
        rawPayload: JSON.parse(JSON.stringify(session)),
      },
      update: {
        status: "succeeded",
        stripePaymentIntentId: paymentIntentId ?? null,
        rawPayload: JSON.parse(JSON.stringify(session)),
      },
    }),
    ...order.items.map((item) =>
      prisma.productVariant.updateMany({
        where: { sku: item.variantSku },
        data: { stock: { decrement: item.quantity } },
      })
    ),
  ]);
}
