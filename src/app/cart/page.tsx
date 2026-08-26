"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { useCartStore } from "@/hooks/useCartStore";
import { formatPrice, variantSummary } from "@/lib/format";
import { LinkButton } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function CartPage() {
  const { cart, loading, hasFetched, fetchCart, updateQuantity, removeItem } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (hasFetched && cart.items.length === 0) {
    return (
      <div className="pt-40 pb-32 flex flex-col items-center justify-center text-center px-6 bg-porcelain">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">Cart</p>
          <h1 className="font-serif text-4xl md:text-5xl mb-5 text-balance text-ink">
            Your collection awaits.
          </h1>
          <p className="text-slate max-w-md mx-auto mb-10 leading-relaxed">
            Discover a timepiece designed around precision, proportion and permanence.
          </p>
          <LinkButton href="/collection">Explore Collection</LinkButton>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32 bg-porcelain">
      <div className="mx-auto max-w-[1100px] px-6 md:px-10">
        <h1 className="font-serif text-4xl md:text-5xl mb-14 text-balance text-ink">Your Cart</h1>

        <div className="divide-y divide-taupe border-y border-taupe">
          {cart.items.map((item) => (
            <div key={item.id} className="py-8 flex gap-6 items-center">
              <Link href={`/watches/${item.product.slug}`} className="relative w-24 h-24 md:w-28 md:h-28 shrink-0 bg-porcelain-2 focus-ring">
                <Image
                  src={item.product.heroImageUrl}
                  alt={item.product.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/watches/${item.product.slug}`} className="font-serif text-lg text-ink hover:text-brass transition-colors focus-ring">
                  {item.product.name}
                </Link>
                <p className="text-xs text-slate mt-1">{variantSummary(item.variant)}</p>
                <p className="text-sm text-ink/80 mt-2">{formatPrice(item.unitPrice)}</p>
              </div>

              <div className="flex items-center border border-taupe">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  disabled={loading || item.quantity <= 1}
                  className="w-9 h-10 flex items-center justify-center text-ink/70 hover:text-brass disabled:opacity-30 transition-colors focus-ring"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-8 text-center text-sm text-ink">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.id, Math.min(item.variant.stock, item.quantity + 1))
                  }
                  disabled={loading || item.quantity >= item.variant.stock}
                  className="w-9 h-10 flex items-center justify-center text-ink/70 hover:text-brass disabled:opacity-30 transition-colors focus-ring"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <p className="w-24 text-right text-sm text-ink hidden sm:block">
                {formatPrice(item.lineTotal)}
              </p>

              <button
                onClick={() => removeItem(item.id)}
                disabled={loading}
                className="text-ink/40 hover:text-ink transition-colors focus-ring"
                aria-label={`Remove ${item.product.name} from cart`}
              >
                <Trash2 size={18} strokeWidth={1.5} />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-end gap-2">
          <div className="flex justify-between w-full max-w-xs text-sm text-slate">
            <span>Subtotal</span>
            <span className="text-ink">{formatPrice(cart.subtotal)}</span>
          </div>
          <p className="text-xs text-slate max-w-xs text-right">
            Shipping and any applicable taxes calculated at checkout.
          </p>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4">
          <LinkButton href="/collection" variant="secondary">
            Continue Shopping
          </LinkButton>
          <LinkButton href="/checkout">Checkout →</LinkButton>
        </div>
      </div>
    </div>
  );
}
