"use client";

import { cn } from "@/lib/utils";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { ComponentProps, useMemo, useState, useEffect } from "react";

function SelectionSlider( {
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  onValueChange,
  onValueCommit,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root> ) {
  const isControlled = value !== undefined;
  const defaultValues = useMemo(
    () =>
      Array.isArray( defaultValue )
        ? defaultValue
        : [ min, max ],
    [ defaultValue, min, max ]
  );

  const [ internalValue, setInternalValue ] = useState<number[]>( defaultValues );

  // Sync internal value when defaultValue changes
  useEffect( () => {
    if ( !isControlled ) {
      setInternalValue( defaultValues );
    }
  }, [ defaultValues, isControlled ] );

  const _values = useMemo(
    () =>
      isControlled
        ? ( Array.isArray( value ) ? value : [ value ] )
        : internalValue,
    [ value, internalValue, isControlled ]
  );

  const handleValueChange = ( newValue: number[] ) => {
    if ( !isControlled ) {
      setInternalValue( newValue );
    }
    onValueChange?.( newValue );
  };

  const handleValueCommit = ( newValue: number[] ) => {
    // Snap back to defaultValue when dragging stops (only for uncontrolled)
    if ( !isControlled ) {
      setInternalValue( defaultValues );
    }
    onValueCommit?.( newValue );
  };

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={isControlled ? value : internalValue}
      min={min}
      max={max}
      onValueChange={handleValueChange}
      onValueCommit={handleValueCommit}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
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
      {Array.from( { length: _values.length }, ( _, index ) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="border-primary ring-ring/50 block data-[orientation=horizontal]:w-4 data-[orientation=vertical]:w-full data-[orientation=vertical]:h-6 shrink-0 border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
        />
      ) )}
    </SliderPrimitive.Root>
  );
}

export { SelectionSlider };
