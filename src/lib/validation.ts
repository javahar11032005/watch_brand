import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[a-zA-Z]/, "Password must contain a letter.")
    .regex(/[0-9]/, "Password must contain a number."),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const addCartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(10).default(1),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1).max(10),
});

export const shippingAddressSchema = z.object({
  name: z.string().trim().min(2, "Full name is required."),
  email: z.email("Enter a valid email address."),
  phone: z.string().trim().min(6, "Enter a valid phone number."),
  line1: z.string().trim().min(3, "Street address is required."),
  city: z.string().trim().min(1, "City is required."),
  state: z.string().trim().min(1, "State / province is required."),
  postalCode: z.string().trim().min(1, "Postal code is required."),
  country: z.string().trim().min(2, "Country is required."),
});

export const shippingDetailsSchema = shippingAddressSchema;

export const createOrderSchema = z.object({
  shipping: shippingAddressSchema,
  createAccount: z.boolean().optional().default(false),
  password: z.string().min(8).optional(),
});

export const productVariantInputSchema = z.object({
  id: z.string().optional(),
  caseMaterial: z.enum(["STEEL", "TITANIUM", "ROSE_GOLD"]),
  dialColor: z.enum(["IVORY", "MIDNIGHT", "SILVER"]),
  strapMaterial: z.enum(["LEATHER", "STEEL_BRACELET", "RUBBER"]),
  priceModifier: z.coerce.number().int().default(0),
  stock: z.coerce.number().int().min(0).default(0),
  isDefault: z.boolean().optional().default(false),
  sku: z.string().min(1),
});

export const productInputSchema = z.object({
  slug: z.string().trim().min(1),
  name: z.string().trim().min(1),
  subtitle: z.string().trim().min(1),
  description: z.string().trim().min(1),
  story: z.string().trim().min(1),
  collectionKey: z.string().trim().min(1),
  basePrice: z.coerce.number().int().min(0),
  currency: z.string().default("usd"),
  movementType: z.string().trim().min(1),
  calibre: z.string().trim().min(1),
  powerReserveHours: z.coerce.number().int().min(0),
  frequencyHz: z.coerce.number().int().min(0),
  caseDiameterMm: z.coerce.number().min(0),
  caseThicknessMm: z.coerce.number().min(0),
  waterResistanceAtm: z.coerce.number().int().min(0),
  complications: z.array(z.string()).default([]),
  heroImageUrl: z.string().trim().min(1),
  galleryImageUrls: z.array(z.string()).default([]),
  model3dUrl: z.string().nullable().optional(),
  isFeatured: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  variants: z.array(productVariantInputSchema).min(1),
});

export const updateOrderStatusSchema = z.object({
  status: z
    .enum(["PROCESSING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"])
    .optional(),
  paymentStatus: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]).optional(),
});
