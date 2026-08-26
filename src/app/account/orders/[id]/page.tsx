import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/dal";
import { getOrderById } from "@/services/orderService";
import { formatPrice, formatDate, labelCaseMaterial, labelDialColor, labelStrapMaterial } from "@/lib/format";
import OrderStatusBadge from "@/components/account/OrderStatusBadge";

const TIMELINE_STEPS = ["PROCESSING", "CONFIRMED", "SHIPPED", "DELIVERED"] as const;

type PageProps = { params: Promise<{ id: string }> };

export default async function OrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=/account/orders/${id}`);

  const order = await getOrderById(id).catch(() => null);
  if (!order || order.userId !== user.id) notFound();

  const currentStepIndex = TIMELINE_STEPS.indexOf(order.status as (typeof TIMELINE_STEPS)[number]);
  const isCancelled = order.status === "CANCELLED";

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32 bg-porcelain">
      <div className="mx-auto max-w-[800px] px-6 md:px-10">
        <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">
          Order {order.orderNumber}
        </p>
        <h1 className="font-serif text-4xl mb-8 text-balance text-ink">Order Details</h1>

        {!isCancelled && (
          <div className="flex items-center mb-14">
            {TIMELINE_STEPS.map((step, i) => (
              <div key={step} className="flex-1 flex items-center last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      i <= currentStepIndex ? "bg-brass" : "bg-porcelain-3 border border-taupe"
                    }`}
                  />
                  <p className="mt-2 text-[10px] tracking-widest uppercase text-slate whitespace-nowrap">
                    {step}
                  </p>
                </div>
                {i < TIMELINE_STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-px mx-2 ${i < currentStepIndex ? "bg-brass" : "bg-taupe"}`}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        {isCancelled && (
          <div className="mb-14">
            <OrderStatusBadge status="CANCELLED" />
          </div>
        )}

        <div className="bg-porcelain-2 p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <OrderStatusBadge status={order.status} />
            <OrderStatusBadge status={order.paymentStatus} />
          </div>

          <div className="space-y-4 mb-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm gap-4">
                <div>
                  <p className="text-ink">Kestrel {item.productName} × {item.quantity}</p>
                  <p className="text-xs text-slate">
                    {labelCaseMaterial(item.caseMaterial)} · {labelDialColor(item.dialColor)} Dial ·{" "}
                    {labelStrapMaterial(item.strapMaterial)}
                  </p>
                </div>
                <p className="shrink-0 text-ink">{formatPrice(item.unitPrice * item.quantity, order.currency)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-taupe pt-4 text-sm space-y-1">
            <div className="flex justify-between text-slate">
              <span>Subtotal</span>
              <span className="text-ink">{formatPrice(order.subtotal, order.currency)}</span>
            </div>
            <div className="flex justify-between text-slate">
              <span>Shipping</span>
              <span className="text-ink">
                {order.shipping === 0 ? "Complimentary" : formatPrice(order.shipping, order.currency)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-taupe mt-2 text-ink">
              <span>Total</span>
              <span className="font-serif text-lg">{formatPrice(order.total, order.currency)}</span>
            </div>
          </div>
        </div>

        <div className="text-sm text-ink/70 space-y-1">
          <p className="text-xs tracking-[0.2em] uppercase text-slate mb-2">Shipping To</p>
          <p>{order.shippingName}</p>
          <p>{order.shippingLine1}</p>
          <p>
            {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
          </p>
          <p>{order.shippingCountry}</p>
          <p className="pt-3 text-slate">Placed {formatDate(order.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
