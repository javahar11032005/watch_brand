"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/hooks/useCartStore";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  movementType: string;
  basePrice: number;
  currency: string;
  heroImageUrl: string;
  videoId: string | null;
  variants: Array<{ id: string; priceModifier: number; stock: number; isDefault: boolean }>;
};

/**
 * A plain, guaranteed-visible photograph is the card's whole visual layer —
 * no embedded video here at all, so there is nothing that can fail to load
 * or render as an empty box. The full cinematic "Watch Film" experience
 * lives on the product page itself, opened via Explore Watch.
 */
export default function ProductCard({ product }: { product: ProductCardData }) {
  const addItem = useCartStore((s) => s.addItem);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const defaultVariant =
    product.variants.find((v) => v.isDefault) ?? product.variants[0];
  const price = product.basePrice + (defaultVariant?.priceModifier ?? 0);
  const inStock = (defaultVariant?.stock ?? 0) > 0;

  async function handleAddToCart() {
    if (!defaultVariant || adding) return;
    setAdding(true);
    try {
      await addItem(product.id, defaultVariant.id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch {
      // surfaced via store error state; swallow here to keep card simple
    } finally {
      setAdding(false);
    }
  }

  return (
    <motion.div
      className="group flex flex-col"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/watches/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-porcelain-3 focus-ring"
      >
        <Image
          src={product.heroImageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 30vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {!inStock && (
          <span className="absolute top-4 left-4 text-[10px] tracking-[0.2em] uppercase bg-porcelain/90 text-ink/80 px-2 py-1">
            Waitlist Only
          </span>
        )}
      </Link>

      <div className="pt-5 flex flex-col flex-1">
        <h3 className="font-serif text-xl mb-1">
          <Link href={`/watches/${product.slug}`} className="text-ink hover:text-brass transition-colors focus-ring">
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-slate mb-3">{product.movementType} timepiece</p>
        <p className="text-sm text-ink/85 mb-5">{formatPrice(price, product.currency)}</p>

        <div className="mt-auto flex items-center gap-4">
          <Link
            href={`/watches/${product.slug}`}
            className="text-xs tracking-[0.2em] uppercase text-ink/80 hover:text-brass transition-colors focus-ring"
          >
            Explore Watch
          </Link>
          <span className="text-ink/20">/</span>
          <button
            onClick={handleAddToCart}
            disabled={!inStock || adding}
            className="text-xs tracking-[0.2em] uppercase text-ink/80 hover:text-brass transition-colors disabled:opacity-40 focus-ring"
          >
            {added ? "Added ✓" : adding ? "Adding…" : "Add to Cart"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
