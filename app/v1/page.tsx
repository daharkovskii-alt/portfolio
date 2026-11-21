import { HeroV1 } from "@/components/sections/HeroV1";
import { AboutSection } from "@/components/sections/About";
import { ProjectsSection } from "@/components/sections/Projects";

export default function V1Page() {
  return (
    <main>
      <HeroV1 />
      <AboutSection />
      <ProjectsSection />
    </main>
  );
}
