import React, { useEffect, useState } from 'react';
import { Colorway, UniformItem } from '../types/uniform';

interface HeroActiveBackdropProps {
  activeItem: UniformItem;
  colorway?: Colorway;
}

export const HeroActiveBackdrop: React.FC<HeroActiveBackdropProps> = ({
  activeItem,
  colorway,
}) => {
  const [liveTime, setLiveTime] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);

    let rafId = 0;
    let lastTick = 0;
    const tick = (now: number) => {
      if (!mq.matches && now - lastTick > 42) {
        lastTick = now;
        setLiveTime(now * 0.0004);
      }
      rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      mq.removeEventListener('change', onChange);
    };
  }, []);

  const driftX = reducedMotion ? 0 : Math.sin(liveTime) * 1.1;
  const driftY = reducedMotion ? 0 : Math.cos(liveTime * 0.8) * 0.8;
  const scale = reducedMotion ? 1.02 : 1.04 + (Math.sin(liveTime * 0.65) + 1) * 0.014;

  // Subtle accent hue tint when colorway swatch is switched (subtle enough to keep stadium lights natural)
  const accentGlow = colorway?.primary || '#10B981';

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#080C15]"
    >
      {/* Active Sport / Streetwear Live Scene matching the currently selected product */}
      <div
        key={activeItem.actionBackdropUrl}
        className="absolute inset-0 will-change-transform animate-[fadeIn_450ms_ease-out]"
        style={{
          transform: `translate3d(${driftX}%, ${driftY}%, 0) scale(${scale})`,
        }}
      >
        <img
          src={activeItem.actionBackdropUrl}
          alt={`${activeItem.name} live sport backdrop`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          style={{
            objectPosition: activeItem.actionBackdropPosition || '50% 25%',
          }}
        />
      </div>

      {/* Light Balanced Overlay: keeps background athlete & garment bright and crystal visible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(7, 11, 20, 0.24) 0%, rgba(7, 11, 20, 0.04) 40%, rgba(7, 11, 20, 0.12) 72%, rgba(7, 11, 20, 0.52) 100%)',
        }}
      />

      {/* Very Subtle Rim Glow */}
      <div
        className="absolute inset-0 opacity-10 transition-colors duration-500"
        style={{
          background: `radial-gradient(ellipse 65% 55% at 50% 48%, ${accentGlow} 0%, transparent 72%)`,
        }}
      />
    </div>
  );
};
