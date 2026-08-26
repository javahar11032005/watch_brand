import Hero from "@/components/hero/Hero";
import BrandPhilosophy from "@/components/story/BrandPhilosophy";
import PrecisionStats from "@/components/craftsmanship/PrecisionStats";
import CollectionTeaser from "@/components/collection/CollectionTeaser";
import FinalCta from "@/components/hero/FinalCta";

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Hero />
      <BrandPhilosophy />
      <PrecisionStats />
      <CollectionTeaser />
      <FinalCta />
    </>
  );
}
