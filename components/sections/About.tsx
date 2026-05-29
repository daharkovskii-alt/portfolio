"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VariableProximity from "@/components/ui/VariableProximity";

const LINES = [
  "7 лет делаю узнаваемый дизайн, который собирает взгляды",
  "и влияет на метрики",
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 72%" } }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" style={{ backgroundColor: "var(--c-bg)", padding: "24px clamp(24px, 5vw, 40px) clamp(32px, 5vw, 48px)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          ref={headingRef}
          style={{ textAlign: "center", fontSize: "clamp(22px, 5.5vw, 38px)", lineHeight: "115%", fontWeight: 300, color: "var(--c-fg)" }}
        >
          {LINES.map((line) => (
            <span key={line} style={{ display: "block" }}>
              <VariableProximity
                label={line}
                containerRef={headingRef}
                radius={200}
                falloff="gaussian"
                fromFontVariationSettings="'wght' 300"
                toFontVariationSettings="'wght' 800"
              />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
