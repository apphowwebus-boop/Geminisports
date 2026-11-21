import React, { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { CATEGORY_TABS, UNIFORM_CATALOG } from '../data/uniformCatalog';
import { SportType, UniformCategory, UniformItem } from '../types/uniform';
import { BrandLogo } from './BrandLogo';

interface CatalogDrawerProps {
  open: boolean;
  initialSport: SportType;
  onClose: () => void;
  onEquipInStudio: (item: UniformItem) => void;
  onAddToQuote: (item: UniformItem) => void;
}

const CATEGORY_LABEL_MAP: Record<UniformCategory, string> = {
  jerseys: 'Sport Jerseys',
  streetwear: 'Streetwear',
  tracksuits: 'Tracksuits',
  footwear: 'Footwear',
  bags: 'Kit Bags',
};

export const CatalogDrawer: React.FC<CatalogDrawerProps> = ({
  open,
  onClose,
  onEquipInStudio,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | UniformCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return UNIFORM_CATALOG.filter((item) => {
      const catMatch = selectedCategory === 'all' || item.category === selectedCategory;
      const textMatch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.sport.toLowerCase().includes(q) ||
        CATEGORY_LABEL_MAP[item.category].toLowerCase().includes(q);
      return catMatch && textMatch;
    });
  }, [selectedCategory, searchQuery]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Gemini Sports Product Catalog"
    >
      <div className="w-full max-w-6xl max-h-[88vh] rounded-3xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        {/* Clean Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <BrandLogo variant="light" size="md" />

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="pl-9 pr-3 py-2 w-48 sm:w-56 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close catalog"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 5-Category Product Filter Bar */}
        <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/70 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
            }`}
          >
            All Categories
          </button>
          {CATEGORY_TABS.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Clean Visual-First Product Grid — ONLY Product Image, Name & Category */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredItems.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500">
              No products matched your search.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onEquipInStudio(item);
                    onClose();
                  }}
                  className="group text-left rounded-2xl border border-slate-200/80 bg-[#DDE2EA] overflow-hidden flex flex-col transition-all duration-200 hover:shadow-xl hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 cursor-pointer"
                >
                  {/* Large Full-Bleed Visual Product Frame */}
                  <div className="w-full aspect-square bg-[#DDE2EA] overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Minimal Footer: Category & Name Only */}
                  <div className="bg-white px-4 py-3.5 border-t border-slate-100">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-700">
                      {CATEGORY_LABEL_MAP[item.category]}
                    </p>
                    <h3 className="mt-0.5 text-sm font-bold text-slate-900 truncate">
                      {item.name}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
