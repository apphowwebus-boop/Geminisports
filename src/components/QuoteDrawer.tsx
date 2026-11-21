import React, { useState } from 'react';
import { CheckCircle2, Trash2, X } from 'lucide-react';
import { QuoteOrderItem, SizeBreakdown } from '../types/uniform';
import { BrandLogo } from './BrandLogo';
import { UniformThumbnail } from './UniformThumbnail';

interface QuoteDrawerProps {
  open: boolean;
  items: QuoteOrderItem[];
  onClose: () => void;
  onUpdateSizes: (uid: string, sizes: SizeBreakdown) => void;
  onRemoveItem: (uid: string) => void;
  onClearQuote: () => void;
}

const SIZE_KEYS: (keyof SizeBreakdown)[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const QuoteDrawer: React.FC<QuoteDrawerProps> = ({
  open,
  items,
  onClose,
  onUpdateSizes,
  onRemoveItem,
  onClearQuote,
}) => {
  const [clubName, setClubName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [destination, setDestination] = useState('');
  const [notes, setNotes] = useState('');
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  if (!open) return null;

  const grandTotalQty = items.reduce((sum, i) => sum + i.totalQty, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    const refId = `GS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedRef(refId);
  };

  const handleResetAndClose = () => {
    setSubmittedRef(null);
    onClearQuote();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/35"
      role="dialog"
      aria-modal="true"
      aria-label="Gemini Sports Inquiry Bag Drawer"
    >
      <div className="w-full max-w-xl h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <BrandLogo variant="light" size="sm" />
            <p className="text-xs text-slate-500">
              Bulk Order &amp; Custom Production Inquiry · S–XXL Sizing
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close inquiry drawer"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submittedRef ? (
          <div className="flex-1 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              Inquiry Confirmed
            </h3>
            <p className="text-xs font-mono-tabular text-slate-500 mt-1">
              Reference {submittedRef}
            </p>
            <p className="text-sm text-slate-600 mt-3 max-w-md leading-relaxed">
              Your custom order manifest for{' '}
              <span className="font-semibold text-slate-900">{clubName || 'your organization'}</span>{' '}
              ({grandTotalQty} total units) has been logged for production tech-pack review.
            </p>
            <div className="mt-6 w-full max-w-sm rounded-xl bg-slate-50 border border-slate-200 p-4 text-left text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span>Contact</span>
                <span className="font-medium text-slate-900">{contactName}</span>
              </div>
              <div className="flex justify-between">
                <span>Email</span>
                <span className="font-medium text-slate-900">{email}</span>
              </div>
              <div className="flex justify-between">
                <span>Destination</span>
                <span className="font-medium text-slate-900">{destination || 'International Air'}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Lead Time</span>
                <span className="font-mono-tabular font-medium text-slate-900">14 – 21 Days</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Return to 3D Studio
            </button>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {items.length === 0 ? (
                <div className="py-14 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6">
                  <p className="text-sm font-medium text-slate-800">
                    Your inquiry bag is empty
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Select any product in the 3D Studio and click &ldquo;Add to Quote&rdquo;.
                  </p>
                </div>
              ) : (
                items.map((entry) => (
                  <div
                    key={entry.uid}
                    className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-14 h-14 rounded-xl bg-[#DDE2EA] overflow-hidden shrink-0">
                          <UniformThumbnail item={entry.item} colorway={entry.colorway} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-700 truncate">
                            {entry.item.sport}
                          </p>
                          <h3 className="text-sm font-semibold text-slate-900 truncate">
                            {entry.item.name}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">
                            {entry.colorway.name} · {entry.totalQty} pcs
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(entry.uid)}
                        aria-label={`Remove ${entry.item.name}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Size Breakdown Matrix */}
                    <div className="grid grid-cols-5 gap-2 pt-2 border-t border-slate-200/70">
                      {SIZE_KEYS.map((sizeKey) => (
                        <div key={sizeKey} className="flex flex-col items-center gap-1">
                          <label
                            htmlFor={`${entry.uid}-${sizeKey}`}
                            className="text-[11px] font-medium text-slate-500"
                          >
                            {sizeKey}
                          </label>
                          <input
                            id={`${entry.uid}-${sizeKey}`}
                            type="number"
                            min={0}
                            max={9999}
                            value={entry.sizes[sizeKey]}
                            onChange={(e) => {
                              const nextVal = Math.max(0, parseInt(e.target.value || '0', 10));
                              onUpdateSizes(entry.uid, {
                                ...entry.sizes,
                                [sizeKey]: Number.isNaN(nextVal) ? 0 : nextVal,
                              });
                            }}
                            className="w-full px-1.5 py-1 rounded-lg bg-white border border-slate-200 text-center text-xs font-mono-tabular text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}

              {/* Buyer / Club Inquiry Form */}
              {items.length > 0 && (
                <form id="quote-submit-form" onSubmit={handleSubmit} className="space-y-3 pt-4 border-t border-slate-200">
                  <h3 className="text-sm font-semibold text-slate-900">
                    Club, Academy or Brand Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={clubName}
                      onChange={(e) => setClubName(e.target.value)}
                      placeholder="Club / School / Brand Name"
                      className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Contact Person"
                      className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Shipping City / Country"
                      className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Custom crest placement or sample notes..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </form>
              )}
            </div>

            {/* Footer Totals (Quantity Only, Zero Pricing) */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-500">Total Units</div>
                <div className="text-lg font-bold font-mono-tabular text-slate-900">
                  {grandTotalQty} pcs
                </div>
              </div>
              <button
                type="submit"
                form="quote-submit-form"
                disabled={items.length === 0 || grandTotalQty === 0}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Submit Inquiry
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
