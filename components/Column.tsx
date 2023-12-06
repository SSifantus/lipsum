"use client";

import React, { useEffect, useRef } from "react";
import { useMousePosition } from "hooks/useMousePosition";

export const ColumnTypes = {
  characters: "characters",
  words: "words",
  sentences: "sentences",
  paragraphs: "paragraphs",
} as const;

export type ColumnType = (typeof ColumnTypes)[keyof typeof ColumnTypes];

export type ColumnProps = {
  type: ColumnType;
}

export default function Column({ type }: ColumnProps) {
  const columnRef = useRef<HTMLDivElement>(null);
  const [ref, mousePosition] = useMousePosition();


  useEffect(() => {

    console.log('Mouse position:', mousePosition);
    console.log('columnRef:', ref?.id);
  }, [mousePosition]);


  return (
    <div ref={ref} id={type} className={`column type-${type}`}>
      <div className="drawer">
        <div className="handle">
          {type}
        </div>
      </div>
    </div>
  );
}
