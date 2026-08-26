"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { MotionConfig } from "framer-motion";
import { useCartStore } from "@/hooks/useCartStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Providers({ children }: { children: ReactNode }) {
  const fetchCart = useCartStore((s) => s.fetchCart);
  const fetchUser = useAuthStore((s) => s.fetchUser);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    fetchCart();
    fetchUser();
  }, [fetchCart, fetchUser]);

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let frameId: number;
    function raf(time: number) {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    }
    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, [reducedMotion]);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
