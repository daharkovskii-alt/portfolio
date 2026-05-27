"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const navItems = [
  { label: "ABOUT", href: "#about" },
  { label: "PROJECTS", href: "#projects" },
  { label: "CONTACT", href: "#contact" },
];

export function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (delta > 10 && currentY > 80) {
        setHidden(true);
      } else if (delta < -6) {
        setHidden(false);
      }

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      ref={navRef}
      initial={{ opacity: 0, y: -16 }}
      animate={{
        opacity: 1,
        y: hidden ? -80 : 0,
      }}
      transition={{
        opacity: { duration: 1, delay: 0.4, ease: [0.19, 1, 0.22, 1] },
        y: { duration: 0.5, ease: [0.87, 0, 0.13, 1] },
      }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6"
      style={{ pointerEvents: hidden ? "none" : "auto" }}
    >
      <Link
        href="/"
        className="text-[11px] uppercase font-light transition-opacity duration-300 hover:opacity-60"
        style={{ color: "#7a7a7a" }}
      >
        D.K.
      </Link>

      <ul className="flex items-center gap-10">
        {navItems.map((item, i) => (
          <li key={item.label}>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.6 + i * 0.1,
                ease: [0.19, 1, 0.22, 1],
              }}
            >
              <Link
                href={item.href}
                className="text-[10px] uppercase font-light transition-all duration-300"
                style={{ color: "#3a3a3a" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#7a7a7a")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "#3a3a3a")
                }
              >
                {item.label}
              </Link>
            </motion.div>
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
