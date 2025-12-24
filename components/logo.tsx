"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib";
import { useSourceStore } from "@/stores";

type LogoProps = {
  className?: string;
}

export function Logo(props: LogoProps) {
  const { className } = props;
  const { source } = useSourceStore((state) => state);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const label = source?.title;

  useEffect(() => {
    // This is intentional to prevent hydration mismatches with theme provider
    // eslint-disable-next-line react-compiler/react-compiler
    setMounted(true);
  }, []);

  // Default to light mode during SSR to prevent hydration mismatch
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <h1
      className={ cn(`bg-gradient-to-br ${isDark ? "from-white to-white/40" : "from-black to-black/40"} from-30% bg-clip-text text-[15px] md:text-[16px] leading-4.5 text-transparent text-balance`, className) }>
      { label } Generator</h1>
  );
}
