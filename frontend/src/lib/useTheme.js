import { useState, useEffect } from "react";

/**
 * useTheme — class-based dark mode with localStorage persistence.
 * Applies/removes `.dark` on <html> element.
 * Returns [isDark, toggleDark].
 */
export function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("fretron-theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("fretron-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("fretron-theme", "light");
    }
  }, [dark]);

  const toggle = () => setDark((d) => !d);
  return [dark, toggle];
}
