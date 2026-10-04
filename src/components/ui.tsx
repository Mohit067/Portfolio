"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function useReveal(deps: unknown[] = []) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !ref.current) return;
    const els = ref.current.querySelectorAll("[data-reveal]");
    const ctx = gsap.context(() => {
      els.forEach((el) => {
        gsap.fromTo(
          el,
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          }
        );
      });
    }, ref);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

export function SectionHeading({ label, title, sub }: { index?: string; label: string; title: string; sub?: string }) {
  return (
    <div data-reveal className="mb-8 md:mb-10">
      <p className="label mb-3">— {label}</p>
      <h2 className="display text-3xl md:text-[2.6rem] font-bold leading-[1.05]">{title}</h2>
      {sub && <p className="mt-3 max-w-2xl text-[var(--mute)] leading-relaxed">{sub}</p>}
    </div>
  );
}
