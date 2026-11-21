import React, { useEffect, useState } from 'react';
import { EquippedKit, UniformCategory } from '../types/uniform';
import { BrandCrestSvg } from './BrandLogo';

interface CenterStudioModelProps {
  kit: EquippedKit;
  activeCategory: UniformCategory;
}

export const CenterStudioModel: React.FC<CenterStudioModelProps> = ({
  kit,
  activeCategory,
}) => {
  const [imgError, setImgError] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const activeSlot = (() => {
    if (activeCategory === 'bags' || kit.showBagOnStage) {
      return kit.bag;
    }
    if (activeCategory === 'footwear') {
      return kit.footwear;
    }
    if (kit.activeTopLayer === 'streetwear') {
      return kit.streetwear;
    }
    if (kit.activeTopLayer === 'tracksuit') {
      return kit.tracksuit;
    }
    return kit.top;
  })();

  const activeModelUrl = activeSlot.item.modelImageUrl;

  useEffect(() => {
    setImgError(false);
  }, [activeModelUrl]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      const ny = (e.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
      setParallax({ x: nx, y: ny });
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  const isFootwearFocus = activeCategory === 'footwear';

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-none pt-20 pb-20"
      aria-label="Gemini Sports live fitting studio athlete"
    >
      {/* Sleek Translucent Portrait Pedestal keeping background athlete clearly visible */}
      <div
        className="relative z-10 w-[196px] sm:w-[224px] md:w-[244px] h-[min(50vh,396px)] rounded-[24px] p-1.5 bg-white/32 backdrop-blur-md border border-white/55 shadow-[0_24px_56px_-14px_rgba(6,10,18,0.58)] transition-transform duration-500 ease-out"
        style={{
          transform: `translate3d(${parallax.x * -5}px, ${isFootwearFocus ? -4 : 8}px, 0) scale(${
            isFootwearFocus ? 1.03 : 1
          })`,
        }}
      >
        <div className="relative w-full h-full rounded-[18px] overflow-hidden bg-white/48">
          {!imgError ? (
            <img
              key={activeModelUrl}
              src={activeModelUrl}
              alt={`${activeSlot.item.name} worn by Gemini Sports Studio Athlete`}
              referrerPolicy="no-referrer"
              draggable={false}
              onError={() => setImgError(true)}
              className={`w-full h-full object-cover mix-blend-multiply ${
                isFootwearFocus ? 'object-bottom' : 'object-top'
              } select-none animate-[fadeIn_280ms_ease-out]`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-slate-600">
              Studio model preview
            </div>
          )}

          <BrandCrestSvg
            className="pointer-events-none absolute bottom-3 right-3 w-6 h-6 opacity-60"
            primaryColor="#0F172A"
            accentColor="#059669"
          />
        </div>
      </div>
    </div>
  );
};
