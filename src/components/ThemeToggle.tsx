"use client";
import { useEffect, useState } from "react";
import { THEME_KEY } from "@/lib/theme";

export default function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    } catch {
      /* private mode — theme just won't persist */
    }
  };

  return (
    <button
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      className="w-9 h-9 grid place-items-center rounded-full border rule text-[15px] hover:opacity-70 transition-opacity"
    >
      <span aria-hidden>{dark ? "◐" : "◑"}</span>
    </button>
  );
}
