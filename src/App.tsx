import React, { useMemo, useState } from 'react';
import { ArrowDown } from 'lucide-react';
import { BottomDock } from './components/BottomDock';
import { BrandCrestSvg, BrandLogo } from './components/BrandLogo';
import { CatalogDrawer } from './components/CatalogDrawer';
import { CenterStudioModel } from './components/CenterStudioModel';
import { CurvedCarousel } from './components/CurvedCarousel';
import { GlobalMatchBackdrop } from './components/GlobalMatchBackdrop';
import { HeroActiveBackdrop } from './components/HeroActiveBackdrop';
import { LandingSections } from './components/LandingSections';
import { ManufacturingModal } from './components/ManufacturingModal';
import { QuoteDrawer } from './components/QuoteDrawer';
import {
  CATEGORY_TABS,
  getVolumeUnitPrice,
  SPORT_FILTERS,
  UNIFORM_CATALOG,
} from './data/uniformCatalog';
import {
  EquippedKit,
  QuoteOrderItem,
  SizeBreakdown,
  SportType,
  UniformCategory,
  UniformItem,
} from './types/uniform';

const DEFAULT_JERSEY =
  UNIFORM_CATALOG.find((i) => i.id === 'fb-pro-match') || UNIFORM_CATALOG[0];
const DEFAULT_STREETWEAR =
  UNIFORM_CATALOG.find((i) => i.id === 'st-washed-hoodie') || UNIFORM_CATALOG[0];
const DEFAULT_TRACKSUIT =
  UNIFORM_CATALOG.find((i) => i.id === 'ts-studio-puffer') || UNIFORM_CATALOG[0];
const DEFAULT_FOOTWEAR =
  UNIFORM_CATALOG.find((i) => i.id === 'fw-court-hightop') || UNIFORM_CATALOG[0];
const DEFAULT_BAG =
  UNIFORM_CATALOG.find((i) => i.id === 'bg-team-wheelie') || UNIFORM_CATALOG[0];

export default function App() {
  const [activeCategory, setActiveCategory] = useState<UniformCategory>('jerseys');
  const [sportFilter, setSportFilter] = useState<SportType>('All');

  const [kit, setKit] = useState<EquippedKit>({
    top: { item: DEFAULT_JERSEY, colorwayIndex: 0 },
    streetwear: { item: DEFAULT_STREETWEAR, colorwayIndex: 0 },
    tracksuit: { item: DEFAULT_TRACKSUIT, colorwayIndex: 0 },
    activeTopLayer: 'jersey',
    footwear: { item: DEFAULT_FOOTWEAR, colorwayIndex: 0 },
    bag: { item: DEFAULT_BAG, colorwayIndex: 0 },
    showBagOnStage: false,
    squadNumber: '10',
    teamName: 'GEMINI',
  });

  const [catalogOpen, setCatalogOpen] = useState(false);
  const [manufacturingOpen, setManufacturingOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteItems, setQuoteItems] = useState<QuoteOrderItem[]>([]);

  // Items shown in the curved 3D carousel for the active category & optional sport filter
  const carouselItems = useMemo(() => {
    const byCategory = UNIFORM_CATALOG.filter((i) => i.category === activeCategory);
    if (sportFilter === 'All') return byCategory;
    const bySport = byCategory.filter((i) => i.sport === sportFilter);
    return bySport.length > 0 ? bySport : byCategory;
  }, [activeCategory, sportFilter]);

  // Currently active slot corresponding to the active top category tab
  const activeSlot = useMemo(() => {
    if (activeCategory === 'jerseys') return kit.top;
    if (activeCategory === 'streetwear') return kit.streetwear;
    if (activeCategory === 'tracksuits') return kit.tracksuit;
    if (activeCategory === 'footwear') return kit.footwear;
    return kit.bag;
  }, [activeCategory, kit]);

  const handleCategoryFromLanding = (cat: UniformCategory, sport?: SportType) => {
    handleCategoryChange(cat);
    if (sport && sport !== 'All') {
      setSportFilter(sport);
      const match = UNIFORM_CATALOG.find((i) => i.category === cat && i.sport === sport);
      if (match) handleSelectItem(match);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (cat: UniformCategory) => {
    setActiveCategory(cat);
    setSportFilter('All');
    setKit((prev) => ({
      ...prev,
      activeTopLayer:
        cat === 'jerseys'
          ? 'jersey'
          : cat === 'streetwear'
            ? 'streetwear'
            : cat === 'tracksuits'
              ? 'tracksuit'
              : prev.activeTopLayer,
      showBagOnStage: cat === 'bags' ? true : cat === 'streetwear' || cat === 'jerseys' || cat === 'tracksuits' ? false : prev.showBagOnStage,
    }));
  };

  const handleSelectItem = (item: UniformItem) => {
    setActiveCategory(item.category);
    setKit((prev) => {
      if (item.category === 'jerseys') {
        const sameItem = prev.top.item.id === item.id;
        return {
          ...prev,
          activeTopLayer: 'jersey',
          showBagOnStage: false,
          top: { item, colorwayIndex: sameItem ? prev.top.colorwayIndex : 0 },
        };
      }
      if (item.category === 'streetwear') {
        const sameItem = prev.streetwear.item.id === item.id;
        return {
          ...prev,
          activeTopLayer: 'streetwear',
          showBagOnStage: false,
          streetwear: { item, colorwayIndex: sameItem ? prev.streetwear.colorwayIndex : 0 },
        };
      }
      if (item.category === 'tracksuits') {
        const sameItem = prev.tracksuit.item.id === item.id;
        return {
          ...prev,
          activeTopLayer: 'tracksuit',
          showBagOnStage: false,
          tracksuit: { item, colorwayIndex: sameItem ? prev.tracksuit.colorwayIndex : 0 },
        };
      }
      if (item.category === 'footwear') {
        const sameItem = prev.footwear.item.id === item.id;
        return {
          ...prev,
          showBagOnStage: false,
          footwear: { item, colorwayIndex: sameItem ? prev.footwear.colorwayIndex : 0 },
        };
      }
      const sameItem = prev.bag.item.id === item.id;
      return {
        ...prev,
        showBagOnStage: true,
        bag: { item, colorwayIndex: sameItem ? prev.bag.colorwayIndex : 0 },
      };
    });
  };

  const handleSelectColorway = (idx: number) => {
    setKit((prev) => {
      if (activeCategory === 'jerseys') {
        return { ...prev, top: { ...prev.top, colorwayIndex: idx } };
      }
      if (activeCategory === 'streetwear') {
        return { ...prev, streetwear: { ...prev.streetwear, colorwayIndex: idx } };
      }
      if (activeCategory === 'tracksuits') {
        return { ...prev, tracksuit: { ...prev.tracksuit, colorwayIndex: idx } };
      }
      if (activeCategory === 'footwear') {
        return { ...prev, footwear: { ...prev.footwear, colorwayIndex: idx } };
      }
      return { ...prev, bag: { ...prev.bag, colorwayIndex: idx } };
    });
  };

  const addConfiguredItemToQuote = (
    item: UniformItem,
    colorwayIndex: number,
  ) => {
    const colorway = item.colorways[colorwayIndex] || item.colorways[0];
    const defaultSizes: SizeBreakdown = {
      S: 3,
      M: 5,
      L: 5,
      XL: 3,
      XXL: 2,
    };
    const totalQty = 18;
    const unitPriceAfterTier = getVolumeUnitPrice(item.unitPriceUsd, totalQty);

    const newEntry: QuoteOrderItem = {
      uid: `${item.id}-${colorway.id}-${Date.now()}`,
      item,
      colorway,
      squadNumber: kit.squadNumber || '10',
      teamName: kit.teamName || 'GEMINI',
      sizes: defaultSizes,
      totalQty,
      unitPriceAfterTier,
    };

    setQuoteItems((prev) => [...prev, newEntry]);
  };

  const handleUpdateQuoteSizes = (uid: string, sizes: SizeBreakdown) => {
    setQuoteItems((prev) =>
      prev.map((entry) => {
        if (entry.uid !== uid) return entry;
        const totalQty = sizes.S + sizes.M + sizes.L + sizes.XL + sizes.XXL;
        return {
          ...entry,
          sizes,
          totalQty,
          unitPriceAfterTier: getVolumeUnitPrice(entry.item.unitPriceUsd, totalQty),
        };
      }),
    );
  };

  const handleRemoveQuoteItem = (uid: string) => {
    setQuoteItems((prev) => prev.filter((entry) => entry.uid !== uid));
  };

  const totalManifestUnits = quoteItems.reduce((acc, item) => acc + item.totalQty, 0);

  return (
    <div className="relative w-full min-h-screen bg-[#090C14]">
      {/* Fixed Global Scroll-Linked Multi-Sport Live Match Background Across Entire Homepage */}
      <GlobalMatchBackdrop />

      {/* Sticky Minimalist 3-Zone Top Bar */}
      <header className="sticky top-0 z-40 w-full px-5 md:px-10 h-16 flex items-center justify-between gap-8 bg-[#eaedf2]/94 border-b border-slate-900/8">
        {/* Zone 1: Gemini Sports Twin-Wing Crest & Wordmark */}
        <a
          href="#studio"
          onClick={(e) => {
            e.preventDefault();
            setCatalogOpen(false);
            setManufacturingOpen(false);
            setQuoteOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 rounded-lg"
          aria-label="Gemini Sports Home"
        >
          <BrandLogo variant="light" size="md" showTagline />
        </a>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          <button
            type="button"
            onClick={() => {
              setCatalogOpen(false);
              setManufacturingOpen(false);
              setQuoteOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-slate-900 hover:text-slate-900 underline underline-offset-4 decoration-slate-900/40 whitespace-nowrap shrink-0 cursor-pointer"
          >
            3D Studio
          </button>
          <button
            type="button"
            onClick={() => setCatalogOpen(true)}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Sportswear &amp; Street
          </button>
          <button
            type="button"
            onClick={() => setManufacturingOpen(true)}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Manufacturing
          </button>
          <button
            type="button"
            onClick={() => setQuoteOpen(true)}
            className="hover:text-slate-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Inquiry Bag
          </button>
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setQuoteOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {totalManifestUnits > 0 ? (
              <span>
                Inquiry Bag <span className="font-mono-tabular">({quoteItems.length})</span>
              </span>
            ) : (
              'Inquiry Bag'
            )}
          </button>
        </div>
      </header>

      {/* HERO SECTION: Full-Viewport Interactive Fitting Studio Over Live Matching Active Player Backdrop */}
      <section className="relative z-20 w-full h-[calc(100vh-4rem)] min-h-[640px] max-h-[920px] overflow-hidden bg-[#080C15] select-none">
        {/* Dynamic Active Athlete / Streetwear Scene matching the selected outfit */}
        <HeroActiveBackdrop
          activeItem={activeSlot.item}
          colorway={activeSlot.item.colorways[activeSlot.colorwayIndex]}
        />

        {/* Top-Center Floating Segmented Category Control */}
        <div className="pointer-events-none absolute top-4 md:top-5 inset-x-0 z-30 flex flex-col items-center gap-2 px-4">
          <div
            className="pointer-events-auto inline-flex items-center gap-1 p-1 rounded-full bg-white/90 backdrop-blur-md border border-white shadow-[0_12px_32px_-8px_rgba(6,10,18,0.4)]"
            role="tablist"
            aria-label="Uniform categories"
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleCategoryChange(tab.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Clean Single-Line Sport Filter Strip */}
          <div className="pointer-events-auto max-w-[92vw] overflow-x-auto no-scrollbar flex items-center gap-1 px-2 py-1 rounded-full bg-white/80 backdrop-blur-md border border-white/90 shadow-md">
            {SPORT_FILTERS.map((sport) => {
              const isActive = sportFilter === sport;
              const hasItems =
                sport === 'All' ||
                UNIFORM_CATALOG.some(
                  (i) => i.category === activeCategory && i.sport === sport,
                );
              if (!hasItems) return null;

              return (
                <button
                  key={sport}
                  type="button"
                  onClick={() => setSportFilter(sport)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-white/70'
                  }`}
                >
                  {sport === 'All' ? 'All Lines' : sport}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setCatalogOpen(true)}
              className="md:hidden px-2.5 py-1 rounded-full text-[11px] font-semibold text-slate-800 hover:bg-white/70 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Full Catalog
            </button>
          </div>
        </div>

        {/* Subtle Architectural Brand Watermark Over Active Backdrop */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[14%] z-0 flex flex-col items-center justify-center opacity-[0.075]"
          aria-hidden="true"
        >
          <BrandCrestSvg className="w-24 h-20 md:w-28 md:h-24" primaryColor="#FFFFFF" accentColor="#34D399" />
          <span className="mt-1 font-display text-3xl md:text-5xl font-bold tracking-[0.22em] text-white uppercase">
            GEMINI SPORTS
          </span>
        </div>

        {/* Central Photorealistic Studio Athlete Viewport */}
        <main id="studio" className="absolute inset-0 z-10 pointer-events-none">
          <CenterStudioModel kit={kit} activeCategory={activeCategory} />
        </main>

        {/* Curved 3D Floating Product Carousel Surrounding the Athlete */}
        <CurvedCarousel
          items={carouselItems}
          equippedItemId={activeSlot.item.id}
          equippedColorwayIndex={activeSlot.colorwayIndex}
          disabled={catalogOpen || manufacturingOpen || quoteOpen}
          onSelectItem={handleSelectItem}
        />

        {/* Bottom Floating Studio Dock */}
        <BottomDock
          activeItem={activeSlot.item}
          activeColorwayIndex={activeSlot.colorwayIndex}
          squadNumber={kit.squadNumber}
          teamName={kit.teamName}
          showBagOnStage={kit.showBagOnStage}
          onSelectColorway={handleSelectColorway}
          onChangeSquadNumber={(val) => setKit((prev) => ({ ...prev, squadNumber: val }))}
          onChangeTeamName={(val) => setKit((prev) => ({ ...prev, teamName: val }))}
          onToggleBagOnStage={() =>
            setKit((prev) => ({ ...prev, showBagOnStage: !prev.showBagOnStage }))
          }
          onAddToQuote={() =>
            addConfiguredItemToQuote(activeSlot.item, activeSlot.colorwayIndex)
          }
        />

        {/* Subtle Bottom-Right Scroll Cue to Explore Homepage Over Live Action Backdrop */}
        <button
          type="button"
          onClick={() => {
            document.getElementById('sport-lines')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="hidden lg:inline-flex items-center gap-1.5 absolute bottom-5 right-6 z-30 px-3.5 py-2 rounded-full bg-white/80 hover:bg-white border border-white shadow-md text-[11px] font-semibold text-slate-800 transition-all cursor-pointer"
        >
          <span>Explore Match Scroll</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </button>
      </section>

      {/* SECTIONS 01–05: FLOATING OVER THE FULL-PAGE SCROLLING VOLLEYBALL-TO-GOAL BACKDROP */}
      <LandingSections
        onSelectCategoryForStudio={handleCategoryFromLanding}
        onOpenCatalog={(sport) => {
          if (sport) setSportFilter(sport);
          setCatalogOpen(true);
        }}
        onOpenManufacturing={() => setManufacturingOpen(true)}
        onOpenQuote={() => setQuoteOpen(true)}
      />

      {/* Full Sports Uniform Catalog Drawer */}
      <CatalogDrawer
        open={catalogOpen}
        initialSport={sportFilter}
        onClose={() => setCatalogOpen(false)}
        onEquipInStudio={handleSelectItem}
        onAddToQuote={(item) => {
          addConfiguredItemToQuote(item, 0);
          setQuoteOpen(true);
        }}
      />

      {/* Manufacturer Capabilities & Wholesale Specs Modal */}
      <ManufacturingModal
        open={manufacturingOpen}
        onClose={() => setManufacturingOpen(false)}
        onOpenQuote={() => setQuoteOpen(true)}
      />

      {/* Bulk Order & Factory Quote Manifest Drawer */}
      <QuoteDrawer
        open={quoteOpen}
        items={quoteItems}
        onClose={() => setQuoteOpen(false)}
        onUpdateSizes={handleUpdateQuoteSizes}
        onRemoveItem={handleRemoveQuoteItem}
        onClearQuote={() => setQuoteItems([])}
      />
    </div>
  );
}
