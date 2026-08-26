import Hero from "@/components/hero/Hero";
import VideoSection from "@/components/video/VideoSection";
import OurStory from "@/components/story/OurStory";
import PrecisionStats from "@/components/craftsmanship/PrecisionStats";
import CollectionTeaser from "@/components/collection/CollectionTeaser";
import ConfiguratorSection from "@/components/configurator/ConfiguratorSection";
import FinalCta from "@/components/hero/FinalCta";

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Hero />
      <VideoSection />
      <OurStory />
      <PrecisionStats />
      <CollectionTeaser />
      <ConfiguratorSection />
      <FinalCta />
    </>
  );
}
