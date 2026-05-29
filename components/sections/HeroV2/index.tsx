"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { CrossSceneV2 } from "@/components/three/CrossSceneV2";

const EXPO = [0.19, 1, 0.22, 1] as const;

function reveal(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease: EXPO },
  };
}

const W = 1618;
const H = 578;

const INITIAL_GAP = 32;
const CROSS_VISUAL_INSET = 140;

export function HeroV2() {
  const sectionRef = useRef<HTMLElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);
  const crossContainerRef = useRef<HTMLDivElement>(null);
  const crossGroupRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const vw = window.innerWidth;
      const isMobile = vw < 768;
      const photoW = isMobile ? vw : Math.min(W, vw);
      const photoH = isMobile ? Math.max(220, Math.round(vw * H / W)) : H;

      gsap.set(photoWrapRef.current, {
        width: photoW,
        height: photoH,
        marginTop: -(photoH / 2),
        marginBottom: -(photoH / 2),
      });

      const photoFinalFlow = photoH + (isMobile ? 20 : 38 + 32);

      const crossGroupH = crossGroupRef.current!.offsetHeight;
      const h1NaturalTop = h1Ref.current!.getBoundingClientRect().top - 20;

      const crossTop = h1NaturalTop - crossGroupH - INITIAL_GAP + CROSS_VISUAL_INSET;
      gsap.set(crossContainerRef.current, { top: crossTop });

      const h1TotalUp = photoFinalFlow / 2;
      const pTouch = Math.max(0, INITIAL_GAP / h1TotalUp);
      const moveDist = (1 - pTouch) * h1TotalUp;
      const moveDur = 1 - pTouch;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.4,
        },
      });

      tl.fromTo(
        photoWrapRef.current,
        { scale: 0, marginTop: -(photoH / 2), marginBottom: -(photoH / 2) },
        { scale: 1, marginTop: isMobile ? 20 : 38, marginBottom: isMobile ? 0 : 32, ease: "none", duration: 1 },
        0
      );

      if (pTouch < 1) {
        tl.fromTo(
          crossGroupRef.current,
          { y: 0 },
          { y: -moveDist, ease: "none", duration: moveDur },
          pTouch
        );
      }

      tl.fromTo(
        scrollHintRef.current,
        { opacity: 1 },
        { opacity: 0, ease: "none", duration: 0.15 },
        0
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={sectionRef} style={{ height: "150vh", position: "relative" }}>
        <div
          className="sticky top-0 h-screen w-full"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--c-bg)",
            overflow: "hidden",
            clipPath: "inset(0)",
          }}
        >
          {/* Cross */}
          <div
            ref={crossContainerRef}
            style={{ position: "absolute", top: 0, left: 0, right: 0, display: "flex", justifyContent: "center", zIndex: 9 }}
          >
            <div ref={crossGroupRef} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <motion.div {...reveal(0.6)} style={{ width: 250, height: 270, flexShrink: 0 }}>
                <CrossSceneV2 />
              </motion.div>
            </div>
          </div>

          {/* Central content */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            <motion.h1
              ref={h1Ref}
              {...reveal(0.7)}
              style={{
                fontFamily: "'Afacad', system-ui, sans-serif",
                fontSize: "clamp(28px, 7.5vw, 80px)",
                lineHeight: "88%",
                fontWeight: 300,
                color: "var(--c-fg)",
                textAlign: "center",
                padding: "0 16px",
              }}
            >
              Creative leader
              <br />
              Communication designer
            </motion.h1>

            <div
              ref={photoWrapRef}
              style={{
                width: W, height: H, flexShrink: 0, overflow: "hidden",
                borderRadius: "24px",
                position: "relative", transformOrigin: "center center",
                marginTop: -(H / 2), marginBottom: -(H / 2), transform: "scale(0)",
              }}
            >
              <Image src="/assets/photo2.png" alt="Daniil Kharkovskiy" fill quality={100} unoptimized style={{ objectFit: "cover" }} priority />
            </div>

            <motion.p
              {...reveal(0.9)}
              style={{
                fontFamily: "'Afacad', system-ui, sans-serif",
                fontSize: "clamp(18px, 3.5vw, 30px)",
                fontWeight: 300,
                color: "var(--c-fg)",
                textAlign: "center",
                marginTop: "20px",
                padding: "0 16px",
              }}
            >
              I&apos;m Daniil Kharkovskiy
            </motion.p>
          </div>

          {/* Scroll hint */}
          <motion.div
            ref={scrollHintRef}
            {...reveal(1.1)}
            style={{ position: "absolute", bottom: "48px", left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", userSelect: "none", zIndex: 5 }}
          >
            <span style={{ fontSize: "11px", fontWeight: 500, color: "var(--c-fg-muted)", textTransform: "uppercase", fontFamily: "'Afacad', system-ui, sans-serif" }}>
              (Scroll)
            </span>
            <motion.svg width="12" height="8" viewBox="0 0 12 8" fill="none" animate={{ y: [0, 4, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
              <path d="M1 1L6 6L11 1" stroke="var(--c-fg-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </motion.div>
        </div>
      </section>
    </>
  );
}
