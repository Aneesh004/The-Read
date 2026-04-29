import { HeroSection } from "@/components/landing/HeroSection";
import { LatestReleases } from "@/components/landing/LatestReleases";
import { TopPicksThisWeek } from "@/components/landing/TopPicksThisWeek";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { HindiSahitya } from "@/components/landing/HindiSahitya";
import { CompetitionMayhem } from "@/components/landing/CompetitionMayhem";


export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <LatestReleases />
      <TopPicksThisWeek />
      <HindiSahitya />
      <CompetitionMayhem />
    </>
  );
}
