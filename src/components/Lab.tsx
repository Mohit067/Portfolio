"use client";
import { labRepos } from "@/data/projects";
import { profile } from "@/data/profile";
import { SectionHeading, useReveal } from "./ui";

export default function Lab() {
  const ref = useReveal();
  return (
    <section id="lab" ref={ref} className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-20 border-t rule" aria-label="Lab">
      <SectionHeading index="06" label="Lab" title="Lab" sub="Small experiments and things I tried to learn something new." />
      <ul className="border-t rule">
        {labRepos.map((r) => (
          <li key={r.name} data-reveal>
            <a href={r.url} target="_blank" rel="noreferrer" className="group grid grid-cols-12 gap-2 items-baseline py-3.5 border-b rule">
              <span className="mono text-[13px] col-span-8 sm:col-span-4 group-hover:underline underline-offset-4">{r.name}</span>
              <span className="hidden sm:block text-[13px] text-[var(--faint)] sm:col-span-6">{r.note}</span>
              <span className="mono text-[11px] text-[var(--faint)] col-span-3 sm:col-span-1 text-right">{r.lang}</span>
              <span className="text-[var(--faint)] group-hover:text-[var(--ink)] group-hover:translate-x-0.5 transition-all col-span-1 text-right text-sm" aria-hidden>↗</span>
            </a>
          </li>
        ))}
      </ul>
      <a data-reveal href={`${profile.links.github}?tab=repositories`} target="_blank" rel="noreferrer" className="u-link mono text-[12px] mt-6 inline-block">
        MORE ON GITHUB <span className="arr">↗</span>
      </a>
    </section>
  );
}
