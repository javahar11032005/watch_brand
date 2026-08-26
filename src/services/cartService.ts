import { prisma } from "@/lib/db";
import { BadRequestError, NotFoundError } from "@/lib/http";
import type { CartIdentity } from "@/types";

function identityWhere(identity: CartIdentity) {
  return identity.kind === "user"
    ? { userId: identity.userId }
    : { guestToken: identity.guestToken };
}

async function getOrCreateCartId(identity: CartIdentity): Promise<string> {
  const where = identityWhere(identity);
  const existing = await prisma.cart.findFirst({ where });
  if (existing) return existing.id;

  const created = await prisma.cart.create({ data: where });
  return created.id;
}

const cartInclude = {
  items: {
    include: { product: true, variant: true },
    orderBy: { createdAt: "asc" as const },
  },
};

export async function getCart(identity: CartIdentity) {
  const where = identityWhere(identity);
  const cart = await prisma.cart.findFirst({ where, include: cartInclude });
  if (!cart) {
    return { id: null, items: [], subtotal: 0, itemCount: 0 };
  }

  const items = cart.items.map((item) => {
    const unitPrice = item.product.basePrice + item.variant.priceModifier;
    return { ...item, unitPrice, lineTotal: unitPrice * item.quantity };
  });

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { id: cart.id, items, subtotal, itemCount };
}

export async function addItem(
  identity: CartIdentity,
  input: { productId: string; variantId: string; quantity: number }
) {
  const variant = await prisma.productVariant.findUnique({
    where: { id: input.variantId },
    include: { product: true },
  });
  if (!variant || variant.productId !== input.productId || !variant.product.isActive) {
    throw new NotFoundError("This watch is not available.");
  }

  const cartId = await getOrCreateCartId(identity);
  const existing = await prisma.cartItem.findUnique({
    where: { cartId_variantId: { cartId, variantId: input.variantId } },
  });

  const desiredQuantity = (existing?.quantity ?? 0) + input.quantity;
  const cappedQuantity = Math.min(desiredQuantity, Math.max(variant.stock, 0), 10);

  if (cappedQuantity <= 0) {
    throw new BadRequestError("This configuration is currently out of stock.");
  }

  await prisma.cartItem.upsert({
    where: { cartId_variantId: { cartId, variantId: input.variantId } },
    create: {
      cartId,
      productId: input.productId,
      variantId: input.variantId,
      quantity: cappedQuantity,
    },
    update: { quantity: cappedQuantity },
  });

  return getCart(identity);
}

export async function updateItemQuantity(
  identity: CartIdentity,
  itemId: string,
  quantity: number
) {
  const where = identityWhere(identity);
  const cart = await prisma.cart.findFirst({ where });
  if (!cart) throw new NotFoundError("Cart item not found.");

  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { variant: true },
  });
  if (!item || item.cartId !== cart.id) throw new NotFoundError("Cart item not found.");

  const cappedQuantity = Math.min(quantity, Math.max(item.variant.stock, 0), 10);
  if (cappedQuantity <= 0) {
    throw new BadRequestError("This configuration is currently out of stock.");
  }

  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: cappedQuantity } });
  return getCart(identity);
}

export async function removeItem(identity: CartIdentity, itemId: string) {
  const where = identityWhere(identity);
  const cart = await prisma.cart.findFirst({ where });
  if (!cart) throw new NotFoundError("Cart item not found.");

  const item = await prisma.cartItem.findUnique({ where: { id: itemId } });
  if (!item || item.cartId !== cart.id) throw new NotFoundError("Cart item not found.");

  await prisma.cartItem.delete({ where: { id: itemId } });
  return getCart(identity);
}

export async function clearCart(identity: CartIdentity) {
  const where = identityWhere(identity);
  const cart = await prisma.cart.findFirst({ where });
  if (!cart) return;
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
}

/**
 * Called right after a guest logs in or registers: fold whatever is in
 * their anonymous cart into their (possibly pre-existing) account cart,
 * summing quantities on overlapping variants, then drop the guest cart.
 */
export async function mergeGuestCartIntoUser(guestToken: string, userId: string) {
  const guestCart = await prisma.cart.findUnique({
    where: { guestToken },
    include: { items: true },
  });
  if (!guestCart || guestCart.items.length === 0) return;

  const userCartId = await getOrCreateCartId({ kind: "user", userId });

  for (const item of guestCart.items) {
    const existing = await prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId: userCartId, variantId: item.variantId } },
    });
    const variant = await prisma.productVariant.findUnique({ where: { id: item.variantId } });
    const stock = variant?.stock ?? 0;
    const quantity = Math.min((existing?.quantity ?? 0) + item.quantity, Math.max(stock, 0), 10);
    if (quantity <= 0) continue;

    await prisma.cartItem.upsert({
      where: { cartId_variantId: { cartId: userCartId, variantId: item.variantId } },
      create: {
        cartId: userCartId,
        productId: item.productId,
        variantId: item.variantId,
        quantity,
      },
      update: { quantity },
    });
  }

  await prisma.cart.delete({ where: { id: guestCart.id } });
}
