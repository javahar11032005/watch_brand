"use client";

import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Tone = "light" | "dark";

const VARIANT_CLASSES: Record<Tone, Record<Variant, string>> = {
  light: {
    primary: "bg-ink text-porcelain hover:bg-brass",
    secondary: "border border-ink/25 text-ink hover:border-brass hover:text-brass",
    ghost: "text-ink/70 hover:text-brass",
  },
  dark: {
    primary: "bg-porcelain text-charcoal hover:bg-champagne",
    secondary: "border border-porcelain/30 text-porcelain hover:border-champagne hover:text-champagne",
    ghost: "text-porcelain/80 hover:text-champagne",
  },
};

const base =
  "inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs tracking-[0.2em] uppercase transition-colors duration-300 focus-ring disabled:opacity-40 disabled:pointer-events-none";

type CommonProps = { variant?: Variant; tone?: Tone; children: ReactNode; className?: string };

export function Button({
  variant = "primary",
  tone = "light",
  children,
  className = "",
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`${base} ${VARIANT_CLASSES[tone][variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export const LinkButton = forwardRef<
  HTMLAnchorElement,
  CommonProps & { href: string; target?: string; rel?: string }
>(({ variant = "primary", tone = "light", children, className = "", href, ...rest }, ref) => (
  <Link
    ref={ref}
    href={href}
    className={`${base} ${VARIANT_CLASSES[tone][variant]} ${className}`}
    {...rest}
  >
    {children}
  </Link>
));
LinkButton.displayName = "LinkButton";
