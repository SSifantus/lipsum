"use client";

import { cn } from "@/lib";
import { useSourceStore } from "@/stores";
import { useEffect, useState } from "react";

type LogoProps = {
  className?: string;
}

export function Logo(props: LogoProps){
  const {className} = props;
  const {source} = useSourceStore((state) => state);
  const [isDark, setIsDark] = useState(false);
  const label = source?.title;

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
      className={cn(`bg-gradient-to-br ${isDark ? "from-white to-white/40" : "from-black to-black/40"} from-30% bg-clip-text leading-none text-transparent text-balance`, className)}>
      {label} Generator</h1>
  );
}
