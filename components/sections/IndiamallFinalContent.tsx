"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const BG    = "#f5f5f7";
const CARD  = "#ffffff";
const DARK  = "#1d1d1f";
const TEXT  = "#1d1d1f";
const MUTED = "#6e6e73";
const DIM   = "#a1a1a6";
const EASE  = [0.16, 1, 0.3, 1] as [number, number, number, number];
const DISPLAY = "'MontserratAlternates', 'Montserrat Alternates', system-ui, sans-serif";

const S  = "clamp(40px, 6vh, 72px)";
const P  = "clamp(20px, 5vw, 80px)";
const CP = "clamp(28px, 4vw, 48px)";

function nb(s: string) {
  return s.replace(/(^|[ ])(в|на|и|а|но|из|от|по|с|к|у|о|за|до|при|со|ко|во|для|без|не|что|как|или|то|же) /g, "$1$2 ");
}


function Reveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function AccentReveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
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

function ScaleReveal({ children, delay = 0, style }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97, y: 12 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

const BEFORE_ITEMS = [
  { src: "/assets/indiamall-web1.png", alt: "Сайт до — главная" },
  { src: "/assets/indiamall-web2.png", alt: "Сайт до — секция"  },
  { src: "/assets/indiamall-viz1.png", alt: "Визитка до"        },
  { src: "/assets/indiamall-viz2.png", alt: "Флаер до"          },
];

function BeforeScroll() {
  const loop = [...BEFORE_ITEMS, ...BEFORE_ITEMS];
  return (
    <div style={{ paddingBottom: S }}>
      <div style={{ overflow: "hidden" }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          style={{ display: "flex", gap: "10px", width: "max-content" }}
        >
          {loop.map((item, i) => (
            <div key={`${item.src}-${i}`} style={{ flexShrink: 0, height: "300px", borderRadius: "14px", overflow: "hidden", backgroundColor: CARD }}>
              <img src={item.src} alt={item.alt} style={{ height: "100%", width: "auto", display: "block" }} />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <Reveal>
      <p style={{ fontSize: "11px", fontWeight: 600, color: light ? "rgba(255,255,255,0.3)" : DIM, textTransform: "uppercase", marginBottom: "48px" }}>
        {children}
      </p>
    </Reveal>
  );
}


function ParallaxImg({ src, alt, height = "clamp(300px, 45vw, 640px)", objectPosition = "center center" }: { src: string; alt: string; height?: string; objectPosition?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} style={{ borderRadius: "16px", overflow: "hidden", position: "relative", height }}>
      <motion.div style={{ y, position: "absolute", top: "-15%", left: 0, right: 0, bottom: "-15%" }}>
        <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition, display: "block" }} />
      </motion.div>
    </div>
  );
}

function ParallaxCard() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <div ref={ref} style={{ borderRadius: "16px", overflow: "hidden", position: "relative", height: "clamp(280px, 40vw, 560px)" }}>
      <motion.div style={{ y, position: "absolute", top: "-20%", left: 0, right: 0, bottom: "-20%" }}>
        <img
          src="/assets/indiamall-card.png"
          alt="Визитка Indiamall"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%", display: "block" }}
        />
      </motion.div>
    </div>
  );
}

export function IndiamallFinalContent() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <main style={{ backgroundColor: BG, minHeight: "100dvh", fontFamily: "'InterLatin', 'Afacad', system-ui, sans-serif", color: TEXT }}>

      {/* ══ HERO ══ */}
      <div ref={heroRef} style={{ padding: "12px 12px 0" }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          style={{ position: "relative", height: "calc(100dvh - 12px)", overflow: "hidden", borderRadius: "24px", backgroundColor: "#1a1a1a" }}
        >
          <img
            src="/assets/indiamall.png"
            alt="Indiamall"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", opacity: 0.65 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(20,20,20,0.9) 100%)" }} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ position: "absolute", top: "28px", left: "32px", zIndex: 3 }}
          >
            <Link href="/v2" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "12px 20px", borderRadius: "66px", border: "1px solid rgba(255,255,255,0.3)", backgroundColor: "#fff", color: "#0a0a0a", fontSize: "13px", fontWeight: 400, textDecoration: "none", whiteSpace: "nowrap" }}>
              <span style={{ fontSize: "10px" }}>←</span>назад
            </Link>
          </motion.div>

          <motion.div style={{ position: "absolute", bottom: "clamp(40px,6vh,80px)", left: P, right: P, opacity: heroOpacity }}>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.35, ease: EASE }}
              style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: "18px" }}
            >
              Design Lead · Бренд + Продукт + E-com
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.45, ease: EASE }}
              style={{ fontSize: "clamp(56px, 8vw, 120px)", fontWeight: 300, color: "#fff", lineHeight: 0.95, letterSpacing: "-0.02em" }}
            >
              INDIAMALL
            </motion.h1>
          </motion.div>
        </motion.div>
      </div>

      {/* ══ COMPANY BENTO ══ */}
      <div className="fim-section" style={{ padding: `${S} ${P} 0` }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "10px" }} className="fim-bento">
          <ScaleReveal>
            <motion.div
              whileHover={{ backgroundColor: "#f8f8fa" }}
              transition={{ duration: 0.25 }}
              style={{ backgroundColor: CARD, borderRadius: "24px", padding: CP, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: "40px", height: "100%", cursor: "default" }}
            >
              <p style={{ fontSize: "11px", fontWeight: 600, color: DIM, textTransform: "uppercase" }}>О компании</p>
              <p style={{ fontSize: "clamp(20px,2.2vw,30px)", lineHeight: 1.45, fontWeight: 400, color: TEXT }}>
                {nb("INDIAMALL — B2B-платформа для организации прямых оптовых поставок товаров от индийских производителей в Россию.")}
              </p>
            </motion.div>
          </ScaleReveal>
          <ScaleReveal delay={0.08}>
            <div style={{ backgroundColor: DARK, borderRadius: "24px", padding: CP, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase" }}>Тип</p>
              <p style={{ fontSize: "clamp(32px,4.5vw,60px)", fontWeight: 500, color: "#fff", lineHeight: 1, letterSpacing: "-0.02em", fontFamily: DISPLAY }}>B2B</p>
            </div>
          </ScaleReveal>
        </div>
      </div>

      {/* ══ META ══ */}
      <div className="fim-section" style={{ padding: `${S} ${P}` }}>
        <Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }} className="fim-meta">
            {[
              { label: "Роль",    value: "Design Lead" },
              { label: "Зона",    value: "Бренд + Продукт + E-com" },
              { label: "Команда", value: "Маркетолог + Dev + Подрядчики" },
              { label: "Формат",  value: "End-to-end" },
            ].map((item, i) => (
              <div key={item.label} style={{ paddingRight: "clamp(12px,2vw,28px)", borderLeft: i > 0 ? "1px solid #d8d8d8" : "none", paddingLeft: i > 0 ? "clamp(12px,2vw,28px)" : "0" }}>
                <p style={{ fontSize: "11px", fontWeight: 600, color: DIM, textTransform: "uppercase", marginBottom: "10px" }}>{item.label}</p>
                <p style={{ fontSize: "15px", fontWeight: 400, color: MUTED }}>{item.value}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* ══ OPENING — dark block ══ */}
      <div className="fim-section" style={{ padding: `0 ${P}`, paddingBottom: S }}>
        <ScaleReveal>
          <div style={{ backgroundColor: DARK, borderRadius: "28px", padding: CP, overflow: "hidden" }}>
            <AccentReveal>
              <p style={{ fontSize: "clamp(28px, 4.5vw, 64px)", fontWeight: 500, lineHeight: 1.1, marginBottom: "36px", letterSpacing: "-0.02em", color: "#fff", maxWidth: "800px", fontFamily: DISPLAY }}>
                {nb("Продукт, маркетинг и офлайн — три разных языка в одной компании.")}
              </p>
            </AccentReveal>
            <Reveal delay={0.2}>
              <p style={{ fontSize: "18px", fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.75, maxWidth: "560px" }}>
                {nb("Собрать всё в одну систему, ")}
                <em style={{ fontStyle: "italic", color: "rgba(255,255,255,0.85)" }}>{nb("которая работает без ручного контроля на каждом шаге.")}</em>
              </p>
            </Reveal>
          </div>
        </ScaleReveal>
      </div>

      {/* ══ СТАРЫЙ ЛОГО + РЕСЕРЧ ══ */}
      <div className="fim-section" style={{ padding: `0 ${P}`, paddingBottom: S }}>
        <Reveal>
          <div style={{ borderRadius: "24px", backgroundColor: CARD, padding: "clamp(24px, 4vw, 48px)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px, 4vw, 64px)" }} className="fim-logo-grid">
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: DIM, textTransform: "uppercase", marginBottom: "24px" }}>Старый лого</p>
              <img src="/assets/indiamall-logo-old.svg" alt="Старый логотип Indiamall" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: DIM, textTransform: "uppercase", marginBottom: "24px" }}>Ресерч похожих лого</p>
              <img src="/assets/indiamall-research.svg" alt="Ресерч логотипов" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </div>
        </Reveal>
      </div>

      {/* ══ ДО РЕДИЗАЙНА ══ */}
      <BeforeScroll />

      {/* ══ 01 — ПРОБЛЕМА ══ */}
      <div className="fim-section" style={{ padding: `0 ${P}`, paddingBottom: S }}>
        <SectionLabel>01 — Контекст и проблема</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", backgroundColor: "#e0e0e5", borderRadius: "24px", overflow: "hidden" }} className="fim-problem">
          {[
            { title: "Хаотичный визуал",       text: nb("Каждый материал — с нуля, без правил. Один стиль в рекламе, другой в продукте, третий на офлайне.") },
            { title: "Нет единого стиля",       text: nb("Сайт и маркетинг выглядели как разные бренды. Узнаваемость — близкая к нулю.") },
            { title: "Слабое позиционирование", text: nb("Непонятно кто это и для кого. Клиент не запоминал — уходил к конкуренту.") },
            { title: "Нет процессов",           text: nb("Задачи ставились хаотично, правки циклились бесконечно. Результат зависел от настроения дня.") },
          ].map((item, i) => (
            <div key={item.title} style={{ height: "100%" }}>
              <motion.div
                whileHover={{ backgroundColor: "#fafafa" }}
                transition={{ duration: 0.2, ease: EASE }}
                style={{
                  backgroundColor: "#ffffff",
                  padding: CP,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(16px,2vh,24px)",
                  cursor: "default",
                  minHeight: "240px",
                }}
              >
                <span style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: DIM,
                  textTransform: "uppercase",
                }}>
                  0{i + 1}
                </span>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "clamp(10px,1.2vh,14px)" }}>
                  <h3 style={{ fontSize: "clamp(19px,2vw,26px)", fontWeight: 500, lineHeight: 1.15, color: TEXT, fontFamily: DISPLAY, margin: 0 }}>{item.title}</h3>
                  <p style={{ fontSize: "clamp(14px,1.1vw,16px)", fontWeight: 400, color: MUTED, lineHeight: 1.7, margin: 0 }}>{item.text}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* ══ 02 — ЗАДАЧА ══ */}
      <div className="fim-section" style={{ padding: `0 ${P}`, paddingBottom: S }}>
        <div style={{ textAlign: "center" }}><SectionLabel>02 — Задача</SectionLabel></div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }} className="fim-task">
          {[
            { title: "Конверсия",       text: nb("Поднять конверсию через визуал, который вызывает доверие с первого касания."),                         accent: false },
            { title: "Консистентность", text: nb("Один стиль везде: web, офлайн, соцсети. Чтобы бренд узнавали, не читая название."),                   accent: false },
            { title: "Масштаб",         text: nb("Система, с которой команда работает сама. Без дизайнера на каждом шаге."),                             accent: true  },
          ].map((item, i) => (
            <ScaleReveal key={item.title} delay={i * 0.09}>
              <motion.div
                whileHover={{ y: -3, backgroundColor: item.accent ? "#e0e4f0" : "#e8eaf0" }}
                transition={{ duration: 0.25, ease: EASE }}
                style={{
                  backgroundColor: item.accent ? "#e4e8f2" : "#eef0f5",
                  borderRadius: "20px",
                  padding: CP,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "clamp(32px,4vh,56px)",
                  cursor: "default",
                  minHeight: "220px",
                }}
              >
                <span style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  backgroundColor: "rgba(29,29,31,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: 600, color: MUTED,
                  flexShrink: 0,
                }}>
                  0{i + 1}
                </span>
                <div>
                  <h3 style={{ fontSize: "clamp(17px,2vw,22px)", fontWeight: 500, marginBottom: "12px", color: TEXT, lineHeight: 1.2, fontFamily: DISPLAY }}>{item.title}</h3>
                  <p style={{ fontSize: "15px", fontWeight: 400, color: MUTED, lineHeight: 1.65 }}>{item.text}</p>
                </div>
              </motion.div>
            </ScaleReveal>
          ))}
        </div>
      </div>

      {/* ══ 03 — МОЯ РОЛЬ ══ */}
      <div className="fim-section" style={{ padding: `0 ${P}`, paddingBottom: S }}>
        <ScaleReveal>
          <div style={{ backgroundColor: DARK, borderRadius: "28px", padding: CP, overflow: "hidden" }}>
            <SectionLabel light>03 — Моя роль</SectionLabel>

            <AccentReveal style={{ marginBottom: "clamp(20px,3vh,32px)" }}>
              <p style={{ fontSize: "clamp(28px,3.2vw,48px)", fontWeight: 500, lineHeight: 1.1, letterSpacing: "-0.01em", color: "#fff", fontFamily: DISPLAY }}>
                {"Единственный дизайнер на проекте."}<br />{"Выстраивал систему с нуля —"}<br />{"от стратегии до производства."}
              </p>
            </AccentReveal>
            <Reveal delay={0.15} style={{ marginBottom: "clamp(32px,4vh,56px)" }}>
              <p style={{ fontSize: "17px", fontWeight: 300, color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}>
                {nb("Работал от задач бизнеса — закрывал end-to-end: от идеи до продакшена.")}<br />
                {nb("Без формального ТЗ — через гипотезы и конкретные предложения.")}
              </p>
            </Reveal>

            {/* Бенто-сетка: акцентная карточка слева + 4 карточки справа */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px", alignItems: "start" }} className="fim-role-bento">

              {/* Акцентная карточка — занимает всю высоту */}
              <ScaleReveal style={{ alignSelf: "stretch" }}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{
                    background: "linear-gradient(to bottom, #C85A1A 0%, #D4683A 25%, #E6843A 55%, #F2AA70 80%, #F5C898 100%)",
                    borderRadius: "16px",
                    padding: "1.5px",
                    height: "100%",
                    cursor: "default",
                    boxShadow: "inset 0 0 0 1.5px rgba(255,170,96,0.75)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* прогрессивный блур снизу */}
                  <div style={{
                    position: "absolute",
                    bottom: 0, left: 0, right: 0,
                    height: "55%",
                    background: "linear-gradient(to bottom, transparent 0%, rgba(230,114,13,0.18) 100%)",
                    backdropFilter: "blur(0px)",
                    pointerEvents: "none",
                    zIndex: 1,
                  }} />
                  <div style={{
                    padding: "clamp(24px,3vw,36px)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                    zIndex: 2,
                  }}>
                    <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", textTransform: "uppercase" }}>
                      Brand Lead
                    </p>
                    <div>
                      <p style={{ fontSize: "clamp(18px,1.8vw,22px)", color: "#fff", lineHeight: 1.45, fontWeight: 400, marginBottom: "clamp(16px,2vh,28px)" }}>
                        {nb("Сформировал бренд с нуля: позиционирование → визуальная система.")}
                      </p>
                      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.65, fontWeight: 300 }}>
                        {nb("Гайдлайн с нуля: цвет, типографика, сетки, принципы. Один стиль во всех точках контакта — бренд стало можно узнать.")}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </ScaleReveal>

              {/* Сетка 2×2 */}
              <div className="fim-role-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {[
                  { label: "Design System",  short: nb("Единый стиль для веба, продукта и офлайна."),          detail: nb("Шаблоны для соцсетей, презентаций, полиграфии. Новый материал — за часы, не за дни.") },
                  { label: "UX / Продукт",   short: nb("Редизайн ключевых страниц и UI-элементов."),           detail: nb("Продукт стал частью бренда, а не отдельным объектом. Единый UX-язык для всей платформы.") },
                  { label: "Production",     short: nb("Типографии, носители, раздатка, стенды, выпуск."),     detail: nb("Контролировал от макета до готового носителя. Менеджеры перестали импровизировать — всё готово заранее.") },
                  { label: "AI в процессе",  short: nb("Концепты и 3D за часы вместо дней."),                  detail: nb("Промт-система для 3D-иллюстраций. Ресёрч и анализ конкурентов — в разы быстрее.") },
                ].map((card, i) => (
                  <ScaleReveal key={card.label} delay={i * 0.06}>
                    <motion.div
                      whileHover={{ y: -3, backgroundColor: "rgba(255,255,255,0.13)" }}
                      transition={{ duration: 0.25, ease: EASE }}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        borderRadius: "16px",
                        padding: "clamp(20px,2.5vw,28px)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "clamp(12px,1.5vh,16px)",
                        cursor: "default",
                        minHeight: "180px",
                      }}
                    >
                      <div>
                        <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", marginBottom: "8px" }}>{card.label}</p>
                        <p style={{ fontSize: "clamp(13px,1.2vw,15px)", color: "#fff", lineHeight: 1.5, fontWeight: 500, marginBottom: "8px" }}>{card.short}</p>
                        <p style={{ fontSize: "clamp(12px,1vw,13px)", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, fontWeight: 300 }}>{card.detail}</p>
                      </div>
                    </motion.div>
                  </ScaleReveal>
                ))}
              </div>
            </div>
          </div>
        </ScaleReveal>
      </div>

      {/* ══ НОВЫЙ БРЕНД ══ */}
      <div className="fim-section" style={{ padding: `0 ${P}`, paddingBottom: S }}>
        <div style={{ textAlign: "center" }}><SectionLabel>Новый бренд</SectionLabel></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {/* Строение */}
          <ScaleReveal>
            <div style={{ backgroundColor: CARD, borderRadius: "16px", overflow: "hidden", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(20px,3vw,40px)" }}>
              <img src="/assets/indiamall-building.png" alt="Строение бренда" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
            </div>
          </ScaleReveal>
          {/* Лого мини цветной */}
          <ScaleReveal delay={0.06}>
            <div style={{ backgroundColor: "#F88740", borderRadius: "16px", overflow: "hidden", aspectRatio: "1/1", display: "flex", alignItems: "center", justifyContent: "center", padding: "clamp(20px,3vw,40px)" }}>
              <img src="/assets/indiamall-logo-mini.svg" alt="Мини логотип Indiamall" style={{ width: "60%", height: "60%", objectFit: "contain", display: "block" }} />
            </div>
          </ScaleReveal>
          {/* Билборд */}
          <ScaleReveal delay={0.1} style={{ gridColumn: "1 / -1" }}>
            <ParallaxImg src="/assets/indiamall-billboard.png" alt="Билборд Indiamall" height="clamp(320px, 48vw, 680px)" objectPosition="center center" />
          </ScaleReveal>
          {/* Глас 1 */}
          <ScaleReveal delay={0.12}>
            <div style={{ borderRadius: "16px", overflow: "hidden" }}>
              <img src="/assets/indiamall-glas.png" alt="Indiamall глас" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </ScaleReveal>
          {/* Глас 2 */}
          <ScaleReveal delay={0.16}>
            <div style={{ borderRadius: "16px", overflow: "hidden" }}>
              <img src="/assets/indiamall-glas2.png" alt="Indiamall глас 2" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </ScaleReveal>
          {/* Бан 1 + подпись */}
          <ScaleReveal delay={0.18}>
            <div style={{ borderRadius: "16px", overflow: "hidden", position: "relative" }}>
              <img src="/assets/indiamall-ban1.png" alt="Indiamall 3D иконки" style={{ width: "100%", height: "auto", display: "block" }} />
              <p style={{ position: "absolute", bottom: "clamp(16px,3%,28px)", left: 0, right: 0, fontSize: "clamp(13px,1.2vw,16px)", color: MUTED, textAlign: "center", lineHeight: 1.5 }}>
                Пример стилизации <strong style={{ color: TEXT }}>3Д иконок</strong> для сайта
              </p>
            </div>
          </ScaleReveal>
          {/* Бан 2 */}
          <ScaleReveal delay={0.22}>
            <div style={{ borderRadius: "16px", overflow: "hidden" }}>
              <img src="/assets/indiamall-ban2.png" alt="Indiamall бан 2" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </ScaleReveal>
          {/* Пакет — на всю ширину, параллакс */}
          <div style={{ gridColumn: "1 / -1" }}>
            <ParallaxImg src="/assets/indiamall-packet.png" alt="Пакет Indiamall" height="clamp(300px, 42vw, 600px)" objectPosition="center 30%" />
          </div>
          {/* Ручка */}
          <ScaleReveal delay={0.26}>
            <div style={{ borderRadius: "16px", overflow: "hidden" }}>
              <img src="/assets/indiamall-pen.png" alt="Ручка Indiamall" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </ScaleReveal>
          {/* Бейдж */}
          <ScaleReveal delay={0.28}>
            <div style={{ borderRadius: "16px", overflow: "hidden" }}>
              <img src="/assets/indiamall-badge.png" alt="Бейдж Indiamall" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>
          </ScaleReveal>
          {/* Визитка с параллаксом — на всю ширину */}
          <div style={{ gridColumn: "1 / -1" }}>
            <ParallaxCard />
          </div>
        </div>
      </div>

      {/* ══ UX / ПРОДУКТ ══ */}
      <div className="fim-section" style={{ padding: `0 ${P}`, paddingBottom: S }}>
        <div style={{ textAlign: "center" }}><SectionLabel>UX / Продукт</SectionLabel></div>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }} className="fim-ux">
          <AccentReveal delay={0.05} style={{ marginBottom: "36px" }}>
            <p style={{ fontSize: "clamp(28px, 3.5vw, 52px)", fontWeight: 500, lineHeight: 1.15, fontFamily: DISPLAY }}>
              Консистентность,<br />читаемость, простота.
            </p>
          </AccentReveal>
          <Reveal delay={0.15} style={{ marginBottom: "36px" }}>
            <p style={{ fontSize: "17px", fontWeight: 300, color: MUTED, lineHeight: 1.75, textAlign: "center" }}>
              {nb("Задал единый UX-подход для всей платформы. Разработал страницы о компании, контакты, новости. Внедрил cookie-модуль и доработал UI-элементы.")}
            </p>
          </Reveal>
        </div>
      </div>



      {/* ══ 06 — РЕЗУЛЬТАТ ══ */}
      <div className="fim-section" style={{ padding: `0 ${P}`, paddingBottom: S }}>
        <SectionLabel>06 — Результат</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }} className="fim-result">
          <ScaleReveal style={{ gridColumn: "1 / -1" }}>
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.25 }}
              style={{
                backgroundColor: DARK,
                borderRadius: "20px",
                padding: CP,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "clamp(20px,3vw,48px)",
                alignItems: "start",
                cursor: "default",
              }}
              className="fim-result-featured"
            >
              <div>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.3)", display: "block", marginBottom: "20px", textTransform: "uppercase" }}>Бренд-система</span>
                <h3 style={{ fontSize: "clamp(22px,2.8vw,36px)", fontWeight: 500, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.01em", maxWidth: "400px", fontFamily: DISPLAY }}>
                  Единый язык для всех каналов
                </h3>
              </div>
              <p style={{ fontSize: "16px", fontWeight: 300, color: "rgba(255,255,255,0.55)", lineHeight: 1.75, paddingTop: "4px" }}>
                {nb("Гайдлайн с нуля. Единый язык для всех каналов — не надо объяснять стиль каждый раз заново.")}
              </p>
            </motion.div>
          </ScaleReveal>

          {[
            { title: "Синхрон",      text: nb("Бренд, продукт и маркетинг из одной системы. Визуал не расходится.") },
            { title: "Масштаб",      text: nb("Шаблоны закрывают большинство задач по производству. Команда работает без дизайнера на каждом шаге.") },
            { title: "Скорость",     text: nb("Новый материал — за часы. Раньше несколько дней только на согласование стиля с нуля.") },
            { title: "Качество",     text: nb("Контроль реализации убрал расхождения между макетом и продом. То, что согласовано — то и выходит.") },
            { title: "Коммуникация", text: nb("Письменные фиксации убрали бесконечные циклы правок. Все знают что, почему и когда.") },
          ].map((item, i) => (
            <ScaleReveal key={item.title} delay={(i % 3) * 0.07}>
              <motion.div
                whileHover={{ y: -3, backgroundColor: "#e8eaf0" }}
                transition={{ duration: 0.25, ease: EASE }}
                style={{
                  backgroundColor: "#eef0f5",
                  borderRadius: "20px",
                  padding: CP,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "clamp(28px,3.5vh,48px)",
                  cursor: "default",
                  minHeight: "180px",
                }}
              >
                <span style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  backgroundColor: "rgba(29,29,31,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: 600, color: MUTED,
                  flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <div>
                  <p style={{ fontSize: "clamp(16px,1.8vw,20px)", fontWeight: 500, marginBottom: "10px", color: TEXT, lineHeight: 1.2, fontFamily: DISPLAY }}>{item.title}</p>
                  <p style={{ fontSize: "14px", fontWeight: 400, color: MUTED, lineHeight: 1.65 }}>{item.text}</p>
                </div>
              </motion.div>
            </ScaleReveal>
          ))}
        </div>
      </div>

      {/* ══ ИТОГ ══ */}
      <div className="fim-section" style={{ padding: `0 ${P}`, paddingBottom: S }}>
        <ScaleReveal>
          <div style={{ backgroundColor: DARK, borderRadius: "28px", padding: CP, overflow: "hidden" }}>
            <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "48px" }}>Итог</p>
            <AccentReveal delay={0.1} style={{ marginBottom: "56px" }}>
              <p style={{ fontSize: "clamp(36px, 5vw, 76px)", fontWeight: 500, lineHeight: 1.08, maxWidth: "900px", color: "#fff", letterSpacing: "-0.02em", fontFamily: DISPLAY }}>
                {nb("Перестроил бренд из хаотичного — в системный.")}
              </p>
            </AccentReveal>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px" }} className="fim-outro">
              <Reveal delay={0.2}>
                <p style={{ fontSize: "17px", fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
                  {nb("Синхронизировал бренд, продукт и маркетинг в одну систему. Упростил производство и масштабирование материалов. Повысил качество визуальных коммуникаций на всех уровнях.")}
                </p>
              </Reveal>
              <Reveal delay={0.28}>
                <p style={{ fontSize: "17px", fontWeight: 300, color: "rgba(255,255,255,0.5)", lineHeight: 1.8 }}>
                  {nb("Новый член команды мог создавать материалы в фирменном стиле ")}<strong style={{ fontWeight: 500, color: "#fff" }}>{nb("уже в первый день")}</strong>{nb(" — без ревью старшего дизайнера.")}
                </p>
              </Reveal>
            </div>
          </div>
        </ScaleReveal>
      </div>

      {/* ══ NEXT PROJECT ══ */}
      <div className="fim-section" style={{ padding: `0 ${P} clamp(40px,6vh,80px)` }}>
        <Link href="/projects/project-02" style={{ textDecoration: "none", display: "block" }}>
          <motion.div
            whileHover={{ backgroundColor: "#ebebed" }}
            transition={{ duration: 0.25 }}
            style={{ backgroundColor: CARD, borderRadius: "24px", padding: CP, display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: DIM, textTransform: "uppercase", marginBottom: "14px" }}>Следующий проект</p>
              <h2 style={{ fontSize: "clamp(28px,4.5vw,60px)", fontWeight: 500, lineHeight: 0.95, letterSpacing: "-0.02em" }}>DIONIS Jewelry</h2>
            </div>
            <span style={{ fontSize: "28px", color: DIM }}>→</span>
          </motion.div>
        </Link>
      </div>

      <style>{`
        @font-face {
          font-family: 'InterLatin';
          src: url('/fonts/Inter/Inter-VariableFont_opsz,wght.ttf') format('truetype');
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
          unicode-range: U+0020-U+007E, U+00A0-U+024F, U+02BB-U+02BC, U+02C6, U+02DA, U+02DC, U+2000-U+206F, U+20AC, U+2122, U+2212, U+2215;
        }

        /* ── MOBILE ≤ 640px ── */
        @media (max-width: 640px) {
          /* Отступы */
          .fim-section         { padding-left: 16px !important; padding-right: 16px !important; }

          /* Лого + ресерч — стек */
          .fim-logo-grid       { grid-template-columns: 1fr !important; gap: 20px !important; }

          /* Бенто "О компании" — два столбца остаются, но меньше паддинг */
          .fim-bento           { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
          .fim-bento > *       { border-radius: 16px !important; }

          /* Мета — 2 колонки */
          .fim-meta            { grid-template-columns: 1fr 1fr !important; row-gap: 24px !important; }

          /* Проблема — 1 колонка */
          .fim-problem         { grid-template-columns: 1fr !important; }
          .fim-problem > div   { min-height: unset !important; }

          /* Задача — 1 колонка */
          .fim-task            { grid-template-columns: 1fr !important; gap: 8px !important; }
          .fim-task > *        { min-height: unset !important; }

          /* Роль бенто — полный стек */
          .fim-role-bento      { grid-template-columns: 1fr !important; gap: 8px !important; }
          .fim-role-bento > *  { min-height: unset !important; }

          /* Карточки роли 2×2 → 1 колонка */
          .fim-role-grid       { grid-template-columns: 1fr !important; gap: 8px !important; }
          .fim-role-grid > *   { min-height: unset !important; }

          /* Результат — 1 колонка */
          .fim-result          { grid-template-columns: 1fr !important; gap: 8px !important; }
          .fim-result-featured { grid-template-columns: 1fr !important; gap: 16px !important; }

          /* Итог — 1 колонка */
          .fim-outro           { grid-template-columns: 1fr !important; gap: 28px !important; }

          /* Прочее */
          .fim-approach        { grid-template-columns: 1fr !important; }
          .fim-ds              { grid-template-columns: 1fr !important; }
          .fim-ux              { max-width: 100% !important; text-align: left !important; }
          .fim-carriers        { grid-template-columns: 1fr !important; }
          .fim-ai              { grid-template-columns: 1fr !important; }
          .fim-process         { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
