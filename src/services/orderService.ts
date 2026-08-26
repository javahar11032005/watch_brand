import { prisma } from "@/lib/db";
import { BadRequestError, NotFoundError } from "@/lib/http";
import { getCart, clearCart } from "@/services/cartService";
import type { CartIdentity } from "@/types";
import type { z } from "zod";
import type { shippingAddressSchema } from "@/lib/validation";

const FREE_SHIPPING_THRESHOLD = 200_000; // $2,000.00
const FLAT_SHIPPING = 4_500; // $45.00, insured courier

function generateOrderNumber(): string {
  const time = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KST-${time}${rand}`;
}

type ShippingInput = z.infer<typeof shippingAddressSchema>;

export async function createOrderFromCart(
  identity: CartIdentity,
  shipping: ShippingInput,
  userId: string | null
) {
  const cart = await getCart(identity);
  if (cart.items.length === 0) {
    throw new BadRequestError("Your cart is empty.");
  }

  for (const item of cart.items) {
    if (item.quantity > item.variant.stock) {
      throw new BadRequestError(
        `${item.product.name} (${item.variant.sku}) no longer has enough stock.`
      );
    }
  }

  const subtotal = cart.subtotal;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const total = subtotal + shippingCost;

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId,
      subtotal,
      shipping: shippingCost,
      total,
      currency: "usd",
      shippingName: shipping.name,
      shippingEmail: shipping.email,
      shippingPhone: shipping.phone,
      shippingLine1: shipping.line1,
      shippingCity: shipping.city,
      shippingState: shipping.state,
      shippingPostalCode: shipping.postalCode,
      shippingCountry: shipping.country,
      items: {
        create: cart.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          productSlug: item.product.slug,
          variantSku: item.variant.sku,
          caseMaterial: item.variant.caseMaterial,
          dialColor: item.variant.dialColor,
          strapMaterial: item.variant.strapMaterial,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          imageUrl: item.product.heroImageUrl,
        })),
      },
    },
    include: { items: true },
  });

  await clearCart(identity);

  return order;
}

export async function getOrderById(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, payment: true },
  });
  if (!order) throw new NotFoundError("Order not found.");
  return order;
}

export async function getOrderByStripeSessionId(sessionId: string) {
  return prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    include: { items: true, payment: true },
  });
}

export function listOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true, payment: true },
    orderBy: { createdAt: "desc" },
  });
}

// --- Admin -----------------------------------------------------------------

export function listAllOrdersForAdmin() {
  return prisma.order.findMany({
    include: { items: true, payment: true, user: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateOrderStatus(
  id: string,
  input: { status?: "PROCESSING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED"; paymentStatus?: "PENDING" | "PAID" | "FAILED" | "REFUNDED" }
) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new NotFoundError("Order not found.");

  return prisma.order.update({
    where: { id },
    data: input,
    include: { items: true, payment: true },
  });
}

export function canViewOrder(
  order: { userId: string | null },
  viewer: { userId: string | null }
): boolean {
  if (order.userId) return order.userId === viewer.userId;
  // Guest orders are reachable by their unguessable id (e.g. straight off
  // the confirmation redirect); there is no account to check ownership against.
  return true;
}
