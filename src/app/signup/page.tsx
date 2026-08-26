"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/hooks/useAuthStore";
import { Button } from "@/components/ui/Button";

export default function SignupPage() {
  const router = useRouter();
  const register = useAuthStore((s) => s.register);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register(name, email, password);
      router.push("/account");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create your account.");
      setSubmitting(false);
    }
  }

  return (
    <div className="pt-40 pb-32 px-6 bg-porcelain min-h-[80vh]">
      <div className="mx-auto max-w-sm">
        <h1 className="font-serif text-4xl mb-2 text-balance text-ink">Create an account.</h1>
        <p className="text-sm text-slate mb-10">
          Track your orders and save your details for next time.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="block text-xs text-slate mb-1.5">Full Name</span>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent border border-taupe px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-brass transition-colors"
            />
          </label>
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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border border-taupe px-3.5 py-2.5 text-sm text-ink focus:outline-none focus:border-brass transition-colors"
            />
            <span className="block text-xs text-slate mt-1.5">
              At least 8 characters, with a letter and a number.
            </span>
          </label>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Creating account…" : "Create Account"}
          </Button>
        </form>

        <p className="mt-8 text-sm text-slate">
          Already have an account?{" "}
          <Link href="/login" className="text-brass hover:text-ink transition-colors focus-ring">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
