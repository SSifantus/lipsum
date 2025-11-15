"use client";

import { ComponentPropsWithoutRef, useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { CloudMoon, CloudSun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface AnimatedThemeTogglerProps
  extends ComponentPropsWithoutRef<"button"> {
  duration?: number;
}

export const AnimatedThemeToggler = ( {
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps ) => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>( null );
  const [ mounted, setMounted ] = useState( false );

  useEffect( () => {
    setMounted( true );
  }, [] );

  // Default to light mode during SSR to prevent hydration mismatch
  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = useCallback( async () => {
    if ( !buttonRef.current ) return;

    const newTheme = isDark ? "light" : "dark";

    // Check if startViewTransition is supported
    if ( typeof document !== "undefined" && "startViewTransition" in document ) {
      await document.startViewTransition( () => {
        flushSync( () => {
          setTheme( newTheme );
        } );
      } ).ready;

      const { top, left, width, height } =
        buttonRef.current.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const maxRadius = Math.hypot(
        Math.max( left, window.innerWidth - left ),
        Math.max( top, window.innerHeight - top )
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    } else {
      // Fallback: just set the theme without animation
      setTheme( newTheme );
    }
  }, [ isDark, setTheme, duration ] );

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn( className )}
      {...props}
    >
      {isDark ? <CloudMoon className="size-4" /> : <CloudSun className="size-4" />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};
