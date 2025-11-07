"use client";

import { useState } from "react";
import { SelectionPane } from "./selection-pane";


const panes = [
  {
    title: "Character",
    id: "characters",
    step: 1,
    min: 0,
    max: 5000,
  },
  {
    title: "Word",
    id: "words",
    step: 1,
    min: 0,
    max: 1000,
  },
  {
    title: "Sentence",
    id: "sentences",
    step: 1,
    min: 0,
    max: 250,
  },
  {
    title: "Paragraph",
    id: "paragraphs",
    step: 1,
    min: 0,
    max: 100,
  },
];

export function SelectionSurface() {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    panes.forEach((pane) => {
      initial[pane.id] = pane.min;
    });
    return initial;
  });

  const handleChange = (id: string, newValue: number) => {
    setValues((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  return (
    <div className="w-full h-full grid grid-cols-4 grid-rows-1 pb-20">
      {panes.map((pane, index) => (
        <SelectionPane
          index={index}
          key={pane.id}
          pane={{...pane, value: values[pane.id]}}
          onChange={(value) => handleChange(pane.id, value)}
        />
      ))}
    </div>
  );
}
