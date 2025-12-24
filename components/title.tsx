"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { HyperText } from "@/components/ui/hyper-text";
import { cn } from "@/lib";

type TitleProps = {
  className?: string;
}

export function Title(props: TitleProps) {
  const { className } = props;
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This is intentional to prevent hydration mismatches with theme provider
    // eslint-disable-next-line react-compiler/react-compiler
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <HyperText
      className={ cn(`bg-gradient-to-br ${isDark ? "from-white to-white/40" : "from-black to-black/40"} from-30% min-h-8 bg-clip-text leading-none text-transparent text-balance`, className) }>
      Lipsum Fast</HyperText>
  );
}
