"use client";

import Link from "next/link";
import { useRef } from "react";
import VariableProximity from "@/components/ui/VariableProximity";
import { CrossSceneV2 } from "@/components/three/CrossSceneV2";

const HEADING_LINES = [
  "Креативный лид и дизайнер",
  "визуальных систем",
];

const SUB_LINES = [
  "7 лет создаю узнаваемые дизайн-экосистемы и проекты,",
  "которые растят метрики продуктов и брендов",
];

const LINE_STYLE: React.CSSProperties = {
  display: "block",
  whiteSpace: "nowrap",
  overflow: "visible",
};

export default function ProximityPage() {
  const headingRef = useRef<HTMLDivElement>(null);
  const subRef     = useRef<HTMLDivElement>(null);
  const nameRef    = useRef<HTMLDivElement>(null);

  return (
    <main
      style={{
        minHeight: "100dvh",
        backgroundColor: "var(--c-bg)",
        color: "var(--c-fg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(80px, 10vw, 120px) clamp(24px, 5vw, 40px)",
      }}
    >
      <Link
        href="/v2"
        style={{
          position: "fixed",
          top: 24,
          left: 24,
          fontSize: 13,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "var(--c-fg)",
          textDecoration: "none",
          zIndex: 10,
        }}
      >
        ← back to /v2
      </Link>

      <div
        style={{
          maxWidth: 1100,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          textAlign: "center",
          marginTop: "-20%",
        }}
      >
        {/* Крест */}
        <div style={{ width: 250, height: 270, marginBottom: -80 }}>
          <CrossSceneV2 />
        </div>

        {/* Большой заголовок */}
        <div
          ref={headingRef}
          style={{
            position: "relative",
            fontSize: 52,
            lineHeight: 0.97,
            letterSpacing: "-0.02em",
            marginBottom: 24,
          }}
        >
          {HEADING_LINES.map((line) => (
            <span key={line} style={LINE_STYLE}>
              <VariableProximity
                label={line}
                containerRef={headingRef}
                radius={200}
                falloff="gaussian"
                fromFontVariationSettings="'wght' 200"
                toFontVariationSettings="'wght' 900"
              />
            </span>
          ))}
        </div>

        {/* Подзаголовок */}
        <div
          ref={subRef}
          style={{
            position: "relative",
            fontSize: 24,
            lineHeight: 1.2,
            color: "var(--c-fg)",
            marginBottom: 32,
          }}
        >
          {SUB_LINES.map((line) => (
            <span key={line} style={LINE_STYLE}>
              <VariableProximity
                label={line}
                containerRef={subRef}
                radius={130}
                falloff="gaussian"
                fromFontVariationSettings="'wght' 200"
                toFontVariationSettings="'wght' 700"
              />
            </span>
          ))}
        </div>

        {/* Имя мелко */}
        <div
          ref={nameRef}
          style={{
            position: "relative",
            fontSize: 24,
            letterSpacing: "-0.01em",
            color: "var(--c-fg)",
          }}
        >
          <span style={LINE_STYLE}>
            <VariableProximity
              label="Даниил Харьковский"
              containerRef={nameRef}
              radius={160}
              falloff="gaussian"
              fromFontVariationSettings="'wght' 200"
              toFontVariationSettings="'wght' 800"
            />
          </span>
        </div>
      </div>
    </main>
  );
}
