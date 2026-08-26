"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  formatPrice,
  labelCaseMaterial,
  labelDialColor,
  labelStrapMaterial,
} from "@/lib/format";
import { useCartStore } from "@/hooks/useCartStore";
import { useVariantSelector, type SelectableVariant } from "@/hooks/useVariantSelector";
import { Button } from "@/components/ui/Button";
import {
  CASE_OPTIONS,
  DIAL_OPTIONS,
  STRAP_OPTIONS,
  CASE_SWATCH,
  DIAL_SWATCH,
  STRAP_SWATCH,
  OptionSwatchGroup,
} from "@/components/configurator/OptionSwatches";

export type BuyBoxProduct = {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  currency: string;
  movementType: string;
  caseDiameterMm: number;
  waterResistanceAtm: number;
  variants: SelectableVariant[];
};

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-taupe text-sm">
      <span className="text-xs tracking-[0.15em] uppercase text-slate">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}

export default function ProductBuyBox({ product }: { product: BuyBoxProduct }) {
  const router = useRouter();
  const {
    caseMaterial,
    dialColor,
    strapMaterial,
    setCaseMaterial,
    setDialColor,
    setStrapMaterial,
    activeVariant,
    price,
    stock,
    inStock,
  } = useVariantSelector(product.basePrice, product.variants);

  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");
  const [buying, setBuying] = useState(false);
  const clampedQuantity = Math.min(quantity, Math.max(stock, 1));

  async function handleAdd() {
    if (!activeVariant || status === "adding") return;
    setStatus("adding");
    try {
      await addItem(product.id, activeVariant.id, clampedQuantity);
      setStatus("added");
      setQuantity(1);
      setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("idle");
    }
  }

  async function handleBuyNow() {
    if (!activeVariant || buying) return;
    setBuying(true);
    try {
      await addItem(product.id, activeVariant.id, clampedQuantity);
      router.push("/checkout");
    } catch {
      setBuying(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-4xl md:text-5xl leading-tight text-balance text-ink mb-4">
        {product.name}
      </h1>
      <p className="text-slate leading-relaxed mb-6 max-w-md">{product.description}</p>

      <div className="flex items-center gap-4 mb-8">
        <p className="font-serif text-3xl text-ink">{formatPrice(price, product.currency)}</p>
        <span
          className={`text-xs tracking-[0.15em] uppercase ${inStock ? "text-brass" : "text-slate"}`}
        >
          {inStock ? "In Stock" : "Waitlist Only"}
        </span>
      </div>

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

      <div className="mt-6 mb-8">
        <SpecRow label="Movement" value={product.movementType} />
        <SpecRow label="Diameter" value={`${product.caseDiameterMm} mm`} />
        <SpecRow label="Water Resistance" value={`${product.waterResistanceAtm * 10} m`} />
        <SpecRow label="Crystal" value="Sapphire, Anti-Reflective" />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
        <div className="flex items-center border border-taupe">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-11 flex items-center justify-center text-ink/70 hover:text-brass transition-colors focus-ring"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm text-ink">{clampedQuantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(stock || 1, q + 1))}
            className="w-10 h-11 flex items-center justify-center text-ink/70 hover:text-brass transition-colors focus-ring"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <Button onClick={handleAdd} disabled={!inStock || status === "adding"} className="flex-1">
          {status === "added" ? "Added to Cart ✓" : status === "adding" ? "Adding…" : "Add to Cart"}
        </Button>
      </div>
      <Button
        variant="secondary"
        onClick={handleBuyNow}
        disabled={!inStock || buying}
        className="w-full"
      >
        {buying ? "Redirecting…" : "Buy Now"}
      </Button>

      {!inStock && (
        <p className="mt-4 text-xs text-slate">
          This configuration is currently on the waitlist — try another combination or request a
          private viewing.
        </p>
      )}
    </div>
  );
}
