"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/Button";

const CASE_MATERIALS = ["STEEL", "TITANIUM", "ROSE_GOLD"] as const;
const DIAL_COLORS = ["IVORY", "MIDNIGHT", "SILVER"] as const;
const STRAP_MATERIALS = ["LEATHER", "STEEL_BRACELET", "RUBBER"] as const;

type Variant = {
  id?: string;
  caseMaterial: (typeof CASE_MATERIALS)[number];
  dialColor: (typeof DIAL_COLORS)[number];
  strapMaterial: (typeof STRAP_MATERIALS)[number];
  priceModifier: number;
  stock: number;
  isDefault: boolean;
  sku: string;
};

type ProductRecord = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  story: string;
  collectionKey: string;
  basePrice: number;
  currency: string;
  movementType: string;
  calibre: string;
  powerReserveHours: number;
  frequencyHz: number;
  caseDiameterMm: number;
  caseThicknessMm: number;
  waterResistanceAtm: number;
  complications: string[];
  heroImageUrl: string;
  galleryImageUrls: string[];
  isFeatured: boolean;
  isActive: boolean;
  variants: Variant[];
};

function buildVariantMatrix(codePrefix: string, caseMod: number, roseGoldMod: number, braceletMod: number): Variant[] {
  const variants: Variant[] = [];
  for (const caseMaterial of CASE_MATERIALS) {
    for (const dialColor of DIAL_COLORS) {
      for (const strapMaterial of STRAP_MATERIALS) {
        const caseModifier = caseMaterial === "TITANIUM" ? caseMod : caseMaterial === "ROSE_GOLD" ? roseGoldMod : 0;
        const strapModifier = strapMaterial === "STEEL_BRACELET" ? braceletMod : 0;
        variants.push({
          caseMaterial,
          dialColor,
          strapMaterial,
          priceModifier: caseModifier + strapModifier,
          stock: 10,
          isDefault: caseMaterial === "STEEL" && dialColor === "IVORY" && strapMaterial === "LEATHER",
          sku: `${codePrefix}-${caseMaterial.slice(0, 2)}-${dialColor.slice(0, 2)}-${strapMaterial.slice(0, 2)}`,
        });
      }
    }
  }
  return variants;
}

export default function ProductForm({ initial }: { initial?: ProductRecord }) {
  const router = useRouter();
  const isEdit = !!initial;

  const [form, setForm] = useState({
    slug: initial?.slug ?? "",
    name: initial?.name ?? "",
    subtitle: initial?.subtitle ?? "",
    description: initial?.description ?? "",
    story: initial?.story ?? "",
    collectionKey: initial?.collectionKey ?? "meridian",
    basePrice: initial ? (initial.basePrice / 100).toString() : "",
    movementType: initial?.movementType ?? "Automatic",
    calibre: initial?.calibre ?? "",
    powerReserveHours: initial?.powerReserveHours?.toString() ?? "48",
    frequencyHz: initial?.frequencyHz?.toString() ?? "4",
    caseDiameterMm: initial?.caseDiameterMm?.toString() ?? "40",
    caseThicknessMm: initial?.caseThicknessMm?.toString() ?? "11",
    waterResistanceAtm: initial?.waterResistanceAtm?.toString() ?? "5",
    complications: initial?.complications?.join(", ") ?? "",
    heroImageUrl: initial?.heroImageUrl ?? "",
    galleryImageUrls: initial?.galleryImageUrls?.join(", ") ?? "",
    isFeatured: initial?.isFeatured ?? true,
    isActive: initial?.isActive ?? true,
  });

  const [variants, setVariants] = useState<Variant[]>(initial?.variants ?? []);
  const [newProductMods, setNewProductMods] = useState({ titanium: "40", roseGold: "180", bracelet: "35" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function updateVariant(index: number, patch: Partial<Variant>) {
    setVariants((vs) => vs.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const finalVariants = isEdit
        ? variants
        : buildVariantMatrix(
            form.slug.slice(0, 6).toUpperCase() || "SKU",
            Math.round(Number(newProductMods.titanium || 0) * 100),
            Math.round(Number(newProductMods.roseGold || 0) * 100),
            Math.round(Number(newProductMods.bracelet || 0) * 100)
          );

      const payload = {
        slug: form.slug,
        name: form.name,
        subtitle: form.subtitle,
        description: form.description,
        story: form.story,
        collectionKey: form.collectionKey,
        basePrice: Math.round(Number(form.basePrice) * 100),
        currency: "usd",
        movementType: form.movementType,
        calibre: form.calibre,
        powerReserveHours: Number(form.powerReserveHours),
        frequencyHz: Number(form.frequencyHz),
        caseDiameterMm: Number(form.caseDiameterMm),
        caseThicknessMm: Number(form.caseThicknessMm),
        waterResistanceAtm: Number(form.waterResistanceAtm),
        complications: form.complications.split(",").map((c) => c.trim()).filter(Boolean),
        heroImageUrl: form.heroImageUrl,
        galleryImageUrls: form.galleryImageUrls.split(",").map((c) => c.trim()).filter(Boolean),
        isFeatured: form.isFeatured,
        isActive: form.isActive,
        variants: finalVariants,
      };

      if (isEdit) {
        await api.patch(`/api/admin/products/${initial!.id}`, payload);
      } else {
        await api.post("/api/admin/products", payload);
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save product.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-3xl">
      <fieldset className="space-y-4">
        <legend className="text-xs tracking-[0.2em] uppercase text-brass mb-2">Overview</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Slug" value={form.slug} onChange={(v) => update("slug", v)} required />
          <Input label="Name" value={form.name} onChange={(v) => update("name", v)} required />
        </div>
        <Input label="Subtitle" value={form.subtitle} onChange={(v) => update("subtitle", v)} required />
        <Textarea label="Description" value={form.description} onChange={(v) => update("description", v)} required />
        <Textarea label="Story" value={form.story} onChange={(v) => update("story", v)} required rows={4} />
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Collection Key" value={form.collectionKey} onChange={(v) => update("collectionKey", v)} required />
          <Input label="Base Price (USD)" type="number" step="0.01" value={form.basePrice} onChange={(v) => update("basePrice", v)} required />
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-xs tracking-[0.2em] uppercase text-brass mb-2">Specification</legend>
        <div className="grid sm:grid-cols-2 gap-4">
          <Input label="Movement Type" value={form.movementType} onChange={(v) => update("movementType", v)} required />
          <Input label="Calibre" value={form.calibre} onChange={(v) => update("calibre", v)} required />
        </div>
        <div className="grid sm:grid-cols-4 gap-4">
          <Input label="Power Reserve (hrs)" type="number" value={form.powerReserveHours} onChange={(v) => update("powerReserveHours", v)} required />
          <Input label="Frequency (Hz)" type="number" value={form.frequencyHz} onChange={(v) => update("frequencyHz", v)} required />
          <Input label="Diameter (mm)" type="number" step="0.1" value={form.caseDiameterMm} onChange={(v) => update("caseDiameterMm", v)} required />
          <Input label="Thickness (mm)" type="number" step="0.1" value={form.caseThicknessMm} onChange={(v) => update("caseThicknessMm", v)} required />
        </div>
        <Input label="Water Resistance (ATM)" type="number" value={form.waterResistanceAtm} onChange={(v) => update("waterResistanceAtm", v)} required />
        <Input label="Complications (comma separated)" value={form.complications} onChange={(v) => update("complications", v)} />
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="text-xs tracking-[0.2em] uppercase text-brass mb-2">Media</legend>
        <Input label="Hero Image URL" value={form.heroImageUrl} onChange={(v) => update("heroImageUrl", v)} required />
        <Input label="Gallery Image URLs (comma separated)" value={form.galleryImageUrls} onChange={(v) => update("galleryImageUrls", v)} />
      </fieldset>

      <fieldset className="flex gap-8">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isFeatured} onChange={(e) => update("isFeatured", e.target.checked)} className="accent-brass" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.isActive} onChange={(e) => update("isActive", e.target.checked)} className="accent-brass" />
          Active (visible to customers)
        </label>
      </fieldset>

      <fieldset>
        <legend className="text-xs tracking-[0.2em] uppercase text-brass mb-4">Variants</legend>
        {isEdit ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="text-left text-xs text-slate border-b border-taupe">
                  <th className="py-2 pr-3">SKU</th>
                  <th className="py-2 pr-3">Combination</th>
                  <th className="py-2 pr-3">Price +</th>
                  <th className="py-2 pr-3">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {variants.map((v, i) => (
                  <tr key={v.id ?? v.sku}>
                    <td className="py-2 pr-3 text-xs text-slate">{v.sku}</td>
                    <td className="py-2 pr-3 text-xs">
                      {v.caseMaterial} / {v.dialColor} / {v.strapMaterial}
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="number"
                        value={v.priceModifier / 100}
                        onChange={(e) => updateVariant(i, { priceModifier: Math.round(Number(e.target.value) * 100) })}
                        className="w-24 bg-transparent border border-taupe px-2 py-1 text-sm text-ink focus:outline-none focus:border-brass"
                      />
                    </td>
                    <td className="py-2 pr-3">
                      <input
                        type="number"
                        value={v.stock}
                        onChange={(e) => updateVariant(i, { stock: Number(e.target.value) })}
                        className="w-20 bg-transparent border border-taupe px-2 py-1 text-sm text-ink focus:outline-none focus:border-brass"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Titanium surcharge (USD)"
              type="number"
              value={newProductMods.titanium}
              onChange={(v) => setNewProductMods((m) => ({ ...m, titanium: v }))}
            />
            <Input
              label="Rose Gold surcharge (USD)"
              type="number"
              value={newProductMods.roseGold}
              onChange={(v) => setNewProductMods((m) => ({ ...m, roseGold: v }))}
            />
            <Input
              label="Steel Bracelet surcharge (USD)"
              type="number"
              value={newProductMods.bracelet}
              onChange={(v) => setNewProductMods((m) => ({ ...m, bracelet: v }))}
            />
            <p className="sm:col-span-3 text-xs text-slate">
              All 27 case/dial/strap combinations will be created automatically, each starting with
              10 units of stock.
            </p>
          </div>
        )}
      </fieldset>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Saving…" : isEdit ? "Save Changes" : "Create Product"}
      </Button>
    </form>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  step,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  step?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-slate mb-1.5">{label}</span>
      <input
        type={type}
        step={step}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border border-taupe px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-brass transition-colors"
      />
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  required,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-slate mb-1.5">{label}</span>
      <textarea
        required={required}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border border-taupe px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-brass transition-colors resize-none"
      />
    </label>
  );
}
