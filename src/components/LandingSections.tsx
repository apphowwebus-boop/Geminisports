import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Check, Trophy } from 'lucide-react';
import { SportType, UniformCategory } from '../types/uniform';
import { BrandCrestSvg, BrandLogo } from './BrandLogo';

interface LandingSectionsProps {
  onSelectCategoryForStudio: (category: UniformCategory, sport?: SportType) => void;
  onOpenCatalog: (sport?: SportType) => void;
  onOpenManufacturing: () => void;
  onOpenQuote: () => void;
}

const SPORT_LINE_CARDS: {
  stageIndex: number;
  title: string;
  sport: SportType;
  category: UniformCategory;
  productUrl: string;
  productAlt: string;
  modelUrl: string;
  modelAlt: string;
}[] = [
  {
    stageIndex: 0,
    title: 'GS Apex Streetwear Hoodies',
    sport: 'Streetwear',
    category: 'streetwear',
    productUrl: '/src/assets/images/prod_street_hoodie_1795260369437.jpg',
    productAlt: 'Gemini Sports washed carbon black heavyweight streetwear hoodie',
    modelUrl: '/src/assets/images/same_model_street_hoodie_1795260438472.jpg',
    modelAlt: 'Studio athlete wearing exact Gemini Sports streetwear hoodie',
  },
  {
    stageIndex: 1,
    title: 'GS Heritage Street Varsity',
    sport: 'Streetwear',
    category: 'streetwear',
    productUrl: '/src/assets/images/prod_street_varsity_1795260368929.jpg',
    productAlt: 'Gemini Sports midnight charcoal and off-white varsity bomber jacket',
    modelUrl: '/src/assets/images/same_model_street_varsity_1795260438862.jpg',
    modelAlt: 'Studio athlete wearing exact Gemini Sports varsity jacket',
  },
  {
    stageIndex: 2,
    title: 'GS Football Pro Match Kits',
    sport: 'Football',
    category: 'jerseys',
    productUrl: '/src/assets/images/prod_gs_football_1795260439349.jpg',
    productAlt: 'Gemini Sports cobalt blue and neon lime sublimated football jersey',
    modelUrl: '/src/assets/images/same_model_gs_football_1795260494684.jpg',
    modelAlt: 'Studio athlete wearing exact Gemini Sports cobalt football kit',
  },
  {
    stageIndex: 3,
    title: 'GS Basketball & Court High-Tops',
    sport: 'Basketball',
    category: 'jerseys',
    productUrl: '/src/assets/images/prod_gs_basketball_1795260439855.jpg',
    productAlt: 'Gemini Sports crimson and black sleeveless basketball jersey',
    modelUrl: '/src/assets/images/same_model_gs_basketball_1795260494858.jpg',
    modelAlt: 'Studio athlete wearing exact Gemini Sports crimson basketball kit',
  },
  {
    stageIndex: 4,
    title: 'GS Cricket T20 & Test Wear',
    sport: 'Cricket',
    category: 'jerseys',
    productUrl: '/src/assets/images/prod_gs_cricket_1795260438914.jpg',
    productAlt: 'Gemini Sports emerald green and gold collared cricket polo jersey',
    modelUrl: '/src/assets/images/same_model_gs_cricket_1795260493427.jpg',
    modelAlt: 'Studio athlete wearing exact Gemini Sports emerald cricket polo',
  },
  {
    stageIndex: 5,
    title: 'GS Drill Tracksuits & Tour Duffels',
    sport: 'All',
    category: 'tracksuits',
    productUrl: '/src/assets/images/prod_gs_tracksuit_1795260465219.jpg',
    productAlt: 'Gemini Sports charcoal and cobalt full-zip athletic drill tracksuit',
    modelUrl: '/src/assets/images/same_model_gs_duffel_1795260517306.jpg',
    modelAlt: 'Studio athlete in Gemini Sports tracksuit carrying GS crimson leather duffel bag',
  },
];

const MANUFACTURING_STAGES = [
  {
    code: '01',
    title: 'Custom Yarn & Mill Knitting',
    summary:
      'In-house circular knitting produces breathable interlock, honeycomb pique, and 420gsm washed streetwear terry.',
    spec: '130–500 GSM · OEKO-TEX Certified Yarns',
  },
  {
    code: '02',
    title: 'Italian Ink Dye-Sublimation',
    summary:
      'Pantone-matched rotary heat presses fuse graphics permanently into fibers—zero cracking, peeling, or extra weight.',
    spec: 'Pantone Delta-E < 1.0 · Washproof 100+ Cycles',
  },
  {
    code: '03',
    title: '4-Needle Flatlock & Chenille Crests',
    summary:
      'Chafe-free flatlock seams, 3D silicone GS heat badges, and boucle chenille varsity patches engineered for lasting craft.',
    spec: 'ISO 9001 Cut & Sew · Reinforced Raglan Fit',
  },
  {
    code: '04',
    title: 'AQL 2.5 Audit & Global Export',
    summary:
      'Every garment passes pull-force, colorfastness, and size-grading QC before custom Gemini Sports or private-label packaging.',
    spec: '7-Day Sample · 12–18 Day Bulk Dispatch',
  },
];

interface FabricProfile {
  id: string;
  name: string;
  gsm: string;
  stretch: string;
  idealFor: string;
  sport: SportType;
  category: UniformCategory;
  summary: string;
  metrics: {
    breathability: number;
    mobility: number;
    durability: number;
    wicking: number;
  };
}

const FABRIC_PROFILES: FabricProfile[] = [
  {
    id: 'dry-fit',
    name: 'Dry-Fit Interlock Polyester',
    gsm: '160 gsm',
    stretch: '4-Way Comfort',
    idealFor: 'Football Kits, Field Hockey & Match Tops',
    sport: 'Football',
    category: 'jerseys',
    summary:
      'Flagship matchday double-knit polyester balancing crisp sublimation clarity with rapid sweat dispersion across 90 minutes.',
    metrics: { breathability: 92, mobility: 92, durability: 89, wicking: 95 },
  },
  {
    id: 'french-terry',
    name: 'Washed Boxy Street French Terry',
    gsm: '420 gsm',
    stretch: 'Heavyweight Loopback',
    idealFor: 'Streetwear Hoodies, Varsity Pullovers & Travel Sweats',
    sport: 'Streetwear',
    category: 'streetwear',
    summary:
      'Combed heavy cotton French terry enzyme-washed for vintage hand-feel and structured boxy drape with raised puff and chenille crests.',
    metrics: { breathability: 78, mobility: 88, durability: 96, wicking: 74 },
  },
  {
    id: 'honeycomb',
    name: 'Honeycomb Moisture Pique',
    gsm: '175 gsm',
    stretch: 'Structured Breathable',
    idealFor: 'Cricket T20 / Test Polos & Badminton',
    sport: 'Cricket',
    category: 'jerseys',
    summary:
      'Micro-textured hexagonal weave lifting gently off skin in high humidity while maintaining tailored collar structure.',
    metrics: { breathability: 92, mobility: 84, durability: 91, wicking: 92 },
  },
  {
    id: 'tricot',
    name: 'Brushed Poly-Spandex Tricot',
    gsm: '240–310 gsm',
    stretch: '4-Way Recovery',
    idealFor: 'Tour Tracksuits, Sideline Jackets & Travel Warmups',
    sport: 'All',
    category: 'tracksuits',
    summary:
      'Smooth matte exterior with brushed thermal comfort inside—retains articulated knee recovery across tournament travel.',
    metrics: { breathability: 74, mobility: 94, durability: 95, wicking: 80 },
  },
];

const clamp = (v: number, min = 0, max = 1) => Math.max(min, Math.min(max, v));

function getElementProgress(el: HTMLElement | null): number {
  if (!el) return 0.5;
  const rect = el.getBoundingClientRect();
  const winH = window.innerHeight || 900;
  return clamp((winH - rect.top) / (winH + rect.height), 0, 1);
}

export const LandingSections: React.FC<LandingSectionsProps> = ({
  onSelectCategoryForStudio,
  onOpenCatalog,
  onOpenManufacturing,
  onOpenQuote,
}) => {
  const sec2Ref = useRef<HTMLElement | null>(null);
  const [s2Progress, setS2Progress] = useState(0.3);
  const [manualStageIdx, setManualStageIdx] = useState<number | null>(null);
  const [activeFabricId, setActiveFabricId] = useState(FABRIC_PROFILES[0].id);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onMqChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onMqChange);

    let rafId = 0;
    const measure = () => {
      rafId = 0;
      const p = Number(getElementProgress(sec2Ref.current).toFixed(3));
      setS2Progress((prev) => (Math.abs(prev - p) > 0.006 ? p : prev));
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      mq.removeEventListener('change', onMqChange);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollStageIdx = Math.min(3, Math.floor(clamp((s2Progress - 0.15) / 0.65) * 3.99));
  const activeStageIdx = manualStageIdx !== null ? manualStageIdx : scrollStageIdx;
  const activeStage = MANUFACTURING_STAGES[activeStageIdx];
  const activeFabric =
    FABRIC_PROFILES.find((f) => f.id === activeFabricId) || FABRIC_PROFILES[0];

  const factoryImgScale = reducedMotion ? 1.02 : 1.02 + s2Progress * 0.08;

  return (
    <div id="sport-lines" className="relative z-10 w-full bg-transparent text-white">
      {/* SECTION 01: STRICT OPPOSITE-SIDE SPLIT SHOWCASE — LEFT CARD / CLEAR RIGHT MODEL, RIGHT CARD / CLEAR LEFT MODEL */}
      <section className="w-full pt-20 md:pt-28 pb-12 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div
            data-bg-stage="0"
            className="lg:w-[54%] rounded-3xl bg-[#080C15]/78 border border-white/15 p-6 md:p-8 shadow-2xl"
          >
            <div className="inline-flex items-center gap-2 text-xs font-medium tracking-wide text-emerald-300">
              <BrandCrestSvg className="w-4 h-4" primaryColor="#F8FAFC" accentColor="#34D399" />
              <span>01. Gemini Sports · Sportswear &amp; Streetwear Collection</span>
            </div>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold tracking-tight text-white text-balance leading-[1.08]">
              Pro match uniforms &amp; heavyweight streetwear forged under one brand
            </h2>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenCatalog('All')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 shadow-lg text-xs font-semibold text-slate-900 transition-colors cursor-pointer"
              >
                <span>Browse All Sportswear &amp; Streetwear</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onSelectCategoryForStudio('streetwear', 'Streetwear')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
              >
                <span>Try Streetwear in Studio</span>
              </button>
            </div>
          </div>

          <div className="mt-24 md:mt-32 space-y-32 md:space-y-44">
            {SPORT_LINE_CARDS.map((card, idx) => {
              const isCardOnRight = idx % 2 === 1;

              return (
                <div
                  key={card.title}
                  data-bg-stage={card.stageIndex}
                  className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8"
                >
                  {/* Open Left Viewport Window for Left-Aligned GS Model/Player */}
                  {isCardOnRight && (
                    <div className="hidden lg:block lg:col-span-6 pointer-events-none" />
                  )}

                  <article className="lg:col-span-6 group rounded-3xl bg-[#080C15]/78 border border-white/15 p-5 md:p-6 shadow-2xl hover:border-white/30 transition-all duration-300">
                    <div className="grid grid-cols-12 gap-3.5 items-stretch">
                      <div className="col-span-7 rounded-2xl overflow-hidden aspect-square bg-[#D6DBE3]">
                        <img
                          src={card.productUrl}
                          alt={card.productAlt}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="col-span-5 rounded-2xl overflow-hidden aspect-[4/5] bg-[#D6DBE3]">
                        <img
                          src={card.modelUrl}
                          alt={card.modelAlt}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-300 truncate">
                          {card.sport}
                        </p>
                        <h3 className="mt-0.5 font-display text-xl md:text-2xl font-bold text-white truncate">
                          {card.title}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => onSelectCategoryForStudio(card.category, card.sport)}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-300 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>Equip in Studio</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </article>

                  {/* Open Right Viewport Window for Right-Aligned GS Model/Player */}
                  {!isCardOnRight && (
                    <div className="hidden lg:block lg:col-span-6 pointer-events-none" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 02: MANUFACTURING ATELIER ON LEFT — OPEN CLEAR RIGHT GS PLAYER */}
      <section
        ref={sec2Ref}
        data-bg-stage="4"
        className="w-full py-24 md:py-36 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
          <div className="lg:col-span-7 rounded-3xl bg-[#080C15]/80 border border-white/15 p-6 md:p-9 shadow-2xl space-y-6">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs font-medium tracking-wide text-emerald-300">
                02. Manufacturer &amp; Direct Exporter
              </p>
              <span className="text-[11px] font-mono-tabular text-slate-400">
                Stage {activeStage.code} / 04
              </span>
            </div>

            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white text-balance leading-tight">
              Precision sublimation, 420gsm terry &amp; chenille crest craft
            </h2>

            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/12 aspect-[16/9]">
              <img
                src="/src/assets/images/factory_sublimation_craft_1795119462052.jpg"
                alt="Gemini Sports precision cut-and-sew and dye sublimation workshop"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover will-change-transform transition-transform duration-200"
                style={{ transform: `scale(${factoryImgScale})` }}
              />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080B12]/88 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute bottom-3.5 left-3.5 right-3.5 rounded-xl bg-black/75 border border-white/15 px-4 py-2.5 flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-white">
                  ISO 9001 Facility · Vertical Knitting &amp; Export QC
                </span>
                <span className="text-xs font-mono-tabular text-emerald-300 shrink-0">
                  99.4% Pass
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MANUFACTURING_STAGES.map((stage, idx) => {
                const isActive = idx === activeStageIdx;
                return (
                  <button
                    key={stage.code}
                    type="button"
                    onClick={() => setManualStageIdx(idx)}
                    className={`px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-lg'
                        : 'bg-white/[0.05] text-slate-300 border-white/10 hover:bg-white/[0.1] hover:text-white'
                    }`}
                  >
                    <div className="text-[11px] font-mono-tabular font-bold opacity-80">
                      Stage {stage.code}
                    </div>
                    <div className="mt-0.5 text-xs font-semibold truncate">
                      {stage.title.split(' ')[0]} {stage.title.split(' ')[1]}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl bg-white/[0.05] border border-white/12 p-5">
              <p className="text-xs font-mono-tabular text-emerald-300">{activeStage.spec}</p>
              <h3 className="mt-1 font-display text-lg font-bold text-white">
                {activeStage.code}. {activeStage.title}
              </h3>
              <p className="mt-2 text-sm text-slate-200 leading-relaxed">{activeStage.summary}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onOpenManufacturing}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
              >
                View Production Specs
              </button>
              <button
                type="button"
                onClick={onOpenQuote}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer"
              >
                Request Custom Sample
              </button>
            </div>
          </div>

          {/* Open Right Viewing Window for Clear Right-Side GS Cricketer */}
          <div className="hidden lg:block lg:col-span-5 pointer-events-none" />
        </div>
      </section>

      {/* SECTION 03: GSM TEXTILE LAB ON RIGHT — OPEN CLEAR LEFT GS BASKETBALL ATHLETE */}
      <section data-bg-stage="3" className="w-full py-24 md:py-36 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
          {/* Open Left Viewing Window for Clear Left-Side GS Basketball Athlete */}
          <div className="hidden lg:block lg:col-span-5 pointer-events-none" />

          <div className="lg:col-span-7 rounded-3xl bg-[#080C15]/80 border border-white/15 p-6 md:p-9 shadow-2xl space-y-6">
            <div>
              <p className="text-xs font-medium tracking-wide text-emerald-300">
                03. Interactive Fabric &amp; GSM Engineering Lab
              </p>
              <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold tracking-tight text-white text-balance">
                Calibrated performance meshes &amp; 420gsm street cotton
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {FABRIC_PROFILES.map((fab) => {
                const selected = fab.id === activeFabric.id;
                return (
                  <button
                    key={fab.id}
                    type="button"
                    onClick={() => setActiveFabricId(fab.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      selected
                        ? 'bg-white text-slate-950 border-white shadow-xl'
                        : 'bg-white/[0.04] text-slate-200 border-white/10 hover:bg-white/[0.09]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold truncate">{fab.name}</span>
                      <span
                        className={`text-[11px] font-mono-tabular shrink-0 ${
                          selected ? 'text-emerald-700 font-bold' : 'text-emerald-300'
                        }`}
                      >
                        {fab.gsm}
                      </span>
                    </div>
                    <p
                      className={`mt-1 text-[11px] truncate ${
                        selected ? 'text-slate-600' : 'text-slate-400'
                      }`}
                    >
                      {fab.idealFor}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl bg-white/[0.05] border border-white/12 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-display text-lg font-bold text-white">{activeFabric.name}</h3>
                  <p className="text-xs text-slate-400">
                    {activeFabric.gsm} · {activeFabric.stretch}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    onSelectCategoryForStudio(activeFabric.category, activeFabric.sport)
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>Equip in Studio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-sm text-slate-200 leading-relaxed">{activeFabric.summary}</p>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-1">
                {(
                  [
                    ['Breathability', activeFabric.metrics.breathability],
                    ['4-Way Mobility', activeFabric.metrics.mobility],
                    ['Abrasion Shield', activeFabric.metrics.durability],
                    ['Sweat Wicking', activeFabric.metrics.wicking],
                  ] as const
                ).map(([label, val]) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-300">{label}</span>
                      <span className="font-mono-tabular font-semibold text-white">{val}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/15 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-all duration-300"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 04: WHOLESALE TIERS ON LEFT — OPEN CLEAR RIGHT GS STREETWEAR MODEL */}
      <section data-bg-stage="0" className="w-full py-24 md:py-36 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
          <div className="lg:col-span-7 rounded-3xl bg-[#080C15]/80 border border-white/15 p-6 md:p-9 shadow-2xl space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-300">
              <Trophy className="w-4 h-4" />
              <span>04. Global B2B Supply &amp; Private Label</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white text-balance">
              Direct factory supply for clubs, academies &amp; streetwear labels
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-4">
                <p className="text-[11px] font-mono-tabular text-slate-400">Team Capsules</p>
                <h3 className="mt-1 font-display text-base font-semibold text-white">
                  Pro Match Standard
                </h3>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                  Custom numbers, player names, and crest application in 12–16 days.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-400/50 bg-emerald-400/[0.1] p-4">
                <p className="text-[11px] font-mono-tabular text-emerald-300">
                  Academy &amp; League
                </p>
                <h3 className="mt-1 font-display text-base font-semibold text-white">
                  Full-Squad Grading
                </h3>
                <p className="mt-1.5 text-xs text-slate-200 leading-relaxed">
                  Complete S–XXL squad runs with complimentary physical pre-production sample.
                </p>
              </div>

              <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-4">
                <p className="text-[11px] font-mono-tabular text-slate-400">200+ Units</p>
                <h3 className="mt-1 font-display text-base font-semibold text-white">
                  22% OEM Wholesale
                </h3>
                <p className="mt-1.5 text-xs text-slate-300 leading-relaxed">
                  Private-label woven tags, custom polybags, and priority air cargo.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <blockquote className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-slate-200 leading-relaxed">
                  &ldquo;We transitioned 18 squads plus our streetwear hoodie capsule to Gemini
                  Sports. Exact crest sharpness even after 40+ washes.&rdquo;
                </p>
                <footer className="mt-2.5 text-[11px] text-slate-400">
                  <span className="font-semibold text-white">Tariq Mahmood</span> · Crescent FC
                </footer>
              </blockquote>
              <blockquote className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs text-slate-200 leading-relaxed">
                  &ldquo;240 custom cricket T20 polos and 420gsm street crewnecks sampled in 7 days
                  and shipped ahead of schedule.&rdquo;
                </p>
                <footer className="mt-2.5 text-[11px] text-slate-400">
                  <span className="font-semibold text-white">Daniel Henderson</span> · Midlands
                  Academy
                </footer>
              </blockquote>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-emerald-300 font-medium">
                <Check className="w-4 h-4" />
                <span>7-Day Sample Turnaround · Mixed Sizes Included</span>
              </div>
              <button
                type="button"
                onClick={onOpenQuote}
                className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold shadow-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                Open Inquiry Bag
              </button>
            </div>
          </div>

          {/* Open Right Viewing Window for Clear Right-Side GS Hoodie Model */}
          <div className="hidden lg:block lg:col-span-5 pointer-events-none" />
        </div>
      </section>

      {/* SECTION 05: COMPACT BRANDED FOOTER OVER CLEAR LEFT GS SQUAD ATHLETES */}
      <footer
        data-bg-stage="5"
        className="w-full pt-12 pb-20 px-6 md:px-12"
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-end gap-8">
          <div className="hidden lg:block lg:col-span-5 pointer-events-none" />

          <div className="lg:col-span-7 rounded-3xl bg-[#080C15]/86 border border-white/15 p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <BrandLogo variant="dark" size="lg" showTagline />
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Back to 3D Studio
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Factory-direct manufacturer and global supplier of sublimated teamwear, custom sports
              footwear, ballistic kit bags, and heavyweight 420gsm streetwear capsules.
            </p>

            <div className="pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
              <span>Gemini Sports · Direct B2B Sportswear &amp; Streetwear Supply</span>
              <div className="flex flex-wrap items-center gap-5">
                <button
                  type="button"
                  onClick={() => onSelectCategoryForStudio('streetwear', 'Streetwear')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Streetwear
                </button>
                <button
                  type="button"
                  onClick={() => onOpenCatalog('All')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  All Lines
                </button>
                <button
                  type="button"
                  onClick={onOpenManufacturing}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Manufacturing
                </button>
                <button
                  type="button"
                  onClick={onOpenQuote}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Bulk Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
