"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { projects, type Project } from "@/data/projects";
import { SectionHeading } from "./ui";

/** Visually hidden suffix so repeated labels ("Frontend", "Live Demo") stay unique for screen readers. */
const For = ({ p }: { p: Project }) => <span className="sr-only"> — {p.title}</span>;

function CaseStudy({ p, onClose }: { p: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const sections: [string, React.ReactNode][] = [
    ["Overview", <p key="o">{p.description}</p>],
    ["Problem", <p key="p">{p.problem}</p>],
    ["Approach", <p key="s">{p.solution}</p>],
    ["Architecture", (
      <div key="a">
        <ol className="flex flex-col gap-1.5 my-2" aria-label={`${p.title} architecture`}>
          {p.architecture.map((n, i) => (
            <li key={n} className="flex items-center gap-3 mono text-[13px]">
              <span className="text-[var(--accent)]">0{i + 1}</span>
              <span className="flex-1 border-b rule pb-1.5">{n}</span>
            </li>
          ))}
        </ol>
        <p className="mono text-[11px] text-[var(--faint)]">{p.architectureNote}</p>
      </div>
    )],
    ["Key features", <ul key="f" className="list-disc pl-5 flex flex-col gap-1.5">{p.features.map((f) => <li key={f}>{f}</li>)}</ul>],
    ["Tech stack", <p key="t" className="mono text-[13px] text-[var(--body)]">{p.technologies.join(" · ")}</p>],
    ["Engineering challenges", <ul key="e" className="list-disc pl-5 flex flex-col gap-1.5">{p.engineering.map((f) => <li key={f}>{f}</li>)}</ul>],
    ["Result", <div key="r" className="flex flex-wrap gap-6">{p.metrics.map((m) => <div key={m.label}><p className="display font-bold text-2xl">{m.value}</p><p className="mono text-[11px] text-[var(--faint)]">{m.label}</p></div>)}</div>],
    ["Links", (
      <div key="l" className="flex flex-wrap gap-x-6 gap-y-2 mono text-[13px]">
        {p.github.map((g) => <a key={g.url} href={g.url} target="_blank" rel="noreferrer" className="u-link text-[var(--ink)]">GitHub · {g.label}<For p={p} /> <span className="arr" aria-hidden>↗</span></a>)}
        {p.live && <a href={p.live.url} target="_blank" rel="noreferrer" className="u-link text-[var(--accent)]">{p.live.label}<For p={p} /> <span className="arr" aria-hidden>↗</span></a>}
        {p.demo && <a href={p.demo.url} target="_blank" rel="noreferrer" className="u-link text-[var(--mute)]">{p.demo.label}<For p={p} /> <span className="arr" aria-hidden>↗</span></a>}
      </div>
    )],
  ];

  return (
    <div role="dialog" aria-modal="true" aria-label={`${p.title} case study`} className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center sm:p-6" onClick={onClose}>
      <div className="absolute inset-0 bg-black/85" aria-hidden />
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-xl sm:rounded-xl border rule bg-[var(--panel)] p-6 md:p-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mono text-[11px] tracking-[0.2em] text-[var(--faint)]">{p.index} — {p.category.join(" / ")}</p>
            <h3 className="display font-bold text-2xl md:text-4xl mt-2">{p.title}</h3>
            <p className="text-[var(--mute)] mt-2">{p.short}</p>
          </div>
          <button onClick={onClose} autoFocus aria-label="Close case study" className="w-10 h-10 shrink-0 grid place-items-center text-xl text-[var(--mute)] hover:text-[var(--ink)] border rule rounded-full">×</button>
        </div>
        <p className="mono text-[11px] text-[var(--faint)] mt-3 mb-6">Verified: {p.verified}</p>
        <div className="flex flex-col gap-7 text-[15px] text-[var(--body)] leading-relaxed">
          {sections.map(([h, body]) => (
            <section key={h} className="border-t rule pt-5">
              <h4 className="mono text-[11px] tracking-[0.2em] text-[var(--ink)] mb-3">{h.toUpperCase()}</h4>
              {body}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const open = useCallback((p: Project) => {
    trigger.current = document.activeElement as HTMLElement | null;
    setActive(p);
  }, []);
  const close = useCallback(() => {
    setActive(null);
    trigger.current?.focus(); // hand focus back to the "Case study" button
  }, []);

  return (
    <section id="work" className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-20 border-t rule" aria-label="Projects">
      <SectionHeading index="03" label="My work" title="My Work" sub="Things I have built — including playable browser games. Click any project for the case study, GitHub, and live demo link." />

      <div className="border-t rule">
        {projects.map((p) => (
          // Whole row is a mouse shortcut; the "Case study" button is the accessible control.
          <article
            key={p.id}
            data-reveal
            onClick={() => open(p)}
            className="group grid md:grid-cols-12 gap-1 md:gap-6 py-7 border-b rule cursor-pointer"
          >
            <p className="mono text-[13px] text-[var(--faint)] md:col-span-1 md:pt-1">{p.index}</p>
            <div className="md:col-span-11">
              <h3 className="display font-bold text-xl md:text-2xl leading-tight group-hover:underline decoration-[var(--accent)] decoration-2 underline-offset-4">
                {p.title}
              </h3>
              <p className="mt-1.5 text-[var(--mute)] leading-relaxed max-w-2xl">{p.short}</p>
              <p className="mt-2 mono text-[12px] text-[var(--faint)]">Tech: {p.technologies.join(" · ")}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 mono text-[13px]">
                {p.github.map((g) => (
                  <a key={g.url} href={g.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="u-link text-[var(--ink)]">
                    {g.label === "Repository" ? "GitHub" : g.label}<For p={p} /> <span className="arr" aria-hidden>↗</span>
                  </a>
                ))}
                {p.live && <a href={p.live.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="u-link text-[var(--accent)]">{p.live.label}<For p={p} /> <span className="arr" aria-hidden>↗</span></a>}
                {p.demo && <a href={p.demo.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="u-link text-[var(--mute)]">{p.demo.label}<For p={p} /> <span className="arr" aria-hidden>↗</span></a>}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); open(p); }}
                  aria-haspopup="dialog"
                  className="text-[var(--faint)] hover:text-[var(--ink)] transition-colors"
                >
                  Case study<For p={p} /> <span className="inline-block transition-transform group-hover:translate-x-1" aria-hidden>→</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {active && <CaseStudy p={active} onClose={close} />}
    </section>
  );
}
