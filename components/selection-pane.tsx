"use client";

import { SelectionSlider } from "@/components";
import { useCallback, useEffect, useState } from "react";

export interface SinglePane {
  title: string;
  id: string;
  value?: number;
  step: number;
  min: number;
  max: number;
}

export interface SelectionPaneProps {
  index: number;
  pane: SinglePane;
  onChange?: (value: number) => void;
}

export function SelectionPane(props: SelectionPaneProps){
  const {index, pane, onChange} = props;
  const {title, value = 0, step, min, max} = pane;

  // Local state for smooth dragging
  const [localValue, setLocalValue] = useState(value);

  // Sync local state when prop value changes (from external updates)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Update local state immediately for smooth dragging
  const handleValueChange = useCallback((newValue: number[]) => {
    if(newValue.length > 0) {
      setLocalValue(newValue[0]);
    }
  }, []);

  // Update parent state when drag ends
  const handleValueCommit = useCallback((newValue: number[]) => {
    if(onChange && newValue.length > 0) {
      onChange(newValue[0]);
    }
  }, [onChange]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-sm font-medium p-4">{title}s</h3>
      <SelectionSlider
        index={index}
        typeId={props.pane.id}
        title={title}
        value={[localValue]}
        min={min}
        max={max}
        step={step}
        onValueChange={handleValueChange}
        onValueCommit={handleValueCommit}
      />
    </div>
  );
}
