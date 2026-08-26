"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/hooks/useCartStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import { api } from "@/lib/api-client";
import { formatPrice, variantSummary } from "@/lib/format";
import { Button, LinkButton } from "@/components/ui/Button";

type ShippingForm = {
  name: string;
  email: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

const EMPTY_FORM: ShippingForm = {
  name: "",
  email: "",
  phone: "",
  line1: "",
  city: "",
  state: "",
  postalCode: "",
  country: "United States",
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, hasFetched, fetchCart } = useCartStore();
  const user = useAuthStore((s) => s.user);

  const [form, setForm] = useState<ShippingForm>(EMPTY_FORM);
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    // Intentional: prefill from the async-loaded session once, the fields
    // stay freely editable afterward — this isn't a value we can compute in
    // the initial useState() since `user` resolves after first render.
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((f) => ({ ...f, name: user.name, email: user.email }));
    }
  }, [user]);

  if (hasFetched && cart.items.length === 0) {
    return (
      <div className="pt-40 pb-32 text-center px-6 bg-porcelain">
        <p className="font-serif text-3xl mb-6 text-ink">Your cart is empty.</p>
        <LinkButton href="/collection">Explore Collection</LinkButton>
      </div>
    );
  }

  function update<K extends keyof ShippingForm>(key: K, value: ShippingForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const { order } = await api.post<{ order: { id: string } }>("/api/orders", {
        shipping: form,
        createAccount: !user && createAccount,
        password: !user && createAccount ? password : undefined,
      });

      try {
        const { url } = await api.post<{ url: string }>("/api/payments/create-session", {
          orderId: order.id,
        });
        window.location.href = url;
      } catch {
        router.push(`/checkout/success?orderId=${order.id}&paymentUnavailable=1`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  const shippingCost = cart.subtotal >= 200_000 ? 0 : 4_500;
  const total = cart.subtotal + shippingCost;

  return (
    <div className="pt-32 pb-24 md:pt-40 md:pb-32 bg-porcelain">
      <div className="mx-auto max-w-[1200px] px-6 md:px-10 grid lg:grid-cols-[1.2fr_1fr] gap-16">
        <div>
          <h1 className="font-serif text-4xl md:text-5xl mb-3 text-balance text-ink">Checkout</h1>
          {!user && (
            <p className="text-sm text-slate mb-10">
              Checking out as a guest.{" "}
              <Link href="/login?next=/checkout" className="text-brass hover:text-ink transition-colors focus-ring">
                Log in
              </Link>{" "}
              if you have an account.
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <fieldset className="space-y-4">
              <legend className="text-xs tracking-[0.2em] uppercase text-brass mb-2">
                Contact & Shipping
              </legend>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full Name" value={form.name} onChange={(v) => update("name", v)} required />
                <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
              </div>
              <Field label="Phone" type="tel" value={form.phone} onChange={(v) => update("phone", v)} required />
              <Field label="Street Address" value={form.line1} onChange={(v) => update("line1", v)} required />
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="City" value={form.city} onChange={(v) => update("city", v)} required />
                <Field label="State / Province" value={form.state} onChange={(v) => update("state", v)} required />
                <Field label="Postal Code" value={form.postalCode} onChange={(v) => update("postalCode", v)} required />
              </div>
              <Field label="Country" value={form.country} onChange={(v) => update("country", v)} required />
            </fieldset>

            {!user && (
              <fieldset>
                <label className="flex items-center gap-3 text-sm text-ink/80 mb-3">
                  <input
                    type="checkbox"
                    checked={createAccount}
                    onChange={(e) => setCreateAccount(e.target.checked)}
                    className="accent-brass"
                  />
                  Create an account to track future orders
                </label>
                {createAccount && (
                  <Field
                    label="Password"
                    type="password"
                    value={password}
                    onChange={setPassword}
                    required
                  />
                )}
              </fieldset>
            )}

            {error && <p className="text-sm text-red-700">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? "Processing…" : "Proceed to Payment"}
            </Button>
          </form>
        </div>

        <div className="bg-porcelain-2 p-8 h-fit">
          <p className="text-xs tracking-[0.2em] uppercase text-brass mb-6">Order Summary</p>
          <div className="space-y-5 mb-6">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm gap-4">
                <div>
                  <p className="text-ink">{item.product.name} × {item.quantity}</p>
                  <p className="text-xs text-slate">{variantSummary(item.variant)}</p>
                </div>
                <p className="shrink-0 text-ink">{formatPrice(item.lineTotal)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-taupe pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate">
              <span>Subtotal</span>
              <span className="text-ink">{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate">
              <span>Shipping</span>
              <span className="text-ink">{shippingCost === 0 ? "Complimentary" : formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between text-base pt-2 border-t border-taupe mt-2 text-ink">
              <span>Total</span>
              <span className="font-serif text-lg">{formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-slate mb-1.5">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border border-taupe px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-brass transition-colors"
      />
    </label>
  );
}
