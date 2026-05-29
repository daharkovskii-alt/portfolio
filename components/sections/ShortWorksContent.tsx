"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const FONT = "'Afacad', 'Inter', system-ui, sans-serif";
const BASE_IMG = "https://hardani.ru/wp-content/uploads";
const BASE_VID = "https://hardani.ru/wp-content/uploads/2025/07";

/* ─── Primitives ─── */

function Reveal({
  children,
  delay = 0,
  style,
  from = "bottom",
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  from?: "bottom" | "left" | "right";
}) {
  const y = from === "bottom" ? 40 : 0;
  const x = from === "left" ? -40 : from === "right" ? 40 : 0;
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontFamily: FONT,
        fontSize: "10px",
        fontWeight: 500,
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        color: "rgba(10,10,10,0.35)",
        marginBottom: "40px",
      }}
    >
      {children}
    </p>
  );
}

function Img({
  src,
  alt,
  radius = "0px",
  aspect,
}: {
  src: string;
  alt: string;
  radius?: string;
  aspect?: string;
}) {
  return (
    <Reveal>
      <div
        style={{
          borderRadius: radius,
          overflow: "hidden",
          width: "100%",
          aspectRatio: aspect,
          lineHeight: 0,
        }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    </Reveal>
  );
}

function Vid({ src, aspect = "16/9" }: { src: string; aspect?: string }) {
  return (
    <Reveal>
      <div
        style={{
          width: "100%",
          aspectRatio: aspect,
          overflow: "hidden",
          lineHeight: 0,
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          src={src}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>
    </Reveal>
  );
}

function HR() {
  return (
    <div
      style={{
        height: "1px",
        backgroundColor: "rgba(10,10,10,0.08)",
        margin: "0 clamp(24px,5vw,80px)",
      }}
    />
  );
}

/* ─── Marquee ─── */
const MARQUEE_WORDS = [
  "UI Design", "Motion", "Visual Identity", "Web", "Art Direction",
  "Prototype", "Concept", "Interaction", "Digital", "Branding",
  "UI Design", "Motion", "Visual Identity", "Web", "Art Direction",
  "Prototype", "Concept", "Interaction", "Digital", "Branding",
];

function Marquee() {
  return (
    <div
      style={{
        borderTop: "1px solid rgba(10,10,10,0.08)",
        borderBottom: "1px solid rgba(10,10,10,0.08)",
        padding: "22px 0",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        style={{ display: "inline-flex" }}
      >
        {MARQUEE_WORDS.map((word, i) => (
          <span
            key={i}
            style={{ display: "inline-flex", alignItems: "center" }}
          >
            <span
              style={{
                fontFamily: FONT,
                fontSize: "10px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "rgba(10,10,10,0.28)",
                padding: "0 28px",
              }}
            >
              {word}
            </span>
            <span
              style={{
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                backgroundColor: "rgba(10,10,10,0.15)",
                flexShrink: 0,
              }}
            />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Main ─── */
export function ShortWorksContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.75], [1, 0]);

  const P = "clamp(24px,5vw,80px)";
  const GAP = "20px";

  return (
    <main
      style={{
        backgroundColor: "#ECECEC",
        minHeight: "100dvh",
        fontFamily: FONT,
        color: "#0A0A0A",
        overflowX: "hidden",
      }}
    >
      {/* ══ HERO ══ */}
      <div ref={heroRef} style={{ position: "relative", height: "100dvh", overflow: "hidden" }}>
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "130%",
            top: "-15%",
            y: heroY,
          }}
        >
          <img
            src={`${BASE_IMG}/2025/03/1%D1%82%D0%B2%D1%82%D1%84%D0%BE%D0%BD.png`}
            alt="Short Works hero"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          />
        </motion.div>

        {/* gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(236,236,236,0.1) 0%, rgba(236,236,236,0.4) 60%, rgba(236,236,236,0.97) 100%)",
          }}
        />

        {/* nav */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          style={{
            position: "absolute",
            top: "clamp(20px,3vh,40px)",
            left: P,
            right: P,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: FONT,
              fontSize: "11px",
              fontWeight: 500,
              color: "rgba(10,10,10,0.45)",
              textDecoration: "none",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
            }}
          >
            ← Back
          </Link>
          <span />
        </motion.div>

        {/* hero text */}
        <motion.div
          style={{
            position: "absolute",
            bottom: "clamp(40px,6vh,80px)",
            left: P,
            right: P,
            opacity: heroOpacity,
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.42, ease: EASE }}
            style={{
              fontSize: "clamp(56px,10vw,148px)",
              fontWeight: 300,
              color: "#0A0A0A",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
            }}
          >
            Short<br />Works
          </motion.h1>
        </motion.div>
      </div>

      {/* ══ META STRIP ══ */}
      <div style={{ padding: `clamp(48px,6vh,80px) ${P}` }}>
        <Reveal>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "clamp(20px,3vw,40px)",
              borderBottom: "1px solid rgba(10,10,10,0.08)",
              paddingBottom: "clamp(40px,5vh,60px)",
            }}
            className="sw-meta"
          >
            {[
              { label: "Формат",  value: "Шорт-работы / Эксперименты" },
              { label: "Стек",    value: "UI · Motion · Visual" },
              { label: "Год",     value: "2025" },
            ].map((item, i) => (
              <div key={i} style={{ borderLeft: i > 0 ? "1px solid rgba(10,10,10,0.08)" : "none", paddingLeft: i > 0 ? "clamp(20px,3vw,40px)" : "0" }}>
                <p style={{ fontSize: "10px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(10,10,10,0.3)", marginBottom: "12px" }}>
                  {item.label}
                </p>
                <p style={{ fontSize: "clamp(14px,1.4vw,17px)", fontWeight: 300, color: "rgba(10,10,10,0.7)" }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ══ INTRO STATEMENT ══ */}
      <div style={{ padding: `0 ${P} clamp(60px,8vh,100px)` }}>
        <div style={{ maxWidth: "820px" }}>
          <Reveal>
            <h2
              style={{
                fontSize: "clamp(28px,4vw,56px)",
                fontWeight: 300,
                color: "#0A0A0A",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: "32px",
              }}
            >
              Сборник коротких работ<br />
              и визуальные концепты.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p
              style={{
                fontSize: "clamp(15px,1.6vw,18px)",
                fontWeight: 300,
                color: "rgba(10,10,10,0.45)",
                lineHeight: 1.75,
                maxWidth: "580px",
              }}
            >
              Каждая работа — отдельная история: интерфейс, айдентика, анимация
              или интерактивный прототип. Без лишних слов — только визуал.
            </p>
          </Reveal>
        </div>
      </div>

      <Marquee />

      {/* ══ BLOCK 01 ══ */}
      <div style={{ padding: `20px ${P}` }}>
        <div style={{ marginBottom: GAP }}>
          <Vid src={`${BASE_VID}/%D0%97%D0%B0%D0%BF%D0%B8%D1%81%D1%8C-%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0-2025-07-25-%D0%B2-19.27.04.mp4`} />
        </div>

        <div style={{ marginBottom: GAP }}>
          <Img src={`${BASE_IMG}/2025/03/2fa.png`} alt="Short work 01" />
        </div>
        <div style={{ marginBottom: GAP }}>
          <Img src={`${BASE_IMG}/2025/03/3fa.png`} alt="Short work 02" />
        </div>

        <div style={{ marginBottom: GAP }}>
          <Vid src={`${BASE_VID}/%D0%97%D0%B0%D0%BF%D0%B8%D1%81%D1%8C-%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0-2025-07-30-%D0%B2-18.48.17.mov`} />
        </div>

        <Img src={`${BASE_IMG}/2025/03/5fa.png`} alt="Short work 03" />
      </div>

      {/* ══ BLOCK 02 ══ */}
      <div style={{ padding: `20px ${P}` }}>
        <div style={{ marginBottom: GAP }}>
          <Vid src={`${BASE_VID}/%D0%97%D0%B0%D0%BF%D0%B8%D1%81%D1%8C-%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0-2025-07-30-%D0%B2-18.53.45.mp4`} />
        </div>
        <div style={{ marginBottom: GAP }}>
          <Vid src={`${BASE_VID}/video-output-78E13B33-0989-4355-925C-7BC5C4524C4D.mp4`} />
        </div>

        <div style={{ marginBottom: GAP }}>
          <Img src={`${BASE_IMG}/2025/03/6fa.png`} alt="Short work 04" />
        </div>

        <div style={{ marginBottom: GAP }}>
          <Vid src={`${BASE_VID}/PIZDEC.mp4`} />
        </div>
        <Img src={`${BASE_IMG}/2025/03/7fa.png`} alt="Short work 05" />
      </div>

      {/* ══ BLOCK 03 — Dense gallery ══ */}
      <div style={{ padding: `20px ${P}` }}>
        <div style={{ marginBottom: GAP }}>
          <Img src={`${BASE_IMG}/2025/03/8fa.png`} alt="Short work 06" />
        </div>
        <div style={{ marginBottom: GAP }}>
          <Img src={`${BASE_IMG}/2025/03/9fa.png`} alt="Short work 07" />
        </div>
        <div style={{ marginBottom: GAP }}>
          <Img src={`${BASE_IMG}/2025/03/10fa.png`} alt="Short work 08" />
        </div>
        <div style={{ marginBottom: GAP }}>
          <Img src={`${BASE_IMG}/2025/03/11fa.png`} alt="Short work 09" />
        </div>

      </div>

      <Marquee />

      {/* ══ BLOCK 04 ══ */}
      <div style={{ padding: `20px ${P}` }}>
        <div style={{ marginBottom: GAP }}>
          <Vid src={`${BASE_VID}/%D0%97%D0%B0%D0%BF%D0%B8%D1%81%D1%8C-%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0-2025-07-25-%D0%B2-16.46.58.mp4`} />
        </div>

        <div style={{ marginBottom: GAP }}>
          <Img src={`${BASE_IMG}/2025/03/13fa.png`} alt="Short work 10" />
        </div>
        <div style={{ marginBottom: GAP }}>
          <Img src={`${BASE_IMG}/2025/03/14fa.png`} alt="Short work 11" />
        </div>

        <Img src={`${BASE_IMG}/2025/03/16fa.png`} alt="Short work 12" />
      </div>

      {/* ══ BLOCK 05 — Final works ══ */}
      <div style={{ padding: `20px ${P}` }}>
        <div style={{ marginBottom: GAP }}>
          <Img src={`${BASE_IMG}/2025/03/15fa.png`} alt="Short work 14" />
        </div>

        <div style={{ marginBottom: GAP }}>
          <Img src={`${BASE_IMG}/2025/07/32242dv.v.png`} alt="Short work 15" />
        </div>
        <div style={{ marginBottom: GAP }}>
          <Img src={`${BASE_IMG}/2025/07/%D0%BA%D0%B6%D0%BF%D1%82%D0%BF-%D0%B0.png`} alt="Short work 16" />
        </div>

        <div style={{ marginBottom: GAP }}>
          <Vid src={`${BASE_VID}/%D0%97%D0%B0%D0%BF%D0%B8%D1%81%D1%8C-%D1%8D%D0%BA%D1%80%D0%B0%D0%BD%D0%B0-2025-07-25-%D0%B2-14.58.18.mp4`} />
        </div>

        <Img src={`${BASE_IMG}/2025/07/3222332.png`} alt="Short work 17" />
      </div>

      {/* ══ BIG STATEMENT ══ */}
      <div
        style={{
          padding: `clamp(80px,12vh,140px) ${P}`,
          borderTop: "1px solid rgba(10,10,10,0.08)",
          borderBottom: "1px solid rgba(10,10,10,0.08)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <h2
              style={{
                fontSize: "clamp(36px,6vw,96px)",
                fontWeight: 300,
                color: "#0A0A0A",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                maxWidth: "880px",
              }}
            >
              Дизайн — это не украшение.<br />
              Это язык, которым говорит продукт.
            </h2>
          </Reveal>
        </div>
      </div>

      {/* ══ NEXT PROJECT ══ */}
      <div style={{ padding: `clamp(40px,6vh,80px) ${P}` }}>
        <Link href="/projects/indiamall-final" style={{ textDecoration: "none", display: "block" }}>
          <motion.div
            whileHover={{ backgroundColor: "rgba(10,10,10,0.03)" }}
            transition={{ duration: 0.25 }}
            style={{
              border: "1px solid rgba(10,10,10,0.1)",
              borderRadius: "20px",
              padding: "clamp(28px,4vw,56px)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.14em",
                  color: "rgba(10,10,10,0.3)",
                  marginBottom: "16px",
                }}
              >
                Следующий проект
              </p>
              <h2
                style={{
                  fontSize: "clamp(28px,4.5vw,64px)",
                  fontWeight: 300,
                  color: "#0A0A0A",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                }}
              >
                Indiamall
              </h2>
            </div>
            <motion.span
              whileHover={{ x: 10 }}
              transition={{ duration: 0.3 }}
              style={{ fontSize: "clamp(24px,3vw,40px)", color: "rgba(10,10,10,0.3)" }}
            >
              →
            </motion.span>
          </motion.div>
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sw-meta { grid-template-columns: 1fr 1fr !important; row-gap: 28px !important; }
        }
        @media (max-width: 480px) {
          .sw-meta { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
