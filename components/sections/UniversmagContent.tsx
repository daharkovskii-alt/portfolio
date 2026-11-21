"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const P = "clamp(20px, 5vw, 80px)";

const BASE = "https://hardani.ru/wp-content/uploads";

const IMAGES = [
  { src: `${BASE}/2025/03/Главная.png` },
  { src: `${BASE}/2025/03/2.2.png` },
  { src: `${BASE}/2025/03/4-1.png` },
  { src: `${BASE}/2025/03/5-1.png` },
  { src: `${BASE}/2025/03/6-1.png` },
  { src: `${BASE}/2025/10/уцвцуацацуац.png` },
  { src: `${BASE}/2025/10/риь-миид.png` },
  { src: `${BASE}/2025/10/ымывпыкпфа.png` },
  { src: `${BASE}/2025/03/ыысысыу.png` },
  { src: `${BASE}/2025/03/11.png` },
  { src: `${BASE}/2025/03/12.png` },
  { src: `${BASE}/2025/10/БЬТИОБТ.png` },
  { src: `${BASE}/2025/03/14.png` },
  { src: `${BASE}/2025/03/15.png` },
  { src: `${BASE}/2025/03/16.png` },
  { src: `${BASE}/2025/03/18.png` },
];

export function UniversmagContent() {
  return (
    <main style={{ backgroundColor: "#fff" }}>

      {/* ══ HERO ══ */}
      <div style={{ padding: "12px 12px 0" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          style={{ position: "relative", height: "calc(100dvh - 12px)", overflow: "hidden", borderRadius: "24px", backgroundColor: "#111" }}
        >
          <img
            src="/assets/univermag-cover.png"
            alt="Универмаг Точка"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: 0.55 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.8) 100%)" }} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ position: "absolute", top: "28px", left: "32px" }}
          >
            <Link href="/v2" style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", textDecoration: "none", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              ← Back
            </Link>
          </motion.div>

          <div style={{ position: "absolute", bottom: "clamp(40px,6vh,80px)", left: P, right: P }}>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
              style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "18px" }}
            >
              Creative Concept · 01.2025
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.45, ease: EASE }}
              style={{ fontSize: "clamp(44px, 8.5vw, 128px)", fontWeight: 700, color: "#fff", lineHeight: 0.9, letterSpacing: "-0.03em" }}
            >
              Универмаг<br />Точка банк
            </motion.h1>
          </div>
        </motion.div>
      </div>

      {/* ══ PHOTOS ══ */}
      <div style={{ display: "flex", flexDirection: "column", padding: "0 4px" }}>
        {IMAGES.map((img) => (
          <img
            key={img.src}
            src={img.src}
            alt=""
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        ))}
      </div>

    </main>
  );
}
