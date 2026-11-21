import type { Metadata } from "next";
import { IndiamallFinalContent } from "@/components/sections/IndiamallFinalContent";
import { ProjectContent } from "@/components/sections/ProjectContent";
import { DionisContent } from "@/components/sections/DionisContent";
import { DionisContentV2 } from "@/components/sections/DionisContentV2";
import { RifContent } from "@/components/sections/RifContent";
import { RifContentV2 } from "@/components/sections/RifContentV2";
import { RifRetro } from "@/components/sections/RifRetro";
import { UniversmagContent } from "@/components/sections/UniversmagContent";
import { ShortWorksContent } from "@/components/sections/ShortWorksContent";

interface Props {
  params: Promise<{ slug: string }>;
}

const titles: Record<string, string> = {
  "indiamall-final": "Indiamall — D.KHARKOVSKIY",
  "project-02": "DIONIS Jewelry — D.KHARKOVSKIY",
  "dionis-v2":  "DIONIS Jewelry v2 — D.KHARKOVSKIY",
  "project-03": "РИФ 2025 — D.KHARKOVSKIY",
  "rif-v2":     "РИФ 2025 v2 — D.KHARKOVSKIY",
  "rif-retro":  "РИФ 2025 RETRO — D.KHARKOVSKIY",
  "project-05": "Short Works — D.KHARKOVSKIY",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: titles[slug] ?? `${slug.replace(/-/g, " ").toUpperCase()} — D.KHARKOVSKIY` };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "indiamall-final") return <IndiamallFinalContent />;
  if (slug === "project-02") return <DionisContent />;
  if (slug === "dionis-v2")  return <DionisContentV2 />;
  if (slug === "project-03") return <RifContent />;
  if (slug === "rif-v2")     return <RifContentV2 />;
  if (slug === "rif-retro")  return <RifRetro />;
  if (slug === "concept-univermag") return <UniversmagContent />;
  if (slug === "project-05") return <ShortWorksContent />;
  return <ProjectContent slug={slug} />;
}
