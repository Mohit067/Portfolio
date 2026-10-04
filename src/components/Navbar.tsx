"use client";
import { useEffect, useState } from "react";
import { navItems, profile } from "@/data/profile";
import ThemeToggle from "@/components/ThemeToggle";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const sections = navItems
      .map((n) => document.querySelector(n.href))
      .filter(Boolean) as Element[];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => obs.observe(s));
    return () => {
      window.removeEventListener("scroll", onScroll);
      obs.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[color-mix(in_srgb,var(--bg)_90%,transparent)] backdrop-blur-md border-b rule" : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav aria-label="Primary" className={`mx-auto max-w-6xl px-5 md:px-8 flex items-center justify-between transition-all duration-300 ${scrolled ? "h-13 py-2.5" : "h-16"}`}>
        <a href="#top" className="display font-bold tracking-tight text-[15px]">
          MOHIT<span className="text-[var(--accent)]">.</span>SAHU
        </a>
        <ul className="hidden lg:flex items-center gap-7">
          {navItems.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                aria-current={active === n.href ? "true" : undefined}
                className={`mono text-[11px] tracking-[0.18em] uppercase transition-colors ${
                  active === n.href ? "text-[var(--ink)]" : "text-[var(--faint)] hover:text-[var(--ink)]"
                }`}
              >
                {active === n.href && <span className="text-[var(--accent)] mr-1" aria-hidden>·</span>}
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden lg:flex items-center gap-5 mono text-[11px]">
          <a href={profile.links.github} target="_blank" rel="noreferrer" className="u-link text-[var(--faint)] hover:text-[var(--ink)]">GitHub <span className="arr">↗</span></a>
          <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="u-link text-[var(--faint)] hover:text-[var(--ink)]">LinkedIn <span className="arr">↗</span></a>
          <a href={profile.links.leetcode} target="_blank" rel="noreferrer" className="u-link text-[var(--faint)] hover:text-[var(--ink)]">LeetCode <span className="arr">↗</span></a>
          <ThemeToggle />
        </div>
        <div className="lg:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 -mr-2"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
          >
            <span className="block w-6 h-px bg-[var(--ink)] mb-1.5" />
            <span className="block w-6 h-px bg-[var(--ink)] mb-1.5" />
            <span className="block w-4 h-px bg-[var(--ink)]" />
          </button>
        </div>
      </nav>
      {open && (
        <div className="lg:hidden border-t rule bg-[color-mix(in_srgb,var(--bg)_95%,transparent)] backdrop-blur-md">
          <ul className="px-6 py-4 flex flex-col">
            {navItems.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className={`block py-2.5 text-sm uppercase mono tracking-[0.18em] ${active === n.href ? "text-[var(--ink)]" : "text-[var(--mute)]"}`}
                >
                  {n.label}
                </a>
              </li>
            ))}
            <li className="flex gap-5 pt-3 pb-2 mono text-xs text-[var(--faint)]">
              <a href={profile.links.github} target="_blank" rel="noreferrer">GITHUB ↗</a>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer">LINKEDIN ↗</a>
              <a href={profile.links.leetcode} target="_blank" rel="noreferrer">LEETCODE ↗</a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
