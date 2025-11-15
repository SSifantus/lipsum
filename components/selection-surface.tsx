"use client";

import { useEffect, useState } from "react";
import { Title } from "@/components/title";
import { isDesktopDevice } from "@/lib/utils";
import { SelectionPane } from "./selection-pane";


const panes = [
  {
    title:"Character",
    id:"characters",
    step:1,
    min:0,
    max:5000,
  },
  {
    title:"Word",
    id:"words",
    step:1,
    min:0,
    max:1000,
  },
  {
    title:"Sentence",
    id:"sentences",
    step:1,
    min:0,
    max:250,
  },
  {
    title:"Paragraph",
    id:"paragraphs",
    step:1,
    min:0,
    max:100,
  },
];

export function SelectionSurface(){

  const [isDesktop, setIsDesktop] = useState<boolean>(true);

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
      [id]:newValue,
    }));
  };

  // TODO: Fix
  useEffect(() => {
    if(typeof window !== "undefined" && navigator.userAgent) {
      setIsDesktop(isDesktopDevice(navigator.userAgent));
    }
  }, []);

  return (
    <div className={`w-full h-full ${isDesktop ? "grid grid-cols-4 grid-rows-1" : "flex flex-col"}`}>
      {panes.map((pane, index) => (
        <SelectionPane
          index={index}
          isDesktop={isDesktop}
          key={pane.id}
          pane={{...pane, value:values[pane.id]}}
          onChange={(value) => handleChange(pane.id, value)}
        />
      ))}
      <div className="flex w-full items-center justify-between h-18 px-5 pb-0.5">
        <Title className="min-w-fit whitespace-nowrap"/>
      </div>
    </div>
  );
}
