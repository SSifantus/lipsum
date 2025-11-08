"use client";

import { useEffect, useState } from "react";

export function Logo(){
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      const storedTheme = localStorage.getItem("theme");
      const shouldBeDark = storedTheme === "dark";
      setIsDark(shouldBeDark);
    };

    updateTheme();

    const handleStorageChange = (ev: StorageEvent) => {
      if(ev.key === "theme") {
        updateTheme();
      }
    };

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
