import React from 'react';

interface DepartureModalProps {
  onReturnToSanctuary: () => void;
  onExitToThreshold: () => void;
}

export const DepartureModal: React.FC<DepartureModalProps> = ({
  onReturnToSanctuary,
  onExitToThreshold
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/75 backdrop-blur-sm p-4 animate-in fade-in select-none"
      onClick={onReturnToSanctuary}
    >
      <div
        className="w-full max-w-md bg-[#faf7f0] text-stone-800 p-8 rounded-sm border border-stone-300 shadow-2xl font-serif text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-[11px] uppercase tracking-widest text-stone-400 font-sans mb-3">
          Gentle Departure
        </div>

        <h3 className="text-2xl font-serif text-stone-900 mb-4 font-normal">
          Nothing to finish.
        </h3>

        <p className="text-stone-600 text-sm leading-relaxed italic mb-8">
          "Just take a little quiet with you."
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onReturnToSanctuary}
            className="w-full sm:w-auto px-5 py-2.5 bg-stone-800 text-stone-100 hover:bg-stone-900 text-xs font-sans rounded-xs transition-colors"
          >
            Stay in sanctuary
          </button>

          <button
            type="button"
            onClick={onExitToThreshold}
            className="w-full sm:w-auto px-5 py-2.5 border border-stone-300 text-stone-700 hover:bg-stone-200/60 text-xs font-sans rounded-xs transition-colors"
          >
            Return to threshold
          </button>
        </div>
      </div>
    </div>
  );
};
