"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api-client";

export default function DeleteProductButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (confirming) {
    return (
      <span className="flex items-center gap-2 text-xs">
        <span className="text-slate">Delete {productName}?</span>
        <button
          disabled={deleting}
          onClick={async () => {
            setDeleting(true);
            await api.delete(`/api/admin/products/${productId}`);
            router.refresh();
          }}
          className="text-red-700 hover:text-red-800 uppercase tracking-widest focus-ring"
        >
          {deleting ? "…" : "Confirm"}
        </button>
        <button onClick={() => setConfirming(false)} className="text-ink/50 hover:text-ink focus-ring">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs tracking-[0.15em] uppercase text-ink/50 hover:text-red-700 transition-colors focus-ring"
    >
      Delete
    </button>
  );
}
