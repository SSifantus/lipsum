"use client";

import { ComponentProps, useMemo } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

function Slider(props: ComponentProps<typeof SliderPrimitive.Root>){

  const {
    className,
    defaultValue,
    value,
    min = 0,
    max = 100,
    ...rest
  } = props;

  const _values = useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  );

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        "relative flex flex-1 w-full touch-none items-center select-none data-[disabled]:opacity-50 h-full",
        className
      )}
      {...rest}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden h-[15vh] data-[orientation=vertical]:w-full"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            "bg-primary absolute h-[15vh]"
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({length:_values.length}, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-primary ring-ring/50 block h-[15vh] min-h-full w-4 shrink-0 border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
