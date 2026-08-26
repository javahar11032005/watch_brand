import Hero from "@/components/hero/Hero";
import VideoSection from "@/components/video/VideoSection";
import WatchIntro from "@/components/story/WatchIntro";
import ScrollStory from "@/components/story/ScrollStory";
import CraftsmanshipJourney from "@/components/craftsmanship/CraftsmanshipJourney";
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
      <WatchIntro />
      <ScrollStory />
      <CraftsmanshipJourney />
      <PrecisionStats />
      <CollectionTeaser />
      <ConfiguratorSection />
      <FinalCta />
    </>
  );
}
