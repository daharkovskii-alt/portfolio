"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);

  const ringX = useSpring(dotX, { stiffness: 120, damping: 18, mass: 0.5 });
  const ringY = useSpring(dotY, { stiffness: 120, damping: 18, mass: 0.5 });

  const ringScale = useSpring(1, { stiffness: 200, damping: 20 });
  const dotOpacity = useSpring(1, { stiffness: 200, damping: 20 });
  const isVisible = useRef(false);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);

      if (!isVisible.current) {
        dotOpacity.set(1);
        isVisible.current = true;
      }
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = target.closest("a, button, [data-cursor='expand']");
      if (isInteractive) {
        ringScale.set(2.2);
        dotOpacity.set(0);
      }
    };

    const handleOut = (e: MouseEvent) => {
      const target = e.relatedTarget as HTMLElement | null;
      const isInteractive = target?.closest("a, button, [data-cursor='expand']");
      if (!isInteractive) {
        ringScale.set(1);
        dotOpacity.set(1);
      }
    };

    const handleLeave = () => {
      dotOpacity.set(0);
      ringScale.set(0.5);
      isVisible.current = false;
    };

    const handleEnter = () => {
      dotOpacity.set(1);
      ringScale.set(1);
      isVisible.current = true;
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    document.addEventListener("mouseover", handleOver);
    document.addEventListener("mouseout", handleOut);
    document.documentElement.addEventListener("mouseleave", handleLeave);
    document.documentElement.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseout", handleOut);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.documentElement.removeEventListener("mouseenter", handleEnter);
    };
  }, []);

  return (
    <>
      {/* Dot */}
      <motion.div
        className="fixed z-[9999] rounded-full pointer-events-none top-0 left-0"
        style={{
          width: 5,
          height: 5,
          backgroundColor: "#c4c4c4",
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: dotOpacity,
        }}
      />

      {/* Ring */}
      <motion.div
        className="fixed z-[9998] rounded-full pointer-events-none top-0 left-0"
        style={{
          width: 30,
          height: 30,
          border: "1px solid rgba(196,196,196,0.35)",
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          scale: ringScale,
        }}
      />
    </>
  );
}
