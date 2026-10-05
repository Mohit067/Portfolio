import { skills } from "@/data/experience";
import { profile } from "@/data/profile";
import { SectionHeading } from "./ui";

export default function Skills() {
  return (
    <section id="stack" className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-20 border-t rule" aria-label="Tech stack">
      <SectionHeading index="05" label="Skills" title="Skills" sub="What I use." />
      <dl className="border-t rule">
        {skills.map((g) => (
          <div key={g.title} data-reveal className="grid md:grid-cols-12 gap-2 md:gap-6 py-5 border-b rule">
            <dt className="mono text-[11px] tracking-[0.18em] text-[var(--faint)] md:col-span-4 md:pt-1 uppercase">{g.title}</dt>
            <dd className="md:col-span-8 text-[15px] text-[var(--body)] leading-relaxed">
              {g.items.join(" · ")}
              {g.note && <span className="block mono text-[11px] text-[var(--faint)] mt-1">{g.note}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 grid md:grid-cols-2 gap-8">
        <article data-reveal aria-label="Problem solving" className="border-t rule pt-5">
          <p className="label mb-3">Problem Solving</p>
          <p className="text-[15px] text-[var(--mute)]">I like solving DSA problems in my free time.</p>
          <p className="display font-bold text-5xl mt-3">{profile.leetcode.totalSolved} <span className="text-lg font-medium text-[var(--faint)]">solved</span></p>
          <p className="mt-2 text-sm text-[var(--mute)]">{profile.leetcode.cppSolved} in C++ · Rank #{profile.leetcode.rank.toLocaleString("en-IN")} · {profile.leetcode.badges.join(" · ")}</p>
          <a href={profile.links.leetcode} target="_blank" rel="noreferrer" className="btn-ghost inline-block px-6 py-3 text-xs mono mt-5">View LeetCode ↗</a>
        </article>
        <article data-reveal aria-label="GitHub" className="border-t rule pt-5">
          <p className="label mb-3">GitHub</p>
          <p className="text-[15px] text-[var(--mute)]">I have built many projects and experiments on GitHub.</p>
          <p className="display font-bold text-5xl mt-3">{profile.github.repoCount} <span className="text-lg font-medium text-[var(--faint)]">public repos</span></p>
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="btn-ghost inline-block px-6 py-3 text-xs mono mt-5">View GitHub ↗</a>
        </article>
      </div>
    </section>
  );
}
