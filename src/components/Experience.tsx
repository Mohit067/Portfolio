import { experience } from "@/data/experience";
import { SectionHeading } from "./ui";

export default function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-20 border-t rule" aria-label="Experience">
      <SectionHeading index="02" label="Experience" title="Experience" />
      <p data-reveal className="-mt-6 mb-2 text-[15px] text-[var(--mute)]">Where I have worked.</p>
      <div className="flex flex-col">
        {experience.map((e) => (
          <article
            key={e.role}
            data-reveal
            className={`grid md:grid-cols-12 gap-3 md:gap-6 py-8 border-b rule first:border-t ${e.current ? "md:bg-[var(--wash)] md:-mx-4 md:px-4 md:rounded-[10px] md:border md:rule" : ""}`}
          >
            <p className="mono text-[11px] tracking-[0.14em] text-[var(--faint)] md:col-span-3 md:pt-1">
              {e.period}
              {e.current && <span className="ml-2 inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden />NOW</span>}
            </p>
            <div className="md:col-span-6">
              <h3 className="display font-bold text-xl md:text-2xl">{e.role}</h3>
              <p className="text-[var(--mute)] text-sm mt-1">{e.org}{e.location ? ` — ${e.location}` : ""}</p>
              <ul className="mt-3 flex flex-col gap-1.5">
                {e.points.map((p) => (
                  <li key={p} className="text-[15px] text-[var(--body)] leading-relaxed">{p}</li>
                ))}
              </ul>
            </div>
            <div className="md:col-span-3 flex md:justify-end items-start">
              <p className="mono text-[11px] text-[var(--faint)] leading-loose md:text-right">{e.tech.join(" · ")}</p>
            </div>
          </article>
        ))}
      </div>
      <p data-reveal className="mono text-[11px] text-[var(--faint)] mt-5">
        Role, company, location and dates per public LinkedIn profile. Responsibilities kept concise where not publicly listed.
      </p>
    </section>
  );
}
