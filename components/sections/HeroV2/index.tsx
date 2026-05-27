"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { CrossSceneV2 } from "@/components/three/CrossSceneV2";
import { useLenis } from "@/components/providers/SmoothScroll";
import { useTheme } from "@/components/providers/ThemeProvider";

const EXPO = [0.19, 1, 0.22, 1] as const;

function reveal(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease: EXPO },
  };
}

const NAV_ITEMS = [
  { label: "ОБО МНЕ",  target: "#about" },
  { label: "ПРОЕКТЫ",  target: "#projects" },
  { label: "КОНТАКТЫ", target: "bottom" },
];

const W = 1618;
const H = 578;

const NAV_TOP = 42;
const INITIAL_GAP = 32;
const CROSS_VISUAL_INSET = 140;

export function HeroV2() {
  const lenis = useLenis();
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";
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
          {/* Nav */}
          <motion.nav
            {...reveal(0.5)}
            style={{
              position: "absolute",
              top: NAV_TOP,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "clamp(12px, 3vw, 32px)",
              padding: "0 16px",
              zIndex: 10,
            }}
          >
            {NAV_ITEMS.map(({ label, target }, i) => (
              <motion.a
                key={label}
                href={target.startsWith("#") ? target : undefined}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 + i * 0.07, ease: EXPO }}
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  color: "var(--c-fg-muted)",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  transition: "color 0.3s",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  lenis?.scrollTo(target, { duration: 1.4 });
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--c-fg)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--c-fg-muted)")}
              >
                {label}
              </motion.a>
            ))}

            {/* Theme pill */}
            <motion.button
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 + NAV_ITEMS.length * 0.07, ease: EXPO }}
              onClick={(e) => {
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                toggle(rect.left + rect.width / 2, rect.top + rect.height / 2);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--c-fg)",
                textTransform: "uppercase",
                fontFamily: "'Inter', system-ui, sans-serif",
                padding: "7px 16px",
                borderRadius: "999px",
                background: isLight ? "#ffffff" : "rgba(255,255,255,0.22)",
                backdropFilter: isLight ? "none" : "blur(16px) saturate(180%)",
                WebkitBackdropFilter: isLight ? "none" : "blur(16px) saturate(180%)",
                border: isLight ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.28)",
                boxShadow: isLight ? "none" : "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 24px rgba(0,0,0,0.12)",
                cursor: "pointer",
                transition: "background 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = isLight ? "#f5f5f5" : "rgba(255,255,255,0.32)";
                if (!isLight) el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 32px rgba(0,0,0,0.18)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = isLight ? "#ffffff" : "rgba(255,255,255,0.22)";
                el.style.boxShadow = isLight ? "none" : "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 24px rgba(0,0,0,0.12)";
              }}
            >
              {isLight ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M10 7.2A4.5 4.5 0 0 1 4.8 2a4.5 4.5 0 1 0 5.2 5.2Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1v1M6 10v1M1 6H2M10 6h1M2.64 2.64l.71.71M8.65 8.65l.71.71M9.36 2.64l-.71.71M3.35 8.65l-.71.71" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  <circle cx="6" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.3"/>
                </svg>
              )}
              {isLight ? "Dark" : "Light"}
            </motion.button>
          </motion.nav>

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
