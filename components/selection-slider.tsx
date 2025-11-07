"use client";

import { cn } from "@/lib/utils";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { ComponentProps, useMemo, useState, useEffect, useRef } from "react";

function SelectionSlider( {
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  step,
  onValueChange,
  onValueCommit,
  orientation = "horizontal",
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
  const trackRef = useRef<HTMLDivElement>( null );
  const isVertical = orientation === "vertical";

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

  const calculateValueFromPosition = ( clientX: number, clientY: number ): number => {
    if ( !trackRef.current ) return min;

    const rect = trackRef.current.getBoundingClientRect();
    let percentage: number;

    if ( isVertical ) {
      // For vertical slider, calculate from bottom to top
      const y = clientY - rect.top;
      percentage = 1 - ( y / rect.height );
    } else {
      // For horizontal slider, calculate from left to right
      const x = clientX - rect.left;
      percentage = x / rect.width;
    }

    // Clamp percentage between 0 and 1
    percentage = Math.max( 0, Math.min( 1, percentage ) );

    // Calculate value based on min and max
    const calculatedValue = min + ( max - min ) * percentage;

    // Round to nearest step if step is provided
    const stepValue = step || 1;
    return Math.round( calculatedValue / stepValue ) * stepValue;
  };

  const handleMouseMove = ( event: React.MouseEvent<HTMLDivElement> ) => {
    const newValue = calculateValueFromPosition( event.clientX, event.clientY );
    const newValueArray = [ newValue ];

    if ( !isControlled ) {
      setInternalValue( newValueArray );
    }
    onValueChange?.( newValueArray );
  };

  const handleMouseLeave = () => {
    // Snap back to defaultValue when mouse leaves (only for uncontrolled)
    if ( !isControlled ) {
      setInternalValue( defaultValues );
    }
    onValueCommit?.( defaultValues );
  };

  const handleValueChange = () => {
    // Prevent Radix UI's default click/drag behavior - do nothing
    // The hover handler will manage the value
  };

  const handleValueCommit = () => {
    // Prevent Radix UI's default click/drag behavior - do nothing
    // The hover handler will manage the value
  };

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={isControlled ? value : internalValue}
      min={min}
      max={max}
      step={step}
      orientation={orientation}
      onValueChange={handleValueChange}
      onValueCommit={handleValueCommit}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:flex-col",
        className
      )}
      {...props}
      style={{ ...( props.style as React.CSSProperties ), pointerEvents: "none" }}
    >
      <SliderPrimitive.Track
        ref={trackRef}
        data-slot="slider-track"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "bg-muted relative grow overflow-hidden data-[orientation=horizontal]:h-1.5" +
          " data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-full cursor-pointer"
        )}
        style={{ pointerEvents: "auto" }}
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
          className="border-primary ring-ring/50 block data-[orientation=horizontal]:w-4 data-[orientation=vertical]:w-full data-[orientation=vertical]:h-6 shrink-0 border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 pointer-events-none"
        />
      ) )}
    </SliderPrimitive.Root>
  );
}

export { SelectionSlider };
