import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/layout/Providers";
import Nav from "@/components/navigation/Nav";
import Footer from "@/components/layout/Footer";

const fraunces = Fraunces({
  variable: "--font-serif-ui",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans-ui",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kestrel Watch Co. — Precision, Quietly Kept.",
  description:
    "Kestrel Watch Co. is an independent house of mechanical watchmaking. Explore the Meridian collection, built on the belief that precision is its own form of beauty.",
  metadataBase: new URL("https://kestrelwatch.co"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-porcelain text-ink font-sans">
        <Providers>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
