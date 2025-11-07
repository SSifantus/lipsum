"use client";

import { cn } from "@/lib/utils";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { ComponentProps, useMemo, useState, useEffect, useRef, useCallback } from "react";

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
  const [ isAnimating, setIsAnimating ] = useState( false );
  const trackRef = useRef<HTMLDivElement>( null );
  const snapBackTimeoutRef = useRef<NodeJS.Timeout | null>( null );
  const isHoveringRef = useRef<boolean>( false );
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>( null );
  const isVertical = orientation === "vertical";

  // Sync internal value when defaultValue changes - use callback to avoid lint error
  const syncDefaultValue = useCallback( () => {
    if ( !isControlled ) {
      setInternalValue( defaultValues );
    }
  }, [ defaultValues, isControlled ] );

  useEffect( () => {
    syncDefaultValue();
  }, [ syncDefaultValue ] );

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

  const snapBackToDefault = () => {
    // Snap back to defaultValue (only for uncontrolled)
    if ( !isControlled ) {
      setInternalValue( defaultValues );
    }
    onValueCommit?.( defaultValues );
  };

  const clearSnapBackTimeout = () => {
    if ( snapBackTimeoutRef.current ) {
      clearTimeout( snapBackTimeoutRef.current );
      snapBackTimeoutRef.current = null;
    }
  };

  const scheduleSnapBack = () => {
    clearSnapBackTimeout();
    // Add a delay before snapping back to defaultValue
    snapBackTimeoutRef.current = setTimeout( () => {
      snapBackToDefault();
      snapBackTimeoutRef.current = null;
    }, 50 ); // 500ms delay to prevent premature snap-back
  };

  const handleMouseMove = ( event: React.MouseEvent<HTMLDivElement> ) => {
    // Clear any pending snap back timeout
    clearSnapBackTimeout();

    const newValue = calculateValueFromPosition( event.clientX, event.clientY );
    const newValueArray = [ newValue ];

    if ( !isControlled ) {
      // If we're animating on initial entry, use smooth transition
      if ( isAnimating ) {
        setInternalValue( newValueArray );
      } else {
        // Normal hover behavior - immediate update
        setInternalValue( newValueArray );
      }
    }
    onValueChange?.( newValueArray );
  };

  const handleMouseEnter = ( event: React.MouseEvent<HTMLDivElement> ) => {
    // Clear any pending snap back timeout when mouse re-enters
    clearSnapBackTimeout();

    // Clear any existing animation timeout
    if ( animationTimeoutRef.current ) {
      clearTimeout( animationTimeoutRef.current );
      animationTimeoutRef.current = null;
    }

    // Check if this is initial entry (mouse was not hovering before)
    if ( !isHoveringRef.current ) {
      // Calculate target value from entry position
      const targetValue = calculateValueFromPosition( event.clientX, event.clientY );
      const targetValueArray = [ targetValue ];

      // Enable animation for smooth transition
      setIsAnimating( true );

      // Use requestAnimationFrame to ensure smooth animation start
      requestAnimationFrame( () => {
        // Set the target value
        if ( !isControlled ) {
          setInternalValue( targetValueArray );
        }
        onValueChange?.( targetValueArray );

        // Disable animation after transition completes
        animationTimeoutRef.current = setTimeout( () => {
          setIsAnimating( false );
          animationTimeoutRef.current = null;
        }, 300 ); // Match animation duration
      } );
    }

    isHoveringRef.current = true;
  };

  const handleMouseLeave = () => {
    isHoveringRef.current = false;
    setIsAnimating( false );

    // Clear animation timeout
    if ( animationTimeoutRef.current ) {
      clearTimeout( animationTimeoutRef.current );
      animationTimeoutRef.current = null;
    }

    // Schedule snap back with delay
    scheduleSnapBack();
  };

  const handleThumbClick = ( event: React.MouseEvent<HTMLSpanElement> ) => {
    event.stopPropagation();
    event.preventDefault();

    // Clear any pending snap back timeout
    clearSnapBackTimeout();

    // Trigger onClick callback if provided
    if ( props.onClick ) {
      ( props.onClick as ( event: React.MouseEvent<HTMLSpanElement> ) => void )( event );
    }

    // Immediately snap back to defaultValue
    snapBackToDefault();
  };

  // Cleanup timeouts on unmount
  useEffect( () => {
    return () => {
      clearSnapBackTimeout();
      if ( animationTimeoutRef.current ) {
        clearTimeout( animationTimeoutRef.current );
      }
    };
  }, [] );

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
      data-animating={isAnimating}
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={( e ) => e.preventDefault()}
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
          onClick={handleThumbClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="border-primary ring-ring/50 block data-[orientation=horizontal]:w-4 data-[orientation=vertical]:w-full data-[orientation=vertical]:h-6 shrink-0 border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          style={{ pointerEvents: "auto" }}
        />
      ) )}
    </SliderPrimitive.Root>
  );
}

export { SelectionSlider };
