import React, { useCallback, useEffect, useState } from "react";

export const useMousePosition = (ref: React.RefObject<HTMLElement | null>) => {
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });

  useEffect(() => {

      const updateMousePosition = (ev: MouseEvent) => {
        const bounds = ref.current.getBoundingClientRect();
        const x = ev.clientX - bounds.left;
        const y = ev.clientY - bounds.top;
        setMousePosition({x, y});
      };

      window.addEventListener('mousemove', updateMousePosition);

      return () => {
        window.removeEventListener('mousemove', updateMousePosition);
      };
  }, []);


  return mousePosition;
};
