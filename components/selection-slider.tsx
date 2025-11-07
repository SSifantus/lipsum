"use client";

import { cn } from "@/lib/utils";
import { useCallback, useRef, useState } from "react";

export interface SelectionSliderProps {
  className?: string;
  title?: string;
  value?: number[];
  min: number;
  max: number;
  step: number;
  typeId: string; // "characters" | "words" | "sentences" | "paragraphs"
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
}

// Determine the y-axis multiplier based on type
function getMultiplier(typeId: string): number {
  switch (typeId) {
    case "characters":
      return 2;
    case "words":
      return 2;
    case "sentences":
      return 8;
    case "paragraphs":
      return 20;
    default:
      return 1;
  }
}

// Convert pixels into values depending on how high the number is (curved calculation)
function pixelConversion(n: number): number {
  if (n < 1) return 1;

  if (n >= 1 && n <= 100) {
    return n;
  } else if (n > 100 && n <= 300) {
    return 100 + 5 * (n - 100);
  } else if (n > 300 && n <= 500) {
    return 100 + 5 * (300 - 100) + 10 * (n - 300);
  } else if (n > 500 && n <= 1000) {
    return 100 + 5 * (300 - 100) + 10 * (500 - 300) + 50 * (n - 500);
  } else if (n > 1000 && n <= 2000) {
    return 100 + 5 * (300 - 100) + 10 * (500 - 300) + 50 * (1000 - 500) + 100 * (n - 1000);
  } else if (n > 2000) {
    return 100 + 5 * (300 - 100) + 10 * (500 - 300) + 50 * (1000 - 500) + 100 * (2000 - 1000) + 500 * (n - 2000);
  }

  return n;
}

function SelectionSlider(props: SelectionSliderProps) {
  const {className, value = [0], min = 0, max = 100, title, typeId, onValueChange, onValueCommit} = props;
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [cursorY, setCursorY] = useState<number | null>(null);
  const [trackHeight, setTrackHeight] = useState<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Calculate what the maximum yValue should be to reach the max after pixelConversion
  // Uses binary search to find the inverse of pixelConversion
  const calculateMaxYValue = useCallback((targetMax: number): number => {
    // Binary search to find yValue such that pixelConversion(yValue) >= targetMax
    let low = 1;
    let high = 10000;
    let result = 1;

    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const converted = pixelConversion(mid);

      if (converted >= targetMax) {
        result = mid;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    return result;
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const height = rect.height;

    // Store track height for fill calculation
    setTrackHeight(height);

    // Ensure relativeY is within bounds
    const clampedY = Math.max(0, Math.min(relativeY, height));

    // Calculate relative position (0 to 1) from top to bottom
    const relativePosition = clampedY / height;

    // Calculate max yValue that would reach the actual max
    const maxYValue = calculateMaxYValue(max);

    // Scale yValue based on relative position to ensure bottom reaches max
    // At top (0): yValue = 1, at bottom (1): yValue = maxYValue
    const scaledYValue = 1 + (maxYValue - 1) * relativePosition;
    let yValue = Math.round(scaledYValue);

    if (yValue < 1) {
      yValue = 1;
    }

    const convertedValue = pixelConversion(yValue);

    // Clamp to max based on type
    let finalValue = convertedValue;
    if (typeId === "characters" && finalValue > 5000) {
      finalValue = 5000;
    } else if (typeId === "words" && finalValue > 2500) {
      finalValue = 2500;
    } else if (typeId === "sentences" && finalValue > 666) {
      finalValue = 666;
    } else if (typeId === "paragraphs" && finalValue > 333) {
      finalValue = 333;
    }

    // Also clamp to the prop max
    if (finalValue > max) {
      finalValue = max;
    }

    setHoverValue(finalValue);
    setCursorY(clampedY);

    if (onValueChange) {
      onValueChange([finalValue]);
    }
  }, [typeId, max, onValueChange, calculateMaxYValue]);

  const handleMouseLeave = useCallback(() => {
    setHoverValue(null);
    setCursorY(null);
    // Reset value to min (0) when leaving the column
    if (onValueCommit) {
      onValueCommit([min]);
    }
    if (onValueChange) {
      onValueChange([min]);
    }
  }, [onValueCommit, onValueChange, min]);

  const handleClick = useCallback(() => {
    // First commit the hover value
    if (hoverValue !== null) {

      toast.success(`Selected value: ${hoverValue}`);
      if (onValueCommit) {
        onValueCommit([hoverValue]);
      }
    }
    // Then reset value to min (0)
    if (onValueCommit) {
      onValueCommit([min]);
    }
    if (onValueChange) {
      onValueChange([min]);
    }
  }, [hoverValue, onValueCommit, onValueChange, min]);

  const valueDisplay = hoverValue !== null ? hoverValue : (value.length > 0 ? value[0] : min);

  const titleDisplay = valueDisplay === 1 ? title : `${title}s`;

  const fillHeight = cursorY !== null && trackHeight > 0 ? `${(cursorY / trackHeight) * 100}%` : "0%";

  return (
    <div ref={sliderRef} data-slot="slider"
         className={cn("relative flex w-full h-full min-h-44 flex-col touch-none select-none", className)}
         onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={handleClick}>
      <div
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow w-full overflow-hidden"
        )}
      >
        <div
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute w-full",
            cursorY === null && "transition-all duration-300"
          )}
          style={{
            height: fillHeight,
            top: 0,
          }}
        />
      </div>

      {cursorY !== null ? (
        <div
          className="absolute w-full pointer-events-none border-t border-primary"
          style={{
            top: `${cursorY}px`,
            left: 0,
            opacity: hoverValue !== null ? 1 : 0,
            transition: "opacity 0.2s",
          }}
        >
          <div className="text-lg font-medium whitespace-nowrap text-center">
            {valueDisplay} {titleDisplay}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { SelectionSlider };
