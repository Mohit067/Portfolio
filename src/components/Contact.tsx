"use client";
import { profile } from "@/data/profile";
import { SectionHeading, useReveal } from "./ui";

export default function Contact() {
  const ref = useReveal();
  return (
    <>
      <section id="contact" ref={ref} className="mx-auto max-w-6xl px-5 md:px-8 py-14 md:py-24 border-t rule" aria-label="Contact">
        <SectionHeading index="07" label="Contact" title="Let's Talk" />
        <p data-reveal className="-mt-6 mb-8 text-[15px] text-[var(--mute)]">Have an idea or want to work together? Send me a message.</p>
        <div className="grid lg:grid-cols-12 gap-8">
          <div data-reveal className="lg:col-span-7 flex flex-wrap gap-3 content-start">
            <a href={`mailto:${profile.email}`} className="btn-primary px-8 py-4 text-sm">Email Me</a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="btn-ghost px-8 py-4 text-sm">LinkedIn</a>
            <a href={profile.links.github} target="_blank" rel="noreferrer" className="btn-ghost px-8 py-4 text-sm">GitHub</a>
          </div>
          <div data-reveal className="lg:col-span-4 lg:col-start-9 mono text-[13px] leading-loose text-[var(--faint)]">
            <p>{profile.email}</p>
            <p>{profile.location}</p>
          </div>
        </div>
      </section>
      <footer className="border-t rule" aria-label="Footer">
        <div className="mx-auto max-w-6xl px-5 md:px-8 py-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="display font-bold text-sm">MOHIT SAHU</p>
            <p className="mono text-[11px] text-[var(--faint)] mt-1">Associate Software Engineer — {profile.company}</p>
          </div>
          <p className="mono text-[11px] text-[var(--faint)]">© {new Date().getFullYear()} Mohit Sahu · no cookies, no tracking · last updated Oct 2026</p>
        </div>
      </footer>
    </>
  );
}
