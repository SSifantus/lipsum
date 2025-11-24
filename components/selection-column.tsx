"use client";


import { MouseEvent, useCallback, useRef, useState } from "react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { cn } from "@/lib/utils";
import { calculateMaxPosition, extractAndCopyText, positionToClampedValue } from "@/lib/utils";
import { useSourceStore } from "@/stores/source";

export interface SelectionColumnProps {
  className?: string;
  title?: string;
  value?: number[];
  index: number;
  min: number;
  max: number;
  step: number;
  typeId: "characters" | "words" | "sentences" | "paragraphs";
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
}

function SelectionColumn(props: SelectionColumnProps){
  const {className, index, value = [0], min = 0, max = 100, title, typeId, onValueChange, onValueCommit} = props;
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [cursorY, setCursorY] = useState<number | null>(null);
  const [trackHeight, setTrackHeight] = useState<number>(0);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [committedValue, setCommittedValue] = useState<number | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const sliderRef = useRef<HTMLDivElement>(null);
  const source = useSourceStore((state) => state.source);

  // Calculate what the maximum yValue should be to reach the max after pixelConversion
  const calculateMaxYValue = useCallback((targetMax: number): number => {
    return calculateMaxPosition(targetMax);
  }, []);

  const handleMouseMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    if(!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const relativeY = event.clientY - rect.top;
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

    if(yValue < 1) {
      yValue = 1;
    }

    const finalValue = positionToClampedValue(yValue, typeId, max, min);

    setHoverValue(finalValue);
    setCursorY(clampedY);

    if(onValueChange) {
      onValueChange([finalValue]);
    }
  }, [typeId, max, onValueChange, calculateMaxYValue]);

  const handleMouseLeave = useCallback(() => {
    setHoverValue(null);
    setCursorY(null);
    // Reset value to min (0) when leaving the column
    if(onValueCommit) {
      onValueCommit([min]);
    }
    if(onValueChange) {
      onValueChange([min]);
    }
  }, [onValueCommit, onValueChange, min]);

  const handleClick = useCallback(async() => {
    // First commit the hover value
    if(hoverValue !== null && source?.id) {
      try {
        const text = await extractAndCopyText(
          source.id,
          typeId as "characters" | "words" | "sentences" | "paragraphs",
          hoverValue
        );
        setExtractedText(text);
        setCommittedValue(hoverValue);
        setModalOpen(true);
        if(onValueCommit) {
          onValueCommit([hoverValue]);
        }
      } catch (error) {
        console.error("Failed to extract text:", error);
      }
    }
    // Then reset value to min (0)
    if(onValueCommit) {
      onValueCommit([min]);
    }
    if(onValueChange) {
      onValueChange([min]);
    }
  }, [hoverValue, source, typeId, onValueCommit, onValueChange, min]);

  const toggleDialog = (open: boolean) => { // TODO: DRY
    setModalOpen(open);
    if(!open) {
      setCommittedValue(null);
      setExtractedText("");
    }
  };

  const valueDisplay = hoverValue !== null ? hoverValue : (value.length > 0 ? value[0] : min);

  const titleDisplay = valueDisplay === 1 ? title : `${title}s`;

  const fillHeight = cursorY !== null && trackHeight > 0 ? `${(cursorY / trackHeight) * 100}%` : "0%";

  const dialogValue = committedValue;
  const dialogTitleDisplay = dialogValue === 1 ? title : `${title}s`;

  return (
    <>
      <div ref={sliderRef} data-slot="slider"
           data-text-type={typeId}
           data-text-amount={hoverValue !== null ? hoverValue : (value.length > 0 ? value[0] : min)}
           className={cn("relative flex w-full h-full min-h-44 flex-col touch-none select-none ", className)}
           onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} onClick={handleClick}>
        <div
          data-slot="slider-track"
          className={cn(
            "relative grow w-full overflow-hidden",
            {
              "[background:var(--slider-gradient-0)]":index === 0,
              "[background:var(--slider-gradient-1)]":index === 1,
              "[background:var(--slider-gradient-2)]":index === 2,
              "[background:var(--slider-gradient-3)]":index === 3,
            },
          )}
        >
          <div
            data-slot="slider-range"
            className={cn(
              "bg-white/20 absolute w-full top-0",
              {"transition-all duration-300":cursorY === null}
            )}
            style={{
              height:fillHeight,
            }}
          />
        </div>

        {cursorY !== null ? (
          <div
            className="absolute w-full pointer-events-none border-t border-white"
            style={{
              top:`${cursorY}px`,
              left:0,
              opacity:hoverValue !== null ? 1 : 0,
              transition:"opacity 0.2s",
            }}
          >
            <div className="text-lg text-white font-medium whitespace-nowrap text-center hover:cursor-pointer">
              {valueDisplay} {titleDisplay}
            </div>
          </div>
        ) : null}
      </div>
      <ConfirmationDialog isOpen={modalOpen} onOpenChange={toggleDialog} text={extractedText} title={dialogTitleDisplay}
                          value={dialogValue}/>
    </>
  );
}

export { SelectionColumn };
