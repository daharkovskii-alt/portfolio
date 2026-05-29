"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLenis } from "@/components/providers/SmoothScroll";
import { useTheme } from "@/components/providers/ThemeProvider";

const EXPO = [0.19, 1, 0.22, 1] as const;

const HOME_ITEMS = [
  { label: "ОБО МНЕ",  target: "#about" },
  { label: "ПРОЕКТЫ",  target: "#projects" },
  { label: "КОНТАКТЫ", target: "bottom" },
];

const linkStyle: React.CSSProperties = {
  fontSize: "11px",
  fontWeight: 500,
  color: "var(--c-fg-muted)",
  textDecoration: "none",
  textTransform: "uppercase",
  fontFamily: "'Inter', system-ui, sans-serif",
  transition: "color 0.3s",
  cursor: "pointer",
};

export function GlobalNav() {
  const lenis = useLenis();
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const isLight = theme === "light";
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isProject = pathname.startsWith("/projects/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navBg = scrolled
    ? isLight ? "rgba(245,240,232,0.85)" : "rgba(0,0,0,0.75)"
    : "transparent";
  const navBorder = scrolled
    ? isLight ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.12)"
    : "1px solid transparent";
  const navBlur = scrolled ? "blur(16px) saturate(180%)" : "none";

  const ThemeButton = (
    <motion.button
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 + HOME_ITEMS.length * 0.07, ease: EXPO }}
      onClick={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        toggle(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "11px",
        fontWeight: 500,
        color: "var(--c-fg)",
        textTransform: "uppercase",
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: "7px 16px",
        borderRadius: "999px",
        background: isLight ? "#ffffff" : "rgba(255,255,255,0.22)",
        backdropFilter: isLight ? "none" : "blur(16px) saturate(180%)",
        WebkitBackdropFilter: isLight ? "none" : "blur(16px) saturate(180%)",
        border: isLight ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.28)",
        boxShadow: isLight ? "none" : "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 24px rgba(0,0,0,0.12)",
        cursor: "pointer",
        transition: "background 0.3s, box-shadow 0.3s",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = isLight ? "#f5f5f5" : "rgba(255,255,255,0.32)";
        if (!isLight) el.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.35), 0 8px 32px rgba(0,0,0,0.18)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.background = isLight ? "#ffffff" : "rgba(255,255,255,0.22)";
        el.style.boxShadow = isLight ? "none" : "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 24px rgba(0,0,0,0.12)";
      }}
    >
      {isLight ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M10 7.2A4.5 4.5 0 0 1 4.8 2a4.5 4.5 0 1 0 5.2 5.2Z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M6 1v1M6 10v1M1 6H2M10 6h1M2.64 2.64l.71.71M8.65 8.65l.71.71M9.36 2.64l-.71.71M3.35 8.65l-.71.71" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
          <circle cx="6" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.3"/>
        </svg>
      )}
      {isLight ? "Dark" : "Light"}
    </motion.button>
  );

  if (isProject) {
    return (
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: EXPO }}
        onClick={() => router.push("/")}
        style={{
          position: "fixed",
          top: "clamp(16px, 3vw, 40px)",
          right: "clamp(16px, 3vw, 40px)",
          zIndex: 9999,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "40px",
          height: "40px",
          borderRadius: "999px",
          background: isLight ? "#ffffff" : "#ffffff",
          border: isLight ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(0,0,0,0.08)",
          boxShadow: isLight ? "0 2px 16px rgba(0,0,0,0.08)" : "0 2px 16px rgba(0,0,0,0.12)",
          color: "#0a0a0a",
          cursor: "pointer",
          transition: "background 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#f5f5f5"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#ffffff"; }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M3 3L13 13M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </motion.button>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 22,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.4, ease: EXPO }}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "clamp(12px, 3vw, 32px)",
          padding: "10px 10px 10px 24px",
          borderRadius: "999px",
          pointerEvents: "auto",
          background: navBg,
          border: navBorder,
          backdropFilter: navBlur,
          WebkitBackdropFilter: navBlur,
          transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
        }}
      >
        {HOME_ITEMS.map(({ label, target }, i) => (
          <motion.a
            key={label}
            href={target.startsWith("#") ? target : undefined}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 + i * 0.07, ease: EXPO }}
            style={linkStyle}
            onClick={(e) => {
              e.preventDefault();
              lenis?.scrollTo(target, { duration: 1.4 });
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--c-fg)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--c-fg-muted)")}
          >
            {label}
          </motion.a>
        ))}
        {ThemeButton}
      </motion.nav>
    </div>
  );
}
