import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/animations/useReducedMotion';

type CursorMode = 'default' | 'orbit' | 'inspect' | 'action';

export const CustomCursor: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const modeRef = useRef<CursorMode>('default');

  useEffect(() => {
    if (reducedMotion) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    setEnabled(true);

    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }

      const target = e.target as HTMLElement | null;
      const cursorEl = target?.closest?.('[data-cursor]') as HTMLElement | null;
      const nextMode = (cursorEl?.getAttribute('data-cursor') as CursorMode) ||
        (target?.closest?.('a, button') ? 'action' : 'default');

      if (nextMode !== modeRef.current) {
        modeRef.current = nextMode;
        if (ringRef.current && labelRef.current) {
          ringRef.current.dataset.mode = nextMode;
          labelRef.current.textContent =
            nextMode === 'orbit'
              ? 'ORBIT'
              : nextMode === 'inspect'
              ? 'INSPECT'
              : '';
        }
      }
    };

    const tick = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.16;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.16;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block" aria-hidden="true">
      {/* Crisp center tracking dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 -ml-1 -mt-1 w-2 h-2 rounded-full bg-[#9CCB4B] mix-blend-difference will-change-transform"
      />

      {/* Context-aware trailing reticle */}
      <div
        ref={ringRef}
        data-mode="default"
        className="fixed top-0 left-0 -ml-4 -mt-4 w-8 h-8 rounded-full border border-[#9CCB4B]/60 flex items-center justify-center transition-[width,height,margin,border-color,background-color] duration-200 ease-out will-change-transform data-[mode=action]:w-11 data-[mode=action]:h-11 data-[mode=action]:-ml-[22px] data-[mode=action]:-mt-[22px] data-[mode=action]:border-[#9CCB4B] data-[mode=orbit]:w-14 data-[mode=orbit]:h-14 data-[mode=orbit]:-ml-7 data-[mode=orbit]:-mt-7 data-[mode=orbit]:border-[#9CCB4B] data-[mode=orbit]:bg-[#17191B]/30 data-[mode=inspect]:w-14 data-[mode=inspect]:h-14 data-[mode=inspect]:-ml-7 data-[mode=inspect]:-mt-7 data-[mode=inspect]:border-[#9CCB4B] data-[mode=inspect]:bg-[#9CCB4B]/15"
      >
        <span
          ref={labelRef}
          className="text-[8px] font-mono font-bold tracking-widest text-[#9CCB4B] uppercase"
        />
      </div>
    </div>
  );
};
