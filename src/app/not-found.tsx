import { LinkButton } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <p className="text-xs tracking-[0.3em] uppercase text-brass mb-4">404</p>
      <h1 className="font-serif text-3xl md:text-4xl mb-6 text-balance max-w-lg text-ink">
        This page doesn&apos;t keep time with the rest of the site.
      </h1>
      <LinkButton href="/">Return Home</LinkButton>
    </div>
  );
}
