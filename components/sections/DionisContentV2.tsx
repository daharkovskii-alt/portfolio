"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const C = {
  bg:      "#F2F2F2",
  dark:    "#0F0F0F",
  darkMid: "#1A1A1A",
  brand:   "#9C4822",
  white:   "#FFFFFF",
  silver:  "#717372",
  border:  "rgba(15,15,15,0.08)",
  text:    "#0F0F0F",
  textMid: "rgba(15,15,15,0.5)",
  textDim: "rgba(15,15,15,0.3)",
};

const FONT    = "'Montserrat', system-ui, sans-serif";
const BOUNDED = "'Bounded', 'Montserrat', system-ui, sans-serif";
const EASE    = [0.16, 1, 0.3, 1] as [number, number, number, number];
const BASE = "/assets/dionis/figma";

function Reveal({ children, delay = 0, style }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function Tag({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span style={{
      fontFamily: FONT,
      fontSize: "9px",
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: "0.14em",
      color: light ? "rgba(255,255,255,0.4)" : C.silver,
    }}>
      ({children})
    </span>
  );
}


function MetricCard({ value, suffix, label, delay }: { value: number; suffix: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay, ease: EASE }}
      style={{ backgroundColor: C.white, padding: "48px 36px" }}
    >
      <div style={{ borderTop: `2px solid ${C.brand}`, paddingTop: "24px" }}>
        <MetricNumber value={value} suffix={suffix} active={inView} />
        <p style={{ fontFamily: FONT, fontSize: "9px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: C.textDim, marginTop: "14px" }}>
          {label}
        </p>
      </div>
    </motion.div>
  );
}

export function DionisContentV2() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.65], [1, 0]);

  return (
    <main style={{ backgroundColor: C.bg, minHeight: "100dvh", overflowX: "hidden" }}>

      {/* ── 1. HERO ─────────────────────────────────────────────────────────── */}
      <div ref={heroRef} style={{ position: "relative", height: "100dvh", overflow: "hidden", backgroundColor: C.dark }}>
        <motion.div style={{ position: "absolute", inset: 0, y: heroY }}>
          <img
            src={`${BASE}/img-61.png`}
            alt="DIONIS Jewelry"
            style={{ width: "100%", height: "115%", objectFit: "cover", objectPosition: "center 20%", display: "block" }}
          />
        </motion.div>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.25) 40%, rgba(0,0,0,0.82) 100%)",
        }} />

        {/* back */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          style={{ position: "absolute", top: "40px", left: "40px" }}
        >
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "10px 18px", borderRadius: "66px",
            border: "1px solid rgba(255,255,255,0.25)",
            backgroundColor: "#fff", color: "#0a0a0a",
            fontSize: "12px", fontWeight: 500,
            fontFamily: FONT, textDecoration: "none",
          }}>
            <span style={{ fontSize: "9px" }}>←</span>назад
          </Link>
        </motion.div>

        {/* hero text */}
        <motion.div style={{ position: "absolute", bottom: "60px", left: "40px", right: "40px", opacity: heroOpacity }}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ marginBottom: "20px" }}
          >
            <Tag light>Art Lead · Visual System · E-commerce / 2024</Tag>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.42, ease: EASE }}
            style={{
              fontFamily: BOUNDED,
              fontSize: "clamp(64px, 11vw, 160px)",
              fontWeight: 800,
              color: "#fff",
              lineHeight: 0.88,
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            DIONIS
            <br />
            <span style={{ color: "rgba(255,255,255,0.3)" }}>JEWELRY</span>
          </motion.h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.9, ease: EASE }}
            style={{
              height: "2px", backgroundColor: C.brand,
              marginTop: "40px", maxWidth: "160px", transformOrigin: "left",
            }}
          />
        </motion.div>
      </div>

      {/* ── 2. META STRIP ──────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          maxWidth: "1400px", margin: "0 auto", padding: "44px 40px",
          display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "32px",
        }}>
          {[
            { label: "Role",    value: "Art Lead" },
            { label: "Team",    value: "4 человека" },
            { label: "Stack",   value: "Design · Dev · Marketing" },
            { label: "Result",  value: "+35% conv · +28% revenue" },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 0.06}>
              <p style={{ fontFamily: BOUNDED, fontSize: "8px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: C.brand, marginBottom: "10px" }}>
                ({item.label})
              </p>
              <p style={{ fontFamily: BOUNDED, fontSize: "14px", fontWeight: 400, color: C.textMid, lineHeight: 1.5 }}>
                {item.value}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── 3. BEFORE ──────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: C.dark, paddingTop: "64px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px 40px" }}>
          <Reveal>
            <Tag light>before</Tag>
          </Reveal>
          <Reveal delay={0.1} style={{ marginTop: "20px", maxWidth: "480px" }}>
            <p style={{ fontFamily: FONT, fontSize: "14px", fontWeight: 400, color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}>
              Не было единой визуальной системы. Каждый канал жил по своим правилам.
              Интерфейс перегружал и не конвертировал.
            </p>
          </Reveal>
        </div>

        {/* before screens grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px" }}>
          <div style={{ overflow: "hidden", aspectRatio: "4/3" }}>
            <img src={`${BASE}/before-screen-1.png`} alt="Before — desktop" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "2px" }}>
            <div style={{ overflow: "hidden" }}>
              <img src={`${BASE}/before-screen-2.png`} alt="Before — mobile" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ overflow: "hidden" }}>
              <img src={`${BASE}/before-screen-3.png`} alt="Before — app" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: "2px" }}>
            <div style={{ overflow: "hidden" }}>
              <img src={`${BASE}/before-screen-4.png`} alt="Before — mobile 2" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div style={{ overflow: "hidden" }}>
              <img src={`${BASE}/before-screen-5.png`} alt="Before — mobile 3" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
          </div>
        </div>
      </div>

      {/* ── 4. AFTER / NEW LOGO ─────────────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <img
          src={`${BASE}/img-47.png`}
          alt="After — new brand"
          style={{ width: "100%", aspectRatio: "2/1", objectFit: "cover", display: "block" }}
        />
        <div style={{ position: "absolute", bottom: "32px", left: "40px", display: "flex", gap: "20px", alignItems: "center" }}>
          <Tag light>after</Tag>
          <div style={{ width: "1px", height: "10px", backgroundColor: "rgba(255,255,255,0.25)" }} />
          <Tag light>new visual</Tag>
        </div>
      </div>

      {/* ── 5. NEW LOGO ─────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: C.dark, padding: "0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "#111", padding: "80px 60px",
          }}>
            <img
              src={`${BASE}/logo-mark.png`}
              alt="DIONIS logo mark"
              style={{ width: "100%", maxWidth: "300px", height: "auto", objectFit: "contain", display: "block" }}
            />
          </div>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "#161616", padding: "80px 60px",
          }}>
            <img
              src={`${BASE}/logo-text.png`}
              alt="DIONIS logo text"
              style={{ width: "100%", maxWidth: "320px", height: "auto", objectFit: "contain", display: "block" }}
            />
          </div>
        </div>

        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "56px 40px" }}>
          <Reveal>
            <Tag light>new logo</Tag>
          </Reveal>
          <Reveal delay={0.1} style={{ marginTop: "16px" }}>
            <p style={{ fontFamily: FONT, fontSize: "14px", fontWeight: 400, color: "rgba(255,255,255,0.4)", lineHeight: 1.75, maxWidth: "480px" }}>
              Лаконичная форма. Минимум декора. Логотип работает как в digital,
              так и на упаковке — один язык везде.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ── 6. SYSTEM STATEMENT ─────────────────────────────────────────────── */}
      <div style={{ backgroundColor: C.bg, padding: "100px 40px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Reveal>
            <Tag>system</Tag>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={{
              fontFamily: FONT,
              fontSize: "clamp(40px, 7vw, 108px)",
              fontWeight: 800,
              color: C.text,
              textTransform: "uppercase",
              lineHeight: 0.9,
              margin: "24px 0 0",
            }}>
              Brand.
              <br />
              <span style={{ color: C.silver }}>Product.</span>
              <br />
              Marketing.
            </h2>
          </Reveal>
          <Reveal delay={0.24} style={{ marginTop: "48px", maxWidth: "460px" }}>
            <p style={{ fontFamily: FONT, fontSize: "15px", fontWeight: 400, color: C.textMid, lineHeight: 1.8 }}>
              Вместо точечных правок — система. Единый визуальный язык объединил
              бренд, продукт и маркетинг. Теперь всё говорит одним голосом.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ── 7. COLOR SYSTEM ─────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: C.bg, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "72px 40px 56px" }}>
          <Reveal>
            <Tag>brand colors</Tag>
          </Reveal>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)" }}>
          {[
            { num: "01", name: "Cinnamon Stick", hex: "9c4822", bg: "#9C4822", light: false, img: `${BASE}/color-swatch-1.png` },
            { num: "02", name: "Silver",          hex: "Material", bg: "#B0AEA8", light: false, img: null },
            { num: "03", name: "Concrete",        hex: "Material", bg: "#8C8C8C", light: false, img: null },
            { num: "04", name: "Cool Gray",       hex: "F2F2F2",   bg: "#F2F2F2", light: true,  img: null },
            { num: "05", name: "Dark",            hex: "0F0F0F",   bg: "#0F0F0F", light: false, img: null },
            { num: "06", name: "Mid Gray",        hex: "717372",   bg: "#717372", light: false, img: null },
          ].map((sw, i) => (
            <Reveal key={sw.num} delay={i * 0.06}>
              <div style={{
                position: "relative",
                aspectRatio: "2/3",
                backgroundColor: sw.bg,
                overflow: "hidden",
                border: sw.bg === "#F2F2F2" ? `1px solid ${C.border}` : "none",
              }}>
                {sw.img && (
                  <img
                    src={sw.img}
                    alt={sw.name}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.4, display: "block" }}
                  />
                )}
                <div style={{
                  position: "absolute", inset: 0, padding: "16px",
                  display: "flex", flexDirection: "column", justifyContent: "flex-end",
                  background: sw.img ? "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)" : "none",
                }}>
                  <p style={{ fontFamily: FONT, fontSize: "7px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: sw.light ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)", marginBottom: "4px" }}>
                    ({sw.num}) {sw.name}
                  </p>
                  <p style={{ fontFamily: FONT, fontSize: "9px", fontWeight: 800, color: sw.light ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.55)" }}>
                    Hex — {sw.hex}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── 8. FULL BLEED HERO 2 ────────────────────────────────────────────── */}
      <div style={{ overflow: "hidden", aspectRatio: "16/7" }}>
        <img
          src={`${BASE}/img-62-hero.png`}
          alt="DIONIS Jewelry — brand"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
        />
      </div>

      {/* ── 9. CATALOG / E-COMMERCE ─────────────────────────────────────────── */}
      <div style={{ backgroundColor: C.bg, padding: "80px 0 0", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px 56px" }}>
          <Reveal>
            <Tag>e-commerce redesign</Tag>
          </Reveal>
          <Reveal delay={0.1} style={{ marginTop: "20px" }}>
            <h2 style={{ fontFamily: FONT, fontSize: "clamp(24px, 3vw, 40px)", fontWeight: 800, textTransform: "uppercase", color: C.text, lineHeight: 1.1 }}>
              Упрощение → конверсия
            </h2>
          </Reveal>
          <Reveal delay={0.18} style={{ marginTop: "16px", maxWidth: "460px" }}>
            <p style={{ fontFamily: FONT, fontSize: "14px", fontWeight: 400, color: C.textMid, lineHeight: 1.75 }}>
              Переработал каталог, карточку товара и checkout. Убрал лишние шаги.
              Усилил визуальную иерархию. Итог — +35% к конверсии в корзину.
            </p>
          </Reveal>
        </div>

        {/* 2x2 grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
          <div style={{ overflow: "hidden", aspectRatio: "4/3" }}>
            <img src={`${BASE}/catalog-01.png`} alt="Catalog view" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ overflow: "hidden", aspectRatio: "4/3" }}>
            <img src={`${BASE}/catalog-02.png`} alt="Product card" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ overflow: "hidden", aspectRatio: "4/3" }}>
            <img src={`${BASE}/catalog-03.png`} alt="Catalog filtered" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{
            aspectRatio: "4/3", backgroundColor: C.dark,
            display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "40px",
          }}>
            <Reveal>
              <p style={{ fontFamily: FONT, fontSize: "8px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: C.brand, marginBottom: "18px" }}>
                (result)
              </p>
              <p style={{
                fontFamily: FONT,
                fontSize: "clamp(40px, 5vw, 72px)",
                fontWeight: 800, textTransform: "uppercase",
                color: "#fff", lineHeight: 1,
              }}>
                +35%
                <br />
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.48em" }}>
                  конверсия в корзину
                </span>
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── 10. SHIPPING PACKAGES ───────────────────────────────────────────── */}
      <div style={{ backgroundColor: C.bg, borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "72px 40px 40px" }}>
          <Reveal>
            <Tag>shipping packages</Tag>
          </Reveal>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px" }}>
          <div style={{ overflow: "hidden", aspectRatio: "3/4" }}>
            <img src={`${BASE}/catalog-04.png`} alt="Packaging" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ overflow: "hidden", aspectRatio: "3/4" }}>
            <img src={`${BASE}/catalog-05.png`} alt="Shipping box" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ overflow: "hidden", aspectRatio: "3/4" }}>
            <img src={`${BASE}/img-62c.png`} alt="Branded package" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </div>

      {/* ── 11. DEVELOPMENT OF ONLINE STORE ─────────────────────────────────── */}
      <div style={{ backgroundColor: C.dark, padding: "80px 0 0" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px 56px" }}>
          <Reveal>
            <Tag light>development of an online store brand</Tag>
          </Reveal>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
          <div style={{ overflow: "hidden", aspectRatio: "1/1" }}>
            <img src={`${BASE}/product-01.png`} alt="Product 01" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ overflow: "hidden", aspectRatio: "1/1" }}>
            <img src={`${BASE}/product-02.png`} alt="Product 02" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ overflow: "hidden", aspectRatio: "1/1" }}>
            <img src={`${BASE}/product-03.png`} alt="Product 03" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ overflow: "hidden", aspectRatio: "1/1" }}>
            <img src={`${BASE}/product-04.png`} alt="Product 04" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2px", marginTop: "2px" }}>
          <div style={{ overflow: "hidden", aspectRatio: "1/1" }}>
            <img src={`${BASE}/product-05.png`} alt="Product 05" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ overflow: "hidden", aspectRatio: "1/1" }}>
            <img src={`${BASE}/product-06.png`} alt="Product 06" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ overflow: "hidden", aspectRatio: "1/1" }}>
            <img src={`${BASE}/product-10.png`} alt="Product 10" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </div>

      {/* ── 12. CUSTOM PENDANT FOR STAFF ────────────────────────────────────── */}
      <div style={{ backgroundColor: C.dark, paddingTop: "80px", borderTop: "2px solid #1a1a1a" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 40px 48px" }}>
          <Reveal>
            <Tag light>Custom Pendant for Staff</Tag>
          </Reveal>
          <Reveal delay={0.1} style={{ marginTop: "16px", maxWidth: "440px" }}>
            <p style={{ fontFamily: FONT, fontSize: "14px", fontWeight: 400, color: "rgba(255,255,255,0.4)", lineHeight: 1.75 }}>
              Кастомные подвески для команды. Айдентика, которая живёт не только на экране.
            </p>
          </Reveal>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px" }}>
          <div style={{ overflow: "hidden", aspectRatio: "3/4" }}>
            <img src={`${BASE}/product-07.png`} alt="Custom pendant 1" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ overflow: "hidden", aspectRatio: "3/4" }}>
            <img src={`${BASE}/product-08.png`} alt="Custom pendant 2" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
        </div>
      </div>

      {/* ── 13. METRICS ─────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: C.bg, padding: "100px 40px", borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Reveal style={{ marginBottom: "64px" }}>
            <Tag>results</Tag>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px", backgroundColor: C.border }}>
            {[
              { val: 35, suf: "%",     label: "Рост конверсии в корзину" },
              { val: 28, suf: "%",     label: "Рост выручки за 6 месяцев" },
              { val: 4,  suf: "",      label: "Человека в команде" },
              { val: 6,  suf: " мес",  label: "До первых результатов" },
            ].map(({ val, suf, label }, i) => (
              <MetricCard key={label} value={val} suffix={suf} label={label} delay={i * 0.09} />
            ))}
          </div>
        </div>
      </div>

      {/* ── 14. BRAND STATEMENT ─────────────────────────────────────────────── */}
      <div style={{ backgroundColor: C.brand, padding: "100px 40px" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <Reveal>
            <p style={{
              fontFamily: FONT,
              fontSize: "clamp(40px, 6.5vw, 96px)",
              fontWeight: 800,
              color: "#fff",
              textTransform: "uppercase",
              lineHeight: 0.9,
            }}>
              FROM
              <br />
              FRAGMENTED
              <br />
              TO SYSTEMATIC.
            </p>
          </Reveal>
          <Reveal delay={0.18} style={{ marginTop: "48px", maxWidth: "520px" }}>
            <p style={{ fontFamily: FONT, fontSize: "15px", fontWeight: 400, color: "rgba(255,255,255,0.65)", lineHeight: 1.8 }}>
              Проект стал переходом от визуального дизайна к управлению системой
              и влиянию на бизнес. Бренд, продукт и маркетинг — единое целое.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ── 15. MARQUEE ─────────────────────────────────────────────────────── */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "20px 0", overflow: "hidden", backgroundColor: C.white }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ display: "inline-flex", whiteSpace: "nowrap" }}
        >
          {Array.from({ length: 2 }).map((_, ri) => (
            <span key={ri} style={{ display: "inline-flex", alignItems: "center" }}>
              {["Art Direction", "Visual System", "E-commerce UX", "Design System", "Brand Identity", "Jewelry", "Art Direction", "Visual System", "E-commerce UX", "Design System"].map((word, wi) => (
                <span key={wi} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ fontFamily: FONT, fontSize: "9px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.12em", color: C.textDim, padding: "0 24px" }}>
                    {word}
                  </span>
                  <span style={{ width: "3px", height: "3px", borderRadius: "50%", backgroundColor: C.brand, flexShrink: 0 }} />
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── 16. NEXT PROJECT ────────────────────────────────────────────────── */}
      <Link href="/projects/rif-v2" style={{ display: "block", textDecoration: "none" }}>
        <motion.div
          whileHover={{ backgroundColor: C.white }}
          transition={{ duration: 0.22 }}
          style={{ padding: "80px 40px", backgroundColor: C.bg, cursor: "pointer" }}
        >
          <div style={{ maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: FONT, fontSize: "8px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.14em", color: C.brand, marginBottom: "16px" }}>
                (next project)
              </p>
              <Reveal>
                <h2 style={{ fontFamily: FONT, fontSize: "clamp(40px, 6.5vw, 96px)", fontWeight: 800, color: C.text, textTransform: "uppercase", lineHeight: 0.9, margin: 0 }}>
                  РИФ 2025
                </h2>
              </Reveal>
            </div>
            <motion.span
              whileHover={{ x: 10 }}
              transition={{ duration: 0.22 }}
              style={{ fontFamily: FONT, fontSize: "40px", color: C.brand, fontWeight: 300, lineHeight: 1 }}
            >
              →
            </motion.span>
          </div>
        </motion.div>
      </Link>

    </main>
  );
}

function MetricNumber({ value, suffix, active }: { value: number; suffix: string; active: boolean }) {
  const [count, setCount] = React.useState(0);
  const hasRun = useRef(false);

  React.useEffect(() => {
    if (!active || hasRun.current) return;
    hasRun.current = true;
    const duration = 1.5;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [active, value]);

  return (
    <div style={{
      fontFamily: FONT,
      fontSize: "clamp(44px, 5vw, 72px)",
      fontWeight: 800,
      color: "#0F0F0F",
      lineHeight: 1,
      fontVariantNumeric: "tabular-nums",
    }}>
      {count}{suffix}
    </div>
  );
}
