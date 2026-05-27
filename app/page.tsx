import { HeroV2 } from "@/components/sections/HeroV2";
import { AboutSection } from "@/components/sections/About";
import { ProjectsParallaxSection } from "@/components/sections/ProjectsParallax";

export default function Home() {
  return (
    <main>
      <HeroV2 />
      <AboutSection />
      <ProjectsParallaxSection />
    </main>
  );
}
