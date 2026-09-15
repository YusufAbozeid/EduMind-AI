import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../../store/useStore';

export const DwellClickSimulator: React.FC = () => {
  const { dwellClickEnabled } = useStore();
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);

  const rafRef = useRef<number | null>(null);
  const cooldownRef = useRef<boolean>(false);

  useEffect(() => {
    if (!dwellClickEnabled) {
      setCoords(null);
      setProgress(0);
      setHoveredElement(null);
      return;
    }

    let interval: any = null;
    let targetEl: HTMLElement | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);

      rafRef.current = requestAnimationFrame(() => {
        setCoords({ x: e.clientX, y: e.clientY });

        if (cooldownRef.current) return;

        const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
        const clickable = el?.closest('button:not(:disabled), a, select, [role="button"]:not([aria-disabled="true"])') as HTMLElement;

        // Skip range inputs or self-deactivation toggles if disabled
        if (clickable && clickable.getAttribute('type') === 'range') return;

        if (clickable && clickable !== targetEl) {
          targetEl = clickable;
          setHoveredElement(clickable);
          setProgress(0);

          if (interval) clearInterval(interval);

          let currentProgress = 0;
          interval = setInterval(() => {
            currentProgress += 10;
            setProgress(currentProgress);

            if (currentProgress >= 100) {
              clearInterval(interval);
              cooldownRef.current = true;
              clickable.click();
              setProgress(0);
              setHoveredElement(null);
              targetEl = null;

              // 1-second cooldown after dwell click
              setTimeout(() => {
                cooldownRef.current = false;
              }, 1000);
            }
          }, 120); // 1.2s total dwell time
        } else if (!clickable) {
          targetEl = null;
          setHoveredElement(null);
          setProgress(0);
          if (interval) clearInterval(interval);
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (interval) clearInterval(interval);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [dwellClickEnabled]);

  if (!dwellClickEnabled || !coords || !hoveredElement) return null;

  return (
    <div 
      className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
      style={{ left: coords.x, top: coords.y }}
    >
      {/* Outer Dwell Countdown Ring */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            className="stroke-slate-300 dark:stroke-slate-700 fill-none stroke-[4]"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            className="stroke-amber-500 fill-none stroke-[4] transition-all duration-100 ease-linear"
            strokeDasharray={125.6}
            strokeDashoffset={125.6 - (125.6 * progress) / 100}
          />
        </svg>
        <span className="absolute text-[10px] font-black text-amber-500 font-mono">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};
