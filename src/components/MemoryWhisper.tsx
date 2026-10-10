import React from 'react';
import { WhisperData } from '../types';

interface MemoryWhisperProps {
  whisper: WhisperData | null;
  reducedMotion?: boolean;
}

export const MemoryWhisper: React.FC<MemoryWhisperProps> = ({
  whisper,
  reducedMotion = false
}) => {
  return (
    <div
      className={`fixed bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-all duration-700 px-4 w-full max-w-lg ${
        whisper
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-3'
      }`}
      aria-live="polite"
    >
      <div className="mx-auto bg-stone-950/75 backdrop-blur-md px-6 py-2.5 rounded-xs border border-stone-700/60 shadow-2xl text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300/60" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-amber-200/70">
            Memory Whisper {whisper?.source ? `· ${whisper.source}` : ''}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-300/60" />
        </div>
        <p className="font-serif italic text-sm sm:text-[15px] text-[#f5efe6] tracking-wide leading-relaxed">
          "{whisper?.text}"
        </p>
      </div>
    </div>
  );
};
