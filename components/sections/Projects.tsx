"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const COVER = "/assets/indiamall.png";

const RIF_INVADER = [
  [0,0,1,0,0,0,0,0,1,0,0],
  [0,0,0,1,0,0,0,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,0,0],
  [0,1,1,0,1,1,1,0,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,0,1,1,1,1,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,1],
  [0,0,0,1,1,0,1,1,0,0,0],
];

type Project = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  cover?: string;
  bg?: string;
};

const projects: Project[] = [
  { slug: "project-01", number: "01", title: "Indiamall",  subtitle: "Moscow, Russia", category: "BRAND IDENTITY", year: "2024", cover: COVER },
  { slug: "project-02", number: "02", title: "DIONIS",      subtitle: "Moscow, Russia", category: "ART DIRECTION",  year: "2024", cover: COVER },
  { slug: "rif-v2",     number: "03", title: "РИФ",        subtitle: "Москва, Россия", category: "ART DIRECTION",  year: "2025",
    bg: "linear-gradient(135deg, #6620D4 0%, #3B1090 55%, #6620D4 100%)" },
];

function RifCover() {
  const px = 9;
  const gap = 2;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden",
      background: "linear-gradient(135deg, #6620D4 0%, #3B1090 55%, #6620D4 100%)" }}>
      {/* lime blob */}
      <div style={{ position: "absolute", top: "-15%", left: "-8%", width: "50%", height: "70%",
        background: "#9DFF2E", borderRadius: "50%", filter: "blur(90px)", opacity: 0.28, pointerEvents: "none" }} />
      {/* yellow blob */}
      <div style={{ position: "absolute", top: "10%", right: "5%", width: "35%", height: "55%",
        background: "#FFD34D", borderRadius: "50%", filter: "blur(110px)", opacity: 0.16, pointerEvents: "none" }} />
      {/* scanlines */}
      <div style={{ position: "absolute", inset: 0,
        background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.1) 3px, rgba(0,0,0,0.1) 4px)",
        pointerEvents: "none" }} />

      {/* pixel invader – bottom right */}
      <div style={{ position: "absolute", bottom: "28px", right: "36px", display: "flex", flexDirection: "column", gap }}>
        {RIF_INVADER.map((row, ri) => (
          <div key={ri} style={{ display: "flex", gap }}>
            {row.map((cell, ci) => (
              <div key={ci} style={{ width: px, height: px, background: cell ? "#fff" : "transparent", flexShrink: 0 }} />
            ))}
          </div>
        ))}
      </div>

      {/* pixel dots */}
      <div style={{ position: "absolute", left: "10%", top: "42%", opacity: 0.4, display: "grid", gridTemplateColumns: "6px 6px", gap: 6 }}>
        {[1,0,0,1].map((c, i) => <div key={i} style={{ width: 6, height: 6, background: c ? "#fff" : "transparent" }} />)}
      </div>
      <div style={{ position: "absolute", right: "22%", top: "28%", opacity: 0.3, display: "grid", gridTemplateColumns: "5px 5px", gap: 5 }}>
        {[1,0,0,1].map((c, i) => <div key={i} style={{ width: 5, height: 5, background: c ? "#fff" : "transparent" }} />)}
      </div>

      {/* title text */}
      <div style={{ position: "absolute", bottom: "36px", left: "40px" }}>
        <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.22em", marginBottom: "8px", fontWeight: 600 }}>
          Российский Интернет Форум
        </div>
        <div style={{ fontSize: "clamp(52px, 6vw, 88px)", fontWeight: 900, color: "#fff", lineHeight: 0.86, letterSpacing: "-0.03em" }}>
          РИФ<br />2025
        </div>
      </div>
    </div>
  );
}

function Block4() {
  return (
    <div>
      {projects.map((p, i) => (
        <div key={p.slug} style={{ height: "70vh", position: "relative", zIndex: i + 1 }}>
          <div style={{
            position: "sticky", top: 0, height: "100vh",
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "var(--c-bg)",
          }}>
            <Link href={`/projects/${p.slug}`} style={{ width: "min(1200px, 96vw)", display: "block" }}>
              <div className="group" style={{ cursor: "pointer", width: "100%" }}>
                <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", position: "relative" }}>
                  {p.cover ? (
                    <img
                      src={p.cover} alt={p.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.8s cubic-bezier(0.19,1,0.22,1)", display: "block" }}
                      className="group-hover:scale-[1.03]"
                    />
                  ) : p.slug === "rif-v2" ? (
                    <RifCover />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: p.bg }} />
                  )}
                  <div style={{ position: "absolute", top: "20px", right: "20px", padding: "6px 12px", backgroundColor: "var(--c-overlay)", border: "1px solid var(--c-border)" }}>
                    <span style={{ fontSize: "9px", color: "var(--c-fg-muted)", textTransform: "uppercase" }}>{p.category}</span>
                  </div>
                  <div style={{ position: "absolute", bottom: "20px", left: "20px" }}>
                    <span style={{ fontSize: "10px", color: "var(--c-fg-ghost)", fontWeight: 300 }}>{p.number}</span>
                  </div>
                </div>
                <div style={{ paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ fontSize: "24px", fontWeight: 300, color: "var(--c-fg)", marginBottom: "6px", transition: "color 0.3s" }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: "10px", color: "var(--c-fg-subtle)", textTransform: "uppercase" }}>{p.subtitle}</p>
                  </div>
                  <span style={{ fontSize: "11px", color: "var(--c-fg-subtle)", marginTop: "4px" }}>{p.year}</span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

const lines = [
  { num: "01", text: "Я не всезнающий, но мой подход к работе помогает мне разобраться в любом вопросе." },
  { num: "02", text: "Душа компании)" },
];

function HireReasons() {
  return (
    <div style={{ position: "relative", zIndex: 20, backgroundColor: "var(--c-bg)", padding: "140px 40px 0" }}>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ fontSize: "11px", color: "var(--c-fg-subtle)", textTransform: "uppercase", marginBottom: "56px" }}
      >
        Топ 2 причины взять меня на работу:
      </motion.p>

      <div style={{ perspective: "600px", perspectiveOrigin: "50% 50%" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {lines.map((line, i) => (
            <motion.div
              key={line.num}
              initial={{ opacity: 0, rotateX: 70, y: 60 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.2, delay: i * 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "50% 100%", display: "flex", gap: "32px", alignItems: "flex-start", paddingBottom: i < lines.length - 1 ? "44px" : "0" }}
            >
              <span style={{ fontSize: "10px", color: "var(--c-fg-ghost)", fontWeight: 300, minWidth: "24px", paddingTop: "10px", flexShrink: 0 }}>
                {line.num}
              </span>
              <p style={{ fontSize: "clamp(32px, 4.5vw, 68px)", fontWeight: 300, color: "var(--c-fg)", lineHeight: 1.12, maxWidth: "1000px", margin: 0 }}>
                {line.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" style={{ backgroundColor: "var(--c-bg)", paddingTop: "56px", paddingBottom: "120px" }}>
      <div style={{ marginTop: "-200px" }}>
        <Block4 />
      </div>
      <HireReasons />
    </section>
  );
}
