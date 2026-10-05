"use client";
import { useEffect } from "react";

/** Fades [data-reveal] elements in as they scroll into view. Elements already on screen are left alone. */
export default function RevealObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const seen = new WeakSet<Element>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const first = !seen.has(e.target);
          seen.add(e.target);
          if (e.isIntersecting) {
            e.target.classList.remove("reveal-pending");
            obs.unobserve(e.target);
          } else if (first) {
            e.target.classList.add("reveal-pending");
          }
        }
      }
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}
