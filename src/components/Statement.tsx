import { SectionHeading } from "./ui";

export default function Statement() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 md:px-8 py-12 md:py-16 border-t rule" aria-label="About me">
      <SectionHeading index="01" label="About" title="About Me" />
      <div className="max-w-2xl flex flex-col gap-4 text-[16px] text-[var(--body)] leading-relaxed">
        <p data-reveal>I am a Software Engineer at Maventic Innovation Pvt. Ltd.</p>
        <p data-reveal>I like building web apps and AI agents.</p>
        <p data-reveal>
          I work with JavaScript, Python, React, Next.js, Node.js, MongoDB, LLMs, RAG, and AI agents.
        </p>
        <p data-reveal className="text-[var(--mute)]">
          I also enjoy solving DSA problems and learning new things. I have finished my B.Tech in AI &amp; Data Science.
        </p>
        <p data-reveal className="mono text-[13px] text-[var(--faint)]">
          off the keyboard: I play video games.
        </p>
      </div>
    </section>
  );
}
