"use client";

import { cn } from "@/lib/utils";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { ComponentProps, useMemo } from "react";


export interface SelectionSliderProps extends ComponentProps<typeof SliderPrimitive.Root> {
  defaultValue?: number[];
  value?: number[];
  min: number;
  max: number;
  step: number;
}

function SelectionSlider(props: SelectionSliderProps) {
  const {className, defaultValue, value, min = 0, max = 100, step = 1, ...rest} = props;
  const _values = useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  );

  // For controlled component, only pass value. For uncontrolled, only pass defaultValue.
  const sliderProps = value !== undefined
    ? {value, min, max, step}
    : {defaultValue, min, max, step};

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      {...sliderProps}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:flex-col",
        className
      )}
      {...rest}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden data-[orientation=horizontal]:h-1.5" +
          " data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-full"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({length: _values.length}, (_, index) => (
        <SliderPrimitive.Thumb asChild={true}
                               data-slot="slider-thumb"
                               key={index}
        >
          <div
            className="border-primary ring-ring/50 block data-[orientation=horizontal]:w-4 data-[orientation=vertical]:w-full data-[orientation=vertical]:h-6 shrink-0 border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
          >{_values[index]}</div>
        </SliderPrimitive.Thumb>
      ))}
    </SliderPrimitive.Root>
  );
}

export { SelectionSlider };
