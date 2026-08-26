"use client";

import { useMemo, useState } from "react";

export type CaseMaterialKey = "STEEL" | "TITANIUM" | "ROSE_GOLD";
export type DialColorKey = "IVORY" | "MIDNIGHT" | "SILVER";
export type StrapMaterialKey = "LEATHER" | "STEEL_BRACELET" | "RUBBER";

export type SelectableVariant = {
  id: string;
  caseMaterial: CaseMaterialKey;
  dialColor: DialColorKey;
  strapMaterial: StrapMaterialKey;
  priceModifier: number;
  stock: number;
  isDefault: boolean;
};

/**
 * Shared case/dial/strap selection state for anything that lets a shopper
 * configure a watch — the compact landing teaser and the full PDP buy box
 * both derive price, stock and the active variant from this the same way.
 */
export function useVariantSelector(basePrice: number, variants: SelectableVariant[]) {
  const defaultVariant = variants.find((v) => v.isDefault) ?? variants[0];
  const [caseMaterial, setCaseMaterial] = useState<CaseMaterialKey>(defaultVariant.caseMaterial);
  const [dialColor, setDialColor] = useState<DialColorKey>(defaultVariant.dialColor);
  const [strapMaterial, setStrapMaterial] = useState<StrapMaterialKey>(defaultVariant.strapMaterial);

  const activeVariant = useMemo(
    () =>
      variants.find(
        (v) =>
          v.caseMaterial === caseMaterial && v.dialColor === dialColor && v.strapMaterial === strapMaterial
      ) ?? null,
    [variants, caseMaterial, dialColor, strapMaterial]
  );

  const price = basePrice + (activeVariant?.priceModifier ?? 0);
  const stock = activeVariant?.stock ?? 0;
  const inStock = stock > 0;

  return {
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
  };
}
