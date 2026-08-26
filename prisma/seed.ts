import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const CASE_MODIFIER: Record<string, number> = {
  STEEL: 0,
  TITANIUM: 40_000,
  ROSE_GOLD: 180_000,
};

const STRAP_MODIFIER: Record<string, number> = {
  LEATHER: 0,
  RUBBER: 0,
  STEEL_BRACELET: 35_000,
};

const CASE_MATERIALS = ["STEEL", "TITANIUM", "ROSE_GOLD"] as const;
const DIAL_COLORS = ["IVORY", "MIDNIGHT", "SILVER"] as const;
const STRAP_MATERIALS = ["LEATHER", "STEEL_BRACELET", "RUBBER"] as const;

function buildVariants(
  productCode: string,
  defaultCombo: { caseMaterial: string; dialColor: string; strapMaterial: string }
) {
  const variants = [];
  for (const caseMaterial of CASE_MATERIALS) {
    for (const dialColor of DIAL_COLORS) {
      for (const strapMaterial of STRAP_MATERIALS) {
        const isDefault =
          caseMaterial === defaultCombo.caseMaterial &&
          dialColor === defaultCombo.dialColor &&
          strapMaterial === defaultCombo.strapMaterial;
        variants.push({
          sku: `${productCode}-${caseMaterial.slice(0, 2)}-${dialColor.slice(0, 2)}-${strapMaterial.slice(0, 2)}`,
          caseMaterial,
          dialColor,
          strapMaterial,
          priceModifier: CASE_MODIFIER[caseMaterial] + STRAP_MODIFIER[strapMaterial],
          stock: isDefault ? 14 : Math.floor(Math.random() * 6) + 2,
          isDefault,
        });
      }
    }
  }
  return variants;
}

const IMG = {
  meridianOne: "https://images.unsplash.com/photo-1633451238208-11c8e6c1fed4?q=80&w=2000&auto=format&fit=crop",
  meridianNocturne: "https://images.unsplash.com/photo-1567093322102-6bdd32fba67d?q=80&w=2000&auto=format&fit=crop",
  meridianChrono: "https://images.unsplash.com/photo-1598640877587-bd8f35df4021?q=80&w=2000&auto=format&fit=crop",
  meridianAtelier: "https://images.unsplash.com/photo-1760532466984-39c3eb7f1254?q=80&w=2000&auto=format&fit=crop",
  meridianAutomatic: "https://images.unsplash.com/photo-1578934856768-78cbeac965c7?q=80&w=2000&auto=format&fit=crop",
  gears: "https://images.unsplash.com/photo-1567093322102-6bdd32fba67d?q=80&w=2000&auto=format&fit=crop",
  movement: "https://images.unsplash.com/photo-1633451238208-11c8e6c1fed4?q=80&w=2000&auto=format&fit=crop",
};

// YouTube video ids used as campaign/product references — see src/data/media.ts
// for the single place these get swapped for client-provided footage later.
// Non-null values are just a "this product has a Watch Film" flag —
// productVideoSrc() maps the product's slug to its own local mp4 under
// /public/videos/watches, it does not use these strings as literal ids.
const VIDEO_IDS = {
  meridianOne: "ZQLN2LVZKzo",
  meridianNocturne: "oNWCa4BZDkY",
  meridianChrono: "7BPiU_TMo00",
  meridianAtelier: "ELodtdn2MlU",
  meridianAutomatic: "kQ8Gk9CBu6E",
};

const PRODUCTS = [
  {
    slug: "meridian-one",
    name: "Meridian One",
    subtitle: "The house's core expression",
    description:
      "A classic three-hand watch built around proportion rather than ornament — the reference every other Meridian is measured against.",
    story:
      "Meridian One began as an argument for restraint. Where the workshop's early sketches layered on complication after complication, the final case was stripped back until only what mattered remained: a legible dial, a case that disappears on the wrist, and a movement finished as carefully on the inside as the case is on the outside.",
    collectionKey: "meridian",
    basePrice: 480_000,
    currency: "usd",
    movementType: "Automatic",
    calibre: "Kestrel Cal. KW100",
    powerReserveHours: 48,
    frequencyHz: 4,
    jewelCount: 26,
    caseDiameterMm: 39,
    caseThicknessMm: 10.8,
    caseFinish: "Brushed Sides, Polished Bevels",
    waterResistanceAtm: 5,
    dialFinish: "Sunray Brushed, Ivory",
    hourMarkers: "Applied Baton Indexes, Rhodium-Plated",
    handsType: "Dauphine, Rhodium-Plated",
    strapClasp: "Pin Buckle, Brushed Steel",
    strapFinish: "Hand-Stitched Edges",
    complications: ["Date"],
    heroImageUrl: IMG.meridianOne,
    galleryImageUrls: [IMG.meridianOne, IMG.movement, IMG.gears],
    videoId: VIDEO_IDS.meridianOne,
    isFeatured: true,
    defaultCombo: { caseMaterial: "STEEL", dialColor: "IVORY", strapMaterial: "LEATHER" },
  },
  {
    slug: "meridian-nocturne",
    name: "Meridian Nocturne",
    subtitle: "A dark, contemporary reading of the house line",
    description:
      "Meridian Nocturne trades the ivory dial for midnight and adds a second time zone for those who keep one eye on somewhere else.",
    story:
      "Nocturne was designed at the end of the day rather than the start of it — for the hour when a second time zone actually matters. The dial is cut from a single blackened disc rather than plated, so the depth stays true under any light, and the dual-time hand is finished in the same champagne accent that runs through the whole collection.",
    collectionKey: "meridian",
    basePrice: 560_000,
    currency: "usd",
    movementType: "Automatic",
    calibre: "Kestrel Cal. KW210",
    powerReserveHours: 60,
    frequencyHz: 4,
    jewelCount: 31,
    caseDiameterMm: 40,
    caseThicknessMm: 11.2,
    caseFinish: "Full Titanium Bead-Blast",
    waterResistanceAtm: 10,
    dialFinish: "Deep Lacquered Midnight",
    hourMarkers: "Recessed Baton Indexes, Luminous",
    handsType: "Skeletonised, Champagne-Filled",
    strapClasp: "Deployment Clasp, Titanium",
    strapFinish: "Vulcanised Matte",
    complications: ["Dual Time", "Date"],
    heroImageUrl: IMG.meridianNocturne,
    galleryImageUrls: [IMG.meridianNocturne, IMG.gears, IMG.movement],
    videoId: VIDEO_IDS.meridianNocturne,
    isFeatured: true,
    defaultCombo: { caseMaterial: "TITANIUM", dialColor: "MIDNIGHT", strapMaterial: "RUBBER" },
  },
  {
    slug: "meridian-chrono",
    name: "Meridian Chrono",
    subtitle: "The precision-focused chronograph",
    description:
      "A column-wheel chronograph built for reading elapsed time at a glance, with a tachymeter scale set quietly into the flange rather than the dial.",
    story:
      "Most chronographs are designed to be looked at. Meridian Chrono was designed to be read — sub-dials sized and spaced by how quickly the eye can find them under pressure, not by how they photograph. The column-wheel mechanism was chosen over a cam-switching system for the cleaner pusher feel it gives at the wrist.",
    collectionKey: "meridian",
    basePrice: 690_000,
    currency: "usd",
    movementType: "Automatic Chronograph",
    calibre: "Kestrel Cal. KW330",
    powerReserveHours: 52,
    frequencyHz: 4,
    jewelCount: 37,
    caseDiameterMm: 41,
    caseThicknessMm: 13.4,
    caseFinish: "Brushed Lugs, Polished Case Flank",
    waterResistanceAtm: 10,
    dialFinish: "Stepped Silver Sub-Dials",
    hourMarkers: "Printed Baton Indexes with Tachymeter Flange",
    handsType: "Faceted Baton, Rhodium-Plated",
    strapClasp: "Fold-Over Deployment, Steel",
    strapFinish: "Brushed Center Links",
    complications: ["Chronograph", "Tachymeter", "Date"],
    heroImageUrl: IMG.meridianChrono,
    galleryImageUrls: [IMG.meridianChrono, IMG.movement, IMG.gears],
    videoId: VIDEO_IDS.meridianChrono,
    isFeatured: true,
    defaultCombo: { caseMaterial: "STEEL", dialColor: "SILVER", strapMaterial: "STEEL_BRACELET" },
  },
  {
    slug: "meridian-atelier",
    name: "Meridian Atelier",
    subtitle: "The most refined expression of the house",
    description:
      "The flagship reference: an openworked dial that exposes the finishing normally hidden behind a solid face, with power-reserve and moon-phase indication.",
    story:
      "Atelier is the one reference every finisher at Kestrel asks to work on. With nothing to hide the movement behind, every bevel, every polished screw head, every drawn bridge has to hold up to direct daylight. It takes roughly three times as long to finish as Meridian One — time the workshop considers well spent.",
    collectionKey: "meridian",
    basePrice: 1_240_000,
    currency: "usd",
    movementType: "Automatic, Openworked",
    calibre: "Kestrel Cal. KW480",
    powerReserveHours: 72,
    frequencyHz: 4,
    jewelCount: 42,
    caseDiameterMm: 40,
    caseThicknessMm: 9.8,
    caseFinish: "Polished Rose Gold, Hand-Chamfered",
    waterResistanceAtm: 3,
    dialFinish: "Openworked, Hand-Bevelled Bridges",
    hourMarkers: "Applied Rose Gold Batons",
    handsType: "Skeletonised Dauphine, Rose Gold-Plated",
    strapClasp: "Pin Buckle, Rose Gold-Plated",
    strapFinish: "Hand-Burnished Edges",
    complications: ["Power Reserve Indicator", "Moon Phase", "Openworked Dial"],
    heroImageUrl: IMG.meridianAtelier,
    galleryImageUrls: [IMG.meridianAtelier, IMG.gears, IMG.movement],
    videoId: VIDEO_IDS.meridianAtelier,
    isFeatured: true,
    defaultCombo: { caseMaterial: "ROSE_GOLD", dialColor: "IVORY", strapMaterial: "LEATHER" },
  },
  {
    slug: "meridian-automatic",
    name: "Meridian Automatic",
    subtitle: "The lightest expression of the house",
    description:
      "A slimmer, quieter reference for daily wear — Automatic trades presence for proportion, built for the wrist that wears a watch every day rather than for occasion.",
    story:
      "Meridian Automatic came out of a simple complaint from the workshop's own watchmakers: Meridian One, worn every day, started to feel like a decision rather than a habit. Automatic is ten percent smaller and two millimetres thinner, with a dial texture borrowed from Atelier but none of its complication — an everyday watch that still says something.",
    collectionKey: "meridian",
    basePrice: 420_000,
    currency: "usd",
    movementType: "Automatic",
    calibre: "Kestrel Cal. KW090",
    powerReserveHours: 44,
    frequencyHz: 4,
    jewelCount: 24,
    caseDiameterMm: 37,
    caseThicknessMm: 9.6,
    caseFinish: "Fully Polished, Slim Profile",
    waterResistanceAtm: 5,
    dialFinish: "Matte Silver, Grained",
    hourMarkers: "Printed Minute Track, Applied Batons at Cardinals",
    handsType: "Slim Baton, Polished Steel",
    strapClasp: "Pin Buckle, Polished Steel",
    strapFinish: "Fine-Grain Calfskin Edge",
    complications: ["Date"],
    heroImageUrl: IMG.meridianAutomatic,
    galleryImageUrls: [IMG.meridianAutomatic, IMG.gears],
    videoId: VIDEO_IDS.meridianAutomatic,
    isFeatured: true,
    defaultCombo: { caseMaterial: "STEEL", dialColor: "SILVER", strapMaterial: "LEATHER" },
  },
];

async function main() {
  console.log("Seeding Kestrel Watch Co. …");

  const adminPasswordHash = await bcrypt.hash("AdminKestrel2026!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@kestrelwatch.co" },
    update: {},
    create: {
      name: "Kestrel Admin",
      email: "admin@kestrelwatch.co",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  const demoPasswordHash = await bcrypt.hash("DemoKestrel2026!", 12);
  const demo = await prisma.user.upsert({
    where: { email: "demo@kestrelwatch.co" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "demo@kestrelwatch.co",
      passwordHash: demoPasswordHash,
      role: "USER",
    },
  });

  for (const p of PRODUCTS) {
    const { defaultCombo, ...productData } = p;

    const existing = await prisma.product.findUnique({ where: { slug: productData.slug } });
    if (existing) {
      // Re-running the seed refreshes copy/media/video without touching
      // variants, so admin-adjusted stock/pricing isn't clobbered.
      await prisma.product.update({ where: { slug: productData.slug }, data: productData });
      continue;
    }

    const variants = buildVariants(
      productData.slug.split("-")[1]!.slice(0, 3).toUpperCase(),
      defaultCombo
    );

    await prisma.product.create({
      data: {
        ...productData,
        variants: { create: variants },
      },
    });
  }

  console.log(`Seeded admin (${admin.email}), demo user (${demo.email}), and ${PRODUCTS.length} watches.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
