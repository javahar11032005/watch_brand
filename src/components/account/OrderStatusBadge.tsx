const STATUS_STYLES: Record<string, string> = {
  PROCESSING: "text-slate border-slate/40",
  CONFIRMED: "text-brass border-brass/40",
  SHIPPED: "text-brass border-brass/40",
  DELIVERED: "text-ink border-ink/40",
  CANCELLED: "text-slate border-slate/40",
};

export default function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block px-2.5 py-1 text-[10px] tracking-[0.15em] uppercase border ${
        STATUS_STYLES[status] ?? "text-slate border-slate/40"
      }`}
    >
      {status}
    </span>
  );
}
