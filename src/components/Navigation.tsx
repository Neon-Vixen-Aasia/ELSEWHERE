import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, LogOut, Sliders } from 'lucide-react';
import { EnvironmentId } from '../types';
import { ENVIRONMENTS } from '../data/environments';

interface NavigationProps {
  currentEnv: EnvironmentId;
  onSelectEnv: (id: EnvironmentId) => void;
  audioEnabled: boolean;
  isMuted: boolean;
  volume: number;
  onToggleMute: () => void;
  onChangeVolume: (vol: number) => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  discoveredOdditiesCount: number;
  onOpenOddities: () => void;
  onOpenDeparture: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentEnv,
  onSelectEnv,
  audioEnabled,
  isMuted,
  volume,
  onToggleMute,
  onChangeVolume,
  reducedMotion,
  onToggleReducedMotion,
  discoveredOdditiesCount,
  onOpenOddities,
  onOpenDeparture
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const envList = Object.values(ENVIRONMENTS);

  return (
    <>
      {/* TOP BAR CONTRACT: Single text wordmark | 5 single-line nav links | Essential controls */}
      <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between gap-8 px-5 sm:px-8 py-3.5 bg-stone-950/40 backdrop-blur-md border-b border-white/10 select-none">
        {/* Zone 1: Brand wordmark (single element, whitespace-nowrap) */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xl font-serif tracking-widest text-[#f5f1ea] font-normal whitespace-nowrap">
            ELSEWHERE
          </span>
          <span className="hidden lg:inline text-xs text-[#d6cdbe]/60 font-serif italic">
            · {ENVIRONMENTS[currentEnv].era}
          </span>
        </div>

        {/* Zone 2: 5 Concise Environment links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-6 text-xs font-sans tracking-wide shrink-0"
          aria-label="Environments"
        >
          {envList.map(env => {
            const isActive = currentEnv === env.id;
            return (
              <button
                key={env.id}
                type="button"
                onClick={() => onSelectEnv(env.id as EnvironmentId)}
                className={`py-1 whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-[#f5f1ea] font-medium border-b border-[#f5f1ea]'
                    : 'text-[#d6cdbe]/70 hover:text-[#f5f1ea]'
                }`}
              >
                {env.name}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Functional Utilities (Audio, Oddities, Reduced Motion, Departure) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Audio HUD Popover / Toggle */}
          <div className="relative">
            <button
              type="button"
              onClick={onToggleMute}
              onMouseEnter={() => setShowVolumeSlider(true)}
              className="p-1.5 text-[#e5ded2]/80 hover:text-white rounded-xs transition-colors cursor-pointer"
              title={isMuted ? 'Unmute sound (M)' : 'Mute sound (M)'}
              aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
            >
              {isMuted || !audioEnabled ? (
                <VolumeX className="w-4 h-4 text-stone-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-200" />
              )}
            </button>

            {showVolumeSlider && !isMuted && audioEnabled && (
              <div
                onMouseLeave={() => setShowVolumeSlider(false)}
                className="absolute right-0 top-full mt-2 w-36 p-3 bg-stone-900/95 border border-stone-700/80 rounded-xs shadow-xl backdrop-blur-md z-50 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-[10px] text-stone-300 font-sans">
                  <span>Volume</span>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={e => onChangeVolume(parseFloat(e.target.value))}
                  className="w-full accent-amber-300 cursor-pointer h-1"
                />
              </div>
            )}
          </div>

          {/* Little Oddities Journal Trigger */}
          <button
            type="button"
            onClick={onOpenOddities}
            className="flex items-center gap-1.5 text-xs text-[#e5ded2]/80 hover:text-white transition-colors cursor-pointer px-2 py-1"
            title="Archival Journal of Little Oddities"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300/80" />
            <span className="hidden sm:inline font-serif italic text-xs">Oddities</span>
            {discoveredOdditiesCount > 0 && (
              <span className="text-[11px] font-mono text-amber-200">
                ({discoveredOdditiesCount})
              </span>
            )}
          </button>

          {/* Reduced Motion Setting */}
          <button
            type="button"
            onClick={onToggleReducedMotion}
            className={`px-2 py-1 text-[11px] font-sans rounded-xs transition-colors cursor-pointer border ${
              reducedMotion
                ? 'border-amber-400/50 text-amber-200 bg-amber-950/30'
                : 'border-transparent text-[#d6cdbe]/60 hover:text-white'
            }`}
            title="Toggle reduced motion"
          >
            {reducedMotion ? 'Calm' : 'Motion'}
          </button>

          {/* Exit / Gentle Departure */}
          <button
            type="button"
            onClick={onOpenDeparture}
            className="p-1.5 text-[#d6cdbe]/70 hover:text-white transition-colors cursor-pointer"
            title="Gentle departure"
            aria-label="Gentle departure"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile Environments Drawer Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="md:hidden p-1.5 text-[#e5ded2] transition-colors"
            aria-label="Toggle environment menu"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* MOBILE ENVIRONMENTS MENU */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-x-0 top-[52px] z-30 bg-stone-950/90 backdrop-blur-md border-b border-stone-800 p-4 md:hidden flex flex-col gap-2.5 animate-in slide-in-from-top-2"
        >
          <div className="text-[10px] uppercase font-mono tracking-widest text-stone-400 mb-1">
            Choose Sanctuary
          </div>
          {envList.map(env => (
            <button
              key={env.id}
              type="button"
              onClick={() => {
                onSelectEnv(env.id as EnvironmentId);
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 px-3 text-xs font-serif rounded-xs flex items-center justify-between ${
                currentEnv === env.id
                  ? 'bg-amber-950/40 text-amber-200 font-medium'
                  : 'text-stone-300 hover:bg-stone-900'
              }`}
            >
              <span>{env.name}</span>
              <span className="text-[10px] font-sans text-stone-500 italic">
                {env.subtitle}
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
};
