import React, { useState, useEffect } from 'react';
import { WhisperData } from '../../types';
import { audioEngine } from '../../services/audioEngine';
import { particleEngine } from '../../services/particleEngine';

interface NightWindowProps {
  reducedMotion: boolean;
  onDiscoverOddity: (id: string) => void;
  onHoverWhisper?: (whisper: WhisperData | null) => void;
}

export const NightWindow: React.FC<NightWindowProps> = ({
  reducedMotion,
  onDiscoverOddity,
  onHoverWhisper
}) => {
  const [lampState, setLampState] = useState<'warm' | 'soft' | 'moonlit'>('warm');
  const [constellationRevealed, setConstellationRevealed] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isSettled, setIsSettled] = useState<boolean>(false);

  // Stillness / settling timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSettled(true);
    }, 9000);

    const resetTimer = () => {
      setIsSettled(false);
    };

    window.addEventListener('pointerdown', resetTimer);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('pointerdown', resetTimer);
    };
  }, [isSettled]);

  // 1. Lamp Switch
  const handleLampToggle = (e: React.PointerEvent) => {
    audioEngine.playLampClick();
    particleEngine.emitLuminousDust(e.clientX, e.clientY, 14, '#ffda9e');

    setLampState(prev => {
      if (prev === 'warm') return 'soft';
      if (prev === 'soft') return 'moonlit';
      return 'warm';
    });
  };

  // 2. Steamed Windowpane Wipe
  const handleWindowWipe = (e: React.PointerEvent) => {
    audioEngine.playCurtainBreeze();
    particleEngine.emitLuminousDust(e.clientX, e.clientY, 20, '#d8e5f2');

    if (!constellationRevealed) {
      setConstellationRevealed(true);
      audioEngine.playOddityDiscovery();
      onDiscoverOddity('inverted-constellation');
    }
  };

  // 3. Desk Drawer
  const handleDrawerOpen = (e: React.PointerEvent) => {
    audioEngine.playPaperTurn();
    particleEngine.emitLuminousDust(e.clientX, e.clientY, 10, '#c7a977');
    onDiscoverOddity('brass-watch');
    setDrawerOpen(true);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Background Artwork */}
      <img
        src="/src/assets/images/scene_night_window_1791619463127.jpg"
        alt="The Night Window"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover transition-filter duration-1000"
        style={{
          filter:
            lampState === 'moonlit'
              ? 'brightness(0.85) contrast(1.1) saturate(0.85)'
              : lampState === 'soft'
              ? 'brightness(0.92) sepia(0.08)'
              : 'none'
        }}
      />

      {/* Dynamic Lighting Overlay from Lamp State */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundColor:
            lampState === 'warm'
              ? 'rgba(255, 175, 80, 0.12)'
              : lampState === 'soft'
              ? 'rgba(215, 140, 60, 0.08)'
              : 'rgba(20, 35, 65, 0.22)'
        }}
      />

      {/* Constellation Overlay upon wiping */}
      {constellationRevealed && (
        <svg
          className="absolute top-[12%] left-[34%] w-[32%] h-[35%] pointer-events-none z-15 animate-in fade-in duration-1000"
          viewBox="0 0 200 200"
        >
          {/* Key Constellation Lines */}
          <line x1="60" y1="50" x2="110" y2="70" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="110" y1="70" x2="140" y2="120" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="140" y1="120" x2="90" y2="140" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="90" y1="140" x2="60" y2="50" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" strokeDasharray="3 3" />
          
          <circle cx="60" cy="50" r="2.5" fill="#ffffff" />
          <circle cx="110" cy="70" r="2" fill="#ffd899" />
          <circle cx="140" cy="120" r="2.8" fill="#ffffff" />
          <circle cx="90" cy="140" r="2" fill="#b0d4f5" />
        </svg>
      )}

      {/* 1. BRASS DESK LAMP (Left Desk) */}
      <div
        onPointerDown={handleLampToggle}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "Warm light that creates an island five feet wide against the entire night.", source: "Brass Desk Lamp" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute bottom-[28%] left-[12%] w-[15%] h-[32%] z-20 cursor-pointer group flex items-center justify-center"
        title="Adjust desk lamp"
      >
        <div className="opacity-0 group-hover:opacity-90 transition-opacity text-xs font-serif italic text-stone-900 bg-amber-100/90 px-3 py-1 rounded-sm shadow-xs backdrop-blur-xs whitespace-nowrap">
          lamp: {lampState === 'warm' ? 'amber glow' : lampState === 'soft' ? 'soft ember' : 'moonlight'}
        </div>
      </div>

      {/* 2. STEAMED WINDOWPANE & NIGHT SKY (Center Window) */}
      <div
        onPointerDown={handleWindowWipe}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "Condensation formed by breathing the cold night air of an impossible valley.", source: "Steamed Casement" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute top-[10%] left-[32%] w-[38%] h-[55%] z-15 cursor-pointer group flex items-center justify-center"
        title="Wipe condensation from the windowpane"
      >
        <div className="opacity-0 group-hover:opacity-75 transition-opacity text-xs font-serif italic text-stone-200 bg-slate-950/75 px-3 py-1 rounded-sm shadow-xs backdrop-blur-xs">
          {constellationRevealed ? 'constellation of the unhurried key' : 'wipe windowpane'}
        </div>
      </div>

      {/* 3. KEEPSAKE DESK DRAWER (Lower Left Desk) */}
      <div
        onPointerDown={handleDrawerOpen}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "Things preserved not for their value, but because they survived an ordinary day.", source: "Walnut Keepsake Drawer" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute bottom-[6%] left-[14%] w-[20%] h-[15%] z-20 cursor-pointer group flex items-center justify-center"
        title="Open desk drawer"
      >
        <div className="opacity-0 group-hover:opacity-90 transition-opacity text-xs font-serif italic text-stone-900 bg-amber-50/90 px-3 py-1 rounded-sm shadow-xs backdrop-blur-xs">
          open drawer · keepsakes
        </div>
      </div>

      {/* 4. OPEN NOTEPAD ON THE DESK */}
      <div
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "Notes written in pencil to a morning you weren't yet sure would come.", source: "Parchment Pad" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute bottom-[20%] left-[20%] w-[16%] h-[12%] z-15 cursor-pointer"
        title="Open notebook"
      />

      {/* Settled Quietude Indication */}
      {isSettled && (
        <div className="absolute bottom-6 right-8 pointer-events-none text-stone-400/50 font-serif text-xs italic tracking-wide transition-opacity duration-1000">
          the room has settled into quiet
        </div>
      )}

      {/* DRAWER MODAL */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/70 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setDrawerOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#181d29] text-stone-200 p-8 rounded-sm border border-stone-700/80 shadow-2xl font-serif"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-[11px] uppercase tracking-widest text-amber-300/70 font-sans mb-1">
              Night Window · Walnut Drawer
            </div>
            <h4 className="text-2xl font-serif text-stone-100 mb-4">
              The Keepsakes of 03:14
            </h4>

            <div className="space-y-4 text-sm leading-relaxed text-stone-300 italic mb-6">
              <div className="p-3 bg-stone-900/60 rounded-xs border border-stone-800 flex items-center gap-3">
                <span className="text-xl text-amber-400">⏱</span>
                <div>
                  <div className="font-sans text-xs text-amber-200/90 not-italic">Brass Pocket Watch</div>
                  <div>The secondhand breathes in place without ticking forward.</div>
                </div>
              </div>

              <div className="p-3 bg-stone-900/60 rounded-xs border border-stone-800 flex items-center gap-3">
                <span className="text-xl text-purple-300">🪻</span>
                <div>
                  <div className="font-sans text-xs text-stone-400 not-italic">Dried Lavender Sprig</div>
                  <div>Harvested from the Infinite Garden three seasons ago.</div>
                </div>
              </div>

              <p className="text-xs text-stone-400 pt-2 border-t border-stone-800">
                "The trains stopped running at midnight, but no one was trying to leave."
              </p>
            </div>

            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              className="px-4 py-1.5 bg-stone-800 text-stone-100 text-xs font-sans rounded-xs hover:bg-stone-700 transition-colors"
            >
              Slide drawer closed
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
