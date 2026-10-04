"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { profile } from "@/data/profile";

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".hero-in", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power2.out", delay: 0.1 });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={root} className="mx-auto max-w-6xl px-5 md:px-8 pt-28 md:pt-36 pb-12" aria-label="Intro">
      <div className="flex items-center gap-5 md:gap-8">
        <div className="flex-1 min-w-0">
          <h1 className="hero-in display font-bold text-4xl md:text-6xl tracking-tight">Mohit Sahu</h1>
          <p className="hero-in mono text-[11px] md:text-xs tracking-[0.2em] text-[var(--mute)] mt-2 uppercase">
            Associate Software Engineer
          </p>
        </div>
        <div className="hero-in relative w-24 md:w-36 aspect-square shrink-0" aria-label="Photo of Mohit Sahu">
          <Image
            src="/mohit_black.png"
            alt="Mohit Sahu"
            fill
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 768px) 96px, 144px"
            className="hidden dark:block object-cover rounded-full border rule"
          />
          <Image
            src="/mohit_light.png"
            alt="Mohit Sahu"
            fill
            loading="eager"
            sizes="(max-width: 768px) 96px, 144px"
            className="block dark:hidden object-cover rounded-full border rule"
          />
        </div>
      </div>

      <p className="hero-in mt-7 max-w-xl text-lg md:text-xl text-[var(--body)] leading-relaxed">
        I build web apps, backend systems, and AI Agents.
      </p>
      <p className="hero-in mt-3 mono text-[13px] text-[var(--faint)]">
        I work with: Next.js · Node.js · Python · AI Agents
      </p>

      <div className="hero-in mt-7 flex flex-wrap gap-3">
        <a href="#work" className="btn-primary px-7 py-3 text-sm">See My Work</a>
        <a href="#contact" className="btn-ghost px-7 py-3 text-sm">Contact Me</a>
      </div>

      <div className="hero-in mt-7 flex flex-wrap gap-x-6 gap-y-2 mono text-xs text-[var(--faint)]">
        <a href={profile.links.github} target="_blank" rel="noreferrer" className="u-link hover:text-[var(--ink)]">GitHub <span className="arr">↗</span></a>
        <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="u-link hover:text-[var(--ink)]">LinkedIn <span className="arr">↗</span></a>
        <a href={profile.links.leetcode} target="_blank" rel="noreferrer" className="u-link hover:text-[var(--ink)]">LeetCode <span className="arr">↗</span></a>
      </div>
      <p className="hero-in mt-6 mono text-[11px] text-[var(--faint)]">
        psst — the <span className="text-[var(--mute)]">MOHIT AI</span> button actually works. Go ask it something.
      </p>
    </section>
  );
}
