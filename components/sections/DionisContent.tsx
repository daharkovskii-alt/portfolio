"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useScreenSize } from "@/hooks/use-screen-size";

const C = {
  black:   "#0A0A0A",
  dark:    "#161616",
  mid:     "#2A2A2A",
  border:  "#222222",
  gray:    "#F2F2F2",
  silver:  "#717372",
  white:   "#FFFFFF",
  cream:   "#E8E5E0",
  cinnamon:"#9C4822",
  cin2:    "#7A3618",
  fg:      "rgba(255,255,255,0.9)",
  fgMid:   "rgba(255,255,255,0.55)",
  fgDim:   "rgba(255,255,255,0.3)",
  fgGhost: "rgba(255,255,255,0.15)",
};

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const BOUNDED = "'Bounded', sans-serif";
const INTER   = "'Inter', sans-serif";

const NBSP_RE = /(^|[\s —–\-])(в|во|на|над|за|по|под|при|без|для|из|изо|от|ото|до|об|обо|про|перед|через|и|а|но|или|либо|не|с|со|к|ко|у|о|то|что|как|же|бы|ли)\s+/gi;
function nbsp(text: string): string {
  let prev = text;
  for (let i = 0; i < 3; i++) {
    const next = prev.replace(NBSP_RE, "$1$2 ");
    if (next === prev) break;
    prev = next;
  }
  return prev;
}

function useCountUp(target: number, duration = 1.6, active: boolean, decimals = 0) {
  const [count, setCount] = useState(0);
  const factor = Math.pow(10, decimals);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / (duration * 1000), 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target * factor) / factor);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration, factor]);
  return count;
}

function Reveal({ children, delay = 0, style }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function AccentReveal({ children, delay = 0, style }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1.1, delay, ease: EASE }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-block",
      fontSize: "9px",
      color: C.cinnamon,
      textTransform: "uppercase",
      fontWeight: 600,
      marginBottom: "24px",
    }}>
      {children}
    </span>
  );
}

function Л2Block({ isMobile }: { isMobile: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-40%", "40%"]);
  return (
    <div ref={ref} style={{ position: "relative", overflow: "hidden" }}>
      <img src="/dionis-jewelry/content/l2.png" alt="" style={{ display: "block", width: "100%", height: "auto" }} />
      <motion.img
        src="/dionis-jewelry/content/logo.svg"
        alt=""
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          translateX: "-50%",
          translateY: "-50%",
          y,
          width: isMobile ? "36%" : "20%",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

export function DionisContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const screen = useScreenSize();
  const isMobile = screen.lessThan("md");

  return (
    <main style={{ backgroundColor: C.black, minHeight: "100dvh", color: C.white, fontFamily: INTER }}>

      {/* ── hero ── */}
      <div ref={heroRef} style={{ position: "relative", height: "100dvh", overflow: "hidden", backgroundColor: "#000000" }}>

        {/* bg image */}
        <img
          src="/dionis-jewelry/content/open1.jpg"
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
        />

        {/* inner layout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{ position: "absolute", inset: 0, zIndex: 2, display: "flex", flexDirection: "column" }}
        >
          {/* heading */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: isMobile ? "0 16px" : "0 40px", textAlign: "center" }}>
            <div>
              <p style={{ fontFamily: BOUNDED, fontSize: isMobile ? "clamp(26px, 8vw, 36px)" : "clamp(32px, 4.5vw, 64px)", fontWeight: 900, color: C.white, textTransform: "uppercase", lineHeight: 0.92, letterSpacing: "-0.02em", margin: 0 }}>
                DIONIS JEWELRY®
              </p>
              <p style={{ fontFamily: BOUNDED, fontSize: isMobile ? "clamp(26px, 8vw, 36px)" : "clamp(32px, 4.5vw, 64px)", fontWeight: 900, color: C.white, textTransform: "uppercase", lineHeight: 0.92, letterSpacing: "-0.02em", margin: 0 }}>
                REDESIGN
              </p>
            </div>
          </div>

          {/* meta strip */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.14)", display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
            {[
              { k: "Роль",      v: "Арт-лид" },
              { k: "Направление", v: "Бренд, UX/UI дизайн" },
            ].map((item, i) => (
              <div key={i} style={{ padding: isMobile ? "14px 16px" : "20px 28px", borderRight: i < 1 ? "1px solid rgba(255,255,255,0.14)" : undefined }}>
                <p style={{ fontFamily: "'Inter', system-ui, sans-serif", fontSize: isMobile ? "9px" : "10px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: isMobile ? "6px" : "8px" }}>{nbsp(item.k)}</p>
                <p style={{ fontFamily: INTER, fontSize: isMobile ? "13px" : "18px", fontWeight: 900, color: "#fff", textTransform: "uppercase", lineHeight: 1.1 }}>{nbsp(item.v)}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>


      {/* ── results ── */}
      <div style={{ backgroundColor: "#E8E6E2" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)" }}>
          {[
            { value: 35,   suffix: "%",    label: "Рост конверсии в корзину", sub: "UX переработка e-commerce",  decimals: 0 },
            { value: 28,   suffix: "%",    label: "Рост выручки",             sub: "За 6 месяцев после запуска", decimals: 0 },
            { value: 6,    suffix: " мес", label: "До первых результатов",    sub: "С момента старта проекта",   decimals: 0 },
            { value: 61.2, suffix: "%",    label: "Рост медийности",          sub: "Прирост аудитории",          decimals: 1 },
          ].map(({ value, suffix, label, sub, decimals }, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true, margin: "-10%" });
            const count = useCountUp(value, 1.6, inView, decimals);
            return (
              <motion.div
                key={label}
                ref={ref}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
                style={{
                  padding: isMobile ? "36px 20px" : "56px 36px",
                  borderRight: !isMobile && i < 3 ? "1px solid rgba(0,0,0,0.1)" : undefined,
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  gap: isMobile ? "20px" : "40px",
                }}
              >
                <div style={{
                  fontFamily: INTER,
                  fontSize: isMobile ? "56px" : "clamp(40px, 5vw, 80px)",
                  fontWeight: 900,
                  color: "#0A0A0A",
                  lineHeight: 0.85,
                  letterSpacing: "-0.04em",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {inView ? `${decimals > 0 ? count.toFixed(decimals) : count}${suffix}` : `0${suffix}`}
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#0A0A0A", textTransform: "uppercase", marginBottom: "6px" }}>{nbsp(label)}</p>
                  <p style={{ fontSize: "12px", color: "#717372" }}>{nbsp(sub)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── opening statement ── */}
      <div style={{ padding: isMobile ? "72px 20px 64px" : "120px 40px 100px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>
          <Reveal>
            <p style={{ fontSize: "9px", color: C.fgDim, textTransform: "uppercase", letterSpacing: "0.2em", fontWeight: 500, marginBottom: isMobile ? "32px" : "48px" }}>
              Контекст
            </p>
            <p style={{ fontSize: isMobile ? "20px" : "clamp(20px, 2vw, 30px)", fontWeight: 700, color: C.fg, lineHeight: isMobile ? 1.35 : 1.2, marginBottom: isMobile ? "28px" : "40px" }}>
              {isMobile ? (
                "Бренд находился в стадии активного роста, но визуальная и продуктовая части не поддерживали масштабирование. Единой системы не было — каждый канал жил по своим правилам."
              ) : (
                <>
                  Бренд находился в стадии активного роста, но визуальная <br />
                  и продуктовая части не поддерживали масштабирование.<br />
                  Единой системы не было — каждый канал жил по своим правилам.
                </>
              )}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{ fontSize: isMobile ? "14px" : "clamp(14px, 1.3vw, 18px)", fontWeight: 300, color: C.fgMid, lineHeight: 1.75 }}>
              <strong style={{ fontWeight: 600, color: C.fgMid }}>Интерфейс e-commerce</strong> был перегружен и слабо конвертировал. Сайт, упаковка
              и маркетинг говорили на разных языках. Это напрямую снижало эффективность
              и конверсию.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ── problem breakdown ── */}
      <div style={{ padding: isMobile ? "0 20px" : "0 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          }}>
            {[
              {
                title: "Нет единой системы",
                text: "Визуальный язык зависел от канала и исполнителя. Каждый носитель — сайт, упаковка, маркетинговые материалы — жил по своим правилам без общей логики.",
              },
              {
                title: "Слабый e-commerce",
                text: "Интерфейс каталога, карточки товара и checkout были перегружены. Пользователь терялся, конверсия падала в ключевых сценариях.",
              },
              {
                title: "Несогласованность каналов",
                text: "Коммуникации расходились между digital и offline. Маркетинг, разработка и дизайн работали вразнобой — это снижало эффективность каждого канала.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div style={{
                  paddingTop: isMobile ? "28px" : "40px",
                  paddingBottom: isMobile ? "28px" : "40px",
                  paddingLeft: isMobile ? 0 : (i === 0 ? 0 : "36px"),
                  paddingRight: isMobile ? 0 : (i === 2 ? 0 : "36px"),
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  height: "100%",
                  fontFamily: "'Inter', system-ui, sans-serif",
                  borderRight: !isMobile && i < 2 ? `1px solid ${C.border}` : "none",
                  borderBottom: isMobile && i < 2 ? `1px solid ${C.border}` : "none",
                }}>
                  <h3 style={{
                    fontSize: "16px",
                    fontWeight: 700,
                    color: C.white,
                    textTransform: "uppercase",
                    lineHeight: 1.3,
                    margin: 0,
                  }}>{nbsp(item.title)}</h3>
                  <p style={{
                    fontSize: "15px",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.72)",
                    lineHeight: 1.75,
                    margin: 0,
                  }}>{nbsp(item.text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── роль ── */}
      <div style={{ padding: isMobile ? "56px 20px" : "80px 40px", borderBottom: "1px solid rgba(0,0,0,0.08)", backgroundColor: "#F7F6F4" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ textAlign: "center" }}
          >
            <span style={{ display: "block", fontFamily: "'Inter', system-ui, sans-serif", fontSize: "9px", color: C.cinnamon, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.14em", marginBottom: "16px" }}>
              Моя роль
            </span>
            <h2 style={{ fontFamily: BOUNDED, fontSize: "clamp(48px, 6vw, 88px)", fontWeight: 900, color: "#0A0A0A", textTransform: "uppercase", lineHeight: 0.92, margin: 0, marginBottom: "40px" }}>
              Art Lead
            </h2>
          </motion.div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {[
              "Кросс-функциональное руководство",
              "Визуальное направление",
              "Продукт и маркетинг через дизайн",
              "Работа с подрядчиками",
            ].map((label, i) => (
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                style={{
                  display: "inline-block",
                  padding: "10px 18px",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#0A0A0A",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  lineHeight: 1,
                }}
              >
                {nbsp(label)}
              </motion.span>
            ))}
          </div>

        </div>
      </div>

      {/* ── content images ── */}
      <div style={{ padding: isMobile ? 0 : "0 40px", backgroundColor: "#000000" }}>
        <video
          src="/dionis-jewelry/content/main.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      </div>
      <div style={{ padding: isMobile ? 0 : "0 40px", backgroundColor: "#000000" }}>
        <img src="/dionis-jewelry/content/l1.png" alt="" style={{ display: "block", width: "100%", height: "auto" }} />
      </div>
      <div style={{ padding: isMobile ? 0 : "0 40px", backgroundColor: "#000000" }}>
        <Л2Block isMobile={isMobile} />
      </div>
      {["l3.png","l4.png"].map((file) => (
        <div key={file} style={{ padding: isMobile ? 0 : "0 40px", backgroundColor: "#000000" }}>
          <img src={`/dionis-jewelry/content/${file}`} alt="" style={{ display: "block", width: "100%", height: "auto" }} />
        </div>
      ))}

      {/* ── второе.mp4 ── */}
      <div style={{ padding: isMobile ? 0 : "0 40px", backgroundColor: "#000000" }}>
        <video
          src="/dionis-jewelry/content/video2.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      </div>

      {["l5.png","l6.png","l7.png","l8.png","l9.png","l10.png","l11.png","l12.png","l13.png","l14.png","l15.png"].map((file) => (
        <div key={file} style={{ padding: isMobile ? 0 : "0 40px", backgroundColor: "#000000" }}>
          <img
            src={`/dionis-jewelry/content/${file}`}
            alt=""
            style={file === "l11.png"
              ? { display: "block", width: "auto", maxWidth: "100%", height: "auto", margin: "0 auto" }
              : { display: "block", width: "100%", height: "auto" }
            }
          />
        </div>
      ))}

      {/* ── key decisions ── */}
      <div style={{ padding: isMobile ? "64px 20px" : "100px 40px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal style={{ marginBottom: isMobile ? "40px" : "64px" }}>
            <Tag>Ключевые решения</Tag>
            <h2 style={{ fontSize: isMobile ? "28px" : "clamp(28px, 3.5vw, 48px)", fontWeight: 900, color: C.white, textTransform: "uppercase", lineHeight: 1.05 }}>
              Что именно изменилось
            </h2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "1px", backgroundColor: C.border }}>
            {[
              {
                num: "01",
                title: "Единая визуальная система",
                text: "Визуальный язык зависел от канала — фрагментированный, непоследовательный. Определил принципы композиции, типографики и работы с продуктом. Задал правила для графики и акцентов. Синхронизировал digital и offline. Теперь бренд везде узнаваем.",
              },
              {
                num: "02",
                title: "Переработка UX e-commerce",
                text: "Каталог, карточка товара, checkout — всё было перегружено и теряло конверсию. Упростил структуру каталога, усилил иерархию карточки, убрал лишние шаги. Каждое решение — через гипотезу и аналитику. Итог: +35% к конверсии.",
              },
              {
                num: "03",
                title: "Дизайн-система",
                text: "Без системы каждый новый экран — задача с нуля. Собрал UI-kit для e-commerce, прописал правила сборки страниц и гайдлайны для маркетинга. Команда запускает экраны и промо без зависимости от одного дизайнера.",
              },
            ].map((item, i) => (
              <Reveal key={item.num} delay={i * 0.1}>
                <div style={{ backgroundColor: C.black, padding: isMobile ? "32px 20px" : "48px 36px", height: "100%" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
                    <span style={{ fontSize: "9px", color: C.cinnamon, fontWeight: 600 }}>{item.num}</span>
                    <div style={{ flex: 1, height: "1px", backgroundColor: C.border }} />
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: C.white, lineHeight: 1.2, marginBottom: "16px", textTransform: "uppercase" }}>
                    {nbsp(item.title)}
                  </h3>
                  <p style={{ fontSize: "15px", fontWeight: 300, color: C.fgMid, lineHeight: 1.75 }}>{nbsp(item.text)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── kpi (light) ── */}
      <div style={{ backgroundColor: "#E8E6E2" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)" }}>
          {[
            { value: 35,   suffix: "%",    label: "Рост конверсии в корзину", sub: "UX переработка e-commerce",  decimals: 0 },
            { value: 28,   suffix: "%",    label: "Рост выручки",             sub: "За 6 месяцев после запуска", decimals: 0 },
            { value: 6,    suffix: " мес", label: "До первых результатов",    sub: "С момента старта проекта",   decimals: 0 },
            { value: 61.2, suffix: "%",    label: "Рост медийности",          sub: "Прирост аудитории",          decimals: 1 },
          ].map(({ value, suffix, label, sub, decimals }, i) => {
            const ref = useRef<HTMLDivElement>(null);
            const inView = useInView(ref, { once: true, margin: "-10%" });
            const count = useCountUp(value, 1.6, inView, decimals);
            return (
              <motion.div
                key={label}
                ref={ref}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.9, delay: i * 0.12, ease: EASE }}
                style={{
                  padding: isMobile ? "36px 20px" : "56px 36px",
                  borderRight: !isMobile && i < 3 ? "1px solid rgba(0,0,0,0.1)" : undefined,
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  gap: isMobile ? "20px" : "40px",
                }}
              >
                <div style={{
                  fontFamily: INTER,
                  fontSize: isMobile ? "56px" : "clamp(40px, 5vw, 80px)",
                  fontWeight: 900,
                  color: "#0A0A0A",
                  lineHeight: 0.85,
                  letterSpacing: "-0.04em",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {inView ? `${decimals > 0 ? count.toFixed(decimals) : count}${suffix}` : `0${suffix}`}
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#0A0A0A", textTransform: "uppercase", marginBottom: "6px" }}>{nbsp(label)}</p>
                  <p style={{ fontSize: "12px", color: "#717372" }}>{nbsp(sub)}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>



      {/* ── cinnamon statement ── */}
      <div style={{ backgroundColor: C.cinnamon, padding: isMobile ? "64px 20px" : "100px 40px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <AccentReveal>
            <p style={{
              fontFamily: BOUNDED,
              fontSize: "clamp(40px, 6vw, 88px)",
              fontWeight: 900,
              color: C.white,
              textTransform: "uppercase",
              lineHeight: 0.95,
            }}>
              FROM<br />FRAGMENTED<br />TO SYSTEMATIC.
            </p>
          </AccentReveal>
          <Reveal delay={0.2} style={{ marginTop: "48px", maxWidth: "560px" }}>
            <p style={{ fontSize: "17px", fontWeight: 300, color: "rgba(255,255,255,0.75)", lineHeight: 1.75 }}>
              Проект стал переходом от визуального дизайна к управлению
              дизайн-системой и влиянию на бизнес. Бренд, продукт и маркетинг
              перестали зависеть от одного человека — они стали системой.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ── next project ── */}
      <Link href="/projects/rif-v2" style={{ display: "block", textDecoration: "none" }}>
        <motion.div
          whileHover={{ backgroundColor: C.dark }}
          transition={{ duration: 0.3 }}
          style={{ padding: isMobile ? "56px 20px" : "80px 40px", borderTop: `1px solid ${C.border}`, cursor: "pointer" }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "9px", color: C.cinnamon, textTransform: "uppercase", fontWeight: 600, marginBottom: "16px" }}>
                Следующий проект
              </p>
              <AccentReveal>
                <h2 style={{ fontFamily: BOUNDED, fontSize: "clamp(40px, 6vw, 88px)", fontWeight: 900, color: C.white, textTransform: "uppercase", lineHeight: 0.9 }}>
                  РИФ
                </h2>
              </AccentReveal>
            </div>
            <motion.span
              whileHover={{ x: 14 }}
              transition={{ duration: 0.3 }}
              style={{ fontSize: "40px", color: C.cinnamon, fontWeight: 300 }}
            >
              →
            </motion.span>
          </div>
        </motion.div>
      </Link>

    </main>
  );
}
