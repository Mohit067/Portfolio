import type { StaticImageData } from "next/image";
import { profile } from "@/data/profile";
import dark1x from "@/assets/mohit-dark-144.webp";
import dark2x from "@/assets/mohit-dark.webp";
import light1x from "@/assets/mohit-light-144.webp";
import light2x from "@/assets/mohit-light.webp";

// Static export has no image optimizer, so pick between pre-sized 144px / 288px files ourselves.
function Portrait({ x1, x2, className, priority }: { x1: StaticImageData; x2: StaticImageData; className: string; priority?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={x1.src}
      srcSet={`${x1.src} 144w, ${x2.src} 288w`}
      sizes="(max-width: 768px) 96px, 144px"
      alt="Mohit Sahu"
      width={144}
      height={144}
      fetchPriority={priority ? "high" : undefined}
      className={`size-full object-cover rounded-full border rule ${className}`}
    />
  );
}

export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-6xl px-5 md:px-8 pt-28 md:pt-36 pb-12" aria-label="Intro">
      <div className="flex items-center gap-5 md:gap-8">
        <div className="flex-1 min-w-0">
          <h1 className="hero-in display font-bold text-4xl md:text-6xl tracking-tight">Mohit Sahu</h1>
          <p className="hero-in mono text-[11px] md:text-xs tracking-[0.2em] text-[var(--mute)] mt-2 uppercase">
            Associate Software Engineer
          </p>
        </div>
        <div className="hero-in relative w-24 md:w-36 aspect-square shrink-0">
          <Portrait x1={dark1x} x2={dark2x} priority className="hidden dark:block" />
          <Portrait x1={light1x} x2={light2x} className="block dark:hidden" />
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
        <a href={profile.links.github} target="_blank" rel="noreferrer" className="u-link hover:text-[var(--ink)]">GitHub <span className="arr" aria-hidden>↗</span></a>
        <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="u-link hover:text-[var(--ink)]">LinkedIn <span className="arr" aria-hidden>↗</span></a>
        <a href={profile.links.leetcode} target="_blank" rel="noreferrer" className="u-link hover:text-[var(--ink)]">LeetCode <span className="arr" aria-hidden>↗</span></a>
      </div>
      <p className="hero-in mt-6 mono text-[11px] text-[var(--faint)]">
        psst — the <span className="text-[var(--mute)]">MOHIT AI</span> button actually works. Go ask it something.
      </p>
    </section>
  );
}
