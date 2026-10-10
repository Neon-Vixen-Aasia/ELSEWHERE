import React, { useState } from 'react';
import { WhisperData } from '../../types';
import { audioEngine } from '../../services/audioEngine';
import { particleEngine } from '../../services/particleEngine';
import { CODEX_PAGES } from '../../data/environments';

interface QuietRoomProps {
  reducedMotion: boolean;
  onDiscoverOddity: (id: string) => void;
  onHoverWhisper?: (whisper: WhisperData | null) => void;
}

export const QuietRoom: React.FC<QuietRoomProps> = ({
  reducedMotion,
  onDiscoverOddity,
  onHoverWhisper
}) => {
  // Interactive state
  const [windowState, setWindowState] = useState<'open' | 'slight' | 'closed'>('open');
  const [curtainSway, setCurtainSway] = useState<number>(0);
  const [prismAngle, setPrismAngle] = useState<number>(0);
  const [codexOpen, setCodexOpen] = useState<boolean>(false);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [reflectionFound, setReflectionFound] = useState<boolean>(false);
  const [deskLightShift, setDeskLightShift] = useState<boolean>(false);

  // 1. Curtain Interaction
  const handleCurtainTouch = (e: React.PointerEvent) => {
    audioEngine.playCurtainBreeze();
    particleEngine.emitLuminousDust(e.clientX, e.clientY, 12, '#fff7ea');
    setCurtainSway(prev => (prev === 0 ? 12 : prev > 0 ? -10 : 0));
    setTimeout(() => setCurtainSway(0), 1800);
  };

  // 2. Window Latch Interaction
  const handleWindowToggle = (e: React.PointerEvent) => {
    audioEngine.playLampClick();
    particleEngine.emitLuminousDust(e.clientX, e.clientY, 8, '#f5e6cf');
    setWindowState(prev => {
      if (prev === 'open') return 'slight';
      if (prev === 'slight') return 'closed';
      return 'open';
    });
  };

  // 3. Prism Interaction
  const handlePrismClick = (e: React.PointerEvent) => {
    const freqs = [523.25, 659.25, 783.99, 1046.50];
    const chosenFreq = freqs[Math.floor(Math.random() * freqs.length)];
    audioEngine.playGlassResonance(chosenFreq, 0.1);
    particleEngine.emitLuminousDust(e.clientX, e.clientY, 16, '#ffeed4');
    setPrismAngle(prev => prev + 45);
    setDeskLightShift(prev => !prev);
  };

  // 4. Codex / Book Interaction
  const handleBookClick = () => {
    audioEngine.playPaperTurn();
    setCodexOpen(true);
  };

  const handleNextPage = () => {
    audioEngine.playPaperTurn();
    setActivePageIndex(prev => (prev + 1) % CODEX_PAGES.length);
  };

  const handlePrevPage = () => {
    audioEngine.playPaperTurn();
    setActivePageIndex(prev => (prev - 1 + CODEX_PAGES.length) % CODEX_PAGES.length);
  };

  // 5. Reflection Discovery
  const handleReflectionClick = (e: React.PointerEvent) => {
    if (!reflectionFound) {
      setReflectionFound(true);
      audioEngine.playOddityDiscovery();
      particleEngine.emitLuminousDust(e.clientX, e.clientY, 28, '#ffdf9e');
      onDiscoverOddity('cloud-ship');
    } else {
      audioEngine.playGlassResonance(880, 0.05);
      particleEngine.emitLuminousDust(e.clientX, e.clientY, 8, '#ffffff');
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Background Room Artwork */}
      <img
        src="/src/assets/images/scene_quiet_room_1791619418918.jpg"
        alt="The Quiet Room interior"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000"
        style={{
          transform: reducedMotion ? 'none' : `scale(${windowState === 'open' ? 1.02 : 1.0})`
        }}
      />

      {/* Dynamic Daylight Overlay from Window State */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundColor: '#ffeed6',
          opacity: windowState === 'open' ? 0.06 : windowState === 'slight' ? 0.12 : 0.02
        }}
      />

      {/* Prismatic Caustic Rainbow on the Desk */}
      <div
        className={`absolute bottom-[28%] left-[44%] w-36 h-10 pointer-events-none transition-all duration-700 blur-[2px] ${
          deskLightShift ? 'opacity-70 scale-110' : 'opacity-40 scale-100'
        }`}
        style={{
          background: 'linear-gradient(90deg, rgba(255,180,180,0.5), rgba(255,230,160,0.6), rgba(180,240,200,0.5), rgba(180,220,255,0.6), rgba(220,180,255,0.4))',
          transform: `rotate(${prismAngle * 0.4 - 15}deg)`
        }}
      />

      {/* INTERACTIVE HOTSPOTS */}

      {/* 1. Translucent Curtains (Left and Right interactive zones) */}
      <div
        onPointerDown={handleCurtainTouch}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "The linen remembers every afternoon when no one called your name.", source: "Ivory Curtains" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute top-0 left-0 w-[24%] h-full z-10 cursor-pointer group"
        title="Touch the linen curtain"
      >
        <div
          className={`w-full h-full transition-transform duration-1000 ease-out ${
            reducedMotion ? '' : 'animate-curtain'
          }`}
          style={{
            transform: `translateX(${curtainSway}px) skewX(${curtainSway * 0.3}deg)`
          }}
        >
          {/* Subtle curtain breeze shimmer hint */}
          <div className="absolute top-[40%] left-[30%] opacity-0 group-hover:opacity-60 transition-opacity text-xs font-serif italic text-stone-700 bg-white/70 px-2.5 py-1 rounded-sm shadow-xs backdrop-blur-xs">
            flutter curtain
          </div>
        </div>
      </div>

      <div
        onPointerDown={handleCurtainTouch}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "The fabric sways even when the air outside holds its breath.", source: "Ivory Curtains" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute top-0 right-[15%] w-[18%] h-full z-10 cursor-pointer group"
        title="Touch the linen curtain"
      >
        <div
          className={`w-full h-full transition-transform duration-1000 ease-out ${
            reducedMotion ? '' : 'animate-curtain'
          }`}
          style={{
            transform: `translateX(${-curtainSway}px) skewX(${-curtainSway * 0.3}deg)`
          }}
        />
      </div>

      {/* 2. Window Latch & Sky Aperture */}
      <div
        onPointerDown={handleWindowToggle}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "Beyond this glass, time moves sideways rather than forward.", source: "The Open Arch" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute top-[8%] left-[42%] w-[20%] h-[32%] z-10 cursor-pointer group"
        title="Click to adjust window frame"
      >
        <div className="w-full h-full flex flex-col items-center justify-end pb-2">
          <div className="opacity-0 group-hover:opacity-75 transition-opacity text-xs font-serif italic text-stone-800 bg-amber-50/80 px-2 py-0.5 rounded-sm backdrop-blur-xs shadow-xs">
            {windowState === 'open' ? 'window: open to horizon' : windowState === 'slight' ? 'window: ajar' : 'window: quiet'}
          </div>
        </div>
      </div>

      {/* 3. Window Reflection (Oddity: Cloud Ship) */}
      <div
        onPointerDown={handleReflectionClick}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "If you look long enough, you can see the person you were before you learned to hurry.", source: "Window Reflection" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute top-[16%] left-[46%] w-[12%] h-[15%] z-10 cursor-pointer group"
        title="Inspect the reflection in the glass"
      >
        {reflectionFound && (
          <div className="absolute top-4 left-6 text-amber-200/90 text-sm tracking-widest animate-pulse pointer-events-none drop-shadow-sm font-serif italic">
            ⛵︎
          </div>
        )}
        <div className="opacity-0 group-hover:opacity-60 transition-opacity text-[11px] font-serif text-stone-700 bg-stone-100/70 px-1.5 py-0.5 rounded-sm text-center">
          {reflectionFound ? 'drifting vessel' : 'peer into glass'}
        </div>
      </div>

      {/* 4. Crystal Prism on the Desk */}
      <div
        onPointerDown={handlePrismClick}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "Light bent at forty-five degrees becomes a spectrum of things you forgot you loved.", source: "Glass Prism" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute bottom-[28%] left-[43%] w-[9%] h-[14%] z-20 cursor-pointer group flex items-center justify-center"
        title="Turn the glass prism"
      >
        <div
          className="w-10 h-10 border border-white/40 bg-white/20 backdrop-blur-xs rounded-xs shadow-lg transition-transform duration-500 flex items-center justify-center"
          style={{ transform: `rotate(${prismAngle}deg)` }}
        >
          <span className="text-white/80 text-xs">◆</span>
        </div>
        <div className="absolute -top-6 opacity-0 group-hover:opacity-80 transition-opacity text-xs font-serif text-stone-800 bg-amber-50/90 px-2 py-0.5 rounded-sm shadow-xs whitespace-nowrap">
          turn prism
        </div>
      </div>

      {/* 5. The Codex / Open Book on the Desk */}
      <div
        onPointerDown={handleBookClick}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "Every page was written with ink made from steeped chamomile and old letters.", source: "Codex of Forgotten Hours" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute bottom-[23%] left-[49%] w-[26%] h-[20%] z-20 cursor-pointer group flex items-center justify-center"
        title="Read the Codex of Forgotten Hours"
      >
        <div className="opacity-0 group-hover:opacity-90 transition-opacity text-xs font-serif tracking-wide text-stone-900 bg-amber-50/90 px-3 py-1 rounded-sm shadow-sm backdrop-blur-xs border border-amber-900/10">
          open journal · fragment {activePageIndex + 1}
        </div>
      </div>

      {/* CODEX READER MODAL */}
      {codexOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/65 backdrop-blur-sm p-4 animate-in fade-in duration-300"
          onClick={() => setCodexOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#faf7f0] text-stone-800 rounded-sm p-8 shadow-2xl border border-stone-300/80 font-serif"
            onClick={e => e.stopPropagation()}
          >
            {/* Ambient paper texture accent */}
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-1 font-sans">
              Codex of Forgotten Hours
            </div>
            <div className="text-stone-400 text-xs italic mb-4">
              {CODEX_PAGES[activePageIndex].date}
            </div>

            <h3 className="text-2xl font-serif font-normal text-stone-900 mb-4 border-b border-stone-200 pb-2">
              {CODEX_PAGES[activePageIndex].title}
            </h3>

            <p className="text-stone-700 text-base leading-relaxed mb-8 italic">
              "{CODEX_PAGES[activePageIndex].body}"
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-stone-200 text-xs font-sans text-stone-600">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handlePrevPage}
                  className="px-3 py-1.5 border border-stone-300 hover:bg-stone-200/50 rounded-xs transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextPage}
                  className="px-3 py-1.5 border border-stone-300 hover:bg-stone-200/50 rounded-xs transition-colors cursor-pointer"
                >
                  Next fragment
                </button>
              </div>

              <span className="text-stone-400">
                {activePageIndex + 1} of {CODEX_PAGES.length}
              </span>

              <button
                type="button"
                onClick={() => setCodexOpen(false)}
                className="px-4 py-1.5 bg-stone-800 text-stone-100 hover:bg-stone-900 rounded-xs transition-colors cursor-pointer"
              >
                Close journal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
