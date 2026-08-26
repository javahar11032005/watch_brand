import { prisma } from "@/lib/db";
import { NotFoundError } from "@/lib/http";

export function listProducts(params: { collectionKey?: string } = {}) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      ...(params.collectionKey ? { collectionKey: params.collectionKey } : {}),
    },
    include: { variants: { orderBy: { priceModifier: "asc" } } },
    orderBy: { createdAt: "asc" },
  });
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { variants: { orderBy: { priceModifier: "asc" } } },
  });
  if (!product || !product.isActive) {
    throw new NotFoundError("Watch not found");
  }
  return product;
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  });
  if (!product) throw new NotFoundError("Watch not found");
  return product;
}

export function priceForVariant(basePrice: number, variantPriceModifier: number) {
  return basePrice + variantPriceModifier;
}

// --- Admin -----------------------------------------------------------------

export function listAllProductsForAdmin() {
  return prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });
}

type ProductInput = {
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  story: string;
  collectionKey: string;
  basePrice: number;
  currency: string;
  movementType: string;
  calibre: string;
  powerReserveHours: number;
  frequencyHz: number;
  caseDiameterMm: number;
  caseThicknessMm: number;
  waterResistanceAtm: number;
  complications: string[];
  heroImageUrl: string;
  galleryImageUrls: string[];
  model3dUrl?: string | null;
  isFeatured?: boolean;
  isActive?: boolean;
  variants: Array<{
    id?: string;
    caseMaterial: "STEEL" | "TITANIUM" | "ROSE_GOLD";
    dialColor: "IVORY" | "MIDNIGHT" | "SILVER";
    strapMaterial: "LEATHER" | "STEEL_BRACELET" | "RUBBER";
    priceModifier: number;
    stock: number;
    isDefault?: boolean;
    sku: string;
  }>;
};

export async function createProduct(input: ProductInput) {
  const { variants, ...productData } = input;
  return prisma.product.create({
    data: {
      ...productData,
      variants: { create: variants.map((v) => ({ ...v, id: undefined })) },
    },
    include: { variants: true },
  });
}

export async function updateProduct(id: string, input: ProductInput) {
  const { variants, ...productData } = input;

  return prisma.$transaction(async (tx) => {
    await tx.product.update({ where: { id }, data: productData });

    const existingVariants = await tx.productVariant.findMany({ where: { productId: id } });
    const keepIds = new Set(variants.filter((v) => v.id).map((v) => v.id));
    const toDelete = existingVariants.filter((v) => !keepIds.has(v.id));
    if (toDelete.length > 0) {
      await tx.productVariant.deleteMany({ where: { id: { in: toDelete.map((v) => v.id) } } });
    }

    for (const variant of variants) {
      const { id: variantId, ...variantData } = variant;
      if (variantId) {
        await tx.productVariant.update({ where: { id: variantId }, data: variantData });
      } else {
        await tx.productVariant.create({ data: { ...variantData, productId: id } });
      }
    }

    return tx.product.findUniqueOrThrow({ where: { id }, include: { variants: true } });
  });
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
}
