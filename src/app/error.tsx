"use client";

import { useEffect } from "react";
import { LinkButton } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">Something went wrong</p>
      <h1 className="font-serif text-3xl md:text-4xl mb-6 text-balance max-w-lg text-ink">
        The atelier hit an unexpected snag.
      </h1>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="px-7 py-3.5 text-xs tracking-[0.2em] uppercase text-ink border border-ink/25 hover:border-brass hover:text-brass transition-colors focus-ring"
        >
          Try Again
        </button>
        <LinkButton href="/">Return Home</LinkButton>
      </div>
    </div>
  );
}
