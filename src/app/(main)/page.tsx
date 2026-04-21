import { HeroSection } from "@/components/landing/HeroSection";
import { LatestReleases } from "@/components/landing/LatestReleases";
import { TopPicksThisWeek } from "@/components/landing/TopPicksThisWeek";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CommunitySpotlight } from "@/components/landing/CommunitySpotlight";


export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <LatestReleases />
      <TopPicksThisWeek />
      <CommunitySpotlight />

    </>
  );
}
