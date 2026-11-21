"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const subRef     = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 72%" } }
      );
      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 65%" } }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" style={{ backgroundColor: "var(--c-bg)", padding: "24px clamp(24px, 5vw, 40px) clamp(80px, 14vw, 140px)" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center" }}>
          <h2
            ref={headingRef}
            style={{ fontSize: "clamp(22px, 5.5vw, 38px)", lineHeight: "115%", fontWeight: 300, color: "var(--c-fg)", marginBottom: "clamp(16px, 3vw, 24px)" }}
          >
            Креативный лид и дизайнер визуальных систем. Помогаю e-commerce и digital-компаниям выстраивать целостный визуальный язык
          </h2>
          <p
            ref={subRef}
            style={{ fontSize: "clamp(16px, 4.5vw, 24px)", fontWeight: 300, color: "var(--c-fg)", lineHeight: 1.4 }}
          >
            Соединяю бренд, продукт, коммуникацию и дизайн в единую систему.
          </p>
        </div>
      </div>
    </section>
  );
}
