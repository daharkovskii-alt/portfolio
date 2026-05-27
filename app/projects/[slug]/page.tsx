import type { Metadata } from "next";
import { IndiamallFinalContent } from "@/components/sections/IndiamallFinalContent";
import { DionisContent } from "@/components/sections/DionisContent";
import { RifContentV2 } from "@/components/sections/RifContentV2";
import { UniversmagContent } from "@/components/sections/UniversmagContent";
import { ShortWorksContent } from "@/components/sections/ShortWorksContent";

interface Props {
  params: Promise<{ slug: string }>;
}

const titles: Record<string, string> = {
  "indiamall-final": "Indiamall — D.KHARKOVSKIY",
  "project-02": "DIONIS Jewelry — D.KHARKOVSKIY",
  "rif-v2":     "РИФ 2025 — D.KHARKOVSKIY",
  "concept-univermag": "Универмаг — D.KHARKOVSKIY",
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
  if (slug === "rif-v2")     return <RifContentV2 />;
  if (slug === "concept-univermag") return <UniversmagContent />;
  if (slug === "project-05") return <ShortWorksContent />;
  return null;
}
