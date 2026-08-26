export function formatPrice(cents: number, currency: string = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

const CASE_MATERIAL_LABELS: Record<string, string> = {
  STEEL: "Stainless Steel",
  TITANIUM: "Titanium",
  ROSE_GOLD: "Rose Gold",
};

const DIAL_COLOR_LABELS: Record<string, string> = {
  IVORY: "Ivory",
  MIDNIGHT: "Midnight",
  SILVER: "Silver",
};

const STRAP_MATERIAL_LABELS: Record<string, string> = {
  LEATHER: "Leather",
  STEEL_BRACELET: "Steel Bracelet",
  RUBBER: "Rubber",
};

export function labelCaseMaterial(value: string): string {
  return CASE_MATERIAL_LABELS[value] ?? value;
}
export function labelDialColor(value: string): string {
  return DIAL_COLOR_LABELS[value] ?? value;
}
export function labelStrapMaterial(value: string): string {
  return STRAP_MATERIAL_LABELS[value] ?? value;
}

export function variantSummary(v: {
  caseMaterial: string;
  dialColor: string;
  strapMaterial: string;
}): string {
  return `${labelCaseMaterial(v.caseMaterial)} · ${labelDialColor(v.dialColor)} Dial · ${labelStrapMaterial(
    v.strapMaterial
  )}`;
}
