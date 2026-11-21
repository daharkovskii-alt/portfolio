"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CrossScene } from "@/components/three/CrossScene";
import { CrossBallpit } from "@/components/three/CrossBallpit";

const EXPO = [0.19, 1, 0.22, 1] as const;

function fadeIn(delay: number, y = 20) {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, delay, ease: EXPO },
  };
}

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={heroRef}
      id="home"
      className="relative"
      style={{ height: "100dvh" }}
    >
      {/* Black top zone */}
      <div
        className="absolute top-0 left-0 right-0"
        style={{ height: "44%", backgroundColor: "#060606", zIndex: 1 }}
      />

      {/* Photo bottom zone */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "calc(56% - 10px)", zIndex: 1 }}
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
        <div
          className="absolute top-0 left-0 right-0 pointer-events-none"
          style={{
            height: "100px",
            background: "linear-gradient(to bottom, #060606 0%, transparent 100%)",
            zIndex: 2,
          }}
        />

      </div>

      {/* 3D Cross — looping rotation, no scroll dependency */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <CrossScene scale={0.52} offsetY={0.22} />
      </div>

      {/* Cross ballpit — disabled */}
      {/* <div className="absolute inset-0" style={{ zIndex: 5 }}>
        <CrossBallpit count={20} photoFraction={0.56} />
      </div> */}

      {/* Text in top zone */}
      <div
        className="absolute top-0 left-0 right-0 flex flex-col items-center justify-center"
        style={{ height: "44%", zIndex: 20 }}
      >
        <motion.p
          {...fadeIn(0.5, 10)}
          style={{
            fontSize: "36px",
            marginBottom: "36px",
            color: "#e8e8e8",
          }}
        >
          I&apos;m Daniil Kharkovskiy
        </motion.p>

        <motion.h1
          {...fadeIn(0.72)}
          className="text-center"
          style={{
            fontSize: "72px",
            lineHeight: 0.78,
            color: "#e8e8e8",
          }}
        >
          Creative leader
          <br />
          Communication designer
        </motion.h1>
      </div>

      {/* Scroll hint */}
      <motion.div
        {...fadeIn(1.4)}
        className="absolute bottom-8 left-10 flex items-center gap-3 pointer-events-none"
        style={{ zIndex: 20 }}
      >
        <div
          className="w-px"
          style={{ height: "44px", backgroundColor: "rgba(232,232,232,0.15)" }}
        />
        <p
          className="font-light"
          style={{
            fontSize: "10px",
            color: "rgba(232,232,232,0.18)",
            writingMode: "vertical-rl",
          }}
        >
          SCROLL
        </p>
      </motion.div>
    </section>
  );
}
