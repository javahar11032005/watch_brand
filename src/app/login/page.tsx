"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button } from "@/components/ui/Button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(email, password);
      router.push(searchParams.get("next") ?? "/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in.");
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-40 pb-32 px-6 bg-porcelain min-h-[80vh]">
      <div className="mx-auto max-w-sm">
        <h1 className="font-serif text-4xl mb-2 text-balance text-ink">Welcome back.</h1>
        <p className="text-sm text-slate mb-10">Log in to view your orders and account.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="block text-xs text-slate mb-1.5">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border border-taupe px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-brass transition-colors"
            />
          </label>
          <label className="block">
            <span className="block text-xs text-slate mb-1.5">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-taupe px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-brass transition-colors"
            />
          </label>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Logging in…" : "Log In"}
          </Button>
        </form>

        <p className="mt-8 text-sm text-slate">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brass hover:text-ink transition-colors focus-ring">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
