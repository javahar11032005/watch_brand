"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, labelCaseMaterial, labelDialColor, labelStrapMaterial } from "@/lib/format";
import { useCartStore } from "@/hooks/useCartStore";
import { Button } from "@/components/ui/Button";
import ProductMediaViewer from "@/components/product/ProductMediaViewer";
import { useVariantSelector, type SelectableVariant } from "@/hooks/useVariantSelector";
import {
  CASE_OPTIONS,
  DIAL_OPTIONS,
  STRAP_OPTIONS,
  CASE_SWATCH,
  DIAL_SWATCH,
  STRAP_SWATCH,
  OptionSwatchGroup,
} from "./OptionSwatches";

export type ConfiguratorVariant = SelectableVariant;

export type ConfiguratorProduct = {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  currency: string;
  heroImageUrl: string;
  videoId: string | null;
  variants: ConfiguratorVariant[];
};

/**
 * The compact "try before you commit" widget used on the landing page's
 * Atelier teaser. For the full product-detail buy experience (stock,
 * quantity, detailed specs, Buy Now) see ProductBuyBox.
 */
export default function Configurator({ product }: { product: ConfiguratorProduct }) {
  const {
    caseMaterial,
    dialColor,
    strapMaterial,
    setCaseMaterial,
    setDialColor,
    setStrapMaterial,
    activeVariant,
    price,
    inStock,
  } = useVariantSelector(product.basePrice, product.variants);

  const addItem = useCartStore((s) => s.addItem);
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");

  async function handleAdd() {
    if (!activeVariant || status === "adding") return;
    setStatus("adding");
    try {
      await addItem(product.id, activeVariant.id, 1);
      setStatus("added");
      setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("idle");
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
      <div>
        <ProductMediaViewer
          youtubeId={product.videoId}
          posterUrl={product.heroImageUrl}
          posterAlt={product.name}
          title={product.name}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={`${caseMaterial}-${dialColor}-${strapMaterial}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-3 h-2 flex overflow-hidden"
            aria-hidden
          >
            <span className="flex-1" style={{ backgroundColor: CASE_SWATCH[caseMaterial] }} />
            <span className="flex-1" style={{ backgroundColor: DIAL_SWATCH[dialColor] }} />
            <span className="flex-1" style={{ backgroundColor: STRAP_SWATCH[strapMaterial] }} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div>
        <p className="text-xs tracking-[0.3em] uppercase text-brass mb-3">{product.name}</p>
        <p className="font-serif text-3xl mb-8 text-ink">{formatPrice(price, product.currency)}</p>

        <OptionSwatchGroup
          label="Case"
          options={CASE_OPTIONS}
          value={caseMaterial}
          onChange={setCaseMaterial}
          swatches={CASE_SWATCH}
          labeller={labelCaseMaterial}
        />
        <OptionSwatchGroup
          label="Dial"
          options={DIAL_OPTIONS}
          value={dialColor}
          onChange={setDialColor}
          swatches={DIAL_SWATCH}
          labeller={labelDialColor}
        />
        <OptionSwatchGroup
          label="Strap"
          options={STRAP_OPTIONS}
          value={strapMaterial}
          onChange={setStrapMaterial}
          swatches={STRAP_SWATCH}
          labeller={labelStrapMaterial}
        />

        <div className="mt-8">
          <Button onClick={handleAdd} disabled={!inStock || status === "adding"}>
            {status === "added" ? "Added to Cart ✓" : status === "adding" ? "Adding…" : "Add to Cart"}
          </Button>
        </div>
        {!inStock && (
          <p className="mt-4 text-xs text-slate">
            This configuration is currently on the waitlist — try another combination or request a
            private viewing.
          </p>
        )}
      </div>
    </div>
  );
}
