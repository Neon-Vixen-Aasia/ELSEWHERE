import React, { useState, useEffect, useCallback } from 'react';
import { EnvironmentId, WhisperData } from './types';
import { ENVIRONMENTS } from './data/environments';
import { audioEngine } from './services/audioEngine';
import { ArrivalScreen } from './components/ArrivalScreen';
import { ParticleCanvas } from './components/ParticleCanvas';
import { Navigation } from './components/Navigation';
import { DreamTransitions } from './components/DreamTransitions';
import { LittleOdditiesModal } from './components/LittleOdditiesModal';
import { DepartureModal } from './components/DepartureModal';
import { MemoryWhisper } from './components/MemoryWhisper';

// Five Environments
import { QuietRoom } from './components/environments/QuietRoom';
import { InfiniteGarden } from './components/environments/InfiniteGarden';
import { FloatingShore } from './components/environments/FloatingShore';
import { CloudObservatory } from './components/environments/CloudObservatory';
import { NightWindow } from './components/environments/NightWindow';

export default function App() {
  const [inArrival, setInArrival] = useState<boolean>(true);
  const [currentEnv, setCurrentEnv] = useState<EnvironmentId>('quiet-room');
  
  // Transition state
  const [transitionState, setTransitionState] = useState<{
    isTransitioning: boolean;
    targetEnv: EnvironmentId | null;
    type: 'curtain' | 'ripple' | 'mist' | 'aperture';
  }>({
    isTransitioning: false,
    targetEnv: null,
    type: 'curtain'
  });

  // Audio settings
  const [audioEnabled, setAudioEnabled] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.65);

  // Motion preference
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  // Discoveries
  const [discoveredOddities, setDiscoveredOddities] = useState<string[]>([]);
  const [recentOddityToast, setRecentOddityToast] = useState<string | null>(null);

  // Modals
  const [odditiesModalOpen, setOdditiesModalOpen] = useState<boolean>(false);
  const [departureModalOpen, setDepartureModalOpen] = useState<boolean>(false);

  // Active Memory Whisper
  const [activeWhisper, setActiveWhisper] = useState<WhisperData | null>(null);

  // Discovery handler
  const handleDiscoverOddity = useCallback((id: string) => {
    setDiscoveredOddities(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });

    setRecentOddityToast('A little oddity revealed itself.');
    setTimeout(() => {
      setRecentOddityToast(null);
    }, 4200);
  }, []);

  // Enter experience from Arrival Screen
  const handleEnterExperience = (withSound: boolean) => {
    setInArrival(false);
    if (withSound) {
      setAudioEnabled(true);
      setIsMuted(false);
      audioEngine.startAudio(currentEnv);
    } else {
      setAudioEnabled(false);
      setIsMuted(true);
    }
  };

  // Switch environment with appropriate dream transition
  const handleSelectEnv = useCallback((targetEnv: EnvironmentId) => {
    if (targetEnv === currentEnv || transitionState.isTransitioning) return;

    let transType: 'curtain' | 'ripple' | 'mist' | 'aperture' = 'curtain';
    if (targetEnv === 'floating-shore') transType = 'ripple';
    else if (targetEnv === 'cloud-observatory') transType = 'mist';
    else if (targetEnv === 'night-window') transType = 'aperture';
    else if (targetEnv === 'infinite-garden') transType = 'curtain';

    setTransitionState({
      isTransitioning: true,
      targetEnv,
      type: transType
    });
    setActiveWhisper(null);

    if (audioEnabled) {
      audioEngine.switchEnvironment(targetEnv);
    }
  }, [currentEnv, transitionState.isTransitioning, audioEnabled]);

  const handleTransitionComplete = () => {
    if (transitionState.targetEnv) {
      setCurrentEnv(transitionState.targetEnv);
    }
    setActiveWhisper(null);
    setTransitionState(prev => ({ ...prev, isTransitioning: false, targetEnv: null }));
  };

  // Audio controls
  const handleToggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);

    if (!nextMuted && !audioEnabled) {
      setAudioEnabled(true);
      audioEngine.startAudio(currentEnv);
    }
  }, [isMuted, audioEnabled, currentEnv]);

  const handleChangeVolume = (vol: number) => {
    setVolume(vol);
    audioEngine.setVolume(vol);
  };

  const handleToggleReducedMotion = () => {
    setReducedMotion(prev => !prev);
  };

  // Keyboard navigation & accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'Escape') {
        if (odditiesModalOpen) setOdditiesModalOpen(false);
        else if (departureModalOpen) setDepartureModalOpen(false);
        else if (!inArrival) setDepartureModalOpen(true);
      } else if (e.key.toLowerCase() === 'm') {
        handleToggleMute();
      } else if (e.key === '1') {
        handleSelectEnv('quiet-room');
      } else if (e.key === '2') {
        handleSelectEnv('infinite-garden');
      } else if (e.key === '3') {
        handleSelectEnv('floating-shore');
      } else if (e.key === '4') {
        handleSelectEnv('cloud-observatory');
      } else if (e.key === '5') {
        handleSelectEnv('night-window');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleToggleMute, handleSelectEnv, odditiesModalOpen, departureModalOpen, inArrival]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0c10] text-[#e8e4dc]">
      {/* 1. Global Particle Canvas (Dust motes, pollen, ripples, petals) */}
      <ParticleCanvas reducedMotion={reducedMotion} />

      {/* 2. Film Grain & Vignette */}
      <div className="film-grain" />
      <div className="vignette" />

      {/* 3. Stage A: Arrival Screen */}
      {inArrival && (
        <ArrivalScreen
          onEnter={handleEnterExperience}
          reducedMotion={reducedMotion}
        />
      )}

      {/* 4. Active Dream Environment */}
      <main className="w-full h-full relative" id="sanctuary-canvas">
        {currentEnv === 'quiet-room' && (
          <QuietRoom
            reducedMotion={reducedMotion}
            onDiscoverOddity={handleDiscoverOddity}
            onHoverWhisper={setActiveWhisper}
          />
        )}

        {currentEnv === 'infinite-garden' && (
          <InfiniteGarden
            reducedMotion={reducedMotion}
            onDiscoverOddity={handleDiscoverOddity}
            onHoverWhisper={setActiveWhisper}
          />
        )}

        {currentEnv === 'floating-shore' && (
          <FloatingShore
            reducedMotion={reducedMotion}
            onDiscoverOddity={handleDiscoverOddity}
            onHoverWhisper={setActiveWhisper}
          />
        )}

        {currentEnv === 'cloud-observatory' && (
          <CloudObservatory
            reducedMotion={reducedMotion}
            onDiscoverOddity={handleDiscoverOddity}
            onNavigateToEnv={handleSelectEnv}
            onHoverWhisper={setActiveWhisper}
          />
        )}

        {currentEnv === 'night-window' && (
          <NightWindow
            reducedMotion={reducedMotion}
            onDiscoverOddity={handleDiscoverOddity}
            onHoverWhisper={setActiveWhisper}
          />
        )}
      </main>

      {/* 5. Hover-based Memory Whisper HUD */}
      {!inArrival && (
        <MemoryWhisper
          whisper={activeWhisper}
          reducedMotion={reducedMotion}
        />
      )}

      {/* 6. Navigation & Interface Bar */}
      {!inArrival && (
        <Navigation
          currentEnv={currentEnv}
          onSelectEnv={handleSelectEnv}
          audioEnabled={audioEnabled}
          isMuted={isMuted}
          volume={volume}
          onToggleMute={handleToggleMute}
          onChangeVolume={handleChangeVolume}
          reducedMotion={reducedMotion}
          onToggleReducedMotion={handleToggleReducedMotion}
          discoveredOdditiesCount={discoveredOddities.length}
          onOpenOddities={() => setOdditiesModalOpen(true)}
          onOpenDeparture={() => setDepartureModalOpen(true)}
        />
      )}

      {/* 6. Dream Scene Transitions */}
      <DreamTransitions
        isTransitioning={transitionState.isTransitioning}
        transitionType={transitionState.type}
        reducedMotion={reducedMotion}
        onTransitionComplete={handleTransitionComplete}
      />

      {/* 7. Little Oddity Notification Toast */}
      {recentOddityToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#faf6ed]/95 text-stone-900 border border-stone-300 px-4 py-2 rounded-xs shadow-xl backdrop-blur-xs font-serif italic text-xs tracking-wide animate-in fade-in slide-in-from-bottom-2 duration-300">
          ✦ {recentOddityToast}
        </div>
      )}

      {/* 8. Little Oddities Archival Journal Modal */}
      {odditiesModalOpen && (
        <LittleOdditiesModal
          discoveredIds={discoveredOddities}
          onClose={() => setOdditiesModalOpen(false)}
        />
      )}

      {/* 9. Stage E: Gentle Departure Modal */}
      {departureModalOpen && (
        <DepartureModal
          onReturnToSanctuary={() => setDepartureModalOpen(false)}
          onExitToThreshold={() => {
            setDepartureModalOpen(false);
            setInArrival(true);
            audioEngine.setMuted(true);
          }}
        />
      )}
    </div>
  );
}
