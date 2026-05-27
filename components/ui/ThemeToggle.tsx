"use client";

import { useTheme } from "@/components/providers/ThemeProvider";

const MoonIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SunIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="12" y1="21" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="1" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="21" y1="12" x2="23" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  const handleClick = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    toggle(x, y);
  };

  const isDark = theme === "dark";

  return (
    <button
      onClick={handleClick}
      aria-label="Toggle theme"
      style={{
        background: "none",
        border: "1px solid var(--c-border)",
        cursor: "pointer",
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "9px",
        color: "var(--c-fg-subtle)",
        textTransform: "uppercase",
        fontFamily: "'Afacad', system-ui, sans-serif",
        transition: "color 0.3s, border-color 0.3s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.color = "var(--c-fg)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--c-fg-mid)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.color = "var(--c-fg-subtle)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--c-border)";
      }}
    >
      {isDark ? <MoonIcon /> : <SunIcon />}
      {isDark ? "Dark" : "Light"}
    </button>
  );
}
