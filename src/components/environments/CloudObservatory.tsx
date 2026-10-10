import React, { useState } from 'react';
import { EnvironmentId, WhisperData } from '../../types';
import { audioEngine } from '../../services/audioEngine';
import { particleEngine } from '../../services/particleEngine';

interface CloudObservatoryProps {
  reducedMotion: boolean;
  onDiscoverOddity: (id: string) => void;
  onNavigateToEnv?: (envId: EnvironmentId) => void;
  onHoverWhisper?: (whisper: WhisperData | null) => void;
}

export const CloudObservatory: React.FC<CloudObservatoryProps> = ({
  reducedMotion,
  onDiscoverOddity,
  onNavigateToEnv,
  onHoverWhisper
}) => {
  const [sphereRotation, setSphereRotation] = useState<number>(0);
  const [sphereModalOpen, setSphereModalOpen] = useState<boolean>(false);
  const [sphereDiscovered, setSphereDiscovered] = useState<boolean>(false);
  const [skyExposure, setSkyExposure] = useState<'morning' | 'solar' | 'aurora'>('morning');
  const [cloudPuffCount, setCloudPuffCount] = useState<number>(0);

  // 1. Interactive Glass Sphere (Orrery of Lost Hours)
  const handleSphereTouch = (e: React.PointerEvent) => {
    audioEngine.playGlassResonance(739.99, 0.15); // Pure glass tone
    particleEngine.emitLuminousDust(e.clientX, e.clientY, 32, '#d4ecfc');
    setSphereRotation(prev => prev + 60);

    if (!sphereDiscovered) {
      setSphereDiscovered(true);
      audioEngine.playOddityDiscovery();
      onDiscoverOddity('miniature-world-sphere');
    }

    setSphereModalOpen(true);
  };

  // 2. Interactive Sea of Clouds (Left Window)
  const handleCloudTouch = (e: React.PointerEvent) => {
    audioEngine.playCurtainBreeze();
    particleEngine.emitLuminousDust(e.clientX, e.clientY, 20, '#ffffff');
    setCloudPuffCount(prev => prev + 1);
  };

  // 3. Arched Window Shutter
  const handleArchWindowTouch = (e: React.PointerEvent) => {
    audioEngine.playLampClick();
    particleEngine.emitLuminousDust(e.clientX, e.clientY, 14, '#e6f3ff');
    setSkyExposure(prev => {
      if (prev === 'morning') return 'solar';
      if (prev === 'solar') return 'aurora';
      return 'morning';
    });
  };

  // 4. Staircase Reflection (Portal to Night Window)
  const handleStaircaseTouch = (e: React.PointerEvent) => {
    audioEngine.playGlassResonance(587.33, 0.08);
    particleEngine.emitLuminousDust(e.clientX, e.clientY, 18, '#d9e2ec');
    if (onNavigateToEnv) {
      onNavigateToEnv('night-window');
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Background Artwork */}
      <img
        src="/src/assets/images/scene_cloud_observatory_1791619452290.jpg"
        alt="The Cloud Observatory"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
        style={{
          filter:
            skyExposure === 'solar'
              ? 'brightness(1.08) saturate(1.1)'
              : skyExposure === 'aurora'
              ? 'hue-rotate(-15deg) contrast(1.05)'
              : 'none'
        }}
      />

      {/* Atmospheric Exposure Tint */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          backgroundColor:
            skyExposure === 'solar'
              ? 'rgba(255, 248, 220, 0.12)'
              : skyExposure === 'aurora'
              ? 'rgba(215, 230, 255, 0.16)'
              : 'rgba(235, 240, 248, 0.06)'
        }}
      />

      {/* 1. CENTRAL GLASS SPHERE ON THE PEDESTAL */}
      <div
        onPointerDown={handleSphereTouch}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "A miniature world spinning to the heartbeat of an hour that never ended.", source: "The Orrery Sphere" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute bottom-[28%] left-[45%] w-[12%] h-[20%] z-20 cursor-pointer group flex items-center justify-center"
        title="Inspect the glass sphere on the pedestal"
      >
        <div
          className="relative w-16 h-16 rounded-full border border-white/60 bg-white/20 backdrop-blur-xs shadow-2xl flex items-center justify-center transition-transform duration-700"
          style={{ transform: `rotate(${sphereRotation}deg)` }}
        >
          {/* Swirling miniature ring inside */}
          <div className="w-10 h-10 rounded-full border border-sky-200/50 animate-spin" style={{ animationDuration: '12s' }} />
          <div className="absolute w-2 h-2 rounded-full bg-white/80 shadow-xs" />
        </div>
        <div className="absolute -top-7 opacity-0 group-hover:opacity-90 transition-opacity text-xs font-serif italic text-stone-800 bg-white/85 px-3 py-1 rounded-sm shadow-xs backdrop-blur-xs whitespace-nowrap">
          the crystal sphere · inspect
        </div>
      </div>

      {/* 2. CLOUD SEA (Left Arched Window) */}
      <div
        onPointerDown={handleCloudTouch}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "Beneath this mist lies every town you dreamed of moving to when you were seventeen.", source: "Sea of Clouds" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute top-[20%] left-[8%] w-[26%] h-[55%] z-10 cursor-pointer group flex items-center justify-center"
        title="Touch the sea of clouds"
      >
        <div className="opacity-0 group-hover:opacity-65 transition-opacity text-xs font-serif italic text-stone-700 bg-white/65 px-2.5 py-1 rounded-sm">
          soften cloud mist ({cloudPuffCount})
        </div>
      </div>

      {/* 3. CENTER ARCHED WINDOW SHUTTER */}
      <div
        onPointerDown={handleArchWindowTouch}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "An aperture tuned to catch the light of mornings that haven't arrived yet.", source: "Observatory Aperture" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute top-[12%] left-[41%] w-[18%] h-[35%] z-10 cursor-pointer group flex flex-col items-center justify-start pt-4"
        title="Shift observatory exposure"
      >
        <div className="opacity-0 group-hover:opacity-75 transition-opacity text-[11px] font-serif italic text-stone-700 bg-white/70 px-2 py-0.5 rounded-sm">
          aperture: {skyExposure}
        </div>
      </div>

      {/* 4. SPIRAL STAIRWAY PASSAGE (Right Arcade) */}
      <div
        onPointerDown={handleStaircaseTouch}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "Steps that lead only to other rooms that smell of cedar and moonlight.", source: "Spiral Passage" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute top-[25%] right-[6%] w-[18%] h-[55%] z-10 cursor-pointer group flex items-center justify-center"
        title="Stairway passage to the Night Window"
      >
        <div className="opacity-0 group-hover:opacity-85 transition-opacity text-xs font-serif italic text-stone-800 bg-slate-900/80 text-white px-2.5 py-1 rounded-sm shadow-md">
          spiral stairway · descend to night
        </div>
      </div>

      {/* SPHERE INSPECTION MODAL */}
      {sphereModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/65 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setSphereModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#f6f9fc] text-stone-800 p-8 rounded-sm border border-stone-300 shadow-2xl font-serif text-center"
            onClick={e => e.stopPropagation()}
          >
            {/* Miniature World Canvas Animation inside */}
            <div className="mx-auto w-28 h-28 rounded-full border border-sky-300/60 bg-gradient-to-tr from-sky-900/10 via-amber-100/20 to-sky-100/30 shadow-inner flex items-center justify-center mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-transparent to-stone-900/15" />
              <span className="text-2xl text-sky-700/80 animate-pulse">✦</span>
            </div>

            <div className="text-[11px] uppercase tracking-widest text-stone-400 font-sans mb-1">
              Cloud Observatory · Oddity
            </div>
            <h4 className="text-2xl font-serif text-stone-900 mb-3">
              The Encapsulated Valley
            </h4>
            <p className="text-stone-600 text-sm leading-relaxed italic mb-6">
              "Inside the sphere, an impossible valley turns upon an invisible axis. Tiny lanterns are lit one by one at dusk, even though there is no sunset inside glass."
            </p>
            <button
              type="button"
              onClick={() => setSphereModalOpen(false)}
              className="px-5 py-1.5 bg-stone-800 text-stone-100 text-xs font-sans rounded-xs hover:bg-stone-900 transition-colors"
            >
              Return to observatory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
