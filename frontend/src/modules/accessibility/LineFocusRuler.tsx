import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';

export const LineFocusRuler: React.FC = () => {
  const { lineFocusEnabled } = useStore();
  const [mouseY, setMouseY] = useState<number>(200);

  useEffect(() => {
    if (!lineFocusEnabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMouseY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [lineFocusEnabled]);

  if (!lineFocusEnabled) return null;

  const rulerHeight = 60; // 60px focus window

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Top Dimmed Overlay */}
      <div 
        className="absolute top-0 left-0 right-0 bg-black/60 transition-all duration-75"
        style={{ height: `${Math.max(0, mouseY - rulerHeight / 2)}px` }}
      />

      {/* Focused Active Reading Line */}
      <div 
        className="absolute left-0 right-0 border-y-2 border-sky-400/80 bg-sky-400/10 transition-all duration-75 shadow-[0_0_15px_rgba(56,189,248,0.2)]"
        style={{ 
          top: `${Math.max(0, mouseY - rulerHeight / 2)}px`,
          height: `${rulerHeight}px` 
        }}
      />

      {/* Bottom Dimmed Overlay */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-black/60 transition-all duration-75"
        style={{ top: `${mouseY + rulerHeight / 2}px` }}
      />
    </div>
  );
};
