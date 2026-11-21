import React, { useEffect, useState } from 'react';

export interface BrandedBgStage {
  id: string;
  label: string;
  caption: string;
  subjectSide: 'left' | 'right';
  imageUrl: string;
  objectPosition: string;
  alt: string;
}

export const BRANDED_BG_STAGES: BrandedBgStage[] = [
  {
    id: 'street-hoodie',
    label: 'Streetwear Hoodie',
    caption: 'GS Apex Boxy Street Hoodie',
    subjectSide: 'right',
    imageUrl: '/src/assets/images/bg_seamless_hoodie_right_1795261068891.jpg',
    objectPosition: '75% 20%',
    alt: 'Model standing on rooftop at golden hour wearing Gemini Sports washed carbon streetwear hoodie',
  },
  {
    id: 'street-varsity',
    label: 'Varsity Jacket',
    caption: 'GS Heritage Varsity Jacket',
    subjectSide: 'left',
    imageUrl: '/src/assets/images/bg_seamless_varsity_left_1795261070565.jpg',
    objectPosition: '24% 18%',
    alt: 'Model standing inside concrete arena tunnel wearing Gemini Sports leather-sleeve varsity jacket',
  },
  {
    id: 'football-pitch',
    label: 'Football Kit',
    caption: 'GS Pro Match Jersey & Cleats',
    subjectSide: 'right',
    imageUrl: '/src/assets/images/bg_seamless_football_right_1795261073963.jpg',
    objectPosition: '76% 24%',
    alt: 'Football striker dribbling under stadium floodlights in cobalt and neon Gemini Sports kit and cleats',
  },
  {
    id: 'basketball-court',
    label: 'Basketball Kit',
    caption: 'GS Swingman & High-Tops',
    subjectSide: 'left',
    imageUrl: '/src/assets/images/bg_seamless_basketball_left_1795261074050.jpg',
    objectPosition: '24% 22%',
    alt: 'Basketball player driving down hardwood court wearing crimson Gemini Sports jersey and GS high-tops',
  },
  {
    id: 'cricket-stadium',
    label: 'Cricket & Atelier',
    caption: 'GS Honeycomb T20 Kit',
    subjectSide: 'right',
    imageUrl: '/src/assets/images/bg_seamless_cricket_right_1795261073631.jpg',
    objectPosition: '78% 18%',
    alt: 'Cricketer walking onto floodlit stadium pitch wearing emerald and gold Gemini Sports polo',
  },
  {
    id: 'squad-tracksuit',
    label: 'Tracksuits & Bags',
    caption: 'GS Drill Suits & Holdall',
    subjectSide: 'left',
    imageUrl: '/src/assets/images/bg_seamless_squad_left_1795261090454.jpg',
    objectPosition: '26% 18%',
    alt: 'Two athletes standing in stadium tunnel wearing Gemini Sports drill tracksuits carrying GS leather duffel',
  },
];

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

export const GlobalMatchBackdrop: React.FC = () => {
  const [activeStageIdx, setActiveStageIdx] = useState(0);
  const [visibility, setVisibility] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [liveTime, setLiveTime] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onMqChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onMqChange);

    let scrollRaf = 0;
    let ambientRaf = 0;

    const updateFromDOM = () => {
      scrollRaf = 0;
      const winH = window.innerHeight || 900;
      const scrollY = window.scrollY;
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight,
      );

      // Reveal full-screen backdrop smoothly once user scrolls past Hero studio
      const vis = smoothstep(Math.min(winH * 0.25, 180), Math.min(winH * 0.65, 520), scrollY);
      const totalP = clamp(scrollY / Math.max(1, docHeight - winH), 0, 1);

      setVisibility((prev) => (Math.abs(prev - vis) > 0.01 ? Number(vis.toFixed(3)) : prev));
      setScrollProgress((prev) =>
        Math.abs(prev - totalP) > 0.002 ? Number(totalP.toFixed(4)) : prev,
      );

      // Lock active background directly to the DOM block closest to viewport focus line (48% height)
      const stageEls = document.querySelectorAll<HTMLElement>('[data-bg-stage]');
      if (stageEls.length > 0) {
        const focusY = winH * 0.48;
        let bestIdx = 0;
        let bestDist = Number.POSITIVE_INFINITY;

        stageEls.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const centerY = rect.top + rect.height * 0.5;
          const dist = Math.abs(centerY - focusY);
          const idxAttr = Number(el.dataset.bgStage);
          if (!Number.isNaN(idxAttr) && dist < bestDist) {
            bestDist = dist;
            bestIdx = clamp(idxAttr, 0, BRANDED_BG_STAGES.length - 1);
          }
        });

        setActiveStageIdx((prev) => (prev !== bestIdx ? bestIdx : prev));
      }
    };

    const handleScroll = () => {
      if (scrollRaf) return;
      scrollRaf = window.requestAnimationFrame(updateFromDOM);
    };

    let lastAmbientTick = 0;
    const tickAmbient = (now: number) => {
      if (!mq.matches && now - lastAmbientTick > 40) {
        lastAmbientTick = now;
        setLiveTime(now * 0.00042);
      }
      ambientRaf = window.requestAnimationFrame(tickAmbient);
    };

    updateFromDOM();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    ambientRaf = window.requestAnimationFrame(tickAmbient);

    return () => {
      if (scrollRaf) window.cancelAnimationFrame(scrollRaf);
      if (ambientRaf) window.cancelAnimationFrame(ambientRaf);
      mq.removeEventListener('change', onMqChange);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const activeStage = BRANDED_BG_STAGES[activeStageIdx] || BRANDED_BG_STAGES[0];
  const isSubjectRight = activeStage.subjectSide === 'right';

  const jumpToStage = (idx: number) => {
    const target = document.querySelector<HTMLElement>(`[data-bg-stage="${idx}"]`);
    if (target) {
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'center' });
    }
  };

  return (
    <>
      {/* FIXED FULL-VIEWPORT CLEAR BRANDED ATHLETE BACKDROP */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#060912] transition-opacity duration-300"
        style={{ opacity: visibility }}
      >
        {BRANDED_BG_STAGES.map((stage, idx) => {
          const isActive = idx === activeStageIdx;

          // Subtle live cinema camera float (minimal X translation so rule-of-thirds subject stays clear!)
          const driftX = reducedMotion ? 0 : Math.sin(liveTime + idx * 1.2) * 0.9;
          const driftY = reducedMotion ? 0 : Math.cos(liveTime * 0.8 + idx) * 0.8;
          const driftScale = reducedMotion ? 1.02 : 1.03 + (Math.sin(liveTime * 0.65) + 1) * 0.012;

          return (
            <div
              key={stage.id}
              className="absolute inset-0 transition-opacity duration-700 ease-out will-change-[opacity,transform]"
              style={{
                opacity: isActive ? 1 : 0,
                zIndex: isActive ? 2 : 1,
                transform: `translate3d(${driftX}%, ${driftY}%, 0) scale(${driftScale})`,
              }}
            >
              <img
                src={stage.imageUrl}
                alt={stage.alt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                style={{ objectPosition: stage.objectPosition }}
              />
            </div>
          );
        })}

        {/* Directional Contrast Gradient: Shades ONLY behind the active card side so opposite athlete is 100% crystal clear */}
        <div
          className="absolute inset-0 z-10 transition-all duration-700"
          style={{
            background: isSubjectRight
              ? 'linear-gradient(90deg, rgba(6, 9, 18, 0.78) 0%, rgba(6, 9, 18, 0.42) 45%, rgba(6, 9, 18, 0.02) 78%, rgba(6, 9, 18, 0.06) 100%)'
              : 'linear-gradient(270deg, rgba(6, 9, 18, 0.78) 0%, rgba(6, 9, 18, 0.42) 45%, rgba(6, 9, 18, 0.02) 78%, rgba(6, 9, 18, 0.06) 100%)',
          }}
        />
      </div>

      {/* SLEEK BOTTOM-CENTER FLOATING LOOKBOOK STAGE NAVIGATOR */}
      {visibility > 0.65 && (
        <aside
          aria-label="Gemini Sports backdrop reel switcher"
          className="hidden lg:flex fixed bottom-4 right-5 z-30 items-center gap-2 rounded-2xl bg-[#080C15]/82 border border-white/15 px-3.5 py-2 shadow-2xl"
        >
          <span className="text-[11px] font-mono-tabular text-emerald-300 pr-2 border-r border-white/12 whitespace-nowrap">
            {activeStage.caption} · {Math.round(scrollProgress * 100)}%
          </span>
          <div className="flex items-center gap-1.5">
            {BRANDED_BG_STAGES.map((stage, idx) => {
              const isActive = idx === activeStageIdx;
              return (
                <button
                  key={stage.id}
                  type="button"
                  title={stage.label}
                  aria-label={`Jump to ${stage.label}`}
                  onClick={() => jumpToStage(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    isActive
                      ? 'w-6 bg-emerald-400'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              );
            })}
          </div>
        </aside>
      )}
    </>
  );
};
