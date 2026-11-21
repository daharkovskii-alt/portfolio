import { HeroSection } from "@/components/sections/Hero";
import { AboutSection } from "@/components/sections/About";
import { ProjectsParallaxSection } from "@/components/sections/ProjectsParallax";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <ProjectsParallaxSection />
    </main>
  );
}
