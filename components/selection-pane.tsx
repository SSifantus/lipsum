"use client";

import { SelectionColumn } from "@/components";
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

  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleValueChange = useCallback((newValue: number[]) => {
    if(newValue.length > 0) {
      setLocalValue(newValue[0]);
    }
  }, []);

  const handleValueCommit = useCallback((newValue: number[]) => {
    if(onChange && newValue.length > 0) {
      onChange(newValue[0]);
    }
  }, [onChange]);

  return (
    <div className="flex flex-col items-center justify-center">
      <h3 className="text-sm font-bold p-4 w-full">{title}s</h3>
      <SelectionColumn
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
