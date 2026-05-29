"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ProjectsLabel } from "@/components/sections/ProjectsLabel";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type Project = {
  slug: string;
  number: string;
  title: string;
  role: string;
  year: string;
  description: string;
  cover?: string;
  tags: string[];
  coverFit?: "cover" | "contain";
  coverVideo?: string;
  bgColor?: string;
};

const projects: Project[] = [
  {
    slug: "indiamall-final",
    number: "01",
    title: "Indiamall",
    role: "Ведущий дизайнер",
    year: "2024",
    description: "Ведущий дизайнер B2B компании",
    cover: "/assets/indiamall.png",
    tags: ["B2B e-commerce"],
  },
  {
    slug: "project-02",
    number: "02",
    title: "Dionis",
    role: "Арт директор",
    year: "2024",
    description: "Арт-дирекшн для московского ювелирного бренда",
    cover: "/dionis-jewelry/content/open1.jpg",
    tags: ["Jewelry", "B2C e-commerce"],
  },
  {
    slug: "rif-v2",
    number: "03",
    title: "РИФ",
    role: "Арт директор",
    year: "2025",
    description: "Айдентика Российского Интернет Форума",
    cover: "/rif/cover.png",
    coverFit: "contain",
    tags: ["Event", "Digital"],
  },
  {
    slug: "concept-univermag",
    number: "04",
    title: "Точка банк",
    role: "Стратег / Концепт",
    year: "2025",
    description: "Креативная концепция",
    tags: ["Creative Concept", "Strategy"],
    bgColor: "#6620D4",
  },
  {
    slug: "project-05",
    number: "05",
    title: "Мини",
    role: "Дизайнер",
    year: "2025",
    description: "Короткие проекты",
    cover: "/assets/short.png",
    tags: ["Design"],
  },
];

function ProjectCard({ project }: { project: Project }) {
  const wrapRef       = useRef<HTMLDivElement>(null);
  const imgRef        = useRef<HTMLElement>(null);
  const roleRef       = useRef<HTMLDivElement>(null);
  const textGroupRef  = useRef<HTMLDivElement>(null);
  const btnRef        = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const trigger = {
        trigger: wrapRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      };

      gsap.fromTo(imgRef.current,       { y: "-6%" },  { y: "6%",   ease: "none", scrollTrigger: trigger });
      gsap.fromTo(roleRef.current,      { y: -4 },     { y: 10,     ease: "none", scrollTrigger: trigger });
      gsap.fromTo(textGroupRef.current, { y: 18 },     { y: -24,    ease: "none", scrollTrigger: trigger });
      gsap.fromTo(btnRef.current,       { y: 14 },     { y: -18,    ease: "none", scrollTrigger: trigger });
    });

    return () => ctx.revert();
  }, []);

  return (
    <Link href={`/projects/${project.slug}`} style={{ display: "block" }}>
      <div
        ref={wrapRef}
        className="group"
        style={{
          position: "relative",
          borderRadius: "24px",
          overflow: "hidden",
          aspectRatio: "16 / 9",
          cursor: "pointer",
          backgroundColor: project.bgColor ?? "#111",
        }}
      >
        {/* parallax image / video */}
        {(project.coverVideo || project.cover) && (
          <div
            style={{
              position: "absolute",
              inset: "-12% 0",
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            {project.coverVideo ? (
              <video
                ref={imgRef as React.RefObject<HTMLVideoElement>}
                src={project.coverVideo}
                autoPlay
                muted
                loop
                playsInline
                style={{
                  width: "100%",
                  height: "120%",
                  objectFit: "cover",
                  display: "block",
                  willChange: "transform",
                  marginTop: "-10%",
                }}
              />
            ) : (
              <img
                ref={imgRef as React.RefObject<HTMLImageElement>}
                src={project.cover}
                alt={project.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: project.coverFit ?? "cover",
                  display: "block",
                  willChange: "transform",
                }}
              />
            )}
          </div>
        )}

        {/* gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.75) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* tags — top right */}
        <div className="card-top-right" style={{ position: "absolute", top: "32px", right: "32px", display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 20px",
                borderRadius: "66px",
                border: "1px solid #FFF",
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: "13px",
                fontWeight: 400,
                color: "#fff",
                whiteSpace: "nowrap",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* role — top left, two lines */}
        <div ref={roleRef} className="card-top-left" style={{ position: "absolute", top: "32px", left: "32px" }}>
          <p style={{ fontSize: "12px", fontWeight: 300, color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.3 }}>
            Роль
          </p>
          <p style={{ fontSize: "16px", fontWeight: 500, color: "rgba(255,255,255,0.9)", margin: "3px 0 0", lineHeight: 1.2 }}>
            {project.role}
          </p>
        </div>

        {/* bottom left: title + description — move as one unit */}
        <div
          ref={textGroupRef}
          className="card-bottom"
          style={{
            position: "absolute",
            bottom: "32px",
            left: "32px",
            right: "calc(132px + 32px + 16px)",
          }}
        >
          <h3
            className="card-title"
            style={{
              fontSize: "clamp(28px,5.5vw,80px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 0.88,
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            {project.title}
          </h3>
          <p className="card-desc" style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.5, maxWidth: "480px", margin: 0 }}>
            {project.description}
          </p>
        </div>

        {/* bottom right: подробнее button */}
        <div
          ref={btnRef}
          className="hidden-mobile"
          style={{ position: "absolute", bottom: "32px", right: "32px" }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "132px",
              height: "45px",
              backgroundColor: "#fff",
              color: "#0a0a0a",
              fontSize: "12px",
              fontWeight: 500,
              borderRadius: "8px",
            }}
          >
            подробнее
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ProjectsParallaxSection() {
  return (
    <section
      id="projects"
      style={{
        backgroundColor: "var(--c-bg)",
        padding: "80px clamp(12px, 2.5vw, 40px) 120px",
      }}
    >
      <ProjectsLabel />

      <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px, 2vw, 24px)" }}>
        {projects.slice(0, 3).map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
        <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(12px, 2vw, 24px)" }}>
          {projects.slice(3).map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
          .projects-grid { grid-template-columns: 1fr !important; }
          .card-top-right { top: 16px !important; right: 16px !important; }
          .card-top-right span { padding: 8px 14px !important; font-size: 11px !important; }
          .card-top-left { top: 16px !important; left: 16px !important; }
          .card-bottom { bottom: 16px !important; left: 16px !important; right: 16px !important; }
          .card-title { font-size: 22px !important; line-height: 1 !important; margin-bottom: 6px !important; }
          .card-desc { font-size: 12px !important; }
        }
      `}</style>
    </section>
  );
}
