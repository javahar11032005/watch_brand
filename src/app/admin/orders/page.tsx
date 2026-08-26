import { requireAdminPage } from "@/lib/page-guards";
import { listAllOrdersForAdmin } from "@/services/orderService";
import { formatPrice, formatDate } from "@/lib/format";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminOrdersPage() {
  await requireAdminPage("/admin/orders");

  const orders = await listAllOrdersForAdmin();

  return (
    <div>
      <h1 className="font-serif text-3xl mb-10 text-ink">Orders</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[900px]">
          <thead>
            <tr className="border-b border-taupe text-left text-xs tracking-[0.15em] uppercase text-slate">
              <th className="py-3 pr-4">Order</th>
              <th className="py-3 pr-4">Customer</th>
              <th className="py-3 pr-4">Date</th>
              <th className="py-3 pr-4">Total</th>
              <th className="py-3 pr-4">Payment</th>
              <th className="py-3 pr-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-taupe text-ink">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="py-4 pr-4">{order.orderNumber}</td>
                <td className="py-4 pr-4">
                  <p>{order.user?.name ?? order.shippingName}</p>
                  <p className="text-xs text-slate">{order.user?.email ?? order.shippingEmail}</p>
                </td>
                <td className="py-4 pr-4 text-xs text-slate">{formatDate(order.createdAt)}</td>
                <td className="py-4 pr-4">{formatPrice(order.total, order.currency)}</td>
                <td className="py-4 pr-4">
                  <OrderStatusBadge status={order.paymentStatus} />
                </td>
                <td className="py-4 pr-4">
                  <OrderStatusSelect orderId={order.id} status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
