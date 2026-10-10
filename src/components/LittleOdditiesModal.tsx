import React from 'react';
import { Oddity } from '../types';
import { INITIAL_ODDITIES } from '../data/environments';

interface LittleOdditiesModalProps {
  discoveredIds: string[];
  onClose: () => void;
}

export const LittleOdditiesModal: React.FC<LittleOdditiesModalProps> = ({
  discoveredIds,
  onClose
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 animate-in fade-in select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#faf7f2] text-stone-800 p-8 rounded-sm border border-stone-300 shadow-2xl font-serif"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-6">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-stone-400 font-sans">
              Archival Notes
            </div>
            <h3 className="text-2xl font-serif text-stone-900 font-normal">
              Little Oddities
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-800 text-sm font-sans px-2 py-1"
          >
            ✕ Close
          </button>
        </div>

        <p className="text-xs font-sans text-stone-500 mb-6 italic leading-relaxed">
          Small, quiet occurrences noted in the margins. You do not need to uncover every one; they happen whether or not anyone is looking.
        </p>

        <div className="space-y-4">
          {INITIAL_ODDITIES.map(oddity => {
            const isDiscovered = discoveredIds.includes(oddity.id);
            return (
              <div
                key={oddity.id}
                className={`p-4 rounded-xs border transition-all duration-300 ${
                  isDiscovered
                    ? 'bg-amber-50/60 border-amber-800/15 text-stone-800'
                    : 'bg-stone-100/50 border-stone-200 text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-serif text-stone-900">
                    {isDiscovered ? oddity.title : 'An Unnamed Occurrence'}
                  </span>
                  <span className="text-[10px] font-sans tracking-wide uppercase text-stone-400">
                    {oddity.environmentId.replace('-', ' ')}
                  </span>
                </div>
                <p className="text-xs leading-relaxed italic text-stone-600">
                  {isDiscovered
                    ? `"${oddity.description}"`
                    : 'A quiet secret waiting in this realm. No hurry to find it.'}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-stone-200 text-center">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 text-stone-100 text-xs font-sans rounded-xs hover:bg-stone-900 transition-colors"
          >
            Return to sanctuary
          </button>
        </div>
      </div>
    </div>
  );
};
