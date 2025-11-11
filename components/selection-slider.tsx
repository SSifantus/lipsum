"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { extractAndCopyText } from "@/lib/utils/text-parser";
import { useSourceStore } from "@/stores/source";
import { useCallback, useEffect, useMemo, useState } from "react";

export interface SelectionSliderProps {
  className?: string;
  title?: string;
  value?: number[];
  index: number;
  min: number;
  max: number;
  step: number;
  typeId: string; // "characters" | "words" | "sentences" | "paragraphs"
  onValueChange?: ( value: number[] ) => void;
  onValueCommit?: ( value: number[] ) => void;
}

// Convert slider position into values depending on how high the number is (curved calculation)
function pixelConversion( n: number ): number {
  if ( n < 1 ) return 1;

  if ( n >= 1 && n <= 100 ) {
    return n;
  } else if ( n > 100 && n <= 300 ) {
    return 100 + 5 * ( n - 100 );
  } else if ( n > 300 && n <= 500 ) {
    return 100 + 5 * ( 300 - 100 ) + 10 * ( n - 300 );
  } else if ( n > 500 && n <= 1000 ) {
    return 100 + 5 * ( 300 - 100 ) + 10 * ( 500 - 300 ) + 50 * ( n - 500 );
  } else if ( n > 1000 && n <= 2000 ) {
    return 100 + 5 * ( 300 - 100 ) + 10 * ( 500 - 300 ) + 50 * ( 1000 - 500 ) + 100 * ( n - 1000 );
  } else if ( n > 2000 ) {
    return 100 + 5 * ( 300 - 100 ) + 10 * ( 500 - 300 ) + 50 * ( 1000 - 500 ) + 100 * ( 2000 - 1000 ) + 500 * ( n - 2000 );
  }

  return n;
}

function SelectionSlider( props: SelectionSliderProps ) {
  const { className, index, value = [ 0 ], min = 0, max = 100, title, typeId, onValueChange, onValueCommit } = props;
  const [ sliderValue, setSliderValue ] = useState<number[]>( [ 0 ] );
  const [ modalOpen, setModalOpen ] = useState<boolean>( false );
  const [ committedValue, setCommittedValue ] = useState<number | null>( null );
  const [ extractedText, setExtractedText ] = useState<string>( "" );
  const source = useSourceStore( ( state ) => state.source );

  // Calculate what the maximum slider value should be to reach the max after pixelConversion
  // Uses binary search to find the inverse of pixelConversion
  const calculateMaxSliderValue = useCallback( ( targetMax: number ): number => {
    // Binary search to find sliderValue such that pixelConversion(sliderValue) >= targetMax
    let low = 1;
    let high = 10000;
    let result = 1;

    while ( low <= high ) {
      const mid = Math.floor( ( low + high ) / 2 );
      const converted = pixelConversion( mid );

      if ( converted >= targetMax ) {
        result = mid;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    return result;
  }, [] );

  // Calculate the max slider value based on the prop max
  const maxSliderValue = useMemo( () => calculateMaxSliderValue( max ), [ max, calculateMaxSliderValue ] );

  // Convert slider value to actual curved value
  const convertedValue = useMemo( () => {
    const sliderPos = sliderValue[ 0 ] || 0;
    if ( sliderPos < 1 ) return min;

    const converted = pixelConversion( sliderPos );

    // Clamp to max based on type
    let finalValue = converted;
    if ( typeId === "characters" && finalValue > 5000 ) {
      finalValue = 5000;
    } else if ( typeId === "words" && finalValue > 2500 ) {
      finalValue = 2500;
    } else if ( typeId === "sentences" && finalValue > 666 ) {
      finalValue = 666;
    } else if ( typeId === "paragraphs" && finalValue > 333 ) {
      finalValue = 333;
    }

    // Also clamp to the prop max
    if ( finalValue > max ) {
      finalValue = max;
    }

    return finalValue;
  }, [ sliderValue, typeId, max, min ] );

  // Convert actual value back to slider position (for initial value)
  const valueToSliderPosition = useCallback( ( targetValue: number ): number => {
    if ( targetValue <= min ) return 0;

    // Binary search to find slider position that gives us targetValue
    let low = 1;
    let high = maxSliderValue;
    let result = 1;

    while ( low <= high ) {
      const mid = Math.floor( ( low + high ) / 2 );
      const converted = pixelConversion( mid );

      if ( converted >= targetValue ) {
        result = mid;
        high = mid - 1;
      } else {
        low = mid + 1;
      }
    }

    return result;
  }, [ min, maxSliderValue ] );

  // Initialize slider value from prop value
  useEffect( () => {
    const propValue = value.length > 0 ? value[ 0 ] : min;
    const sliderPos = valueToSliderPosition( propValue );
    setSliderValue( [ sliderPos ] );
  }, [ value, min, valueToSliderPosition, maxSliderValue ] );

  const handleSliderChange = useCallback( ( newValue: number[] ) => {
    setSliderValue( newValue );
    if ( onValueChange ) {
      // Calculate converted value directly from newValue
      const sliderPos = newValue[ 0 ] || 0;
      if ( sliderPos < 1 ) {
        onValueChange( [ min ] );
        return;
      }

      let converted = pixelConversion( sliderPos );

      // Clamp to max based on type
      if ( typeId === "characters" && converted > 5000 ) {
        converted = 5000;
      } else if ( typeId === "words" && converted > 2500 ) {
        converted = 2500;
      } else if ( typeId === "sentences" && converted > 666 ) {
        converted = 666;
      } else if ( typeId === "paragraphs" && converted > 333 ) {
        converted = 333;
      }

      // Also clamp to the prop max
      if ( converted > max ) {
        converted = max;
      }

      onValueChange( [ converted ] );
    }
  }, [ onValueChange, typeId, max, min ] );

  const handleSliderCommit = useCallback( async ( newValue: number[] ) => {
    setSliderValue( newValue );

    // Calculate converted value directly from newValue
    const sliderPos = newValue[ 0 ] || 0;
    if ( sliderPos < 1 ) {
      // Reset to min after commit
      setSliderValue( [ 0 ] );
      if ( onValueCommit ) {
        onValueCommit( [ min ] );
      }
      if ( onValueChange ) {
        onValueChange( [ min ] );
      }
      return;
    }

    let converted = pixelConversion( sliderPos );

    // Clamp to max based on type
    if ( typeId === "characters" && converted > 5000 ) {
      converted = 5000;
    } else if ( typeId === "words" && converted > 2500 ) {
      converted = 2500;
    } else if ( typeId === "sentences" && converted > 666 ) {
      converted = 666;
    } else if ( typeId === "paragraphs" && converted > 333 ) {
      converted = 333;
    }

    // Also clamp to the prop max
    if ( converted > max ) {
      converted = max;
    }

    if ( converted > min && source?.id ) {
      try {
        const text = await extractAndCopyText(
          source.id,
          typeId as "characters" | "words" | "sentences" | "paragraphs",
          converted
        );
        setExtractedText( text );
        setCommittedValue( converted );
        setModalOpen( true );
        if ( onValueCommit ) {
          onValueCommit( [ converted ] );
        }
      } catch ( error ) {
        console.error( "Failed to extract text:", error );
      }
    }

    // Reset to min after commit
    setSliderValue( [ 0 ] );
    if ( onValueCommit ) {
      onValueCommit( [ min ] );
    }
    if ( onValueChange ) {
      onValueChange( [ min ] );
    }
  }, [ source, typeId, onValueCommit, onValueChange, min, max ] );

  const valueDisplay = convertedValue;
  const titleDisplay = valueDisplay === 1 ? title : `${title}s`;

  const dialogValue = committedValue;
  const dialogTitleDisplay = dialogValue === 1 ? title : `${title}s`;

  return (
    <>
      <div className={cn( "flex flex-row items-center gap-4 w-full py-4 px-2", className )}>
        <div className="flex-shrink-0 min-w-[80px] text-center">
          <div className="text-sm font-medium text-foreground">
            {valueDisplay} {titleDisplay}
          </div>
        </div>
        <div className="flex-1 relative">
          <Slider
            value={sliderValue}
            min={0}
            max={maxSliderValue}
            step={1}
            onValueChange={handleSliderChange}
            onValueCommit={handleSliderCommit}
            className={cn(
              "w-full",
              {
                "[&_[data-slot=slider-track]]:bg-gradient-to-r": true,
                "[&_[data-slot=slider-track]]:[background:var(--slider-gradient-0)]": index === 0,
                "[&_[data-slot=slider-track]]:[background:var(--slider-gradient-1)]": index === 1,
                "[&_[data-slot=slider-track]]:[background:var(--slider-gradient-2)]": index === 2,
                "[&_[data-slot=slider-track]]:[background:var(--slider-gradient-3)]": index === 3,
              }
            )}
          />
        </div>
      </div>
      <Dialog open={modalOpen} onOpenChange={( open ) => {
        setModalOpen( open );
        if ( !open ) {
          setCommittedValue( null );
          setExtractedText( "" );
        }
      }}>
        <DialogContent className="w-115 max-w-[99vw] max-h-[60vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>{dialogTitleDisplay} Copied!</DialogTitle>
            <DialogDescription>
              {dialogValue} {dialogTitleDisplay} copied to clipboard
            </DialogDescription>
          </DialogHeader>
          {extractedText ? (
            <div className="p-4 bg-muted rounded-md max-h-[47vh] overflow-y-auto">
              <p className="text-sm whitespace-pre-wrap break-words">{extractedText}</p>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}

export { SelectionSlider };
