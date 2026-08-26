"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ShoppingBag, User } from "lucide-react";
import { useCartStore } from "@/hooks/useCartStore";
import { useAuthStore } from "@/hooks/useAuthStore";

const LINKS = [
  { label: "Collection", href: "/collection" },
  { label: "Our Story", href: "/#story" },
  { label: "Precision", href: "/#precision" },
];

export default function Nav() {
  const pathname = usePathname();
  const hasDarkHero = pathname === "/";

  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useCartStore((s) => s.cart.itemCount);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!hasDarkHero) return;
    const onScroll = () => setScrolledPastHero(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasDarkHero]);

  // Only the homepage has a dark, full-bleed hero for the nav to float
  // over transparently — everywhere else the page starts light, so the
  // nav should always render in its solid, dark-text state.
  const overDarkHero = hasDarkHero && !scrolledPastHero && !menuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        overDarkHero
          ? "bg-transparent"
          : "bg-porcelain/95 backdrop-blur-md border-b border-taupe"
      }`}
    >
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 h-20 flex items-center justify-between">
        <Link
          href="/"
          className={`font-serif text-lg md:text-xl tracking-[0.15em] uppercase focus-ring ${
            overDarkHero ? "text-porcelain" : "text-ink"
          }`}
          onClick={() => setMenuOpen(false)}
        >
          Kestrel
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative text-sm tracking-wide transition-colors focus-ring ${
                overDarkHero ? "text-porcelain/80 hover:text-porcelain" : "text-ink/75 hover:text-ink"
              }`}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-brass transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-5">
          <Link
            href={user ? "/account" : "/login"}
            className={`hidden sm:flex items-center gap-2 text-sm transition-colors focus-ring ${
              overDarkHero ? "text-porcelain/80 hover:text-porcelain" : "text-ink/75 hover:text-ink"
            }`}
            aria-label="Account"
          >
            <User size={18} strokeWidth={1.5} />
          </Link>
          <Link
            href="/cart"
            className={`relative flex items-center gap-2 text-sm transition-colors focus-ring ${
              overDarkHero ? "text-porcelain/80 hover:text-porcelain" : "text-ink/75 hover:text-ink"
            }`}
            aria-label={`Cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
          >
            <ShoppingBag size={18} strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 rounded-full bg-brass text-porcelain text-[10px] font-medium">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className={`md:hidden focus-ring ${overDarkHero ? "text-porcelain" : "text-ink"}`}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-porcelain border-b border-taupe"
          >
            <nav className="flex flex-col px-6 py-8 gap-6">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-serif text-2xl text-ink focus-ring"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={user ? "/account" : "/login"}
                onClick={() => setMenuOpen(false)}
                className="text-sm tracking-wide text-ink/70 focus-ring"
              >
                {user ? "My Account" : "Login / Sign Up"}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
