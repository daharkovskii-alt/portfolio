"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/providers/ThemeProvider";

export const CURTAIN_H = 700;

const BALL_COUNT = 10;
const BALL_IMAGES = Array.from(
  { length: BALL_COUNT },
  (_, i) => `/footer-balls/ball-${i + 1}.png`
);
const RADIUS = 72;

export function CurtainFooter() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contactsRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (contactsRef.current && !contactsRef.current.contains(e.target as Node)) {
        window.getSelection()?.removeAllRanges();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);
  const isLight = theme === "light";
  const bgColor = isLight ? "#090909" : "#EBEBEB";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animId: number;
    let mouseCleanup: (() => void) | undefined;
    let MatterLib: typeof import("matter-js") | null = null;

    const run = async () => {
      cancelAnimationFrame(animId);
      mouseCleanup?.();

      const Matter = MatterLib ?? await import("matter-js");
      MatterLib = Matter;
      const { Engine, Bodies, Body, Composite } = Matter;

      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      const dpr = window.devicePixelRatio || 1;

      canvas.width = W * dpr;
      canvas.height = H * dpr;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(dpr, dpr);

      // Radius scales with viewport width, capped at 72px
      const radius = Math.min(W / 7, 72);

      const engine = Engine.create({ gravity: { x: 0, y: 2.5 } });

      const thickness = 60;
      Composite.add(engine.world, [
        Bodies.rectangle(W / 2, H + thickness / 2, W * 2, thickness, { isStatic: true, friction: 0.4 }),
        Bodies.rectangle(-thickness / 2, H / 2, thickness, H * 2, { isStatic: true }),
        Bodies.rectangle(W + thickness / 2, H / 2, thickness, H * 2, { isStatic: true }),
      ]);

      const images = BALL_IMAGES.map((src) => {
        const img = new Image();
        img.src = src;
        return img;
      });

      const scales = [1, 1.08, 1, 1.06, 1.10, 1, 1.07, 1, 1.05, 1];

      const cols = Math.max(1, Math.floor(W / (radius * 2.4)));
      const bodies = images.map((img, i) => {
        const r = radius * (scales[i] ?? 1);
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = r * 1.15 + col * (radius * 2.4) + (Math.random() - 0.5) * 15;
        const y = -r * 1.5 - row * (r * 2.6) - 60;

        const body = Bodies.circle(x, y, r, {
          restitution: 0.35,
          friction: 0.3,
          frictionAir: 0.025,
          density: 0.0008,
        });

        Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 3,
          y: Math.random() * 1.5,
        });

        return { body, img, r };
      });

      Composite.add(engine.world, bodies.map((b) => b.body));

      let mx = -9999;
      let my = -9999;

      const onMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mx = e.clientX - rect.left;
        my = e.clientY - rect.top;
      };
      const onLeave = () => { mx = -9999; my = -9999; };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseleave", onLeave);

      let last = performance.now();

      const tick = (now: number) => {
        const delta = Math.min(now - last, 33);
        last = now;

        const repulseR = radius * 3;
        bodies.forEach(({ body }) => {
          const dx = body.position.x - mx;
          const dy = body.position.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < repulseR && dist > 1) {
            const push = (1 - dist / repulseR) * 7;
            const nx = dx / dist;
            const ny = dy / dist;
            const vx = body.velocity.x + nx * push;
            const vy = body.velocity.y + ny * push;
            const speed = Math.sqrt(vx * vx + vy * vy);
            const maxSpeed = 18;
            if (speed > maxSpeed) {
              Body.setVelocity(body, { x: (vx / speed) * maxSpeed, y: (vy / speed) * maxSpeed });
            } else {
              Body.setVelocity(body, { x: vx, y: vy });
            }
          }
        });

        Engine.update(engine, delta);

        ctx.clearRect(0, 0, W, H);

        bodies.forEach(({ body, img, r }) => {
          const { x, y } = body.position;
          const angle = body.angle;

          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(angle);

          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.clip();

          if (img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, -r, -r, r * 2, r * 2);
          } else {
            ctx.fillStyle = "#444";
            ctx.fill();
          }

          ctx.restore();
        });

        animId = requestAnimationFrame(tick);
      };

      animId = requestAnimationFrame(tick);

      mouseCleanup = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseleave", onLeave);
      };
    };

    run();

    const ro = new ResizeObserver(run);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      mouseCleanup?.();
      ro.disconnect();
    };
  }, []);

  return (
    <footer
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 0,
        height: "100dvh",
        backgroundColor: bgColor,
      }}
    >
      {/* Canvas fills entire footer — balls fly freely without clipping */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />

      <style>{`
        @media (max-width: 768px) {
          .footer-overlay { transform: translateY(-40px); }
          .footer-svyaz { width: min(86%, 624px) !important; }
          .footer-contacts { font-size: clamp(14px, 3.5vw, 19px) !important; }
        }
        .footer-contacts ::selection,
        .footer-contacts::selection {
          background: #FF0000;
          color: #FFFF00;
        }
        .footer-contacts a {
          user-select: text;
          display: inline-block;
          transition: color 0.2s ease;
        }
        .footer-contacts a:hover {
          color: var(--footer-hover-color) !important;
        }
        .footer-contacts span {
          display: inline-block;
          pointer-events: auto;
          transition: color 0.2s ease;
        }
        .footer-contacts span:hover {
          color: var(--footer-hover-color) !important;
        }
      `}</style>

      {/* СВЯЗЬ overlay — centered across full footer */}
      <div
        className="footer-overlay"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(16px, 3vh, 36px)",
          padding: "0 8%",
          pointerEvents: "none",
        }}
      >
        <img
          className="footer-svyaz"
          src="/assets/svyaz.svg"
          alt="СВЯЗЬ"
          style={{
            width: "min(72%, 520px)",
            filter: isLight ? "none" : "invert(1)",
            userSelect: "none",
          }}
        />
        <div
          ref={contactsRef}
          className="footer-contacts"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            color: isLight ? "rgba(255,255,255,0.45)" : "rgba(28,28,28,0.45)",
            ["--footer-hover-color" as string]: isLight ? "#ffffff" : "#1c1c1c",
            fontFamily: "'Bounded', sans-serif",
            fontSize: "clamp(12px, 1.2vw, 16px)",
            fontWeight: 300,
            letterSpacing: "0.02em",
            lineHeight: 1.6,
            pointerEvents: "auto",
            userSelect: "text",
          }}
        >
          <a href="mailto:daniil_harkovskii@mail.ru" style={{ color: "inherit", textDecoration: "none" }}>daniil_harkovskii@mail.ru</a>
          <a href="https://t.me/DanielHardani" target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>t.me/DanielHardani</a>
          <span style={{ marginTop: "6px" }}>+7 903 430 82 32</span>
        </div>
      </div>
    </footer>
  );
}
