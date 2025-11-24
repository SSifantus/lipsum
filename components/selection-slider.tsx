"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { calculateMaxPosition, extractAndCopyText, positionToClampedValue, valueToPosition } from "@/lib/utils";
import { useSourceStore } from "@/stores/source";

export interface SelectionSliderProps {
  className?: string;
  title?: string;
  value?: number[];
  index: number;
  min: number;
  max: number;
  step: number;
  typeId: string;
  onValueChange?: (value: number[]) => void;
  onValueCommit?: (value: number[]) => void;
}

function SelectionSlider(props: SelectionSliderProps){
  const {className, index, value = [0], min = 0, max = 100, title, typeId, onValueChange, onValueCommit} = props;
  const [sliderValue, setSliderValue] = useState<number[]>([0]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [committedValue, setCommittedValue] = useState<number | null>(null);
  const [extractedText, setExtractedText] = useState<string>("");
  const source = useSourceStore((state) => state.source);

  // Calculate the max slider value based on the prop max
  const maxSliderValue = useMemo(() => calculateMaxPosition(max), [max]);

  // Convert slider value to actual curved value
  const convertedValue = useMemo(() => {
    const sliderPos = sliderValue[0] || 0;
    return positionToClampedValue(sliderPos, typeId, max, min);
  }, [sliderValue, typeId, max, min]);

  // Convert actual value back to slider position (for initial value)
  const valueToSliderPosition = useCallback((targetValue: number): number => {
    return valueToPosition(targetValue, min, maxSliderValue);
  }, [min, maxSliderValue]);

  // Initialize slider value from prop value
  useEffect(() => {
    const propValue = value.length > 0 ? value[0] : min;
    const sliderPos = valueToSliderPosition(propValue);
    setSliderValue([sliderPos]);
  }, [value, min, valueToSliderPosition, maxSliderValue]);

  const handleSliderChange = useCallback((newValue: number[]) => {
    setSliderValue(newValue);
    if(onValueChange) {
      const sliderPos = newValue[0] || 0;
      const converted = positionToClampedValue(sliderPos, typeId, max, min);
      onValueChange([converted]);
    }
  }, [onValueChange, typeId, max, min]);

  const handleSliderCommit = useCallback(async(newValue: number[]) => {
    setSliderValue(newValue);

    const sliderPos = newValue[0] || 0;
    const converted = positionToClampedValue(sliderPos, typeId, max, min);

    if(sliderPos < 1 || converted <= min) {
      // Reset to min after commit
      setSliderValue([0]);
      if(onValueCommit) {
        onValueCommit([min]);
      }
      if(onValueChange) {
        onValueChange([min]);
      }
      return;
    }

    if(converted > min && source?.id) {
      try {
        const text = await extractAndCopyText(
          source.id,
          typeId as "characters" | "words" | "sentences" | "paragraphs",
          converted
        );
        setExtractedText(text);
        setCommittedValue(converted);
        setModalOpen(true);
        if(onValueCommit) {
          onValueCommit([converted]);
        }
      } catch (error) {
        console.error("Failed to extract text:", error);
      }
    }

    // Reset to min after commit
    setSliderValue([0]);
    if(onValueCommit) {
      onValueCommit([min]);
    }
    if(onValueChange) {
      onValueChange([min]);
    }
  }, [source, typeId, onValueCommit, onValueChange, min, max]);

  const toggleDialog = (open: boolean) => { // TODO: DRY
    setModalOpen(open);
    if(!open) {
      setCommittedValue(null);
      setExtractedText("");
    }
  };

  const valueDisplay = convertedValue;
  const titleDisplay = valueDisplay === 1 ? title : `${title}s`;

  const dialogValue = committedValue;
  const dialogTitleDisplay = dialogValue === 1 ? title : `${title}s`;

  return (
    <>
      <div className={cn("flex flex-col items-center w-full h-full", className)}>
        <div className="flex items-end w-full">
          <div className="text-sm font-medium text-foreground pb-2 pt-3 px-1">
            {valueDisplay} {titleDisplay}
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <Slider
            value={sliderValue}
            min={0}
            max={maxSliderValue}
            step={1}
            onValueChange={handleSliderChange}
            onValueCommit={handleSliderCommit}
            data-text-type={typeId}
            data-text-amount={convertedValue}
            className={cn(
              "w-full",
              {
                "[&_[data-slot=slider-track]]:bg-gradient-to-r":true,
                "[&_[data-slot=slider-track]]:[background:var(--slider-gradient-0)]":index === 0,
                "[&_[data-slot=slider-track]]:[background:var(--slider-gradient-1)]":index === 1,
                "[&_[data-slot=slider-track]]:[background:var(--slider-gradient-2)]":index === 2,
                "[&_[data-slot=slider-track]]:[background:var(--slider-gradient-3)]":index === 3,
              }
            )}
          />
        </div>
      </div>

      <ConfirmationDialog isOpen={modalOpen} onOpenChange={toggleDialog} text={extractedText} title={dialogTitleDisplay}
                          value={dialogValue}/>
    </>
  );
}

export { SelectionSlider };
