"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { CrossSceneV1 } from "@/components/three/CrossSceneV1";

const EXPO = [0.19, 1, 0.22, 1] as const;

function reveal(delay: number) {
  return {
    initial: { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.1, delay, ease: EXPO },
  };
}

export function HeroV1() {
  const heroRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.to([textRef.current, labelRef.current], {
        opacity: 0,
        y: -22,
        ease: "power2.in",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "25% top",
          scrub: 1.2,
        },
      });

      gsap.to(overlayRef.current, {
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "58% top",
          end: "82% top",
          scrub: 1.5,
        },
      });

      gsap.fromTo(
        photoRef.current,
        { scale: 1.08, filter: "brightness(0.2)" },
        {
          scale: 1,
          filter: "brightness(0.75)",
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "55% top",
            end: "bottom bottom",
            scrub: 2,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative"
      style={{ height: "300vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Photo layer */}
        <div
          ref={photoRef}
          className="absolute inset-0 z-0"
          style={{ filter: "brightness(0.2)" }}
        >
          <Image
            src="/assets/photo.png"
            alt="Daniil Kharkovskiy"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
            quality={100}
            unoptimized
          />
        </div>

        {/* Dark overlay — fades out to reveal photo */}
        <div
          ref={overlayRef}
          className="absolute inset-0 z-10"
          style={{ backgroundColor: "#060606" }}
        />

        {/* 3D Canvas */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <CrossSceneV1 heroRef={heroRef} />
        </div>

        {/* Top labels */}
        <div
          ref={labelRef}
          className="absolute top-0 left-0 right-0 z-30 flex items-start justify-between px-10 pt-8"
        >
          <motion.p {...reveal(1.0)} style={{ fontSize: "11px", color: "#7a7a7a", textTransform: "uppercase", fontWeight: 300 }}>
            D.KHARKOVSKIY
          </motion.p>
          <motion.p {...reveal(1.1)} style={{ fontSize: "11px", color: "#7a7a7a", textTransform: "uppercase", fontWeight: 300 }}>
            EST. 2020
          </motion.p>
        </div>

        {/* Bottom text */}
        <div
          ref={textRef}
          className="absolute bottom-0 left-0 right-0 z-30 flex items-end justify-between px-10 pb-10"
        >
          <motion.div {...reveal(0.9)}>
            <h1
              className="font-light leading-[0.88] tracking-[-0.02em]"
              style={{ fontSize: "clamp(3rem, 8.5vw, 7.5rem)", color: "#e8e8e8" }}
            >
              CREATIVE
              <br />
              <span style={{ color: "#7a7a7a" }}>DEVELOPER</span>
            </h1>
            <p style={{ marginTop: "12px", fontSize: "11px", color: "#7a7a7a", textTransform: "uppercase", fontWeight: 300 }}>
              & ART DIRECTOR
            </p>
          </motion.div>

          <motion.div {...reveal(1.3)} className="flex flex-col items-end gap-3 pb-1">
            <div className="w-px" style={{ height: "56px", backgroundColor: "#3a3a3a" }} />
            <p style={{ fontSize: "10px", color: "#3a3a3a", textTransform: "uppercase", fontWeight: 300, writingMode: "vertical-rl" }}>
              SCROLL
            </p>
          </motion.div>
        </div>

        {/* Vignette */}
        <div
          className="absolute inset-0 z-25 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 25%, rgba(6,6,6,0.65) 100%)" }}
        />
      </div>
    </section>
  );
}
