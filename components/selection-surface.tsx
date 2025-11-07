"use client";

import { useState } from "react";
import { SelectionPane } from "./selection-pane";


const panes = [
  {
    title: "Characters",
    id: "characters",
    step: 1,
    min: 0,
    max: 5000,
  },
  {
    title: "Words",
    id: "words",
    step: 1,
    min: 0,
    max: 2500,
  },
  {
    title: "Sentences",
    id: "sentences",
    step: 1,
    min: 0,
    max: 666,
  },
  {
    title: "Paragraphs",
    id: "paragraphs",
    step: 1,
    min: 0,
    max: 333,
  },
];

export function SelectionSurface() {
  const [ values, setValues ] = useState<Record<string, number>>( () => {
    const initial: Record<string, number> = {};
    panes.forEach( ( pane ) => {
      initial[ pane.id ] = pane.min;
    } );
    return initial;
  } );

  const handleChange = ( id: string, newValue: number ) => {
    setValues( ( prev ) => ( {
      ...prev,
      [ id ]: newValue,
    } ) );
  };

  return (
    <div className="w-full h-full grid grid-cols-4 grid-rows-1 pb-20">
      {panes.map( ( pane ) => (
        <SelectionPane
          key={pane.id}
          pane={{ ...pane, value: values[ pane.id ] }}
          onChange={( value ) => handleChange( pane.id, value )}
        />
      ) )}
    </div>
  );
}
