"use client";

import Link from "next/link";
import { useState } from "react";

const COLUMNS = [
  {
    title: "Brand",
    links: [
      { label: "Our Story", href: "/#story" },
      { label: "Private Viewing", href: "/#viewing" },
      { label: "Contact", href: "mailto:atelier@kestrelwatch.co" },
    ],
  },
  {
    title: "Collection",
    links: [
      { label: "Meridian One", href: "/watches/meridian-one" },
      { label: "Meridian Nocturne", href: "/watches/meridian-nocturne" },
      { label: "Meridian Chrono", href: "/watches/meridian-chrono" },
      { label: "Meridian Atelier", href: "/watches/meridian-atelier" },
      { label: "Meridian Automatic", href: "/watches/meridian-automatic" },
    ],
  },
  {
    title: "Care",
    links: [
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <footer className="border-t border-taupe bg-porcelain-2">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 md:gap-8">
          <div className="col-span-2">
            <p className="font-serif text-xl tracking-[0.15em] uppercase mb-4 text-ink">Kestrel</p>
            <p className="text-sm text-slate max-w-xs leading-relaxed">
              Precision, quietly kept. An independent house of mechanical watchmaking based in
              Alderbrook.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-xs tracking-[0.2em] uppercase text-slate mb-4">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink/75 hover:text-ink transition-colors focus-ring"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-slate mb-4">Newsletter</p>
            {submitted ? (
              <p className="text-sm text-brass">Thank you — you&apos;re on the list.</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) setSubmitted(true);
                }}
                className="flex flex-col gap-3"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="bg-transparent border-b border-taupe pb-2 text-sm text-ink placeholder:text-slate focus:outline-none focus:border-brass transition-colors"
                />
                <button
                  type="submit"
                  className="text-xs tracking-[0.2em] uppercase text-brass text-left hover:text-ink transition-colors focus-ring"
                >
                  Subscribe →
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-taupe flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-slate">
            © {new Date().getFullYear()} Kestrel Watch Co. All rights reserved. A fictional house,
            for demonstration purposes.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-slate hover:text-ink transition-colors">
              Instagram
            </a>
            <a href="#" className="text-xs text-slate hover:text-ink transition-colors">
              Journal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
