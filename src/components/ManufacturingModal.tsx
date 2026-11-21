import React from 'react';
import { X } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface ManufacturingModalProps {
  open: boolean;
  onClose: () => void;
  onOpenQuote: () => void;
}

const CAPABILITIES = [
  {
    title: '01. Full Dye Sublimation & Cut-and-Sew',
    detail:
      'Zero-fade Italian ink sublimation across front, back, collar, and sleeve panels with 4-needle flatlock seams built for high-contact match play.',
    spec: '300+ Custom Pantone Matches · Zero Peeling',
  },
  {
    title: '02. Sportswear & Streetwear Fabric Library',
    detail:
      'In-house knitting and GSM calibration across 130gsm Micro-Mesh, 160gsm Dry-Fit Interlock, 420gsm Washed French Terry, and 500gsm Varsity Melton Wool.',
    spec: 'Moisture-Wicking · Enzyme Wash · Heavy Fleece',
  },
  {
    title: '03. Crests, Chenille Embroidery & Hardware',
    detail:
      'Raised 3D silicone GS heat-transfers, boucle chenille streetwear patches, YKK concealed zippers, and bar-tack reinforced stress points.',
    spec: 'Sample Dispatch in 7 Days · Bulk in 14–21 Days',
  },
  {
    title: '04. Global B2B Supply & Private Label',
    detail:
      'Dedicated factory-direct export supply for clubs, academies, streetwear labels, and retailers with custom hangtags and polybag packaging.',
    spec: 'Low MOQ from 12–15 Units · DHL / FedEx Air Cargo',
  },
];

export const ManufacturingModal: React.FC<ManufacturingModalProps> = ({
  open,
  onClose,
  onOpenQuote,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4 md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Gemini Sports Manufacturing Capabilities"
    >
      <div className="w-full max-w-4xl max-h-[88vh] rounded-2xl bg-white border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <BrandLogo variant="light" size="sm" />
            <p className="text-xs text-slate-500">
              Direct-from-factory sportswear &amp; streetwear production · OEM, ODM, and custom teamwear supply
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close manufacturing details"
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* 4-column factory metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="text-2xl font-bold font-mono-tabular text-slate-900">10+</div>
              <div className="text-xs text-slate-500 mt-0.5">Sport Disciplines</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono-tabular text-slate-900">15 pcs</div>
              <div className="text-xs text-slate-500 mt-0.5">Minimum Order Qty</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono-tabular text-slate-900">7 Days</div>
              <div className="text-xs text-slate-500 mt-0.5">Custom Sample Turnaround</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono-tabular text-slate-900">99.4%</div>
              <div className="text-xs text-slate-500 mt-0.5">AQL Seam Inspection Pass</div>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CAPABILITIES.map((cap) => (
              <div key={cap.title} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <h3 className="text-sm font-semibold text-slate-900">{cap.title}</h3>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">{cap.detail}</p>
                <p className="mt-2.5 text-xs font-medium text-slate-800">{cap.spec}</p>
              </div>
            ))}
          </div>

          {/* Production Turnaround Table */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">
              Production Turnaround &amp; Order Scale
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <th className="py-2.5 px-4 font-semibold">Production Run</th>
                    <th className="py-2.5 px-4 font-semibold">Finishing &amp; Labeling</th>
                    <th className="py-2.5 px-4 font-semibold">Lead Time</th>
                    <th className="py-2.5 px-4 font-semibold">Best For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="text-slate-800">
                    <td className="py-2.5 px-4 font-semibold">Team Capsule</td>
                    <td className="py-2.5 px-4">Custom Crests &amp; Squad Numbers</td>
                    <td className="py-2.5 px-4 font-mono-tabular">12 – 16 Days</td>
                    <td className="py-2.5 px-4 text-slate-500">Club &amp; streetwear drops</td>
                  </tr>
                  <tr className="text-slate-800">
                    <td className="py-2.5 px-4 font-semibold">Academy Run</td>
                    <td className="py-2.5 px-4">Full S–XXL Grading + Pre-Sample</td>
                    <td className="py-2.5 px-4 font-mono-tabular">14 – 18 Days</td>
                    <td className="py-2.5 px-4 text-slate-500">League &amp; capsule orders</td>
                  </tr>
                  <tr className="text-slate-800">
                    <td className="py-2.5 px-4 font-semibold">Global OEM</td>
                    <td className="py-2.5 px-4">Private-Label Woven Tags &amp; Packaging</td>
                    <td className="py-2.5 px-4 font-mono-tabular">18 – 24 Days</td>
                    <td className="py-2.5 px-4 text-slate-500">Distributors &amp; apparel labels</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
          <span className="text-xs text-slate-500">
            Worldwide courier &amp; sea freight dispatch · Custom tech-pack support included
          </span>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenQuote();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer"
          >
            Open Inquiry Bag
          </button>
        </div>
      </div>
    </div>
  );
};
