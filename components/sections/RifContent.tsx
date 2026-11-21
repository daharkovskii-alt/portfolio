"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import FaultyTerminal from "@/components/ui/FaultyTerminal";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ─── color system ───────────────────────────────────────── */
const DARK_C = {
  bg:        "#050508",
  fg:        "rgba(240,240,240,0.95)",
  fgMuted:   "rgba(240,240,240,0.65)",
  fgDim:     "rgba(240,240,240,0.48)",
  fgSubtle:  "rgba(240,240,240,0.32)",
  fgGhost:   "rgba(240,240,240,0.18)",
  border:    "rgba(255,255,255,0.09)",
  accent:    "#3dff8f",
  heroGrad:  "linear-gradient(to top, #050508 0%, transparent 60%)",
  nextHover: "#0a0a0a",
  pixelBg:   "#0a0a0a",
  pixelGrid: "rgba(255,255,255,0.03)",
  scanline:  "rgba(0,0,0,0.18)",
  toggleBg:  "rgba(5,5,8,0.88)",
  toggleBdr: "rgba(61,255,143,0.22)",
  toggleFg:  "rgba(61,255,143,0.65)",
};

const LIGHT_C = {
  bg:        "#f5efe4",
  fg:        "rgba(12,10,8,0.92)",
  fgMuted:   "rgba(12,10,8,0.68)",
  fgDim:     "rgba(12,10,8,0.48)",
  fgSubtle:  "rgba(12,10,8,0.34)",
  fgGhost:   "rgba(12,10,8,0.2)",
  border:    "rgba(12,10,8,0.1)",
  accent:    "#1d9955",
  heroGrad:  "linear-gradient(to top, #f5efe4 0%, transparent 60%)",
  nextHover: "#ece6db",
  pixelBg:   "#e4ddd0",
  pixelGrid: "rgba(0,0,0,0.05)",
  scanline:  "rgba(0,0,0,0.05)",
  toggleBg:  "rgba(245,239,228,0.92)",
  toggleBdr: "rgba(29,153,85,0.25)",
  toggleFg:  "rgba(29,153,85,0.75)",
};

type C = typeof DARK_C;

/* ─── helpers ────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1.6, active: boolean) {
  const [count, setCount] = useState(0);
  const frameRef = useRef<number>(0);
  const startRef = useRef<number | null>(null);

  if (active && count === 0 && target > 0) {
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / (duration * 1000), 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
  }

  return count;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function PixelPlaceholder({ label, aspect, accent, C }: {
  label: string;
  aspect?: string;
  accent?: string;
  C: C;
}) {
  const a = accent ?? C.accent;
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: aspect ?? "16/9",
        position: "relative",
        backgroundColor: C.pixelBg,
        backgroundImage: `
          linear-gradient(${C.pixelGrid} 1px, transparent 1px),
          linear-gradient(90deg, ${C.pixelGrid} 1px, transparent 1px)
        `,
        backgroundSize: "12px 12px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(0deg, transparent, transparent 3px, ${C.scanline} 3px, ${C.scanline} 4px)`,
          pointerEvents: "none",
        }}
      />
      {[
        { top: 0, left: 0 },
        { top: 0, right: 0 },
        { bottom: 0, left: 0 },
        { bottom: 0, right: 0 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: "24px",
            height: "24px",
            ...pos,
            borderTop:    i < 2  ? `2px solid ${a}` : "none",
            borderBottom: i >= 2 ? `2px solid ${a}` : "none",
            borderLeft:   i % 2 === 0 ? `2px solid ${a}` : "none",
            borderRight:  i % 2 === 1 ? `2px solid ${a}` : "none",
            opacity: 0.45,
          }}
        />
      ))}
      <div style={{ position: "relative", textAlign: "center" }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: "9px", color: a, textTransform: "uppercase", opacity: 0.55, marginBottom: "8px" }}>▓▓▒░</div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: "10px", color: a, textTransform: "uppercase", opacity: 0.4 }}>{label}</div>
      </div>
    </div>
  );
}

function MetricCard({ value, suffix, label, delay, C }: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
  C: C;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const count = useCountUp(value, 1.6, inView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      style={{ borderTop: `1px solid ${C.border}`, paddingTop: "32px" }}
    >
      <div style={{ fontSize: "clamp(40px, 5vw, 72px)", fontWeight: 300, color: C.fg, lineHeight: 1, marginBottom: "16px", fontVariantNumeric: "tabular-nums" }}>
        {inView ? `${count}${suffix}` : `0${suffix}`}
      </div>
      <p style={{ fontSize: "11px", color: C.fgSubtle, textTransform: "uppercase" }}>
        {label}
      </p>
    </motion.div>
  );
}

/* ─── main component ─────────────────────────────────────── */
export function RifContent() {
  const [dark, setDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const C = dark ? DARK_C : LIGHT_C;

  useEffect(() => { setMounted(true); }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);

  return (
    <main style={{ backgroundColor: C.bg, minHeight: "100dvh", transition: "background-color 0.35s ease" }}>

      {/* ── hero ── */}
      <div ref={heroRef} style={{ position: "relative", height: "100dvh", overflow: "hidden" }}>
        {/* ГЛИЧ: <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.15, mixBlendMode: "screen" }}><FaultyTerminal scale={2.3} digitSize={3.4} scanlineIntensity={0.45} glitchAmount={1.7} flickerAmount={1.2} noiseAmp={0.35} dither={0.3} curvature={0.6} tint="#3dff8f" mouseReact mouseStrength={0.4} brightness={1.8} pageLoadAnimation={false} /></div> */}
        {/* pixel grid bg — always dark, it's the RIF identity */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "115%",
            y: heroY,
            backgroundColor: "#050508",
            backgroundImage: `
              linear-gradient(rgba(61,255,143,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(61,255,143,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.25) 3px, rgba(0,0,0,0.25) 4px)",
            pointerEvents: "none",
          }}
        />
        {/* fade to current page bg */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            background: C.heroGrad,
            transition: "background 0.35s ease",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ position: "absolute", top: "40px", left: "40px" }}
        >
          <Link
            href="/v2"
            style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "12px 20px", borderRadius: "66px", border: "1px solid rgba(255,255,255,0.3)", backgroundColor: "#fff", color: "#0a0a0a", fontSize: "13px", fontWeight: 400, textDecoration: "none", whiteSpace: "nowrap" }}
          >
            <span style={{ fontSize: "10px" }}>←</span>назад
          </Link>
        </motion.div>

        {/* ── theme toggle inside hero ── */}
        <motion.button
          onClick={() => setDark(d => !d)}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            position: "absolute",
            top: "34px",
            right: "40px",
            zIndex: 10,
            background: "rgba(61,255,143,0.12)",
            border: "1px solid rgba(61,255,143,0.5)",
            color: "#3dff8f",
            fontFamily: "'Courier New', monospace",
            fontSize: "9px",
            textTransform: "uppercase",
            padding: "8px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ width: "6px", height: "6px", backgroundColor: "#3dff8f", borderRadius: "1px", flexShrink: 0, display: "inline-block" }} />
          {dark ? "LIGHT_MODE" : "DARK_MODE"}
        </motion.button>

        <motion.div
          style={{
            position: "absolute",
            bottom: "60px",
            left: "40px",
            right: "40px",
            opacity: heroOpacity,
          }}
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ fontSize: "10px", color: "rgba(240,240,240,0.45)", textTransform: "uppercase", marginBottom: "20px" }}
          >
            РИФ 2025 — Концепция / Визуальная система / Сайт
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: EASE }}
            style={{ fontSize: "clamp(48px, 8vw, 120px)", fontWeight: 300, color: "rgba(240,240,240,0.95)", lineHeight: 0.92, maxWidth: "900px" }}
          >
            РИФ
          </motion.h1>
        </motion.div>
      </div>

      {/* ── sticky theme toggle strip ── */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, height: 0, overflow: "visible" }}>
        <button
          onClick={() => setDark(d => !d)}
          style={{
            position: "absolute",
            top: "16px",
            right: "40px",
            backgroundColor: dark ? "rgba(5,5,8,0.92)" : "rgba(245,239,228,0.96)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: dark ? "1px solid rgba(61,255,143,0.4)" : "1px solid rgba(29,153,85,0.4)",
            color: dark ? "#3dff8f" : "#1d9955",
            fontFamily: "'Courier New', monospace",
            fontSize: "9px",
            textTransform: "uppercase",
            padding: "8px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            transition: "all 0.35s ease",
          }}
        >
          <span style={{ width: "6px", height: "6px", backgroundColor: "currentColor", borderRadius: "1px", flexShrink: 0, display: "inline-block" }} />
          {dark ? "LIGHT_MODE" : "DARK_MODE"}
        </button>
      </div>

      {/* ── info row ── */}
      <div style={{ padding: "80px 40px", borderBottom: `1px solid ${C.border}`, transition: "border-color 0.35s ease" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "40px" }}>
          {[
            { label: "Роль",    value: "Концепция / Арт-дирекшн" },
            { label: "Фокус",   value: "Visual System / UX / Digital" },
            { label: "Формат",  value: "Digital + Offline форум" },
            { label: "Год",     value: "2025" },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08}>
              <p style={{ fontSize: "10px", color: C.fgSubtle, textTransform: "uppercase", marginBottom: "12px", transition: "color 0.35s ease" }}>{item.label}</p>
              <p style={{ fontSize: "14px", fontWeight: 300, color: C.fgMuted, transition: "color 0.35s ease" }}>{item.value}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── context ── */}
      <div style={{ padding: "100px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "80px", alignItems: "start" }}>
          <Reveal>
            <p style={{ fontSize: "10px", color: C.fgSubtle, textTransform: "uppercase", paddingTop: "8px", transition: "color 0.35s ease" }}>Контекст</p>
          </Reveal>
          <div>
            <Reveal delay={0.1}>
              <p style={{ fontSize: "clamp(18px, 2.2vw, 28px)", fontWeight: 300, color: C.fg, lineHeight: 1.45, marginBottom: "32px", transition: "color 0.35s ease" }}>
                Форуму нужен был новый визуальный язык — целостный, эмоциональный,
                работающий одинаково в digital и на физических носителях.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {[
                  "Отсутствие целостной айдентики между онлайн и офлайн",
                  "Слабая эмоциональная связь с аудиторией",
                  "Необходимость выделиться среди digital-мероприятий",
                  "Разрозненный визуал без единого визуального центра",
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{ padding: "18px 0", borderTop: `1px solid ${C.border}`, display: "flex", gap: "24px", alignItems: "flex-start", transition: "border-color 0.35s ease" }}
                  >
                    <span style={{ fontSize: "10px", color: C.fgGhost, paddingTop: "2px", flexShrink: 0, transition: "color 0.35s ease" }}>0{i + 1}</span>
                    <span style={{ fontSize: "14px", fontWeight: 300, color: C.fgDim, lineHeight: 1.6, transition: "color 0.35s ease" }}>{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── hero image placeholder ── */}
      <div style={{ padding: "0 40px", maxWidth: "1200px", margin: "0 auto 80px" }}>
        <Reveal>
          <PixelPlaceholder label="hero visual / логотип" aspect="21/9" C={C} />
        </Reveal>
      </div>

      {/* ── metrics ── */}
      <div style={{ padding: "60px 40px 100px", borderTop: `1px solid ${C.border}`, transition: "border-color 0.35s ease" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: "10px", color: C.fgSubtle, textTransform: "uppercase", marginBottom: "60px", transition: "color 0.35s ease" }}>Результат</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
            <MetricCard value={2764} suffix=""      label="Участников форума" delay={0}   C={C} />
            <MetricCard value={59}   suffix=".7 млн" label="Медиаохват"        delay={0.1} C={C} />
            <MetricCard value={476}  suffix=""      label="Упоминаний в СМИ"  delay={0.2} C={C} />
          </div>
        </div>
      </div>

      {/* ── approach statement ── */}
      <div style={{ padding: "100px 40px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, transition: "border-color 0.35s ease" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: "10px", color: C.fgSubtle, textTransform: "uppercase", marginBottom: "48px", transition: "color 0.35s ease" }}>Подход</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontSize: "clamp(28px, 4vw, 60px)", fontWeight: 300, color: C.fg, lineHeight: 1.15, maxWidth: "960px", transition: "color 0.35s ease" }}>
              Связал эмоцию ностальгии с современным digital-контекстом: перевёл
              культурный код retro gaming и Windows XP в визуальную систему.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ── key decisions ── */}
      <div style={{ padding: "120px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal>
          <p style={{ fontSize: "10px", color: C.fgSubtle, textTransform: "uppercase", marginBottom: "60px", transition: "color 0.35s ease" }}>Ключевые решения</p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", backgroundColor: C.border, transition: "background-color 0.35s ease" }}>
          {[
            { num: "01", title: "Retro как точка входа в эмоцию",    text: "Нейтральный визуал не вовлекал. Использовал ностальгию через эстетику Windows XP и retro gaming — получил сильный эмоциональный отклик аудитории." },
            { num: "02", title: "Система вместо набора графики",      text: "Заменил разрозненные элементы на набор повторяемых паттернов и принципов. Результат — масштабируемость на любые носители без потери целостности." },
            { num: "03", title: "Логотип как якорь стиля",            text: "При отсутствии визуального центра разработал логотип в пиксельной стилистике. Он задал тон всей айдентике и стал точкой отсчёта для всех решений." },
            { num: "04", title: "Гибкие фирменные элементы",          text: "Вместо жёстких форматов — модульные графические элементы. Ускорило производство материалов под любой формат: баннеры, навигация, мерч." },
            { num: "05", title: "Иконки как часть системы",           text: "Единый стиль иконок для UI и офлайн-носителей создал связку digital и физического опыта. Несогласованность между каналами исчезла." },
            { num: "06", title: "Интерфейс как часть опыта",          text: "Сайт — не просто навигация, а продолжение визуальной концепции. UX-решения строились от айдентики, а не от шаблона." },
          ].map((item, i) => (
            <Reveal key={item.num} delay={(i % 3) * 0.1}>
              <div style={{ backgroundColor: C.bg, padding: "48px 40px", height: "100%", transition: "background-color 0.35s ease" }}>
                <span style={{ fontSize: "10px", color: C.fgGhost, display: "block", marginBottom: "28px", transition: "color 0.35s ease" }}>{item.num}</span>
                <h3 style={{ fontSize: "clamp(16px, 1.8vw, 22px)", fontWeight: 300, color: C.fg, lineHeight: 1.3, marginBottom: "20px", transition: "color 0.35s ease" }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "13px", fontWeight: 300, color: C.fgDim, lineHeight: 1.7, transition: "color 0.35s ease" }}>
                  {item.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── image grid ── */}
      <div style={{ padding: "0 40px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <Reveal><PixelPlaceholder label="айдентика / логотип"  aspect="4/3" accent="#3dff8f" C={C} /></Reveal>
          <Reveal delay={0.12}><PixelPlaceholder label="пиксельная графика"  aspect="4/3" accent="#ff9f3d" C={C} /></Reveal>
        </div>
        <Reveal delay={0.2}>
          <PixelPlaceholder label="сайт / навигация форума" aspect="16/6" accent="#3d9fff" C={C} />
        </Reveal>
      </div>

      {/* ── what I did ── */}
      <div style={{ padding: "80px 40px", borderTop: `1px solid ${C.border}`, transition: "border-color 0.35s ease" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal>
            <p style={{ fontSize: "10px", color: C.fgSubtle, textTransform: "uppercase", marginBottom: "60px", transition: "color 0.35s ease" }}>Моя роль</p>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "80px", alignItems: "start" }}>
            <Reveal delay={0.1}>
              <p style={{ fontSize: "clamp(18px, 2vw, 26px)", fontWeight: 300, color: C.fg, lineHeight: 1.4, transition: "color 0.35s ease" }}>
                От концепции до синхронизации с разработкой.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { title: "Сформировал креативную концепцию",    text: "Определил смысловую основу: ностальгия как точка входа, retro gaming и Windows XP как визуальный код." },
                  { title: "Разработал ключевые элементы айдентики", text: "Логотип, пиксельная графика, иконки — всё связано единой системой, а не набором отдельных решений." },
                  { title: "Задал систему масштабирования",        text: "Принципы и паттерны позволяют применять айдентику на любых носителях — сайт, навигация, мерч, баннеры." },
                  { title: "Синхронизировал дизайн с разработкой", text: "Выстроил взаимодействие с командой разработчиков: чёткая документация, меньше правок, перенос в продакшн без потери качества." },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "24px 0", borderTop: `1px solid ${C.border}`, transition: "border-color 0.35s ease" }}>
                    <p style={{ fontSize: "14px", fontWeight: 300, color: C.fgMuted, marginBottom: "8px", transition: "color 0.35s ease" }}>{item.title}</p>
                    <p style={{ fontSize: "13px", fontWeight: 300, color: C.fgSubtle, lineHeight: 1.65, transition: "color 0.35s ease" }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── two images ── */}
      <div style={{ padding: "40px 40px 100px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <Reveal><PixelPlaceholder label="офлайн-носители / навигация" aspect="3/4" accent="#ff3d6e" C={C} /></Reveal>
          <Reveal delay={0.15}><PixelPlaceholder label="мобильная версия" aspect="3/4" accent="#c03dff" C={C} /></Reveal>
        </div>
      </div>

      {/* ── marquee ── */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "28px 0", overflow: "hidden", whiteSpace: "nowrap", transition: "border-color 0.35s ease" }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ display: "inline-flex" }}
        >
          {Array.from({ length: 2 }).map((_, ri) => (
            <span key={ri} style={{ display: "inline-flex", alignItems: "center" }}>
              {["Art Direction", "Visual System", "Pixel Identity", "Retro Concept", "UX Design", "Digital + Offline", "Art Direction", "Visual System", "Pixel Identity", "Retro Concept", "UX Design", "Digital + Offline"].map((word, wi) => (
                <span key={wi} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: C.fgGhost, textTransform: "uppercase", padding: "0 32px", transition: "color 0.35s ease" }}>{word}</span>
                  <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: C.fgGhost, flexShrink: 0, transition: "background-color 0.35s ease" }} />
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── outcome ── */}
      <div style={{ padding: "120px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "80px", alignItems: "start" }}>
          <Reveal>
            <p style={{ fontSize: "10px", color: C.fgSubtle, textTransform: "uppercase", paddingTop: "8px", transition: "color 0.35s ease" }}>Итог</p>
          </Reveal>
          <div>
            <Reveal delay={0.1}>
              <p style={{ fontSize: "clamp(18px, 2.2vw, 28px)", fontWeight: 300, color: C.fg, lineHeight: 1.45, marginBottom: "32px", transition: "color 0.35s ease" }}>
                Визуальная система превратила форум из набора точек контакта
                в цельный опыт — от сайта до офлайн-среды.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <p style={{ fontSize: "15px", fontWeight: 300, color: C.fgDim, lineHeight: 1.7, transition: "color 0.35s ease" }}>
                Концепция объединила digital и офлайн без потери стиля. Визуал стал
                узнаваемым и целостным, производство носителей ускорилось, а
                эмоциональная связь с аудиторией усилилась.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── next project ── */}
      <Link href="/projects/project-02" style={{ display: "block", textDecoration: "none" }}>
        <motion.div
          whileHover={{ backgroundColor: C.nextHover }}
          transition={{ duration: 0.3 }}
          style={{ padding: "80px 40px", borderTop: `1px solid ${C.border}`, cursor: "pointer", transition: "border-color 0.35s ease" }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "10px", color: C.fgSubtle, textTransform: "uppercase", marginBottom: "16px", transition: "color 0.35s ease" }}>Следующий проект</p>
              <h2 style={{ fontSize: "clamp(32px, 5vw, 72px)", fontWeight: 300, color: C.fg, lineHeight: 0.95, transition: "color 0.35s ease" }}>DIONIS</h2>
            </div>
            <motion.span whileHover={{ x: 12 }} transition={{ duration: 0.3 }} style={{ fontSize: "32px", color: C.fgSubtle, transition: "color 0.35s ease" }}>
              →
            </motion.span>
          </div>
        </motion.div>
      </Link>

    </main>
  );
}
