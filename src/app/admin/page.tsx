import { requireAdminPage } from "@/lib/page-guards";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";

export default async function AdminDashboard() {
  await requireAdminPage("/admin");

  const [productCount, orderCount, paidOrders] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({ where: { paymentStatus: "PAID" }, select: { total: true } }),
  ]);

  const revenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Products", value: productCount },
    { label: "Orders", value: orderCount },
    { label: "Paid Revenue", value: formatPrice(revenue) },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl mb-10 text-ink">Dashboard</h1>
      <div className="grid sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-taupe p-6">
            <p className="text-xs tracking-[0.2em] uppercase text-slate mb-3">{stat.label}</p>
            <p className="font-serif text-3xl text-ink">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
