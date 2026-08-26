import type { ReactNode } from "react";
import Link from "next/link";
import { requireAdminPage } from "@/lib/page-guards";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  await requireAdminPage("/admin");

  return (
    <div className="pt-28 pb-24 md:pt-32 bg-porcelain min-h-screen">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        <div className="flex items-center gap-8 border-b border-taupe mb-12 pb-4">
          <p className="text-xs tracking-[0.3em] uppercase text-brass">Admin</p>
          <nav className="flex gap-6 text-sm">
            <Link href="/admin" className="text-ink/80 hover:text-brass transition-colors focus-ring">
              Dashboard
            </Link>
            <Link href="/admin/products" className="text-ink/80 hover:text-brass transition-colors focus-ring">
              Products
            </Link>
            <Link href="/admin/orders" className="text-ink/80 hover:text-brass transition-colors focus-ring">
              Orders
            </Link>
          </nav>
        </div>
        {children}
      </div>
    </div>
  );
}
