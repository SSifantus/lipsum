"use client";

import { useState, useEffect, useCallback } from "react";
import { SelectionSlider } from "@/components";

export interface SinglePane {
  title: string;
  id: string;
  value?: number;
  step: number;
  min: number;
  max: number;
}

export interface SelectionPaneProps {
  pane: SinglePane;
  onChange?: ( value: number ) => void;
}

export function SelectionPane( props: SelectionPaneProps ) {
  const { title, value = 0, step, min, max } = props.pane;
  const { onChange } = props;

  // Local state for smooth dragging
  const [ localValue, setLocalValue ] = useState( value );

  // Sync local state when prop value changes (from external updates)
  useEffect( () => {
    setLocalValue( value );
  }, [ value ] );

  // Update local state immediately for smooth dragging
  const handleValueChange = useCallback( ( newValue: number[] ) => {
    if ( newValue.length > 0 ) {
      setLocalValue( newValue[ 0 ] );
    }
  }, [] );

  // Update parent state when drag ends
  const handleValueCommit = useCallback( ( newValue: number[] ) => {
    if ( onChange && newValue.length > 0 ) {
      onChange( newValue[ 0 ] );
    }
  }, [ onChange ] );

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-lg font-medium p-4">{title}</h3>
      <div className="text-2xl font-bold mb-4 min-h-[2rem] flex items-center justify-center">
        {localValue}
      </div>
      <SelectionSlider
        orientation="vertical"
        value={[ localValue ]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
      />
    </div>
  );
}
