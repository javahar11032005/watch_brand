"use client";

import { create } from "zustand";
import { api } from "@/lib/api-client";

export type CartItemView = {
  id: string;
  productId: string;
  variantId: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  product: { id: string; name: string; slug: string; heroImageUrl: string };
  variant: {
    id: string;
    sku: string;
    caseMaterial: string;
    dialColor: string;
    strapMaterial: string;
    stock: number;
  };
};

export type CartView = {
  id: string | null;
  items: CartItemView[];
  subtotal: number;
  itemCount: number;
};

const EMPTY_CART: CartView = { id: null, items: [], subtotal: 0, itemCount: 0 };

type CartState = {
  cart: CartView;
  loading: boolean;
  error: string | null;
  hasFetched: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, variantId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
};

export const useCartStore = create<CartState>((set, get) => ({
  cart: EMPTY_CART,
  loading: false,
  error: null,
  hasFetched: false,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const { cart } = await api.get<{ cart: CartView }>("/api/cart");
      set({ cart, loading: false, hasFetched: true });
    } catch {
      set({ loading: false, hasFetched: true });
    }
  },

  addItem: async (productId, variantId, quantity = 1) => {
    set({ loading: true, error: null });
    try {
      const { cart } = await api.post<{ cart: CartView }>("/api/cart/items", {
        productId,
        variantId,
        quantity,
      });
      set({ cart, loading: false });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : "Could not add to cart." });
      throw e;
    }
  },

  updateQuantity: async (itemId, quantity) => {
    const previous = get().cart;
    set({ loading: true, error: null });
    try {
      const { cart } = await api.patch<{ cart: CartView }>(`/api/cart/items/${itemId}`, {
        quantity,
      });
      set({ cart, loading: false });
    } catch (e) {
      set({ cart: previous, loading: false, error: e instanceof Error ? e.message : "Could not update cart." });
    }
  },

  removeItem: async (itemId) => {
    set({ loading: true, error: null });
    try {
      const { cart } = await api.delete<{ cart: CartView }>(`/api/cart/items/${itemId}`);
      set({ cart, loading: false });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : "Could not remove item." });
    }
  },
}));
