"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True once the element has intersected the viewport at least once, and
 * stays true afterward (used to lazily start players/effects, not to pause
 * them again on scroll-away — see individual callers for pause behavior).
 */
export function useInView(ref: RefObject<Element | null>, options?: IntersectionObserverInit): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (inView || !ref.current) return;
    const el = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      options
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, inView]);

  return inView;
}
