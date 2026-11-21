"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function HeroCaption() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 88%" },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section style={{ backgroundColor: "#060606", padding: "0 40px 0" }}>
      <div
        ref={ref}
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          paddingTop: "80px",
          paddingBottom: "80px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "36px",
            lineHeight: "113%",
            fontWeight: 300,
            color: "#e8e8e8",
            marginBottom: "50px",
          }}
        >
          7 лет делаю узнаваемый дизайн, который собирает взгляды и влияет на метрики
        </h2>
      </div>
    </section>
  );
}
