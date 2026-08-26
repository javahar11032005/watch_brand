"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";

const STATUSES = ["PROCESSING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  return (
    <select
      value={value}
      disabled={saving}
      onChange={async (e) => {
        const next = e.target.value;
        setValue(next);
        setSaving(true);
        await api.patch(`/api/admin/orders/${orderId}`, { status: next });
        setSaving(false);
        router.refresh();
      }}
      className="bg-porcelain border border-taupe text-ink text-xs px-2 py-1.5 focus:outline-none focus:border-brass"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
