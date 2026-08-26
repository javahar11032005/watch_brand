"use client";

import type { CaseMaterialKey, DialColorKey, StrapMaterialKey } from "@/hooks/useVariantSelector";

export const CASE_OPTIONS: CaseMaterialKey[] = ["STEEL", "TITANIUM", "ROSE_GOLD"];
export const DIAL_OPTIONS: DialColorKey[] = ["IVORY", "MIDNIGHT", "SILVER"];
export const STRAP_OPTIONS: StrapMaterialKey[] = ["LEATHER", "STEEL_BRACELET", "RUBBER"];

export const CASE_SWATCH: Record<CaseMaterialKey, string> = {
  STEEL: "#c9cdd0",
  TITANIUM: "#8f9296",
  ROSE_GOLD: "#caa08a",
};
export const DIAL_SWATCH: Record<DialColorKey, string> = {
  IVORY: "#efe9de",
  MIDNIGHT: "#12181f",
  SILVER: "#d7dadd",
};
export const STRAP_SWATCH: Record<StrapMaterialKey, string> = {
  LEATHER: "#3b2a22",
  STEEL_BRACELET: "#b9bdc1",
  RUBBER: "#1a1c1e",
};

export function OptionSwatchGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  swatches,
  labeller,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
  swatches: Record<T, string>;
  labeller: (v: T) => string;
}) {
  return (
    <div className="mb-7">
      <p className="text-xs tracking-[0.2em] uppercase text-slate mb-3">
        {label} — <span className="text-ink/80">{labeller(value)}</span>
      </p>
      <div className="flex gap-3">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            aria-label={labeller(opt)}
            aria-pressed={value === opt}
            className={`w-9 h-9 rounded-full border transition-all focus-ring ${
              value === opt ? "border-brass scale-110" : "border-taupe hover:border-ink/40"
            }`}
            style={{ backgroundColor: swatches[opt] }}
          />
        ))}
      </div>
    </div>
  );
}
