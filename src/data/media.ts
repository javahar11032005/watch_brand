/**
 * Every non-3D photographic asset on the site is declared here, in one
 * place, so a client's real photography/video can be dropped in later by
 * editing only this file. Everything currently points at free-license
 * stock (Unsplash) sourced for this build, or is intentionally left as a
 * pure CSS treatment where a photo would only dilute the design.
 */

export type MediaAsset = {
  url: string;
  credit: string;
  alt: string;
};

function unsplash(id: string, params = "q=80&w=2000&auto=format&fit=crop"): string {
  return `https://images.unsplash.com/${id}?${params}`;
}

export const media = {
  macro: {
    gears: {
      url: unsplash("photo-1567093322102-6bdd32fba67d"),
      credit: "Jonathan Borba on Unsplash",
      alt: "Macro photograph of assorted precision gears",
    } satisfies MediaAsset,
    movement: {
      url: unsplash("photo-1633451238208-11c8e6c1fed4"),
      credit: "Lukas Tennie on Unsplash",
      alt: "Close-up of a mechanical watch movement",
    } satisfies MediaAsset,
  },
  products: {
    "meridian-one": {
      url: unsplash("photo-1633451238208-11c8e6c1fed4"),
      credit: "Lukas Tennie on Unsplash",
      alt: "Detail of a classic three-hand watch movement",
    } satisfies MediaAsset,
    "meridian-nocturne": {
      url: unsplash("photo-1567093322102-6bdd32fba67d"),
      credit: "Jonathan Borba on Unsplash",
      alt: "Dark-toned macro detail of precision components",
    } satisfies MediaAsset,
    "meridian-chrono": {
      url: unsplash("photo-1598640877587-bd8f35df4021"),
      credit: "Mauro Lima on Unsplash",
      alt: "Black and silver chronograph watch",
    } satisfies MediaAsset,
    "meridian-atelier": {
      url: unsplash("photo-1760532466984-39c3eb7f1254"),
      credit: "Unsplash",
      alt: "Gold-toned minimalist watch worn on the wrist",
    } satisfies MediaAsset,
    "meridian-automatic": {
      url: unsplash("photo-1578934856768-78cbeac965c7"),
      credit: "Aaron Burden on Unsplash",
      alt: "Round watch with a silver case and dark dial",
    } satisfies MediaAsset,
  },
  craftsmanship: {
    machining: {
      url: unsplash("photo-1570207344214-c60ad57f3c00"),
      credit: "Denis Sebastian Tamas on Unsplash",
      alt: "Precision metal lathe in a workshop",
    } satisfies MediaAsset,
    finishing: {
      url: unsplash("photo-1776090188130-26c7253ff423"),
      credit: "LISK OBE on Unsplash",
      alt: "Close-up of a metal lathe finishing a component",
    } satisfies MediaAsset,
    assembly: {
      url: unsplash("photo-1633451238208-11c8e6c1fed4"),
      credit: "Lukas Tennie on Unsplash",
      alt: "Close-up of a watch movement mid-assembly",
    } satisfies MediaAsset,
    testing: {
      url: unsplash("photo-1567093322102-6bdd32fba67d"),
      credit: "Jonathan Borba on Unsplash",
      alt: "Macro detail used to represent precision testing",
    } satisfies MediaAsset,
    wrist: {
      url: unsplash("photo-1760532466984-39c3eb7f1254"),
      credit: "Unsplash",
      alt: "Finished watch worn on the wrist",
    } satisfies MediaAsset,
  },
  /**
   * The single site-level campaign film (hero + "The First Impression").
   * Per-product campaign clips live on the Product record itself
   * (`Product.videoId`, nullable) since they're real catalog data, not
   * brand chrome — components read `product.videoId` directly.
   */
  hero: {
    youtubeId: "gPGjd34M_cM",
    title: "Kestrel — Time, Refined",
    posterAlt: "Cinematic still from the Kestrel campaign film",
    // A verified, always-loading photograph — the guaranteed visual layer.
    // The YouTube film plays on top of this once it genuinely starts; if it
    // never does, this is what stays on screen, not an empty/dark box.
    posterUrl: unsplash("photo-1598640877587-bd8f35df4021", "q=85&w=2400&auto=format&fit=crop"),
  },
} as const;

export type ProductSlug = keyof typeof media.products;

export function productMedia(slug: string): MediaAsset {
  return (
    (media.products as Record<string, MediaAsset>)[slug] ?? media.products["meridian-one"]
  );
}
