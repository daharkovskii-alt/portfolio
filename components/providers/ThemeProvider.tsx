"use client";

import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

type Theme = "dark" | "light";

const BG: Record<Theme, string> = {
  dark:  "#000000",
  light: "#f5f0e8",
};

interface ThemeCtx {
  theme: Theme;
  toggle: (x: number, y: number) => void;
}

const Ctx = createContext<ThemeCtx>({ theme: "dark", toggle: () => {} });

export function useTheme() {
  return useContext(Ctx);
}

function applyTheme(t: Theme) {
  document.documentElement.setAttribute("data-theme", t);
  document.documentElement.style.backgroundColor = BG[t];
  document.body.style.backgroundColor = BG[t];
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const wipeRef = useRef<HTMLDivElement>(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme | null) ?? "dark";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const toggle = useCallback((clickX: number, clickY: number) => {
    if (animatingRef.current) return;
    const el = wipeRef.current;
    if (!el) return;

    const next: Theme = theme === "dark" ? "light" : "dark";
    animatingRef.current = true;

    el.style.backgroundColor = BG[next];
    el.style.clipPath = `circle(0% at ${clickX}px ${clickY}px)`;

    const DURATION = 700;
    const start = performance.now();

    const animate = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.style.clipPath = `circle(${eased * 200}% at ${clickX}px ${clickY}px)`;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        // apply theme under the overlay
        applyTheme(next);
        setTheme(next);
        localStorage.setItem("theme", next);

        // collapse overlay instantly
        requestAnimationFrame(() => {
          el.style.clipPath = `circle(0% at ${clickX}px ${clickY}px)`;
          animatingRef.current = false;
        });
      }
    };

    requestAnimationFrame(animate);
  }, [theme]);

  return (
    <Ctx.Provider value={{ theme, toggle }}>
      {children}
      <div
        ref={wipeRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          pointerEvents: "none",
          clipPath: "circle(0% at 50% 50%)",
        }}
      />
    </Ctx.Provider>
  );
}
