import React, { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Plus, SlidersHorizontal } from 'lucide-react';
import { UniformItem } from '../types/uniform';
import { UniformThumbnail } from './UniformThumbnail';

interface BottomDockProps {
  activeItem: UniformItem;
  activeColorwayIndex: number;
  squadNumber: string;
  teamName: string;
  showBagOnStage: boolean;
  onSelectColorway: (index: number) => void;
  onChangeSquadNumber: (val: string) => void;
  onChangeTeamName: (val: string) => void;
  onToggleBagOnStage: () => void;
  onAddToQuote: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  activeItem,
  activeColorwayIndex,
  squadNumber,
  teamName,
  showBagOnStage,
  onSelectColorway,
  onChangeSquadNumber,
  onChangeTeamName,
  onToggleBagOnStage,
  onAddToQuote,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showCustomPrint, setShowCustomPrint] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const activeColorway = activeItem.colorways[activeColorwayIndex] || activeItem.colorways[0];

  const handleAdd = () => {
    onAddToQuote();
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1400);
  };

  if (collapsed) {
    return (
      <div className="pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 z-30">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white border border-slate-200/80 shadow-lg text-xs font-medium text-slate-800 whitespace-nowrap transition-colors"
        >
          <ChevronUp className="w-3.5 h-3.5" />
          <span>Show Studio Dock</span>
        </button>
      </div>
    );
  }

  return (
    <div className="pointer-events-auto absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 z-30 w-[min(860px,94vw)] flex flex-col items-center gap-2">
      {/* Optional Popover for Live 3D Squad Number & Team Name Customization */}
      {showCustomPrint && (
        <div className="w-full max-w-md rounded-2xl bg-white/95 border border-slate-200/90 shadow-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[160px]">
            <label htmlFor="studio-team-name" className="text-xs font-medium text-slate-600 whitespace-nowrap">
              Team Print
            </label>
            <input
              id="studio-team-name"
              type="text"
              maxLength={14}
              value={teamName}
              onChange={(e) => onChangeTeamName(e.target.value)}
              placeholder="GEMINI"
              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold uppercase text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="studio-squad-num" className="text-xs font-medium text-slate-600 whitespace-nowrap">
              Squad #
            </label>
            <input
              id="studio-squad-num"
              type="text"
              maxLength={2}
              value={squadNumber}
              onChange={(e) => onChangeSquadNumber(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="10"
              className="w-14 px-2 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono-tabular font-semibold text-center text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          {activeItem.category !== 'bags' && (
            <button
              type="button"
              onClick={onToggleBagOnStage}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                showBagOnStage
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {showBagOnStage ? 'Hide Kit Bag' : 'Show Kit Bag'}
            </button>
          )}
        </div>
      )}

      {/* Main Bottom Control Dock */}
      <div className="relative w-full rounded-2xl bg-white/90 border border-white shadow-[0_18px_44px_-12px_rgba(15,23,42,0.22)] px-3.5 py-2.5 md:px-5 md:py-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-3">
        {/* Collapse Toggle Tab */}
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          aria-label="Hide studio dock"
          className="hidden md:flex absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-5 rounded-t-lg bg-white/90 border border-b-0 border-slate-200/80 items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {/* Left: Active Uniform Thumbnail & Minimal Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-xl bg-[#DDE2EA] overflow-hidden shrink-0">
            <UniformThumbnail item={activeItem} colorway={activeColorway} className="w-full h-full" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 truncate">
              {activeItem.name}
            </h2>
            <p className="text-xs font-medium text-emerald-700 truncate">
              {activeItem.sport}
            </p>
          </div>
        </div>

        {/* Center: Interactive Colorway Swatches */}
        <div
          className="flex items-center gap-2 px-2 py-1 rounded-xl bg-slate-100/80 border border-slate-200/60 shrink-0"
          role="radiogroup"
          aria-label="Select team colorway"
        >
          {activeItem.colorways.map((cw, idx) => {
            const isSelected = idx === activeColorwayIndex;
            return (
              <button
                key={cw.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={`Colorway ${cw.name}`}
                title={cw.name}
                onClick={() => onSelectColorway(idx)}
                className={`relative w-6 h-6 rounded-full transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                  isSelected
                    ? 'scale-110 ring-2 ring-slate-900 ring-offset-2 ring-offset-white'
                    : 'hover:scale-105 opacity-90 hover:opacity-100'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${cw.primary} 0%, ${cw.primary} 62%, ${cw.trim} 100%)`,
                }}
              />
            );
          })}
        </div>

        {/* Right: Print Customizer & Add to Quote CTA */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowCustomPrint((v) => !v)}
            aria-expanded={showCustomPrint}
            title="Customize team name & squad number"
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors whitespace-nowrap shrink-0 ${
              showCustomPrint
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-slate-100 text-slate-700 border-slate-200/80 hover:bg-slate-200/80'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print #{squadNumber || '10'}</span>
          </button>

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
