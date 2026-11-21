"use client";

import { useScreenSize } from "@/hooks/use-screen-size";
import { PixelTrail } from "@/components/ui/pixel-trail";
import { GooeyFilter } from "@/components/ui/gooey-filter";

export function RifPixelTrail() {
  const screenSize = useScreenSize();

  return (
    <>
      <GooeyFilter id="rif-gooey" strength={5} />
      <div
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ filter: "url(#rif-gooey)" }}
      >
        <PixelTrail
          pixelSize={screenSize.lessThan("md") ? 20 : 28}
          fadeDuration={0}
          delay={400}
          pixelClassName="bg-white opacity-80"
        />
      </div>
    </>
  );
}
