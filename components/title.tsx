"use client";

import { HyperText } from "@/components/ui/hyper-text";
import { cn } from "@/lib";
import { useSourceStore } from "@/stores";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type TitleProps = {
  className?: string;
}

export function Title(props: TitleProps){
  const {className} = props;
  const {source} = useSourceStore((state) => state);
  const {resolvedTheme} = useTheme();
  const [mounted, setMounted] = useState(false);
  const label = source?.title;

  // TODO: Fix
  useEffect(() => {
    setMounted(true);
  }, []);

  // Default to light mode during SSR to prevent hydration mismatch
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <HyperText
      className={cn(`bg-gradient-to-br ${isDark ? "from-white to-white/40" : "from-black to-black/40"} from-30% bg-clip-text leading-none text-transparent text-balance`, className)}>
      Lipsum Fast</HyperText>
  );
}
