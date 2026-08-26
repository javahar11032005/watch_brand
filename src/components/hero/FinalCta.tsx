"use client";

import { useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { Button, LinkButton } from "@/components/ui/Button";
import CinematicVideo from "@/components/video/CinematicVideo";
import { media } from "@/data/media";

export default function FinalCta() {
  const [requested, setRequested] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <section id="viewing" className="relative py-28 md:py-44 bg-charcoal overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <CinematicVideo
          videoSrc={media.hero.videoSrc}
          posterUrl={media.hero.posterUrl}
          posterAlt={media.hero.posterAlt}
          mode="background"
          className="absolute inset-0"
          title="Meridian Atelier"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/40" />

      <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
        <Reveal>
          <p className="text-xs tracking-[0.3em] uppercase text-champagne mb-6">Ownership</p>
          <h2 className="font-serif text-4xl md:text-6xl leading-tight text-balance mb-6">
            Own a moment that lasts.
          </h2>
          <p className="text-ivory/70 leading-relaxed mb-10 max-w-md mx-auto">
            Discover the collection and experience the craft behind every second — or arrange a
            private viewing at the Alderbrook atelier.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <LinkButton href="/collection" tone="dark">Explore Collection</LinkButton>
          <LinkButton href="#viewing-form" variant="secondary" tone="dark">
            Request a Private Viewing
          </LinkButton>
        </Reveal>

        <Reveal delay={0.2} id="viewing-form">
          {requested ? (
            <p className="text-sm text-champagne">
              Thank you — the atelier will be in touch within two business days.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setRequested(true);
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-transparent border border-ivory/25 px-4 py-3 text-sm placeholder:text-gray-muted focus:outline-none focus:border-champagne transition-colors"
              />
              <Button type="submit" variant="secondary" tone="dark">
                Request Viewing
              </Button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
