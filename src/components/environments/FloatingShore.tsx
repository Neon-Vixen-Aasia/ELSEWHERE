import React, { useState } from 'react';
import { WhisperData } from '../../types';
import { audioEngine } from '../../services/audioEngine';
import { particleEngine } from '../../services/particleEngine';
import { WaterSurface } from '../WaterSurface';

interface FloatingShoreProps {
  reducedMotion: boolean;
  onDiscoverOddity: (id: string) => void;
  onHoverWhisper?: (whisper: WhisperData | null) => void;
}

export const FloatingShore: React.FC<FloatingShoreProps> = ({
  reducedMotion,
  onDiscoverOddity,
  onHoverWhisper
}) => {
  const [skyTone, setSkyTone] = useState<'twilight' | 'dawn' | 'dusk'>('twilight');
  const [monolithPulse, setMonolithPulse] = useState<boolean>(false);
  const [capsuleDiscovered, setCapsuleDiscovered] = useState<boolean>(false);
  const [memoryModalOpen, setMemoryModalOpen] = useState<boolean>(false);

  // 1. Monolith Interaction (Tapping the floating structure)
  const handleMonolithTouch = (e: React.PointerEvent) => {
    setMonolithPulse(true);
    audioEngine.playGlassResonance(155.56, 0.14); // Deep resonant Eb tone
    particleEngine.emitLuminousDust(e.clientX, e.clientY, 28, '#ecd7ba');

    // Cycle sky tone
    setSkyTone(prev => {
      if (prev === 'twilight') return 'dawn';
      if (prev === 'dawn') return 'dusk';
      return 'twilight';
    });

    setTimeout(() => setMonolithPulse(false), 2400);
  };

  // 2. Memory Capsule (Floating stone in the shallows)
  const handleCapsuleTouch = (e: React.PointerEvent) => {
    if (!capsuleDiscovered) {
      setCapsuleDiscovered(true);
      audioEngine.playOddityDiscovery();
      particleEngine.emitLuminousDust(e.clientX, e.clientY, 32, '#c4d8e8');
      onDiscoverOddity('floating-capsule');
    } else {
      audioEngine.playWaterRipple(1.1);
      particleEngine.emitWaterDroplets(e.clientX, e.clientY, 6);
    }
    setMemoryModalOpen(true);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Background Artwork */}
      <img
        src="/src/assets/images/scene_floating_shore_1791619441493.jpg"
        alt="The Floating Shoreline"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover transition-filter duration-1000"
        style={{
          filter:
            skyTone === 'dawn'
              ? 'sepia(0.12) hue-rotate(-8deg) brightness(1.05)'
              : skyTone === 'dusk'
              ? 'hue-rotate(18deg) saturate(1.12)'
              : 'none'
        }}
      />

      {/* Dynamic Lighting Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundColor:
            skyTone === 'dawn'
              ? 'rgba(255, 238, 214, 0.14)'
              : skyTone === 'dusk'
              ? 'rgba(196, 172, 214, 0.18)'
              : 'rgba(230, 225, 235, 0.08)'
        }}
      />

      {/* Monolith Harmonic Radial Wave */}
      {monolithPulse && (
        <div className="absolute top-[38%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/40 pointer-events-none animate-ping opacity-35" />
      )}

      {/* Horizon Sky Zone (Whisper) */}
      <div
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "Where the sky and the sea agree to forget where they meet.", source: "Distant Horizon" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute top-0 left-0 w-full h-[28%] z-10"
      />

      {/* 1. FLOATING ARCHITECTURAL MONOLITH HOTSPOT */}
      <div
        onPointerDown={handleMonolithTouch}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "An architecture built not to shelter bodies, but to hold the echoes of quiet thoughts.", source: "Suspended Monolith" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute top-[30%] left-[36%] w-[28%] h-[24%] z-20 cursor-pointer group flex items-center justify-center"
        title="Touch the suspended structure to shift the horizon"
      >
        <div className="opacity-0 group-hover:opacity-85 transition-opacity text-xs font-serif italic text-stone-800 bg-white/70 px-3 py-1 rounded-sm shadow-xs backdrop-blur-xs">
          suspended structure · {skyTone}
        </div>
      </div>

      {/* 2. FLOATING MEMORY STONE (In the rock shallows) */}
      <div
        onPointerDown={handleCapsuleTouch}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "A pebble carried in a winter pocket until it grew smooth as salt.", source: "Memory Stone" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute bottom-[28%] right-[22%] w-[12%] h-[12%] z-20 cursor-pointer group flex items-center justify-center"
        title="Touch the weathered memory stone"
      >
        <div
          className={`w-7 h-7 rounded-full border border-white/50 backdrop-blur-xs shadow-md transition-all duration-700 flex items-center justify-center ${
            capsuleDiscovered ? 'bg-indigo-100/40 animate-pulse' : 'bg-white/20 hover:bg-white/40'
          }`}
        >
          <span className="text-[10px] text-stone-700">◌</span>
        </div>
        <div className="absolute -top-7 opacity-0 group-hover:opacity-85 transition-opacity text-[11px] font-serif italic text-stone-800 bg-white/80 px-2 py-0.5 rounded-sm shadow-xs whitespace-nowrap">
          memory of still tide
        </div>
      </div>

      {/* 3. SIGNATURE WATER SURFACE: FULL VAST REFLECTIVE WATER REGION */}
      <div
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "The tide here never recedes; it only listens to whatever you let fall into it.", source: "Reflective Tide" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute bottom-0 left-0 w-full h-[62%] z-10"
      >
        <WaterSurface
          tint="rgba(235, 245, 255, 0.42)"
          reducedMotion={reducedMotion}
          className="w-full h-full"
        />
        {/* Subtle prompt hint that fades */}
        <div className="absolute bottom-6 left-8 pointer-events-none text-stone-700/60 font-serif text-xs italic tracking-wide">
          touch or drag across the water surface to create ripples
        </div>
      </div>

      {/* MEMORY MODAL */}
      {memoryModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-xs p-4"
          onClick={() => setMemoryModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#faf8f5] text-stone-800 p-6 rounded-sm border border-stone-300 shadow-xl font-serif"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-[11px] uppercase tracking-widest text-stone-400 font-sans mb-1">
              Floating Shore · Oddity
            </div>
            <h4 className="text-xl font-serif text-stone-900 mb-3">
              Memory of Still Tide
            </h4>
            <p className="text-stone-600 text-sm leading-relaxed italic mb-6">
              "The shoreline does not move toward the water, and the water does not withdraw from the stone. For an entire afternoon, you sat here without needing to become someone else."
            </p>
            <button
              type="button"
              onClick={() => setMemoryModalOpen(false)}
              className="px-4 py-1.5 bg-stone-800 text-stone-100 text-xs font-sans rounded-xs hover:bg-stone-900 transition-colors"
            >
              Return to water
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
