import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { UniformItem } from '../types/uniform';
import { BrandCrestSvg } from './BrandLogo';
import { UniformThumbnail } from './UniformThumbnail';

interface CurvedCarouselProps {
  items: UniformItem[];
  equippedItemId: string;
  equippedColorwayIndex: number;
  disabled?: boolean;
  onSelectItem: (item: UniformItem) => void;
}

// Arc slots flanking the unobstructed central athlete: +1 is the foreground active spotlight slot
const ARC_SLOTS = [-3, -2, -1, 1, 2, 3];

export const CurvedCarousel: React.FC<CurvedCarouselProps> = ({
  items,
  equippedItemId,
  equippedColorwayIndex,
  disabled = false,
  onSelectItem,
}) => {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1440,
  );
  const wheelAccumRef = useRef(0);
  const lastStepTimeRef = useRef(0);
  const dragStartXRef = useRef<number | null>(null);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const currentIdx = Math.max(
    0,
    items.findIndex((i) => i.id === equippedItemId),
  );

  const stepAndAutoEquip = (dir: -1 | 1) => {
    if (items.length <= 1) return;
    const nextIdx = (currentIdx + dir + items.length) % items.length;
    onSelectItem(items[nextIdx]);
  };

  // Horizontal trackpad scroll, Shift+Wheel, drag, or Left/Right keys spin the uniform ring & auto-change outfit
  // while leaving normal vertical page scrolling free to explore all 5 sections below!
  useEffect(() => {
    if (disabled || items.length <= 1) return;

    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY > 120) return;
      const targetEl = e.target as HTMLElement | null;
      const onCarouselCard = Boolean(targetEl?.closest('[data-carousel-card="true"]'));
      const isHorizontalIntent = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
      if (!isHorizontalIntent && !onCarouselCard) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 4) return;
      e.preventDefault();

      const now = performance.now();
      wheelAccumRef.current += delta;

      if (Math.abs(wheelAccumRef.current) >= 42 && now - lastStepTimeRef.current > 150) {
        const dir: -1 | 1 = wheelAccumRef.current > 0 ? 1 : -1;
        wheelAccumRef.current = 0;
        lastStepTimeRef.current = now;
        stepAndAutoEquip(dir);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepAndAutoEquip(1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepAndAutoEquip(-1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [disabled, items, currentIdx]);

  if (items.length === 0) return null;

  const isCompact = viewportWidth < 900;
  const isNarrow = viewportWidth < 640;

  // Map items relative to currentIdx so currentIdx always sits at foreground slot +1 (right beside the model)
  const slotsToRender = isNarrow ? [-1, 1] : isCompact ? [-2, -1, 1, 2] : ARC_SLOTS;
  const slotToOffset: Record<number, number> = {
    1: 0,
    2: 1,
    3: 2,
    [-1]: -1,
    [-2]: -2,
    [-3]: -3,
  };

  const visibleCards = slotsToRender
    .map((slot) => {
      if (items.length <= 3 && Math.abs(slot) > 1) return null;
      if (items.length <= 5 && Math.abs(slot) > 2) return null;
      const relOffset = slotToOffset[slot] ?? 0;
      const itemIndex = ((currentIdx + relOffset) % items.length + items.length) % items.length;
      return { slot, item: items[itemIndex], isActiveSlot: slot === 1 };
    })
    .filter(Boolean) as { slot: number; item: UniformItem; isActiveSlot: boolean }[];

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartXRef.current = e.clientX;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (dragStartXRef.current === null) return;
    const dx = e.clientX - dragStartXRef.current;
    dragStartXRef.current = null;
    if (Math.abs(dx) > 42) {
      stepAndAutoEquip(dx < 0 ? 1 : -1);
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
      style={{ perspective: '1450px' }}
    >
      {/* Left / Right subtle studio arc steppers */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => stepAndAutoEquip(-1)}
            aria-label="Previous uniform"
            className="pointer-events-auto absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-white/90 shadow-md flex items-center justify-center text-slate-800 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => stepAndAutoEquip(1)}
            aria-label="Next uniform"
            className="pointer-events-auto absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/70 hover:bg-white border border-white/90 shadow-md flex items-center justify-center text-slate-800 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Curved 3D Arc of Frosted Glass Real Product Cards */}
      <div className="pointer-events-none relative w-full h-full flex items-center justify-center">
        {visibleCards.map(({ slot, item, isActiveSlot }) => {
          const absSlot = Math.abs(slot);
          const sign = slot < 0 ? -1 : 1;

          const baseX = isNarrow
            ? 122
            : isCompact
              ? absSlot === 1
                ? 216
                : 370
              : absSlot === 1
                ? 290
                : absSlot === 2
                  ? 484
                  : 636;

          const translateX = sign * baseX;
          const translateZ = absSlot === 1 ? 26 : absSlot === 2 ? -95 : -220;
          const translateY = absSlot === 1 ? 30 : absSlot === 2 ? 16 : 2;
          const rotateY = sign * (absSlot === 1 ? -14 : absSlot === 2 ? -28 : -42);
          const scale = isNarrow
            ? 0.8
            : absSlot === 1
              ? 1
              : absSlot === 2
                ? 0.82
                : 0.65;
          const opacity = absSlot === 1 ? 1 : absSlot === 2 ? 0.88 : 0.65;
          const zIndex = absSlot === 1 ? 25 : absSlot === 2 ? 18 : 12;

          const activeColorway = isActiveSlot
            ? item.colorways[equippedColorwayIndex] || item.colorways[0]
            : item.colorways[0];

          return (
            <button
              key={`${slot}-${item.id}`}
              type="button"
              data-carousel-card="true"
              onClick={() => onSelectItem(item)}
              style={{
                transform: `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity,
                zIndex,
              }}
              className={`pointer-events-auto group absolute flex flex-col items-center justify-between text-center rounded-2xl p-2.5 transition-all duration-300 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                isNarrow ? 'w-[128px] h-[168px]' : 'w-[164px] h-[204px]'
              } ${
                isActiveSlot
                  ? 'spatial-card-glass-active ring-2 ring-white/80 -translate-y-1'
                  : 'spatial-card-glass hover:bg-white/55 hover:-translate-y-0.5'
              }`}
              aria-pressed={isActiveSlot}
              aria-label={`Equip ${item.name}`}
            >
              {/* Translucent Product Frame letting background athlete bleed gently behind */}
              <div className="relative w-full flex-1 rounded-xl bg-white/45 flex items-center justify-center overflow-hidden">
                <BrandCrestSvg
                  className="pointer-events-none absolute top-1.5 right-1.5 z-10 w-3.5 h-3.5 opacity-60"
                  primaryColor="#0F172A"
                  accentColor="#059669"
                />
                <UniformThumbnail
                  item={item}
                  colorway={activeColorway}
                  className="w-full h-full mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Clean Product Name Only */}
              <div className="w-full pt-2 px-1">
                <p className="text-[12.5px] font-bold text-slate-950 leading-tight truncate">
                  {item.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
