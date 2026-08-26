"use client";

import { create } from "zustand";
import { api } from "@/lib/api-client";
import { useCartStore } from "@/hooks/useCartStore";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
} | null;

type AuthState = {
  user: CurrentUser;
  loading: boolean;
  hasFetched: boolean;
  fetchUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  hasFetched: false,

  fetchUser: async () => {
    try {
      const { user } = await api.get<{ user: CurrentUser }>("/api/auth/me");
      set({ user, hasFetched: true });
    } catch {
      set({ user: null, hasFetched: true });
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { user } = await api.post<{ user: CurrentUser }>("/api/auth/login", {
        email,
        password,
      });
      set({ user, loading: false });
      await useCartStore.getState().fetchCart();
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  register: async (name, email, password) => {
    set({ loading: true });
    try {
      const { user } = await api.post<{ user: CurrentUser }>("/api/auth/register", {
        name,
        email,
        password,
      });
      set({ user, loading: false });
      await useCartStore.getState().fetchCart();
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  logout: async () => {
    await api.post("/api/auth/logout");
    set({ user: null });
    await useCartStore.getState().fetchCart();
  },
}));
