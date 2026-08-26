import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { listOrdersForUser } from "@/services/orderService";
import { formatPrice, formatDate } from "@/lib/format";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import LogoutButton from "@/components/account/LogoutButton";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = { title: "My Account — Kestrel Watch Co." };

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const orders = await listOrdersForUser(user.id);

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32 bg-porcelain">
      <div className="mx-auto max-w-[1000px] px-6 md:px-10">
        <div className="flex items-start justify-between mb-14">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">My Account</p>
            <h1 className="font-serif text-4xl md:text-5xl text-balance text-ink">{user.name}</h1>
            <p className="text-sm text-slate mt-2">{user.email}</p>
          </div>
          <LogoutButton />
        </div>

        <h2 className="font-serif text-2xl mb-6 text-ink">My Orders</h2>

        {orders.length === 0 ? (
          <div className="border border-taupe p-10 text-center">
            <p className="text-ink/70 mb-6">You haven&apos;t placed an order yet.</p>
            <LinkButton href="/collection">Explore Collection</LinkButton>
          </div>
        ) : (
          <div className="divide-y divide-taupe border-y border-taupe">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-6 hover:bg-porcelain-2 transition-colors px-2 -mx-2 focus-ring"
              >
                <div>
                  <p className="text-sm text-ink">{order.orderNumber}</p>
                  <p className="text-xs text-slate mt-1">
                    {formatDate(order.createdAt)} · {order.items.length} item
                    {order.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-sm w-24 text-right text-ink">{formatPrice(order.total, order.currency)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
