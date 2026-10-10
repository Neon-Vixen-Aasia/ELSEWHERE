import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface ArrivalScreenProps {
  onEnter: (withSound: boolean) => void;
  reducedMotion: boolean;
}

export const ArrivalScreen: React.FC<ArrivalScreenProps> = ({
  onEnter,
  reducedMotion
}) => {
  const [isCrossingThreshold, setIsCrossingThreshold] = useState<boolean>(false);

  const handleEnter = (withSound: boolean) => {
    setIsCrossingThreshold(true);
    setTimeout(() => {
      onEnter(withSound);
    }, reducedMotion ? 250 : 850);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center select-none overflow-hidden transition-all duration-1000 ${
        isCrossingThreshold ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      style={{ backgroundColor: '#0d0f14' }}
    >
      {/* Background dream sanctuary threshold image */}
      <img
        src="/src/assets/images/scene_quiet_room_1791619418918.jpg"
        alt="Sanctuary entrance threshold"
        referrerPolicy="no-referrer"
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-2000 ${
          reducedMotion ? 'filter brightness-60' : 'filter brightness-65 scale-105'
        }`}
      />

      {/* Atmospheric warm veil */}
      <div className="absolute inset-0 bg-radial from-transparent via-stone-950/40 to-stone-950/85" />

      {/* Subtle billowing curtain threshold accents */}
      <div
        className={`absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-stone-900/60 to-transparent pointer-events-none ${
          reducedMotion ? '' : 'animate-curtain'
        }`}
      />
      <div
        className={`absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-stone-900/60 to-transparent pointer-events-none ${
          reducedMotion ? '' : 'animate-curtain'
        }`}
      />

      {/* Central Sanctuary Gateway Typography & Entry Options */}
      <div className="relative z-10 max-w-xl mx-auto px-6 text-center text-[#f2eee6]">
        {/* Monospace era coordinate */}
        <div className="text-[11px] font-mono tracking-widest text-[#d4cbb8]/70 uppercase mb-4">
          Threshold · Beyond Ordinary Time
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-7xl font-serif font-normal tracking-wide text-[#faf7f0] mb-3 drop-shadow-md">
          ELSEWHERE
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl font-serif italic text-[#dfd8ca] mb-8 font-light tracking-wide">
          A little place outside ordinary time.
        </p>

        {/* Gentle Invitation */}
        <p className="text-sm font-sans text-[#c8bfb0] mb-10 max-w-sm mx-auto leading-relaxed">
          Stay for a moment. Wander between impossible rooms, touch water, open windows, and rest.
        </p>

        {/* Entry Options (Strict anti-slop: clean buttons, clear purpose, explains audio policy) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            type="button"
            onClick={() => handleEnter(true)}
            className="w-full sm:w-auto px-6 py-3.5 bg-[#f6f2ea] text-stone-900 hover:bg-white text-xs font-sans font-medium tracking-wider uppercase rounded-xs transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-stone-700" />
            <span>Enter with sound</span>
          </button>

          <button
            type="button"
            onClick={() => handleEnter(false)}
            className="w-full sm:w-auto px-6 py-3.5 bg-stone-900/70 hover:bg-stone-900 text-[#ded7cb] hover:text-white border border-stone-600/60 text-xs font-sans font-medium tracking-wider uppercase rounded-xs transition-all duration-300 backdrop-blur-xs flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <VolumeX className="w-4 h-4 text-stone-400" />
            <span>Enter silently</span>
          </button>
        </div>

        {/* Audio note explanation */}
        <div className="mt-6 text-[11px] text-[#b0a797]/75 font-sans">
          Audio features generative ambient pads and responsive instruments. You may mute at any time.
        </div>
      </div>
    </div>
  );
};
