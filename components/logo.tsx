"use client";

import { useEffect, useState } from "react";

export function Logo() {
  // Initialize state from localStorage if available, otherwise check document
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme) {
        return storedTheme === "dark";
      }
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    const updateTheme = () => {
      const storedTheme = localStorage.getItem("theme");
      const shouldBeDark = storedTheme === "dark";
      setIsDark(shouldBeDark);
    };

    // Read from localStorage on mount
    updateTheme();

    // Listen for storage events (cross-tab updates)
    const handleStorageChange = (ev: StorageEvent) => {
      if (ev.key === "theme") {
        updateTheme();
      }
    };

    // Listen for custom theme change events (same-tab updates)
    const handleThemeChange = () => {
      updateTheme();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("themechange", handleThemeChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("themechange", handleThemeChange);
    };
  }, []);

  return (
    <h1
      className={`bg-gradient-to-br ${isDark ? "from-white to-white/40" : "from-black to-black/40"} from-30% bg-clip-text leading-none text-transparent text-balance`}>Lipsum
      Pro</h1>
  );
}
