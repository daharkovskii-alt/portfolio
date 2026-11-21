"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import FaultyTerminal from "@/components/ui/FaultyTerminal";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const MONO = "'Courier New', Courier, monospace";

// ── palette ──────────────────────────────────────────────────
const BG      = "#080612";
const CARD    = "#0F0B1E";
const CARD2   = "#16102A";
const LIME    = "#9DFF2E";
const PURPLE  = "#6620D4";
const YELLOW  = "#FFD34D";
const RED_ERR = "#FF4455";
const WHITE   = "#E8E8E8";
const DIM     = "rgba(232,232,232,0.52)";
const GHOST   = "rgba(232,232,232,0.2)";
const BORDER  = "rgba(102,32,212,0.45)";
const LIME_B  = `rgba(157,255,46,0.18)`;

const SCANLINES = "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.18) 2px,rgba(0,0,0,0.18) 4px)";
const GRID_BG   = `linear-gradient(rgba(157,255,46,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(157,255,46,0.04) 1px,transparent 1px)`;

// ── pixel invader ─────────────────────────────────────────────
const INV = [
  [0,0,1,0,0,0,0,0,1,0,0],
  [0,0,0,1,0,0,0,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,0,0],
  [0,1,1,0,1,1,1,0,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,1],
  [1,0,1,1,1,1,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,1,0,1],
  [0,0,0,1,1,0,1,1,0,0,0],
];
function Invader({ color = LIME, px = 7 }: { color?: string; px?: number }) {
  const g = Math.max(1, Math.round(px * 0.18));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: g }}>
      {INV.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap: g }}>
          {row.map((cell, ci) => (
            <div key={ci} style={{
              width: px, height: px,
              backgroundColor: cell ? color : "transparent",
              boxShadow: cell ? `0 0 3px ${color}88` : "none",
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── blinking cursor ───────────────────────────────────────────
function Cursor({ color = LIME }: { color?: string }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn(v => !v), 520);
    return () => clearInterval(t);
  }, []);
  return <span style={{ opacity: on ? 1 : 0, color, fontFamily: MONO, marginLeft: 2 }}>█</span>;
}

// ── reveal ────────────────────────────────────────────────────
function Reveal({ children, delay = 0, style }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ── pixel frame (corner brackets) ────────────────────────────
function Frame({ children, accent = PURPLE, style }: {
  children: React.ReactNode; accent?: string; style?: React.CSSProperties;
}) {
  const C = 10;
  return (
    <div style={{ position: "relative", backgroundColor: CARD, ...style }}>
      {([
        { top: 0, left: 0,    borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` },
        { top: 0, right: 0,   borderTop: `2px solid ${accent}`, borderRight: `2px solid ${accent}` },
        { bottom: 0, left: 0, borderBottom: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` },
        { bottom: 0, right: 0,borderBottom: `2px solid ${accent}`, borderRight: `2px solid ${accent}` },
      ] as React.CSSProperties[]).map((s, i) => (
        <span key={i} style={{ position: "absolute", width: C, height: C, ...s }} />
      ))}
      {children}
    </div>
  );
}

// ── section tag ───────────────────────────────────────────────
function STag({ children, color = DIM }: { children: React.ReactNode; color?: string }) {
  return (
    <p style={{ fontFamily: MONO, fontSize: "9px", color, textTransform: "uppercase", letterSpacing: "0.18em", margin: 0 }}>
      {children}
    </p>
  );
}

// ── metric ────────────────────────────────────────────────────
function Metric({ value, suffix, label, delay, accent }: {
  value: number; suffix: string; label: string; delay: number; accent: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 1600, 1);
      setN(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value]);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
      style={{ fontFamily: MONO, padding: "36px 32px", backgroundColor: CARD2, borderTop: `2px solid ${accent}` }}
    >
      <STag color={accent}>HIGH SCORE</STag>
      <div style={{
        fontSize: "clamp(40px, 5vw, 68px)", fontWeight: 900, color: accent,
        lineHeight: 1, margin: "14px 0 12px",
        textShadow: `0 0 28px ${accent}55`,
        fontVariantNumeric: "tabular-nums",
      }}>
        {inView ? `${n}${suffix}` : `0${suffix}`}
      </div>
      <STag color={GHOST}>{label}</STag>
    </motion.div>
  );
}

// ── main ──────────────────────────────────────────────────────
export function RifRetro() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY      = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const GAP = "2px";

  return (
    <main style={{ backgroundColor: BG, minHeight: "100dvh", color: WHITE }}>

      {/* ═══════════════════════ HERO ═══════════════════════ */}
      <div ref={heroRef} style={{ position: "relative", height: "100dvh", overflow: "hidden" }}>
        {/* ГЛИЧ: <div style={{ position: "absolute", inset: 0, zIndex: 2, opacity: 0.28, mixBlendMode: "screen" }}><FaultyTerminal scale={2.3} digitSize={3.4} scanlineIntensity={0.45} glitchAmount={1.7} flickerAmount={1.2} noiseAmp={0.35} dither={0.3} curvature={0.6} tint="#9DFF2E" mouseReact mouseStrength={0.4} brightness={1.8} pageLoadAnimation={false} /></div> */}
        <motion.div style={{
          position: "absolute", inset: 0, y: heroY, height: "115%",
          backgroundColor: BG,
          backgroundImage: GRID_BG,
          backgroundSize: "20px 20px",
        }} />
        <div style={{ position: "absolute", inset: 0, background: SCANLINES, pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 60%, transparent 30%, rgba(8,6,18,0.9) 80%)", pointerEvents: "none" }} />

        {/* glow orbs */}
        <div style={{ position: "absolute", top: "15%", left: "10%", width: "35vw", height: "35vw", borderRadius: "50%", background: PURPLE, filter: "blur(110px)", opacity: 0.25, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "25%", right: "8%",  width: "22vw", height: "22vw", borderRadius: "50%", background: LIME,   filter: "blur(130px)", opacity: 0.1,  pointerEvents: "none" }} />

        {/* back */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ position: "absolute", top: 40, left: 40, zIndex: 20 }}>
          <Link href="/v2" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "12px 20px", borderRadius: "66px", border: "1px solid rgba(255,255,255,0.3)", backgroundColor: "#fff", color: "#0a0a0a", fontSize: "13px", fontWeight: 400, textDecoration: "none", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: "10px" }}>←</span>назад
          </Link>
        </motion.div>

        {/* invader top-right */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.45 }} transition={{ delay: 0.6 }}
          style={{ position: "absolute", top: 30, right: 40, zIndex: 20 }}>
          <Invader color={LIME} px={9} />
        </motion.div>

        {/* V2 link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          style={{ position: "absolute", top: 36, right: 160, zIndex: 20 }}>
          <Link href="/projects/rif-v2" style={{
            fontFamily: MONO, fontSize: "9px", color: LIME, letterSpacing: "0.15em",
            textDecoration: "none", border: `1px solid ${LIME}44`,
            padding: "6px 12px", backgroundColor: `${BG}cc`,
          }}>
            CLEAN_MODE
          </Link>
        </motion.div>

        {/* center text */}
        <motion.div style={{ position: "absolute", bottom: 60, left: 40, right: 40, opacity: heroOpacity }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <STag color={`${WHITE}44`}>// КОНЦЕПЦИЯ / АРТ-ДИРЕКШН / ВИЗУАЛЬНАЯ СИСТЕМА / САЙТ</STag>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: EASE }}
            style={{
              fontSize: "clamp(72px, 14vw, 200px)", fontWeight: 900,
              color: WHITE, lineHeight: 0.85,
              margin: "20px 0 0", textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            РИФ<br />
            <span style={{ color: LIME, textShadow: `0 0 60px ${LIME}44` }}>2025</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            style={{ marginTop: 28, display: "flex", alignItems: "center", gap: 8 }}>
            <STag color={LIME}>РОССИЙСКИЙ ИНТЕРНЕТ ФОРУМ</STag>
            <Cursor />
          </motion.div>
        </motion.div>
      </div>

      {/* ═══════════════════════ INFO STRIP ═══════════════════════ */}
      <div style={{ borderBottom: `1px solid ${BORDER}` }}>
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", backgroundColor: BORDER }}>
            {[
              { label: "ROLE://",   value: "АРТ-ДИРЕКШН" },
              { label: "YEAR://",   value: "2025" },
              { label: "FORMAT://", value: "DIGITAL + OFFLINE" },
              { label: "REACH://",  value: "59.7М ЧЕЛ." },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: CARD, padding: "28px 32px" }}>
                <p style={{ fontFamily: MONO, fontSize: "9px", color: LIME, opacity: 0.65, marginBottom: 10, letterSpacing: "0.15em" }}>{item.label}</p>
                <p style={{ fontFamily: MONO, fontSize: "15px", color: WHITE, letterSpacing: "0.05em" }}>{item.value}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ═══════════════════════ CONTEXT ═══════════════════════ */}
      <div style={{ padding: "100px 40px", maxWidth: "1200px", margin: "0 auto", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "80px", alignItems: "start" }}>
          <Reveal><STag>// ЗАДАЧА</STag></Reveal>
          <div>
            <Reveal delay={0.1}>
              <p style={{ fontSize: "clamp(18px, 2.2vw, 28px)", color: WHITE, lineHeight: 1.5, marginBottom: 40, fontWeight: 300 }}>
                Форуму нужен был новый визуальный язык — целостный, эмоциональный,
                работающий одинаково в digital и на физических носителях.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div style={{ fontFamily: MONO }}>
                {[
                  { lvl: "WRN", text: "Отсутствие целостной айдентики между онлайн и офлайн" },
                  { lvl: "WRN", text: "Слабая эмоциональная связь с аудиторией" },
                  { lvl: "ERR", text: "Необходимость выделиться среди digital-мероприятий" },
                  { lvl: "ERR", text: "Разрозненный визуал без единого визуального центра" },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "12px 0", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <span style={{ fontSize: "9px", color: item.lvl === "ERR" ? RED_ERR : YELLOW, paddingTop: 2, flexShrink: 0, letterSpacing: "0.1em", minWidth: 28 }}>
                      {item.lvl}
                    </span>
                    <span style={{ fontSize: "13px", color: DIM, lineHeight: 1.55 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ═══════════════════════ HERO IMAGE ═══════════════════════ */}
      <div style={{ padding: "60px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ position: "relative", overflow: "hidden", height: 440, border: `1px solid ${BORDER}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/rif/frames/frame_1057.png" alt="РИФ 2025" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: SCANLINES, opacity: 0.45, pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: 16, right: 20, opacity: 0.3 }}>
              <Invader color={LIME} px={6} />
            </div>
          </div>
        </Reveal>
      </div>

      {/* ═══════════════════════ KEY DECISIONS ═══════════════════════ */}
      <div style={{ padding: "20px 40px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 18, borderBottom: `1px solid ${BORDER}` }}>
            <STag>// КЛЮЧЕВЫЕ РЕШЕНИЯ</STag>
            <STag color={GHOST}>03 QUEST LOG</STag>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", backgroundColor: BORDER }}>
          {[
            {
              num: "01", accent: YELLOW,
              title: "Retro основа эмоциональной концепции",
              problem:  "нейтральный визуал не интересен",
              solution: "ностальгия через Windows XP и игры",
              result:   "эмоциональная ностальгия",
            },
            {
              num: "02", accent: PURPLE,
              title: "Гибкие фирменные элементы",
              problem:  "сложность адаптации под разные форматы",
              solution: "модульные графические элементы",
              result:   "быстрое производство материалов",
            },
            {
              num: "03", accent: LIME,
              title: "Иконки как часть системы",
              problem:  "несогласованность UI и офлайна",
              solution: "единый стиль иконок",
              result:   "связка digital и физического опыта",
            },
          ].map((card, i) => (
            <Reveal key={card.num} delay={i * 0.09}>
              <div style={{ backgroundColor: CARD, padding: "32px 28px", fontFamily: MONO, height: "100%", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <span style={{ fontSize: "9px", color: card.accent, letterSpacing: "0.15em", opacity: 0.75 }}>QUEST_{card.num}</span>
                  <Invader color={card.accent} px={4} />
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, color: WHITE, lineHeight: 1.3, marginBottom: 24 }}>{card.title}</h3>
                <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
                  {[
                    { pre: "> ПРОБЛЕМА", text: card.problem,  c: YELLOW },
                    { pre: "> РЕШЕНИЕ",  text: card.solution, c: `${WHITE}66` },
                    { pre: "✓ РЕЗУЛЬТАТ",text: card.result,   c: LIME   },
                  ].map((row, ri) => (
                    <div key={ri} style={{ padding: "12px 0", borderTop: `1px solid ${BORDER}` }}>
                      <span style={{ fontSize: "9px", color: row.c, display: "block", marginBottom: 5, letterSpacing: "0.1em" }}>{row.pre}:</span>
                      <span style={{ fontSize: "12px", color: ri === 2 ? LIME : DIM, lineHeight: 1.55, fontWeight: ri === 2 ? 600 : 400 }}>{row.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ═══════════════════════ HIGH SCORE ═══════════════════════ */}
      <div style={{ padding: "0 40px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal>
          <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 32, marginBottom: 24 }}>
            <STag>// HIGH SCORE</STag>
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", backgroundColor: BORDER }}>
          <Metric value={2764}  suffix=""        label="Участников форума" delay={0}   accent={YELLOW} />
          <Metric value={59}    suffix=".7 МЛН"  label="Медиаохват"        delay={0.1} accent={LIME}   />
          <Metric value={476}   suffix=""        label="Упоминаний в СМИ"  delay={0.2} accent={PURPLE} />
        </div>
      </div>

      {/* ═══════════════════════ MY ROLE ═══════════════════════ */}
      <div style={{ padding: "80px 40px", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal><STag>// МОЯ РОЛЬ</STag></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 80, marginTop: 40 }}>
            <Reveal delay={0.1}>
              <p style={{ fontSize: "clamp(18px, 2vw, 26px)", color: WHITE, lineHeight: 1.4, fontWeight: 300 }}>
                От концепции до синхронизации с разработкой — системно.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div style={{ fontFamily: MONO }}>
                {[
                  { n: "01", t: "Сформировал креативную концепцию",       d: "Ностальгия как точка входа, retro gaming и Windows XP как визуальный код." },
                  { n: "02", t: "Разработал ключевые элементы айдентики", d: "Логотип, пиксельная графика, иконки — единой системой." },
                  { n: "03", t: "Задал систему масштабирования",          d: "Принципы и паттерны работают на любых носителях." },
                  { n: "04", t: "Синхронизировал дизайн с разработкой",  d: "Чёткая документация, меньше правок, качество в продакшне." },
                  { n: "05", t: "Использовал AI для ускорения",           d: "Генерация вариаций, поиск стилистики, быстрый подбор референсов." },
                ].map((item, i) => (
                  <div key={i} style={{ padding: "20px 0", borderTop: `1px solid ${BORDER}`, display: "flex", gap: 20 }}>
                    <span style={{ fontSize: "9px", color: LIME, paddingTop: 3, flexShrink: 0, letterSpacing: "0.1em", opacity: 0.6 }}>[{item.n}]</span>
                    <div>
                      <p style={{ fontSize: "14px", color: WHITE, margin: "0 0 5px", fontWeight: 600 }}>{item.t}</p>
                      <p style={{ fontSize: "12px", color: DIM, lineHeight: 1.6, margin: 0 }}>{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ═══════════════════════ OFFLINE EVENT ═══════════════════════ */}
      <div style={{ padding: "60px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal>
          <Frame accent={PURPLE} style={{ padding: "56px 60px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, background: SCANLINES, opacity: 0.3, pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: 40, bottom: 30, opacity: 0.1 }}>
              <Invader color={LIME} px={16} />
            </div>
            <div style={{ position: "relative" }}>
              <STag color={DIM}>// МЕРОПРИЯТИЕ</STag>
              <p style={{ fontSize: "clamp(28px, 4vw, 56px)", fontWeight: 900, color: WHITE, lineHeight: 1.1, margin: "20px 0 14px", textTransform: "uppercase" }}>
                OFFLINE <span style={{ color: LIME, textShadow: `0 0 30px ${LIME}55` }}>EVENT</span>
              </p>
              <p style={{ fontSize: "16px", color: DIM, lineHeight: 1.65, maxWidth: 520, fontWeight: 300 }}>
                Мероприятие вышло масштабным и красивым. Локация — Moscow Country Club.
              </p>
            </div>
          </Frame>
        </Reveal>
      </div>

      {/* ═══════════════════════ PHOTOS ═══════════════════════ */}
      <div style={{ padding: "0 40px 40px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>

          {/* billboards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: GAP }}>
            <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
              <Reveal>
                <div style={{ overflow: "hidden", height: 320 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/rif/photos/billboard_1.png" alt="Билборд РИФ 2025" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
                </div>
              </Reveal>
              <Reveal delay={0.06}>
                <div style={{ overflow: "hidden", height: 220 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/rif/photos/billboard_3.png" alt="Билборд РИФ 2025" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              </Reveal>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
              <Reveal delay={0.08}>
                <div style={{ overflow: "hidden", height: 220 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/rif/photos/billboard_4.png" alt="Билборд РИФ 2025" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              </Reveal>
              <Reveal delay={0.12}>
                <div style={{ overflow: "hidden", height: 320 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/rif/photos/billboard_2.png" alt="Билборд РИФ 2025" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
                </div>
              </Reveal>
            </div>
          </div>

          {/* event row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: GAP }}>
            <Reveal>
              <div style={{ overflow: "hidden", height: 380 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/rif/photos/event_01.png" alt="Сцена РИФ 2025" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
              <Reveal delay={0.07}><div style={{ overflow: "hidden", flex: 1 }}><img src="/rif/photos/event_02.png" alt="РИФ 2025" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div></Reveal>{/* eslint-disable-line @next/next/no-img-element */}
              <Reveal delay={0.12}><div style={{ overflow: "hidden", flex: 1 }}><img src="/rif/photos/event_03.png" alt="РИФ 2025" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div></Reveal>{/* eslint-disable-line @next/next/no-img-element */}
            </div>
          </div>

          {/* event row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: GAP }}>
            {["event_08.png", "event_09.png", "event_10.png"].map((f, i) => (
              <Reveal key={f} delay={i * 0.07}>
                <div style={{ overflow: "hidden", height: 320 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/rif/photos/${f}`} alt="РИФ 2025" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
                </div>
              </Reveal>
            ))}
          </div>

          {/* event row 3 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: GAP }}>
            <Reveal>
              <div style={{ overflow: "hidden", height: 380 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/rif/photos/event_05.png" alt="РИФ 2025" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
              </div>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
              <Reveal delay={0.07}><div style={{ overflow: "hidden", flex: 1 }}><img src="/rif/photos/event_11.png" alt="РИФ 2025" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div></Reveal>{/* eslint-disable-line @next/next/no-img-element */}
              <Reveal delay={0.12}><div style={{ overflow: "hidden", flex: 1 }}><img src="/rif/photos/event_12.png" alt="РИФ 2025" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div></Reveal>{/* eslint-disable-line @next/next/no-img-element */}
            </div>
          </div>

          {/* event row 4 */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: GAP }}>
            {["event_13.png", "event_14.png", "event_15.png", "event_16.png"].map((f, i) => (
              <Reveal key={f} delay={i * 0.06}>
                <div style={{ overflow: "hidden", height: 240 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/rif/photos/${f}`} alt="РИФ 2025" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
              </Reveal>
            ))}
          </div>

          {/* event row 5 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: GAP }}>
            <Reveal>
              <div style={{ overflow: "hidden", height: 400 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/rif/photos/event_17.png" alt="РИФ 2025 — вечер" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
            </Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: GAP }}>
              <Reveal delay={0.08}><div style={{ overflow: "hidden", flex: 1 }}><img src="/rif/photos/event_18.png" alt="РИФ 2025" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} /></div></Reveal>{/* eslint-disable-line @next/next/no-img-element */}
              <Reveal delay={0.14}><div style={{ overflow: "hidden", flex: 1 }}><img src="/rif/photos/event_19.png" alt="РИФ 2025" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} /></div></Reveal>{/* eslint-disable-line @next/next/no-img-element */}
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════ MARQUEE ═══════════════════════ */}
      <div style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, backgroundColor: CARD2, padding: "18px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          style={{ display: "inline-flex" }}
        >
          {Array.from({ length: 2 }).map((_, ri) => (
            <span key={ri} style={{ display: "inline-flex", alignItems: "center" }}>
              {["ART_DIRECTION", "VISUAL_SYSTEM", "PIXEL_IDENTITY", "RETRO_CONCEPT", "UX_DESIGN", "DIGITAL+OFFLINE",
                "ART_DIRECTION", "VISUAL_SYSTEM", "PIXEL_IDENTITY", "RETRO_CONCEPT", "UX_DESIGN", "DIGITAL+OFFLINE"].map((w, wi) => (
                <span key={wi} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ fontFamily: MONO, fontSize: "9px", color: GHOST, textTransform: "uppercase", padding: "0 28px", letterSpacing: "0.12em" }}>{w}</span>
                  <span style={{ width: 4, height: 4, backgroundColor: LIME, opacity: 0.35, flexShrink: 0 }} />
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ═══════════════════════ OUTCOME ═══════════════════════ */}
      <div style={{ padding: "100px 40px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal><STag>// ИТОГ</STag></Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontSize: "clamp(28px, 4vw, 56px)", color: WHITE, lineHeight: 1.15, maxWidth: 900, marginTop: 36, fontWeight: 300 }}>
              Визуальная система превратила форум из набора точек контакта
              в цельный опыт — от сайта до офлайн-среды.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontSize: "15px", color: DIM, lineHeight: 1.7, maxWidth: 560, marginTop: 28, fontWeight: 300 }}>
              Концепция объединила digital и офлайн без потери стиля. Визуал стал
              узнаваемым и целостным, производство носителей ускорилось, а
              эмоциональная связь с аудиторией усилилась.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ═══════════════════════ NEXT PROJECT ═══════════════════════ */}
      <Link href="/projects/project-02" style={{ display: "block", textDecoration: "none" }}>
        <motion.div
          whileHover={{ backgroundColor: CARD }}
          transition={{ duration: 0.2 }}
          style={{ padding: "80px 40px", cursor: "pointer" }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <STag color={DIM}>// СЛЕДУЮЩИЙ ПРОЕКТ</STag>
              <h2 style={{ fontSize: "clamp(48px, 7vw, 108px)", fontWeight: 900, color: WHITE, lineHeight: 0.88, marginTop: 16, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
                DIONIS
              </h2>
            </div>
            <motion.span
              whileHover={{ x: 14 }}
              transition={{ duration: 0.25 }}
              style={{ fontSize: 36, color: LIME, fontFamily: MONO }}
            >→</motion.span>
          </div>
        </motion.div>
      </Link>

    </main>
  );
}
