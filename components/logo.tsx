"use client";

import { useEffect, useState } from "react";

export function Logo() {
  // Initialize with false to match server render, then update in useEffect
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const storedTheme = localStorage.getItem("theme");
      const shouldBeDark = storedTheme === "dark";
      setIsDark(shouldBeDark);
    };

    // Read from localStorage on mount (client-side only)
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
