import React, { useCallback, useEffect, useRef, useState } from "react";

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });


  const handleMouseMove = useCallback(
    (e) =>
      setMousePosition({
        x: e.pageX,
        y: e.pageY,
      }),
    []
  );

  const ref = useRef<HTMLDivElement>(null);

  const callbackRef = useCallback(
    (node) => {
      if (ref.current) {
        ref.current.removeEventListener("mousemove", handleMouseMove);
      }

      ref.current = node;

      if (ref.current) {
        ref.current.addEventListener("mousemove", handleMouseMove);
      }
    },
    [handleMouseMove]
  );

  return [callbackRef, mousePosition];
};
