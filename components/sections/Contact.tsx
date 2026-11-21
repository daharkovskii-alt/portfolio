"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const links = [
  { label: "TELEGRAM", href: "https://t.me/", value: "@handle" },
  { label: "EMAIL", href: "mailto:daharkovskii@gmail.com", value: "daharkovskii@gmail.com" },
  { label: "INSTAGRAM", href: "https://instagram.com/", value: "@handle" },
];

export function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="contact" className="px-10 py-14" style={{ backgroundColor: "var(--c-bg)" }}>
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
        <div className="flex items-center gap-6 mb-8">
          <span className="text-[10px] uppercase font-light" style={{ color: "var(--c-fg-subtle)" }}>
            04 / CONTACT
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--c-border)" }} />
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.4, ease: [0.19, 1, 0.22, 1] }}
          className="font-light leading-[0.88] tracking-[-0.02em] mb-10"
          style={{ fontSize: "clamp(2.5rem, 6vw, 6rem)", color: "var(--c-fg)", maxWidth: "14ch" }}
        >
          LET&apos;S
          <br />
          <span style={{ color: "var(--c-fg-subtle)" }}>BUILD</span>
          <br />
          SOMETHING.
        </motion.h2>

        <div className="flex flex-col gap-8">
          {links.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }}
              className="group flex items-center justify-between py-4 border-b transition-all duration-500"
              style={{ borderColor: "var(--c-border)" }}
            >
              <span className="text-[10px] uppercase font-light" style={{ color: "var(--c-fg-subtle)" }}>
                {link.label}
              </span>
              <span className="text-sm font-light transition-all duration-400 group-hover:translate-x-2" style={{ color: "var(--c-fg-muted)" }}>
                {link.value}
              </span>
            </motion.a>
          ))}
        </div>

        <div className="mt-10 flex justify-between items-end">
          <p className="text-[10px] uppercase font-light" style={{ color: "var(--c-border)" }}>© 2024 D.KHARKOVSKIY</p>
          <p className="text-[10px] uppercase font-light" style={{ color: "var(--c-border)" }}>ALL RIGHTS RESERVED</p>
        </div>
      </div>
    </section>
  );
}
