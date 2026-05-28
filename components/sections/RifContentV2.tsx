"use client";

import Link from "next/link";
import NextImage from "next/image";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";

const MotionImage = motion(NextImage);
import FaultyTerminal from "@/components/ui/FaultyTerminal";
import { useScreenSize } from "@/hooks/use-screen-size";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ─── brand constants (fixed in both themes) ─────────────── */
const PURPLE      = "#6620D4";
const PURPLE_DARK = "#150630";
const LIME        = "#9DFF2E";
const YELLOW      = "#FFD34D";

/* ─── theme color system ──────────────────────────────────── */
const DARK_C = {
  bg:       "#0D0A1A",
  card:     "#1A1330",
  cardGrey: "#150F28",
  cardDeep: "#201840",
  title:    "#FFFFFF",
  body:     "rgba(255,255,255,0.52)",
  label:    "rgba(255,255,255,0.38)",
  divider:  "rgba(255,255,255,0.07)",
  uxText:   "rgba(255,255,255,0.12)",
  nextBg:   "#1A1330",
};

const LIGHT_C = {
  bg:       "#F5F5F7",
  card:     "#FFFFFF",
  cardGrey: "#E8E8EA",
  cardDeep: "#D1D1D6",
  title:    PURPLE_DARK,
  body:     "#6B6B6B",
  label:    "#6B6B6B",
  divider:  "#E8E8EA",
  uxText:   "#D1D1D6",
  nextBg:   "#FFFFFF",
};

type C = typeof DARK_C;

/* ─── pixel helpers ──────────────────────────────────────── */
const INVADER_GRID = [
  [0,0,1,0,0,0,0,0,1,0,0],
  [0,0,0,1,0,0,0,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,0,0],
  [0,1,1,0,1,1,1,0,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,0,1,1,1,1,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,1],
  [0,0,0,1,1,0,1,1,0,0,0],
];

function PixelInvader({ color = "#fff", px = 8 }: { color?: string; px?: number }) {
  const gap = Math.max(1, Math.round(px * 0.18));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {INVADER_GRID.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap }}>
          {row.map((cell, ci) => (
            <div key={ci} style={{ width: px, height: px, background: cell ? color : "transparent", flexShrink: 0 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

const CACTUS_GRID = [
  [0,0,1,0,0],
  [0,0,1,0,0],
  [1,0,1,0,0],
  [1,1,1,0,1],
  [1,1,1,1,1],
  [0,0,1,1,0],
  [0,0,1,0,0],
  [0,0,1,0,0],
  [0,0,1,0,0],
  [0,0,1,0,0],
  [0,0,1,0,0],
];

function PixelCactus({ color = PURPLE, px = 10 }: { color?: string; px?: number }) {
  const gap = Math.max(1, Math.round(px * 0.18));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap }}>
      {CACTUS_GRID.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap }}>
          {row.map((cell, ci) => (
            <div key={ci} style={{ width: px, height: px, background: cell ? color : "transparent", flexShrink: 0 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

function Dots({ color = "#fff", size = 5, opacity = 0.5 }: { color?: string; size?: number; opacity?: number }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `${size}px ${size}px`, gap: size, opacity }}>
      {[1, 0, 0, 1].map((c, i) => (
        <div key={i} style={{ width: size, height: size, background: c ? color : "transparent" }} />
      ))}
    </div>
  );
}

/* ─── counter ─────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1.6, active: boolean) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return n;
}

/* ─── ui atoms ────────────────────────────────────────────── */
function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      style={{ display: "flex", flexDirection: "column", ...style }}
    >
      {children}
    </motion.div>
  );
}

function Label({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <p style={{ fontSize: "11px", color, textTransform: "uppercase", fontWeight: 700, margin: 0 }}>
      {children}
    </p>
  );
}

function MetricCard({ value, suffix, label, delay, bg, textColor }: {
  value: number; suffix: string; label: string; delay: number; bg: string; textColor: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const count = useCountUp(value, 1.6, inView);
  const isLight = textColor === "#fff";
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.85, delay, ease: EASE }}
      style={{ background: bg, borderRadius: "24px", padding: "52px 44px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "240px" }}
    >
      <p style={{ fontSize: "11px", color: isLight ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.42)", textTransform: "uppercase", fontWeight: 700, margin: 0 }}>
        {label}
      </p>
      <div style={{ fontSize: "clamp(52px, 6.5vw, 84px)", fontWeight: 900, color: textColor, lineHeight: 1, fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>
        {inView ? `${count}${suffix}` : `0${suffix}`}
      </div>
    </motion.div>
  );
}

/* ─── Windows XP dialog ──────────────────────────────────── */
const WIN_ERRORS = [
  "Task failed successfully.",
  "Error: success.",
  "Unknown error occurred. Maybe.",
  "Please ignore this message.",
  "Critical: everything is fine.",
  "Warning: no warnings found.",
  "404: problem not found.",
  "Segmentation fault (core not dumped).",
];

function WinDialog({ onOkClick, message = "Task failed successfully." }: { onOkClick?: () => void; message?: string }) {
  const [pressed, setPressed] = useState(false);

  const handleOk = () => {
    setPressed(true);
    setTimeout(() => setPressed(false), 120);
    onOkClick?.();
  };

  return (
    <div style={{
      width: "min(380px, 85vw)",
      fontFamily: "'Tahoma', 'Arial', sans-serif",
      fontSize: "14px",
      filter: "drop-shadow(0px 32px 24px rgba(0,0,0,0.28)) drop-shadow(0px 8px 8px rgba(0,0,0,0.18))",
      userSelect: "none",
    }}>
      {/* title bar */}
      <div style={{
        background: "linear-gradient(180deg, #0997FF 0%, #0053EE 8%, #0050EE 40%, #006BEF 88%, #1E8CFD 95%, #1E8CFD 100%)",
        padding: "3px 4px 4px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "8px 8px 0 0",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <div style={{ width: "14px", height: "14px", background: "rgba(255,255,255,0.15)", borderRadius: "2px" }} />
          <span style={{ color: "#fff", fontWeight: 700, fontSize: "11px", textShadow: "1px 1px 0 rgba(0,0,80,0.5)" }}>Windows</span>
        </div>
        <div style={{
          width: "21px", height: "21px",
          background: "linear-gradient(180deg, #f06060 0%, #c02020 100%)",
          border: "1px solid #8b0000",
          borderRadius: "4px",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontWeight: 900, fontSize: "11px", lineHeight: 1,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.3)",
          cursor: "default",
        }}>✕</div>
      </div>

      {/* body */}
      <div style={{
        background: "#ECE9D8",
        border: "2px solid #0831D9",
        borderTop: "none",
        borderRadius: "0 0 4px 4px",
        padding: "20px 20px 16px",
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "16px" }}>
          <div style={{
            width: "40px", height: "40px", flexShrink: 0,
            border: "2px solid #6A6A6A",
            borderRadius: "50%",
            background: "#ECE9D8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", fontWeight: 900, color: "#00008B",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.15)",
          }}>i</div>
          <p style={{ margin: 0, color: "#000", lineHeight: 1.5, paddingTop: "6px" }}>{message}</p>
        </div>

        {/* ok button */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <motion.button
            onClick={handleOk}
            animate={pressed ? {} : {
              boxShadow: [
                "0 0 0px 0px rgba(0,80,238,0), 1px 1px 0 #fff inset, -1px -1px 0 #ABA89B inset",
                "0 0 12px 4px rgba(0,80,238,0.55), 1px 1px 0 #fff inset, -1px -1px 0 #ABA89B inset",
                "0 0 0px 0px rgba(0,80,238,0), 1px 1px 0 #fff inset, -1px -1px 0 #ABA89B inset",
              ],
            }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              padding: "4px 32px",
              background: pressed
                ? "linear-gradient(180deg, #C0BDB0 0%, #ECE9D8 100%)"
                : "linear-gradient(180deg, #FFFFFF 0%, #ECE9D8 100%)",
              border: "2px solid #7A7A7A",
              borderRadius: "3px",
              color: "#000",
              cursor: "pointer",
              fontSize: "13px",
              fontFamily: "'Tahoma', sans-serif",
              transform: pressed ? "translateY(1px)" : "none",
            }}
          >OK</motion.button>
        </div>
      </div>
    </div>
  );
}

/* ─── toggle button (reusable) ───────────────────────────── */
function ToggleBtn({ dark, onToggle, style }: { dark: boolean; onToggle: () => void; style?: React.CSSProperties }) {
  return (
    <button
      onClick={onToggle}
      style={{
        background:       dark ? "rgba(21,6,48,0.88)" : "rgba(245,245,247,0.95)",
        backdropFilter:   "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border:           dark ? "1px solid rgba(157,255,46,0.4)" : `1px solid rgba(102,32,212,0.35)`,
        color:            dark ? LIME : PURPLE,
        fontFamily:       "'Inter', system-ui, sans-serif",
        fontSize:         "9px",
        textTransform:    "uppercase",
        padding:          "8px 16px",
        cursor:           "pointer",
        display:          "flex",
        alignItems:       "center",
        gap:              "8px",
        transition:       "all 0.35s ease",
        ...style,
      }}
    >
      <span style={{ width: "6px", height: "6px", backgroundColor: "currentColor", borderRadius: "1px", flexShrink: 0, display: "inline-block" }} />
      {dark ? "LIGHT_MODE" : "DARK_MODE"}
    </button>
  );
}

/* ─── approach block with parallax ──────────────────────────── */
type FlyingDialog = { id: number; x: number; y: number; rot: number; msg: string };

function ApproachBlock() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const winY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const [flying, setFlying] = useState<FlyingDialog[]>([]);

  const spawnDialog = () => {
    const id = Date.now() + Math.random();
    const x = (Math.random() - 0.5) * 500;
    const y = -(Math.random() * 300 + 150);
    const rot = (Math.random() - 0.5) * 50;
    const msg = WIN_ERRORS[Math.floor(Math.random() * WIN_ERRORS.length)];
    setFlying(prev => [...prev.slice(-6), { id, x, y, rot, msg }]);
    setTimeout(() => setFlying(prev => prev.filter(d => d.id !== id)), 1800);
  };

  const ICONS = [
    { src: "/rif/joystick.svg", dur: 3.5, rot: true,  delay: 0,   size: "clamp(70px,8vw,115px)",  top: "8%",   left: "38%" },
    { src: "/rif/lightning.svg",   dur: 2.8, rot: true,  delay: 0.4, size: "clamp(50px,5vw,78px)",   top: "5%",   left: "54%" },
    { src: "/rif/bomb.svg",     dur: 4.0, rot: false, delay: 0.8, size: "clamp(70px,8vw,108px)",  top: "6%",   right: "5%" },
    { src: "/rif/comp.svg",     dur: 3.8, rot: false, delay: 1.2, size: "clamp(90px,10vw,148px)", bottom: "12%", right: "22%" },
    { src: "/rif/fire.svg",    dur: 2.5, rot: false, delay: 0.3, size: "clamp(60px,6vw,90px)",   bottom: "32%", right: "24%" },
    { src: "/rif/fire1.png",   dur: 3.0, rot: false, delay: 0.6, size: "clamp(55px,5vw,80px)",   bottom: "5%",  left: "3%" },
    { src: "/rif/sword.svg",      dur: 3.6, rot: true,  delay: 1.0, size: "clamp(60px,6vw,90px)",   bottom: "5%",  right: "7%" },
  ];

  return (
    <Reveal>
      <div ref={ref} style={{ background: LIME, borderRadius: "24px", padding: "clamp(64px,8vw,100px) clamp(48px,6vw,80px)", position: "relative", overflow: "hidden" }}>
        <p style={{ fontSize: "11px", color: "rgba(21,6,48,0.45)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.12em", margin: "0 0 32px" }}>Подход</p>
        <p style={{ fontSize: "clamp(32px,4.5vw,64px)", fontWeight: 900, color: PURPLE_DARK, lineHeight: 1.08, margin: 0, maxWidth: "900px" }}>
          Взял культурный код retro gaming и Windows XP — и превратил ностальгию в визуальную систему.
        </p>
        <p style={{ fontSize: "clamp(16px,1.6vw,20px)", fontWeight: 500, color: "rgba(21,6,48,0.55)", lineHeight: 1.65, margin: "32px 0 0", maxWidth: "640px" }}>
          Один стиль — для сайта, навигации и офлайн-носителей. Команда принимала решения быстро, без микроменеджмента.
        </p>

        {/* floating pixel icons */}
        {ICONS.map((item) => (
          <motion.div
            key={item.src}
            style={{ position: "absolute", top: item.top, left: item.left, right: item.right, bottom: item.bottom, zIndex: 2, pointerEvents: "none" }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6, delay: item.delay * 0.4, ease: EASE }}
          >
            <motion.img
              src={item.src}
              alt=""
              animate={item.rot ? { y: [0, -12, 0], rotate: [-4, 4, -4] } : { y: [0, -12, 0] }}
              transition={{ duration: item.dur, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
              style={{ width: item.size, display: "block", imageRendering: "pixelated", filter: "drop-shadow(0px 20px 12px rgba(0,0,0,0.18))" }}
            />
          </motion.div>
        ))}

        {/* flying dialogs */}
        <AnimatePresence>
          {flying.map(d => (
            <motion.div
              key={d.id}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.7 }}
              animate={{ x: d.x, y: d.y, opacity: 1, rotate: d.rot, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "absolute", bottom: "60px", right: "-20px", zIndex: 10, pointerEvents: "none" }}
            >
              <WinDialog message={d.msg} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* main dialog — parallax + levitate */}
        <motion.div
          style={{ position: "absolute", bottom: "60px", right: "-20px", zIndex: 5 }}
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <WinDialog onOkClick={spawnDialog} />
        </motion.div>
      </div>
    </Reveal>
  );
}

/* ─── key decisions ──────────────────────────────────────── */
const DECISIONS = [
  {
    title: "Retro как точка входа в эмоцию",
    problem: "Нейтральный визуал не вовлекал — не было ничего, за что зацепиться.",
    solution: "Взял Windows XP и retro gaming как главный культурный код.",
    result: "Сильный эмоциональный отклик — люди узнавали стилистику и чувствовали форум своим.",
    accent: true,
  },
  {
    title: "Визуальная система",
    problem: "Разрозненные элементы не складывались в единое ощущение.",
    solution: "Построил набор повторяемых паттернов и принципов.",
    result: "Один стиль масштабируется на любой носитель без потери целостности.",
    accent: false,
  },
  {
    title: "Модульная графика",
    problem: "Разные носители требовали постоянных компромиссов при адаптации.",
    solution: "Элементы собраны по модульному принципу.",
    result: "Любой формат закрывается быстро и без потери стиля.",
    accent: false,
  },
  {
    title: "UX как часть визуального опыта",
    problem: "Стандартный сайт форума — навигация, но не опыт.",
    solution: "Визуальная концепция встроена прямо в интерфейс.",
    result: "Сайт и офлайн заговорили одним языком.",
    accent: false,
  },
];

function DecisionCard({ d, C, tr }: { d: typeof DECISIONS[0]; C: typeof DARK_C; tr: string }) {
  const bg       = d.accent ? PURPLE : C.card;
  const border   = d.accent ? "rgba(255,255,255,0.1)" : C.divider;
  const title    = d.accent ? "#fff" : C.title;
  const label    = d.accent ? "rgba(255,255,255,0.35)" : C.label;
  const body     = d.accent ? "rgba(255,255,255,0.65)" : C.body;
  const resultBg = d.accent ? "rgba(255,255,255,0.07)" : C.cardGrey;
  const resultTx = d.accent ? "rgba(255,255,255,0.9)" : C.title;
  const P        = "20px 24px";

  return (
    <div style={{ background: bg, borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", transition: tr }}>

      <div style={{ padding: "24px 24px 20px" }}>
        <h3 style={{ fontSize: "clamp(16px,1.6vw,20px)", fontWeight: 800, color: title, lineHeight: 1.2, margin: 0, transition: tr }}>
          {d.title}
        </h3>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", borderTop: `1px solid ${border}`, transition: tr }}>
        <div style={{ padding: P, borderBottom: `1px solid ${border}`, transition: tr }}>
          <p style={{ fontSize: "9px", color: label, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, margin: "0 0 6px" }}>Проблема</p>
          <p style={{ fontSize: "13px", color: body, lineHeight: 1.55, margin: 0, transition: tr }}>{d.problem}</p>
        </div>

        <div style={{ padding: P, borderBottom: `1px solid ${border}`, flex: 1, transition: tr }}>
          <p style={{ fontSize: "9px", color: label, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, margin: "0 0 6px" }}>Решение</p>
          <p style={{ fontSize: "13px", color: body, lineHeight: 1.55, margin: 0, transition: tr }}>{d.solution}</p>
        </div>

        <div style={{ padding: P, background: resultBg, transition: tr }}>
          <p style={{ fontSize: "9px", color: label, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700, margin: "0 0 6px" }}>Результат</p>
          <p style={{ fontSize: "13px", color: resultTx, lineHeight: 1.55, margin: 0, fontWeight: 600, transition: tr }}>{d.result}</p>
        </div>
      </div>
    </div>
  );
}

function KeyDecisions({ C, dark, tr, isMobile }: { C: typeof DARK_C; dark: boolean; tr: string; isMobile: boolean }) {
  return (
    <div>
      <Reveal>
        <p style={{ fontSize: "11px", color: C.label, textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700, margin: "0 0 clamp(20px,2.5vw,32px)", transition: tr }}>
          Ключевые решения
        </p>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "12px" }}>
        {DECISIONS.map((d, i) => (
          <Reveal key={d.title} delay={i * 0.07}>
            <DecisionCard d={d} C={C} tr={tr} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* ─── main ────────────────────────────────────────────────── */
export function RifContentV2() {
  const screen = useScreenSize();
  const isMobile = screen.lessThan("md");
  const [dark, setDark] = useState(true);
  const C = dark ? DARK_C : LIGHT_C;
  const toggle = () => setDark(d => !d);



  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);
  const dinoY = useTransform(heroScroll, [0, 1], ["0%", "55%"]);
  const birdY = useTransform(heroScroll, [0, 1], ["0%", "40%"]);

  const brandRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: brandScroll } = useScroll({ target: brandRef, offset: ["start end", "end start"] });
  const tirekY = useTransform(brandScroll, [0, 1], ["8%", "-8%"]);
  const piksY  = useTransform(brandScroll, [0, 1], ["14%", "-14%"]);

  const mobileRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: mobileScroll } = useScroll({ target: mobileRef, offset: ["start end", "end start"] });
  const mobImgY = useTransform(mobileScroll, [0, 1], ["0%", "-10%"]);

  const GAP = "12px";
  const R = "24px";
  const R_LG = "24px";

  const tr = "all 0.35s ease";

  return (
    <main style={{ backgroundColor: C.bg, minHeight: "100dvh", transition: "background-color 0.35s ease", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── HERO ── */}
      <div style={{ padding: "12px 12px 0" }}>
        <div ref={heroRef} style={{ position: "relative", height: "calc(100dvh - 12px)", overflow: "hidden", borderRadius: "24px" }}>
          <motion.div style={{ position: "absolute", inset: 0, y: heroY, background: `linear-gradient(135deg, ${PURPLE_DARK} 0%, ${PURPLE} 45%, #3B0FA0 100%)` }} />
          {/* ГЛИЧ: <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.18, mixBlendMode: "screen" }}><FaultyTerminal scale={2.3} digitSize={3.4} scanlineIntensity={0.45} glitchAmount={1.7} flickerAmount={1.2} noiseAmp={0.35} dither={0.3} curvature={0.6} tint="#8e90ff" mouseReact mouseStrength={0.4} brightness={1.8} pageLoadAnimation={false} /></div> */}
          <motion.div style={{ position: "absolute", top: "-10%", left: "-5%", width: "45%", height: "55%", background: LIME, borderRadius: "50%", filter: "blur(110px)", opacity: 0.28, y: heroY, pointerEvents: "none" }} />
          <motion.div style={{ position: "absolute", top: "5%", right: "10%", width: "30%", height: "40%", background: YELLOW, borderRadius: "50%", filter: "blur(130px)", opacity: 0.16, y: heroY, pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(21,6,48,0.15) 0%, rgba(21,6,48,0.65) 100%)" }} />
          <div style={{ position: "absolute", left: "80px", top: "42%", opacity: 0.45 }}><Dots color="#fff" size={6} /></div>
          <div style={{ position: "absolute", right: "130px", top: "36%", opacity: 0.35 }}><Dots color="#fff" size={5} /></div>

          {/* ── dino — bottom left, parallax + float ── */}
          <motion.div
            style={{ position: "absolute", bottom: "6%", left: "5%", y: dinoY, zIndex: 2, pointerEvents: "none" }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
          >
            <motion.div
              animate={{ y: [0, -22, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <NextImage
                src="/rif/img-327.png"
                alt=""
                width={240}
                height={240}
                style={{
                  width: "clamp(140px, 16vw, 240px)",
                  height: "auto",
                  display: "block",
                  filter: "drop-shadow(0px 44px 18px rgba(0,0,0,0.3))",
                }}
              />
            </motion.div>
          </motion.div>

          {/* ── bird — bottom right, parallax + float ── */}
          <motion.div
            style={{ position: "absolute", bottom: "8%", right: "5%", y: birdY, zIndex: 2, pointerEvents: "none" }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.75, ease: EASE }}
          >
            <motion.div
              animate={{ y: [0, -16, 0] }}
              transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
            >
              <NextImage
                src="/rif/img-328.png"
                alt=""
                width={285}
                height={285}
                style={{
                  width: "clamp(165px, 18vw, 285px)",
                  height: "auto",
                  display: "block",
                  filter: "drop-shadow(0px 38px 16px rgba(0,0,0,0.28))",
                }}
              />
            </motion.div>
          </motion.div>

          {/* back */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} style={{ position: "absolute", top: isMobile ? "20px" : "40px", left: isMobile ? "16px" : "40px" }}>
            <Link href="/v2" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "10px 16px", borderRadius: "66px", border: "1px solid rgba(255,255,255,0.3)", backgroundColor: "#fff", color: "#0a0a0a", fontSize: "13px", fontWeight: 400, textDecoration: "none", whiteSpace: "nowrap" }}><span style={{ fontSize: "10px" }}>←</span>назад</Link>
          </motion.div>


          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "0 40px",
              opacity: heroOpacity,
              pointerEvents: "none",
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4, ease: EASE }}
              style={{ fontSize: "clamp(53px, 10vw, 147px)", fontWeight: 900, color: "#fff", lineHeight: 0.88, margin: "0 0 32px" }}
            >
              РИФ 2025
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: EASE }}
              style={{ fontSize: "clamp(16px, 2vw, 24px)", color: "rgba(255,255,255,0.75)", lineHeight: 1.5, maxWidth: "560px", margin: 0, fontWeight: 400 }}
            >
              Российский Интернет Форум 2025 — крупнейшее ИТ-событие России.
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* ── fixed toggle ── */}
      <div style={{ position: "fixed", top: "16px", right: isMobile ? "12px" : "40px", zIndex: 50 }}>
        <ToggleBtn dark={dark} onToggle={toggle} />
      </div>

      {/* ── BENTO BODY ── */}
      <div style={{ padding: isMobile ? "20px 12px" : `clamp(40px, 5vw, 72px) clamp(20px, 5vw, 80px)` }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(40px, 5vw, 72px)" }}>

          {/* ── PROJECT INFO CARDS ── */}
          <Reveal>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "12px" }}>
              {[
                { label: "Роль",    value: "Арт-дирекшн, дизайнер",                    bg: dark ? "#1A1330" : "#E8E8EA", labelColor: dark ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.4)", textColor: dark ? "#fff" : PURPLE_DARK },
                { label: "Задача",  value: "Креативная концепция + сайт",                bg: PURPLE,                        labelColor: "rgba(255,255,255,0.55)",                            textColor: "#fff" },
                { label: "Команда", value: "Студия разработки и стейкхолдеры форума",   bg: LIME,                          labelColor: "rgba(0,0,0,0.45)",                                  textColor: "#0D0A1A" },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: item.bg,
                    borderRadius: "20px",
                    padding: isMobile ? "24px" : "clamp(24px, 3vw, 40px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: isMobile ? "100px" : "clamp(140px, 14vw, 200px)",
                    transition: "background 0.35s ease",
                  }}
                >
                  <p style={{ fontSize: "10px", color: item.labelColor, textTransform: "uppercase", letterSpacing: "0.12em", margin: 0, fontWeight: 600 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: "clamp(20px, 2.4vw, 32px)", fontWeight: 800, color: item.textColor, lineHeight: 1.15, margin: 0 }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>


          {/* ── CONTEXT ── */}
          <Reveal>
            <div style={{ background: PURPLE_DARK, borderRadius: R_LG, padding: "clamp(48px,6vw,88px) clamp(48px,6vw,80px)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: "-20%", right: "-5%", width: "50%", height: "100%", background: PURPLE, borderRadius: "50%", filter: "blur(140px)", opacity: 0.35, pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.12em", margin: "0 0 clamp(24px,3vw,40px)" }}>Контекст</p>
                <p style={{ fontSize: "clamp(32px,4.5vw,64px)", fontWeight: 900, color: "#fff", lineHeight: 1.08, margin: "0 0 clamp(24px,3vw,40px)" }}>
                  У форума не было айдентики. Онлайн и офлайн существовали отдельно.
                </p>
                <p style={{ fontSize: "clamp(15px,1.5vw,18px)", fontWeight: 400, color: "rgba(255,255,255,0.5)", lineHeight: 1.7, margin: 0, maxWidth: "640px" }}>
                  Стандартный визуал не вовлекал и не давал эмоциональной связи. Нужно было выделиться среди digital-событий и сделать так, чтобы люди запомнили.
                </p>
              </div>
            </div>
          </Reveal>

          {/* ── APPROACH — lime full-width ── */}
          <ApproachBlock />

          {/* ── KEY DECISIONS ── */}
          <KeyDecisions C={C} dark={dark} tr={tr} isMobile={isMobile} />

          {/* ── LOGO BLOCK ── */}
          <Reveal>
            <div style={{ background: C.card, borderRadius: R_LG, padding: "clamp(48px,6vw,80px) clamp(48px,6vw,80px)", transition: tr }}>
              <p style={{ fontSize: "clamp(28px,4vw,56px)", fontWeight: 900, color: C.title, lineHeight: 1.08, margin: 0, transition: tr, textAlign: "center", width: "100%" }}>
                Логотип форума 2025
              </p>

              {/* logo comparison */}
              <div style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                justifyContent: "center",
                gap: isMobile ? "24px" : "clamp(16px,3vw,40px)",
                marginTop: "clamp(40px,6vw,72px)",
              }}>
                {/* БЫЛО */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  {isMobile && <span style={{ fontSize: "11px", fontWeight: 700, color: C.label, textTransform: "uppercase", letterSpacing: "0.12em", transition: tr }}>Было</span>}
                  <NextImage
                    src="/rif/logo-old.png"
                    alt="Старый логотип РИФ"
                    width={260}
                    height={260}
                    style={{ width: isMobile ? "140px" : "clamp(160px,18vw,260px)", height: isMobile ? "140px" : "clamp(160px,18vw,260px)", objectFit: "contain", display: "block", opacity: 0.72 }}
                  />
                  {!isMobile && <span style={{ fontSize: "11px", fontWeight: 700, color: C.label, textTransform: "uppercase", letterSpacing: "0.12em", flexShrink: 0, transition: tr }}>Было</span>}
                </div>

                {/* connector */}
                {isMobile ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: PURPLE }} />
                    <div style={{ width: "1.5px", height: "32px", background: PURPLE, opacity: 0.4 }} />
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: PURPLE }} />
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", flex: "1 1 auto", maxWidth: "160px", minWidth: "48px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: PURPLE, flexShrink: 0 }} />
                    <div style={{ flex: 1, height: "1.5px", background: PURPLE, opacity: 0.4 }} />
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: PURPLE, flexShrink: 0 }} />
                  </div>
                )}

                {/* СТАЛО */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                  {isMobile && <span style={{ fontSize: "11px", fontWeight: 700, color: PURPLE, textTransform: "uppercase", letterSpacing: "0.12em" }}>Стало</span>}
                  <motion.img
                    src="/rif/logo-new.svg"
                    alt="Новый логотип РИФ"
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
                    style={{ width: isMobile ? "140px" : "clamp(160px,18vw,260px)", height: isMobile ? "140px" : "clamp(160px,18vw,260px)", objectFit: "contain", display: "block", imageRendering: "pixelated" }}
                  />
                  {!isMobile && <span style={{ fontSize: "11px", fontWeight: 700, color: PURPLE, textTransform: "uppercase", letterSpacing: "0.12em", flexShrink: 0 }}>Стало</span>}
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── BRAND ELEMENTS ── */}
          <Reveal>
            <div ref={brandRef} style={{
              background: C.card, borderRadius: R_LG,
              padding: "clamp(48px,6vw,80px) clamp(48px,6vw,80px) 30px",
              overflow: "hidden", transition: tr, position: "relative",
            }}>
              {/* text */}
              <div style={{ position: "relative", zIndex: 2, maxWidth: "600px" }}>
                <Label color={C.label}>Узнаваемость</Label>
                <p style={{ fontSize: "clamp(28px,4vw,56px)", fontWeight: 900, color: C.title, lineHeight: 1.08, margin: "16px 0 0", transition: tr }}>
                  Фирменные элементы
                </p>
                <p style={{ fontSize: "clamp(15px,1.4vw,18px)", fontWeight: 400, color: C.body, lineHeight: 1.65, margin: "20px 0 0", transition: tr }}>
                  Для айдентики я предложил несколько графических элементов и знаков, которые можно гибко адаптировать под разные носители.
                </p>
              </div>

              {/* тирекс — parallax scene, bleeds to card edges */}
              <div style={{
                position: "relative",
                marginLeft: "calc(-1 * clamp(48px,6vw,80px))",
                marginRight: "calc(-1 * clamp(48px,6vw,80px))",
                overflow: "hidden",
                height: "clamp(180px,22vw,280px)",
              }}>
                {/* тирекс fills container + 20% extra so parallax range stays visible */}
                <motion.img
                  src="/rif/trex.svg"
                  alt=""
                  style={{
                    display: "block", width: "100%",
                    position: "absolute", top: 0, left: 0,
                    pointerEvents: "none", imageRendering: "pixelated",
                    y: tirekY,
                  }}
                />

                {/* пикс — foreground parallax */}
                <motion.img
                  src="/rif/пикс.svg"
                  alt=""
                  style={{
                    position: "absolute",
                    right: "9%",
                    bottom: "calc(48% - 20px)",
                    height: "clamp(40px,5vw,65px)",
                    imageRendering: "pixelated",
                    pointerEvents: "none",
                    y: piksY,
                  }}
                />
              </div>
            </div>
          </Reveal>

          {/* ── ICONS ── */}
          <Reveal>
            <div style={{ background: C.card, borderRadius: R_LG, padding: "clamp(48px,6vw,80px) clamp(48px,6vw,80px)", transition: tr }}>
              <Label color={C.label}>Узнаваемость</Label>
              <p style={{ fontSize: "clamp(28px,4vw,56px)", fontWeight: 900, color: C.title, lineHeight: 1.08, margin: "16px 0 0", transition: tr }}>
                Иконки
              </p>
              <p style={{ fontSize: "clamp(15px,1.4vw,18px)", fontWeight: 400, color: C.body, lineHeight: 1.65, margin: "20px 0 0", transition: tr }}>
                Отдельно были разработаны иконки для сайта и мероприятия.
              </p>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "clamp(48px,6vw,72px)", gap: "clamp(16px,2vw,32px)", flexWrap: "wrap" }}>
                {[
                  { src: "/rif/comp2.svg",      alt: "Компьютер", delay: 0 },
                  { src: "/rif/clock.svg",        alt: "Часы",      delay: 0.07 },
                  { src: "/rif/planet.svg",     alt: "Планета",   delay: 0.14 },
                  { src: "/rif/clock2.svg",       alt: "Часы 2",    delay: 0.21 },
                  { src: "/rif/pencils.svg",   alt: "Карандаши", delay: 0.28 },
                  { src: "/rif/folder.svg",       alt: "Папка",     delay: 0.35 },
                ].map((icon, i) => (
                  <motion.div
                    key={icon.src}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.6, delay: icon.delay, ease: EASE }}
                    style={{ flex: "1 1 auto", display: "flex", justifyContent: "center" }}
                  >
                    <motion.img
                      src={icon.src}
                      alt={icon.alt}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3.2 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                      style={{
                        width: "clamp(80px,8vw,130px)",
                        height: "clamp(80px,8vw,130px)",
                        objectFit: "contain",
                        display: "block",
                        imageRendering: "pixelated",
                        filter: "drop-shadow(0px 16px 10px rgba(0,0,0,0.15))",
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* ── WEBSITE SHOWCASE ── */}
          <Reveal>
            <div style={{ background: C.card, borderRadius: R_LG, padding: "clamp(48px,6vw,80px)", transition: tr }}>
              <Label color={C.label}>Стилистика веб-сайта</Label>
              <p style={{ fontSize: "clamp(28px,4vw,56px)", fontWeight: 900, color: C.title, lineHeight: 1.08, margin: "16px 0 0", transition: tr }}>
                Web-site
              </p>
              <p style={{ fontSize: "clamp(15px,1.4vw,18px)", fontWeight: 400, color: C.body, lineHeight: 1.65, margin: "20px 0 clamp(40px,5vw,64px)", transition: tr }}>
                В команде с разработчиками был разработан <strong style={{ fontWeight: 700, color: C.title }}>веб-сайт</strong> форума.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ borderRadius: "16px", overflow: "hidden" }}>
                  <NextImage src="/rif/main1.png" alt="Главная страница РИФ 2025" width={1200} height={800} style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
                <div style={{ borderRadius: "16px", overflow: "hidden" }}>
                  <NextImage src="/rif/main2.png" alt="РИФ 2025 — страница сайта" width={1200} height={800} style={{ width: "100%", height: "auto", display: "block" }} />
                </div>
              </div>
            </div>
          </Reveal>

          {/* ── MOBILE SHOWCASE ── */}
          <Reveal>
            <div ref={mobileRef} style={{ background: C.card, borderRadius: R_LG, overflow: "hidden", transition: tr }}>
              <div style={{ padding: "clamp(48px,6vw,80px) clamp(48px,6vw,80px) 0" }}>
                <Label color={C.label}>Адаптивность</Label>
                <p style={{ fontSize: isMobile ? "36px" : "clamp(28px,4vw,56px)", fontWeight: 900, color: C.title, lineHeight: 1.08, margin: "16px 0 0", transition: tr }}>
                  Mobile
                </p>
                <p style={{ fontSize: "clamp(15px,1.4vw,18px)", fontWeight: 400, color: C.body, lineHeight: 1.65, margin: "4px 0 0", transition: tr }}>
                  Так же дизайн был адаптирован под мобильные устройства.
                </p>
              </div>
              <MotionImage
                src="/rif/mob3.png"
                alt="Мобильная версия сайта РИФ 2025"
                width={900}
                height={1200}
                style={{
                  width: isMobile ? "72%" : "86%",
                  height: "auto",
                  display: "block",
                  margin: isMobile ? "32px auto 0" : "-80px auto -400px",
                  y: isMobile ? undefined : mobImgY,
                }}
              />
            </div>
          </Reveal>

          {/* ── METRICS ── */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: GAP }}>
            <MetricCard value={2764} suffix=""      label="Участников форума" delay={0}   bg={PURPLE_DARK} textColor="#fff" />
            <MetricCard value={59}   suffix=".7 млн" label="Медиаохват"        delay={0.1} bg={PURPLE}      textColor="#fff" />
            <MetricCard value={476}  suffix=""      label="Упоминаний в СМИ"  delay={0.2} bg={LIME}        textColor={PURPLE_DARK} />
          </div>

          {/* ── MY ROLE ── */}
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "5fr 8fr", gap: GAP }}>
            <Reveal>
              <div style={{ background: C.cardGrey, borderRadius: R_LG, padding: "52px clamp(48px,6vw,80px)", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", transition: tr }}>
                <Label color={C.label}>Моя роль</Label>
                <p style={{ fontSize: "clamp(22px, 2.5vw, 34px)", fontWeight: 800, color: C.title, lineHeight: 1.22, margin: 0, transition: tr }}>
                  Сформировал концепцию и определил визуальное направление. Провёл его через весь проект.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div style={{ background: C.card, borderRadius: R_LG, padding: "52px clamp(48px,6vw,80px)", flex: 1, transition: tr }}>
                {[
                  { n: "01", t: "Сформировал креативную концепцию",         d: "Определил визуальное направление: взял культурный код retro gaming и Windows XP и перевёл его в визуальную систему." },
                  { n: "02", t: "Разработал ключевые элементы айдентики",   d: "Логотип, графика, иконки — всё вышло из единой пиксельной стилистики, а не набора разрозненных решений." },
                  { n: "03", t: "Задал систему для масштабирования",        d: "Принципы и паттерны работают на любых носителях без потери: сайт, навигация, офлайн." },
                  { n: "04", t: "Синхронизировал дизайн с разработкой",    d: "На всех этапах. Чёткая передача, меньше итераций, перенос в продакшн без потери качества." },
                  { n: "05", t: "Использовал AI для ускорения процесса",   d: "Генерация вариаций графики и поиск стилистики — ускорил этап исследований и референсов." },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "24px 0", borderTop: i === 0 ? "none" : `1px solid ${C.divider}`, display: "flex", gap: "24px", transition: tr }}>
                    <span style={{ fontSize: "11px", color: PURPLE, paddingTop: "3px", flexShrink: 0, fontWeight: 800, opacity: 0.38, minWidth: "28px" }}>{item.n}</span>
                    <div>
                      <p style={{ fontSize: "16px", fontWeight: 700, color: C.title, margin: "0 0 6px", transition: tr }}>{item.t}</p>
                      <p style={{ fontSize: "13px", fontWeight: 400, color: C.body, lineHeight: 1.65, margin: 0, transition: tr }}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* ── OFFLINE EVENT ── */}
          <Reveal>
            <div style={{ padding: "64px 72px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center" }}>
              <p style={{ fontSize: "clamp(28px, 4vw, 60px)", fontWeight: 900, color: C.title, lineHeight: 1.08, margin: 0, transition: tr }}>Offline event</p>
              <p style={{ fontSize: "17px", fontWeight: 400, color: C.body, lineHeight: 1.6, margin: 0, transition: tr }}>
                Мероприятие вышло масштабным и красивым. Локация — Moscow Country Club.
              </p>
            </div>
          </Reveal>

          {/* ── PHOTO GRID ── */}
          {(() => {
            const f = (name: string) => `/rif/frames/${name}`;
            const img = (name: string, pos = "center center") => (
              <NextImage src={f(name)} alt="РИФ 2025" fill style={{ objectFit: "cover", objectPosition: pos }} />
            );
            const two = isMobile ? "1fr 1fr" : "1fr 1fr";
            const three = isMobile ? "1fr 1fr" : "1fr 1fr 1fr";
            const wideLeft = isMobile ? "1fr 1fr" : "1fr 2fr";
            const wideRight = isMobile ? "1fr 1fr" : "2fr 1fr";
            const h360 = isMobile ? "160px" : "360px";
            const h380 = isMobile ? "170px" : "380px";
            const h320 = isMobile ? "140px" : "320px";
            const h420 = isMobile ? "180px" : "420px";
            const h480 = isMobile ? "220px" : "480px";
            const h460 = isMobile ? "210px" : "460px";
            const h520 = isMobile ? "240px" : "520px";
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>

                {/* БИЛБОРДЫ */}
                <div style={{ display: "grid", gridTemplateColumns: two, gap: GAP }}>
                  <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h360 }}>{img("frame-314.png")}</div></Reveal>
                  <Reveal delay={0.07}><div style={{ borderRadius: R, overflow: "hidden", height: h360 }}>{img("frame-315.png")}</div></Reveal>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: two, gap: GAP }}>
                  <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h360 }}>{img("frame-336.png")}</div></Reveal>
                  <Reveal delay={0.07}><div style={{ borderRadius: R, overflow: "hidden", height: h360 }}>{img("frame-337.png")}</div></Reveal>
                </div>

                {/* ТЕРРИТОРИЯ */}
                <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h480 }}>{img("frame-288.png")}</div></Reveal>
                <div style={{ display: "grid", gridTemplateColumns: wideLeft, gap: GAP }}>
                  <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h420 }}>{img("frame-289.png")}</div></Reveal>
                  <Reveal delay={0.07}><div style={{ borderRadius: R, overflow: "hidden", height: h420 }}>{img("frame-300.png", "center top")}</div></Reveal>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: three, gap: GAP }}>
                  <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h320 }}>{img("frame-305.png")}</div></Reveal>
                  <Reveal delay={0.07}><div style={{ borderRadius: R, overflow: "hidden", height: h320 }}>{img("frame-302.png")}</div></Reveal>
                  {!isMobile && <Reveal delay={0.12}><div style={{ borderRadius: R, overflow: "hidden", height: h320 }}>{img("frame-299.png")}</div></Reveal>}
                </div>
                {isMobile && (
                  <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h320 }}>{img("frame-299.png")}</div></Reveal>
                )}
                <div style={{ display: "grid", gridTemplateColumns: wideRight, gap: GAP }}>
                  <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h380 }}>{img("frame-265.png")}</div></Reveal>
                  <Reveal delay={0.07}><div style={{ borderRadius: R, overflow: "hidden", height: h380 }}>{img("frame-296.png")}</div></Reveal>
                </div>

                {/* ЛЮДИ */}
                <div style={{ display: "grid", gridTemplateColumns: wideRight, gap: GAP }}>
                  <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h380 }}>{img("frame-281.png")}</div></Reveal>
                  <Reveal delay={0.07}><div style={{ borderRadius: R, overflow: "hidden", height: h380 }}>{img("frame-322.png")}</div></Reveal>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: three, gap: GAP }}>
                  <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h320 }}>{img("frame-257.png")}</div></Reveal>
                  <Reveal delay={0.07}><div style={{ borderRadius: R, overflow: "hidden", height: h320 }}>{img("frame-279.png")}</div></Reveal>
                  {!isMobile && <Reveal delay={0.12}><div style={{ borderRadius: R, overflow: "hidden", height: h320 }}>{img("frame-311.png")}</div></Reveal>}
                </div>
                {isMobile && (
                  <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h320 }}>{img("frame-311.png")}</div></Reveal>
                )}

                {/* ЛЕКЦИИ */}
                <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h460 }}>{img("frame-292.png")}</div></Reveal>
                <div style={{ display: "grid", gridTemplateColumns: three, gap: GAP }}>
                  <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h360 }}>{img("frame-249.png")}</div></Reveal>
                  <Reveal delay={0.07}><div style={{ borderRadius: R, overflow: "hidden", height: h360 }}>{img("frame-253.png")}</div></Reveal>
                  {!isMobile && <Reveal delay={0.12}><div style={{ borderRadius: R, overflow: "hidden", height: h360 }}>{img("frame-254.png", "center top")}</div></Reveal>}
                </div>
                {isMobile && (
                  <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h360 }}>{img("frame-254.png", "center top")}</div></Reveal>
                )}

                {/* ДЕТАЛИ */}
                <div style={{ display: "grid", gridTemplateColumns: two, gap: GAP }}>
                  <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h380 }}>{img("frame-258.png")}</div></Reveal>
                  <Reveal delay={0.07}><div style={{ borderRadius: R, overflow: "hidden", height: h380 }}>{img("frame-323.png")}</div></Reveal>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: three, gap: GAP }}>
                  <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h320 }}>{img("frame-338.png")}</div></Reveal>
                  <Reveal delay={0.07}><div style={{ borderRadius: R, overflow: "hidden", height: h320 }}>{img("frame-295.png")}</div></Reveal>
                  {!isMobile && <Reveal delay={0.12}><div style={{ borderRadius: R, overflow: "hidden", height: h320 }}>{img("frame-270.png")}</div></Reveal>}
                </div>
                {isMobile && (
                  <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h320 }}>{img("frame-270.png")}</div></Reveal>
                )}

                {/* ВЕЧЕР */}
                <div style={{ display: "grid", gridTemplateColumns: wideRight, gap: GAP }}>
                  <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h420 }}>{img("frame-244.png")}</div></Reveal>
                  <Reveal delay={0.07}><div style={{ borderRadius: R, overflow: "hidden", height: h420 }}>{img("frame-261.png")}</div></Reveal>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: two, gap: GAP }}>
                  <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h380 }}>{img("frame-262.png")}</div></Reveal>
                  <Reveal delay={0.07}><div style={{ borderRadius: R, overflow: "hidden", height: h380 }}>{img("frame-263.png")}</div></Reveal>
                </div>
                <Reveal><div style={{ borderRadius: R, overflow: "hidden", height: h520 }}>{img("frame-242.png")}</div></Reveal>

              </div>
            );
          })()}
          {/* end PHOTO GRID */}

        </div>
      </div>

      {/* ── MARQUEE ── */}
      <div style={{ background: PURPLE, padding: "22px 0", overflow: "hidden", whiteSpace: "nowrap", margin: `${GAP} 0` }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ display: "inline-flex" }}
        >
          {Array.from({ length: 2 }).map((_, ri) => (
            <span key={ri} style={{ display: "inline-flex", alignItems: "center" }}>
              {["Art Direction", "Visual System", "Pixel Identity", "Retro Concept", "UX Design", "Digital + Offline",
                "Art Direction", "Visual System", "Pixel Identity", "Retro Concept", "UX Design", "Digital + Offline"].map((word, wi) => (
                <span key={wi} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "#fff", textTransform: "uppercase", padding: "0 28px", fontWeight: 700 }}>{word}</span>
                  <div style={{ width: 4, height: 4, background: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── OUTCOME + NEXT ── */}
      <div style={{ padding: isMobile ? "0 12px 40px" : `0 clamp(20px, 5vw, 80px) clamp(48px, 6vw, 80px)` }}>
        <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>

          <Reveal>
            <div style={{ background: PURPLE_DARK, borderRadius: R_LG, padding: "clamp(64px,8vw,100px) clamp(48px,6vw,80px)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", bottom: "-30%", right: "-8%", width: "50%", height: "80%", background: PURPLE, borderRadius: "50%", filter: "blur(140px)", opacity: 0.5, pointerEvents: "none" }} />
              <div style={{ position: "relative" }}>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.12em", margin: "0 0 32px" }}>Итог</p>
                <p style={{ fontSize: "clamp(32px,4.5vw,64px)", fontWeight: 900, color: "#fff", lineHeight: 1.08, maxWidth: "820px", margin: "0 0 64px" }}>
                  Концепция объединила сайт и офлайн-мероприятие в единый опыт.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? "24px 0" : 0, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
                  {[
                    { n: "59.7M", label: "медиаохват" },
                    { n: "2 764", label: "участника форума" },
                    { n: "476",   label: "упоминаний в СМИ" },
                    { n: "2026",  label: "концепция продлена на следующий год" },
                  ].map((s, i) => (
                    <div key={i} style={{ paddingTop: "40px", borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.1)" : "none", paddingLeft: i > 0 ? "clamp(24px,4vw,56px)" : "0" }}>
                      <p style={{ fontSize: "clamp(40px,5.5vw,80px)", fontWeight: 900, color: i === 3 ? LIME : "#fff", lineHeight: 1, margin: "0 0 12px", letterSpacing: "-0.02em" }}>{s.n}</p>
                      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, margin: 0 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Link href="/projects/project-02" style={{ display: "block", textDecoration: "none" }}>
            <motion.div
              whileHover={{ scale: 1.008 }}
              transition={{ duration: 0.3 }}
              style={{ background: C.nextBg, borderRadius: R_LG, padding: "60px clamp(48px,6vw,80px)", cursor: "pointer", transition: tr }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <Label color={C.label}>Следующий проект</Label>
                  <h2 style={{ fontSize: "clamp(52px, 7.5vw, 108px)", fontWeight: 900, color: C.title, lineHeight: 0.88, margin: "20px 0 0", transition: tr }}>
                    DIONIS
                  </h2>
                </div>
                <motion.div
                  whileHover={{ x: 8 }}
                  transition={{ duration: 0.3 }}
                  style={{ width: "68px", height: "68px", borderRadius: "50%", background: PURPLE, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "26px", flexShrink: 0 }}
                >
                  →
                </motion.div>
              </div>
            </motion.div>
          </Link>

        </div>
      </div>

    </main>
  );
}
