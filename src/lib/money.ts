export function formatPrice(cents: number, currency: string = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function generateOrderNumber(): string {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `KST-${random}`;
}
