"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

// ─── count-up hook ───────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1.6, active: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return count;
}

// ─── metric card ─────────────────────────────────────────────────────────────

function MetricCard({ display, label, delay }: {
  display: string; label: string; delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const numericTarget = parseFloat(display.replace(/[^0-9.]/g, ""));
  const suffix = display.replace(/[0-9.]/g, "");
  const count = useCountUp(numericTarget, 1.6, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: EASE }}
      style={{ borderTop: "1px solid var(--c-border)", paddingTop: "32px" }}
    >
      <div style={{
        fontSize: "clamp(48px, 6vw, 88px)",
        fontWeight: 300,
        color: "var(--c-fg)",
        lineHeight: 1,
        marginBottom: "16px",
        fontVariantNumeric: "tabular-nums",
      }}>
        {inView ? `${count}${suffix}` : `0${suffix}`}
      </div>
      <p style={{ fontSize: "12px", color: "var(--c-fg-subtle)", textTransform: "uppercase", lineHeight: 1.5 }}>
        {label}
      </p>
    </motion.div>
  );
}

// ─── visual slot ─────────────────────────────────────────────────────────────

function VisualSlot({ label, aspectRatio = "16/9", height }: {
  label: string; aspectRatio?: string; height?: string;
}) {
  return (
    <div style={{
      aspectRatio: height ? undefined : aspectRatio,
      height: height ?? undefined,
      backgroundColor: "var(--c-void-soft)",
      border: "1px dashed var(--c-border)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "12px",
      width: "100%",
    }}>
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" style={{ opacity: 0.2 }}>
        <rect x="3" y="3" width="26" height="26" rx="3" stroke="var(--c-chrome)" strokeWidth="1.5"/>
        <circle cx="11" cy="12" r="2.5" stroke="var(--c-chrome)" strokeWidth="1.5"/>
        <path d="M3 22l7-6 5 5 4-3 10 8" stroke="var(--c-chrome)" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      <span style={{ fontSize: "9px", color: "var(--c-fg-ghost)", textTransform: "uppercase", textAlign: "center", padding: "0 20px" }}>
        {label}
      </span>
    </div>
  );
}

// ─── reveal: fade + lift ──────────────────────────────────────────────────────

function Reveal({ children, delay = 0, style }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── accent reveal: bigger motion, no clipping ───────────────────────────────

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

// ─── B — inline bold ─────────────────────────────────────────────────────────

function B({ children }: { children: React.ReactNode }) {
  return <strong style={{ fontWeight: 500, color: "var(--c-fg)" }}>{children}</strong>;
}

// ─── label ───────────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "10px", color: "var(--c-fg-subtle)", textTransform: "uppercase", marginBottom: "40px" }}>
      {children}
    </p>
  );
}

// ─── main ────────────────────────────────────────────────────────────────────

export function ProjectContent({ slug }: { slug: string }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroScroll, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);

  return (
    <main style={{ backgroundColor: "var(--c-bg)", minHeight: "100dvh" }}>

      {/* ── hero ── */}
      <div ref={heroRef} style={{ position: "relative", height: "100dvh", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: 0, y: heroY, backgroundColor: "#f5c842", height: "115%" }} />
        <div style={{ position: "absolute", inset: 0, background: "var(--c-hero-grad)" }} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ position: "absolute", top: "40px", left: "40px" }}
        >
          <Link href="/v2" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "12px 20px", borderRadius: "66px", border: "1px solid rgba(255,255,255,0.3)", backgroundColor: "#fff", color: "#0a0a0a", fontSize: "13px", fontWeight: 400, textDecoration: "none", whiteSpace: "nowrap" }}>
            <span style={{ fontSize: "10px" }}>←</span>назад
          </Link>
        </motion.div>

        <motion.div style={{ position: "absolute", bottom: "60px", left: "40px", right: "40px", opacity: heroOpacity }}>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ fontSize: "10px", color: "var(--c-fg-muted)", textTransform: "uppercase", marginBottom: "24px" }}
          >
            Indiamall — Brand + Product + E-com / 2024
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4, ease: EASE }}
            style={{
              fontSize: "clamp(64px, 10vw, 144px)",
              fontWeight: 300,
              color: "var(--c-fg)",
              lineHeight: 0.9,
              maxWidth: "1000px",
            }}
          >
            Indiamall
          </motion.h1>
        </motion.div>
      </div>

      {/* ── info row ── */}
      <div style={{ padding: "72px 40px", borderBottom: "1px solid var(--c-border)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "40px" }}>
          {[
            { label: "Категория", value: "Brand Identity + E-com" },
            { label: "Год", value: "2024" },
            { label: "Роль", value: "Design Lead" },
            { label: "Команда", value: "Маркетолог, разработка, подрядчики" },
          ].map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08}>
              <p style={{ fontSize: "10px", color: "var(--c-fg-subtle)", textTransform: "uppercase", marginBottom: "10px" }}>
                {item.label}
              </p>
              <p style={{ fontSize: "16px", fontWeight: 300, color: "var(--c-fg-muted)" }}>{item.value}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── opening statement ── */}
      <div style={{ padding: "120px 40px", borderBottom: "1px solid var(--c-border)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <AccentReveal>
            <p style={{
              fontSize: "clamp(36px, 5.5vw, 80px)",
              fontWeight: 300,
              color: "var(--c-fg)",
              lineHeight: 1.08,
              maxWidth: "1000px",
            }}>
              Компания без системы — хаотичный визуал, разные стили везде,
              ни маркетинг ни продукт не говорят на одном языке.
            </p>
          </AccentReveal>
          <Reveal delay={0.2} style={{ marginTop: "48px", maxWidth: "560px" }}>
            <p style={{ fontSize: "17px", fontWeight: 300, color: "var(--c-fg-dim)", lineHeight: 1.75 }}>
              Задача: перестроить визуальную систему бренда и e-commerce,
              чтобы повысить конверсию, обеспечить консистентность
              и создать основу для масштабирования.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ── problems — 3 колонки ── */}
      <div style={{ padding: "100px 40px", borderBottom: "1px solid var(--c-border)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal><Label>Проблема</Label></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
            {[
              { num: "01", title: "Нет узнаваемости", text: "Слабое визуальное позиционирование на сайте — клиенты не понимают что это и для кого." },
              { num: "02", title: "Размытый продукт", text: "Непонятно для кого и как. Разные стили в разных местах — ни единства, ни доверия." },
              { num: "03", title: "Хаос в процессах", text: "Задачи без структуры, материалы делались бессистемно, договорённости не фиксировались." },
            ].map((item, i) => (
              <Reveal key={item.num} delay={i * 0.1}>
                <div style={{ borderTop: "1px solid var(--c-border)", paddingTop: "28px" }}>
                  <span style={{ fontSize: "9px", color: "var(--c-fg-ghost)", display: "block", marginBottom: "20px" }}>{item.num}</span>
                  <h3 style={{ fontSize: "20px", fontWeight: 400, color: "var(--c-fg)", marginBottom: "16px", lineHeight: 1.2 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "15px", fontWeight: 300, color: "var(--c-fg-dim)", lineHeight: 1.7 }}>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── metrics ── */}
      <div style={{ padding: "100px 40px", borderBottom: "1px solid var(--c-border)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal><Label>Результаты</Label></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
            {[
              { display: "3x", label: "Быстрее запуск новых материалов" },
              { display: "240+", label: "Компонентов в дизайн-системе" },
              { display: "1 день", label: "За сколько новый в команде работает по системе" },
            ].map((m, i) => (
              <MetricCard key={m.label} {...m} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </div>

      {/* ── full-width visual ── */}
      <VisualSlot label="Брендбук / главный экран платформы / ключевой визуал" height="72vh" />

      {/* ── role — большой текст + таблица ── */}
      <div style={{ padding: "120px 40px", borderBottom: "1px solid var(--c-border)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal><Label>Моя роль</Label></Reveal>
          <AccentReveal delay={0.1} style={{ marginBottom: "72px" }}>
            <p style={{
              fontSize: "clamp(32px, 4.5vw, 64px)",
              fontWeight: 300,
              color: "var(--c-fg)",
              lineHeight: 1.1,
              maxWidth: "880px",
            }}>
              Design Lead без арт-директора.
              Бренд, продукт, маркетинг — один человек, одна система.
            </p>
          </AccentReveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 80px" }}>
            {[
              { title: "Brand Lead", text: <><B>Сформировал бренд с нуля</B>: позиционирование → визуальная система.</> },
              { title: "Design System", text: <>Определил <B>единый стиль для веба, продукта и офлайна</B>.</> },
              { title: "Production", text: <><B>Управлял продакшеном</B>: типографии, носители, подготовка к печати.</> },
              { title: "Sync", text: <><B>Синхронизировал маркетинг и разработку</B> через дизайн.</> },
              { title: "Product", text: <>Запустил редизайн: <B>задал стиль интерфейсов</B>, внедрил контроль UI.</> },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.07}>
                <div style={{
                  padding: "22px 0",
                  borderTop: "1px solid var(--c-border)",
                  display: "grid",
                  gridTemplateColumns: "160px 1fr",
                  gap: "24px",
                  alignItems: "start",
                }}>
                  <span style={{ fontSize: "13px", color: "var(--c-fg-subtle)", fontWeight: 300 }}>{item.title}</span>
                  <p style={{ fontSize: "16px", fontWeight: 300, color: "var(--c-fg-muted)", lineHeight: 1.6 }}>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── подход — full accent ── */}
      <div style={{ padding: "120px 40px", borderBottom: "1px solid var(--c-border)", backgroundColor: "var(--c-void-soft)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal><Label>Подход</Label></Reveal>
          <AccentReveal delay={0.1}>
            <p style={{
              fontSize: "clamp(40px, 6vw, 92px)",
              fontWeight: 300,
              color: "var(--c-fg)",
              lineHeight: 1.05,
            }}>
              Связал бренд,
              <br />продукт
              <br />и маркетинг
              <br /><em style={{ fontStyle: "italic", color: "var(--c-fg-muted)" }}>в единую систему.</em>
            </p>
          </AccentReveal>
          <Reveal delay={0.3} style={{ marginTop: "56px", maxWidth: "480px" }}>
            <p style={{ fontSize: "17px", fontWeight: 300, color: "var(--c-fg-dim)", lineHeight: 1.75 }}>
              Работал от задач бизнеса — закрывал end-to-end:
              от идеи до продакшена. Без TZ — через гипотезы и предложения.
            </p>
          </Reveal>
        </div>
      </div>

      {/* ── key decisions ── */}
      <div style={{ padding: "120px 40px", borderBottom: "1px solid var(--c-border)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal><Label>Ключевые решения</Label></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", backgroundColor: "var(--c-border)" }}>
            {[
              {
                num: "01",
                title: "Сборка бренд-системы",
                text: <>Разрозненный визуал → <B>единый стиль</B>. База: графика, типографика, принципы. Бренд стал узнаваемым и масштабируемым.</>,
              },
              {
                num: "02",
                title: "Перевод бренда в носители",
                text: <>Шаблоны для <B>соцсетей, презентаций, полиграфии</B>. Бренд стал применяться системно, производство — в разы быстрее.</>,
              },
              {
                num: "03",
                title: "Поддержка продаж",
                text: <>Создал <B>концепции раздаток и ивент-материалов</B>. Продажники получили инструменты — усилилась визуальная часть.</>,
              },
              {
                num: "04",
                title: "Визуал продукта",
                text: <>Задал <B>стиль интерфейса</B> и начал редизайн. Появилась согласованность между продуктом и брендом.</>,
              },
              {
                num: "05",
                title: "Дизайн-контроль",
                text: <>Расхождение макетов и реализации. Внедрил контроль и правки UI. <B>Повысил качество финала</B>.</>,
              },
              {
                num: "06",
                title: "AI в процессе",
                text: <>Создал промт для <B>фирменных 3D-иллюстраций</B>. Ускорил этап исследования и генерации идей в разы.</>,
              },
            ].map((item, i) => (
              <Reveal key={item.num} delay={(i % 3) * 0.08}>
                <div style={{ backgroundColor: "var(--c-bg)", padding: "48px 36px", height: "100%" }}>
                  <span style={{ fontSize: "9px", color: "var(--c-fg-ghost)", display: "block", marginBottom: "28px" }}>{item.num}</span>
                  <h3 style={{ fontSize: "20px", fontWeight: 400, color: "var(--c-fg)", lineHeight: 1.2, marginBottom: "16px" }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: "15px", fontWeight: 300, color: "var(--c-fg-dim)", lineHeight: 1.75 }}>{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── 2 равных фото ── */}
      <div style={{ padding: "80px 40px", borderBottom: "1px solid var(--c-border)", maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal><Label>Дизайн-система</Label></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <Reveal>
            <VisualSlot label="Брендбук / стайлгайд" aspectRatio="4/3" />
          </Reveal>
          <Reveal delay={0.1}>
            <VisualSlot label="Типографика / палитра / логотип" aspectRatio="4/3" />
          </Reveal>
        </div>
      </div>

      {/* ── UX / product — большой заголовок + картинка ── */}
      <div style={{ padding: "120px 40px", borderBottom: "1px solid var(--c-border)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal><Label>UX / Product</Label></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
            <div>
              <AccentReveal delay={0.05} style={{ marginBottom: "40px" }}>
                <p style={{
                  fontSize: "clamp(28px, 3.5vw, 52px)",
                  fontWeight: 300,
                  color: "var(--c-fg)",
                  lineHeight: 1.15,
                }}>
                  Консистентность,
                  читаемость,
                  простота.
                </p>
              </AccentReveal>
              <Reveal delay={0.18} style={{ marginBottom: "40px" }}>
                <p style={{ fontSize: "17px", fontWeight: 300, color: "var(--c-fg-dim)", lineHeight: 1.75 }}>
                  Задал <B>единый UX-подход</B> для всей платформы.
                  Разработал страницы о компании, контакты, новости.
                  Внедрил cookie-модуль и доработал UI-элементы.
                </p>
              </Reveal>
              <Reveal delay={0.26}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {[
                    "Страницы о компании, контакты, новости",
                    "Cookie-модуль",
                    "Доработка UI-элементов",
                    "Согласованность продукта и бренда",
                  ].map((item, i) => (
                    <div key={item} style={{
                      padding: "16px 0",
                      borderTop: "1px solid var(--c-border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}>
                      <span style={{ fontSize: "15px", fontWeight: 300, color: "var(--c-fg-mid)" }}>{item}</span>
                      <span style={{ fontSize: "10px", color: "var(--c-fg-ghost)" }}>0{i + 1}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.12}>
              <VisualSlot label="Скриншот продукта / интерфейс" aspectRatio="4/5" />
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── 3 носителя — квадраты ── */}
      <div style={{ padding: "80px 40px", borderBottom: "1px solid var(--c-border)", maxWidth: "1200px", margin: "0 auto" }}>
        <Reveal><Label>Носители</Label></Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            "Шаблоны соцсетей",
            "Презентации / pitch deck",
            "Полиграфия / раздатки / ивент",
          ].map((label, i) => (
            <Reveal key={label} delay={i * 0.08}>
              <VisualSlot label={label} aspectRatio="1/1" />
            </Reveal>
          ))}
        </div>
      </div>

      {/* ── AI block ── */}
      <div style={{ padding: "120px 40px", borderBottom: "1px solid var(--c-border)", backgroundColor: "var(--c-void-soft)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal><Label>Использование AI</Label></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            <AccentReveal delay={0.05}>
              <VisualSlot label="AI-иллюстрации / 3D фирменные визуалы" aspectRatio="4/3" />
            </AccentReveal>
            <div>
              <AccentReveal delay={0.15} style={{ marginBottom: "32px" }}>
                <p style={{
                  fontSize: "clamp(26px, 3vw, 44px)",
                  fontWeight: 300,
                  color: "var(--c-fg)",
                  lineHeight: 1.2,
                }}>
                  Ускорил исследование и генерацию идей в разы.
                </p>
              </AccentReveal>
              <Reveal delay={0.25} style={{ marginBottom: "36px" }}>
                <p style={{ fontSize: "17px", fontWeight: 300, color: "var(--c-fg-dim)", lineHeight: 1.75 }}>
                  Генерация концептов и визуальных направлений.
                  Создал промт для <B>фирменных 3D-иллюстраций</B>
                  и маркетинговых материалов. Собрал базовую дизайн-систему и гайд.
                </p>
              </Reveal>
              <Reveal delay={0.32}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {[
                    "Быстрее запуск новых материалов",
                    "Единый визуальный язык",
                    "Снижение зависимости от одного дизайнера",
                  ].map((item) => (
                    <div key={item} style={{ padding: "15px 0", borderTop: "1px solid var(--c-border)", fontSize: "15px", fontWeight: 300, color: "var(--c-fg-muted)" }}>
                      {item}
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* ── process ── */}
      <div style={{ padding: "120px 40px", borderBottom: "1px solid var(--c-border)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal><Label>Процессы</Label></Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
            {[
              {
                num: "01",
                title: "Производство",
                text: <>Вёл работу с типографиями и подрядчиками. <B>Контролировал подготовку и выпуск</B> от макета до готового носителя.</>,
              },
              {
                num: "02",
                title: "Договорённости",
                text: <>Внедрил <B>практику письменной фиксации</B> согласований — минимум разночтений, максимум скорости.</>,
              },
              {
                num: "03",
                title: "Планирование",
                text: <><B>Синхронизировал маркетинг и разработку</B> через дизайн — одна правда для всей команды.</>,
              },
            ].map((step, i) => (
              <Reveal key={step.num} delay={i * 0.1}>
                <div style={{ borderTop: "1px solid var(--c-border)", paddingTop: "28px" }}>
                  <span style={{ fontSize: "9px", color: "var(--c-fg-ghost)", display: "block", marginBottom: "20px" }}>{step.num}</span>
                  <h3 style={{ fontSize: "22px", fontWeight: 400, color: "var(--c-fg)", marginBottom: "16px", lineHeight: 1.2 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: "15px", fontWeight: 300, color: "var(--c-fg-dim)", lineHeight: 1.75 }}>{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ── full-width visual 2 ── */}
      <VisualSlot label="Результат: до / после или финальный визуал платформы" height="60vh" />

      {/* ── marquee ── */}
      <div style={{ borderTop: "1px solid var(--c-border)", borderBottom: "1px solid var(--c-border)", padding: "28px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ display: "inline-flex" }}
        >
          {Array.from({ length: 2 }).map((_, ri) => (
            <span key={ri} style={{ display: "inline-flex", alignItems: "center" }}>
              {["Brand Identity", "Design System", "Visual Direction", "E-commerce", "Product Design", "AI Tools", "Production"].map((word, wi) => (
                <span key={wi} style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: "var(--c-fg-ghost)", textTransform: "uppercase", padding: "0 32px" }}>
                    {word}
                  </span>
                  <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "var(--c-fg-ghost)", flexShrink: 0 }} />
                </span>
              ))}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── result ── */}
      <div style={{ padding: "120px 40px", borderBottom: "1px solid var(--c-border)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Reveal><Label>Итог</Label></Reveal>
          <AccentReveal delay={0.1} style={{ marginBottom: "56px" }}>
            <p style={{
              fontSize: "clamp(36px, 5vw, 76px)",
              fontWeight: 300,
              color: "var(--c-fg)",
              lineHeight: 1.08,
              maxWidth: "900px",
            }}>
              Перестроил бренд из хаотичного — в системный.
            </p>
          </AccentReveal>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px" }}>
            <Reveal delay={0.2}>
              <p style={{ fontSize: "17px", fontWeight: 300, color: "var(--c-fg-dim)", lineHeight: 1.8 }}>
                Синхронизировал бренд, продукт и маркетинг в одну систему.
                Упростил производство и масштабирование материалов.
                Повысил качество визуальных коммуникаций на всех уровнях.
              </p>
            </Reveal>
            <Reveal delay={0.28}>
              <p style={{ fontSize: "17px", fontWeight: 300, color: "var(--c-fg-dim)", lineHeight: 1.8 }}>
                Новый член команды мог создавать материалы в фирменном стиле
                <B> уже в первый день</B> — без ревью старшего дизайнера.
              </p>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ── next project ── */}
      <Link href="/projects/project-02" style={{ display: "block", textDecoration: "none" }}>
        <motion.div
          whileHover={{ backgroundColor: "var(--c-void-soft)" }}
          transition={{ duration: 0.3 }}
          style={{ padding: "80px 40px", cursor: "pointer" }}
        >
          <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontSize: "10px", color: "var(--c-fg-subtle)", textTransform: "uppercase", marginBottom: "16px" }}>
                Следующий проект
              </p>
              <AccentReveal>
                <h2 style={{
                  fontSize: "clamp(40px, 6vw, 88px)",
                  fontWeight: 300,
                  color: "var(--c-fg)",
                  lineHeight: 0.95,
                }}>
                  DIONIS Jewelry
                </h2>
              </AccentReveal>
            </div>
            <motion.span
              whileHover={{ x: 12 }}
              transition={{ duration: 0.3 }}
              style={{ fontSize: "32px", color: "var(--c-fg-subtle)" }}
            >
              →
            </motion.span>
          </div>
        </motion.div>
      </Link>

    </main>
  );
}
