import { notFound } from "next/navigation";
import { getOrderById } from "@/services/orderService";
import { getSession } from "@/lib/session";
import { formatPrice, formatDate, labelCaseMaterial, labelDialColor, labelStrapMaterial } from "@/lib/format";
import { LinkButton } from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

type PageProps = {
  searchParams: Promise<{ orderId?: string; paymentUnavailable?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { orderId, paymentUnavailable } = await searchParams;
  if (!orderId) notFound();

  const order = await getOrderById(orderId).catch(() => null);
  if (!order) notFound();

  const session = await getSession();
  const canViewAccountOrder = order.userId && session?.userId === order.userId;

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32 bg-porcelain">
      <div className="mx-auto max-w-2xl px-6 md:px-10 text-center">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">
            Order {order.orderNumber}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl mb-6 text-balance text-ink">
            {order.paymentStatus === "PAID"
              ? "Your timepiece is reserved."
              : "Your order has been received."}
          </h1>

          {paymentUnavailable === "1" && order.paymentStatus !== "PAID" && (
            <p className="text-sm text-brass bg-porcelain-2 border border-taupe px-5 py-4 mb-8 text-left">
              Payment is running in Stripe test mode and hasn&apos;t been configured with live test
              keys yet, so this order is saved as <strong>{order.paymentStatus}</strong>. Add
              <code className="mx-1 text-ink/70">STRIPE_SECRET_KEY</code> /{" "}
              <code className="text-ink/70">STRIPE_WEBHOOK_SECRET</code> to <code className="text-ink/70">.env</code>{" "}
              to complete a real test payment.
            </p>
          )}
        </Reveal>

        <Reveal delay={0.1} className="text-left bg-porcelain-2 p-8 mb-10">
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

          <div className="border-t border-taupe pt-4 space-y-2 text-sm">
            <Row label="Subtotal" value={formatPrice(order.subtotal, order.currency)} />
            <Row
              label="Shipping"
              value={order.shipping === 0 ? "Complimentary" : formatPrice(order.shipping, order.currency)}
            />
            <div className="flex justify-between pt-2 border-t border-taupe mt-2 text-ink">
              <span>Total</span>
              <span className="font-serif text-lg">{formatPrice(order.total, order.currency)}</span>
            </div>
          </div>

          <div className="border-t border-taupe mt-6 pt-6 text-sm text-ink/70 space-y-1">
            <p>{order.shippingName}</p>
            <p>{order.shippingLine1}</p>
            <p>
              {order.shippingCity}, {order.shippingState} {order.shippingPostalCode}
            </p>
            <p>{order.shippingCountry}</p>
            <p className="pt-2 text-slate">Placed {formatDate(order.createdAt)}</p>
          </div>
        </Reveal>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {canViewAccountOrder && <LinkButton href={`/account/orders/${order.id}`}>View Order</LinkButton>}
          <LinkButton href="/collection" variant={canViewAccountOrder ? "secondary" : "primary"}>
            Continue Exploring
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-slate">
      <span>{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
