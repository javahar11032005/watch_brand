import type { z } from "zod";
import type {
  registerSchema,
  loginSchema,
  addCartItemSchema,
  updateCartItemSchema,
  shippingDetailsSchema,
  createOrderSchema,
  productInputSchema,
  updateOrderStatusSchema,
} from "@/lib/validation";

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AddCartItemInput = z.infer<typeof addCartItemSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type ShippingDetailsInput = z.infer<typeof shippingDetailsSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type ProductInput = z.infer<typeof productInputSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
