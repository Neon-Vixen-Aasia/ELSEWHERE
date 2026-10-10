import React, { useEffect, useState } from 'react';

interface DreamTransitionProps {
  isTransitioning: boolean;
  transitionType?: 'curtain' | 'ripple' | 'mist' | 'aperture';
  reducedMotion: boolean;
  onTransitionComplete: () => void;
}

export const DreamTransitions: React.FC<DreamTransitionProps> = ({
  isTransitioning,
  transitionType = 'curtain',
  reducedMotion,
  onTransitionComplete
}) => {
  const [phase, setPhase] = useState<'idle' | 'enter' | 'exit'>('idle');

  useEffect(() => {
    if (isTransitioning) {
      if (reducedMotion) {
        // Fast gentle crossfade
        setPhase('enter');
        const t1 = setTimeout(() => {
          setPhase('exit');
          onTransitionComplete();
        }, 300);
        const t2 = setTimeout(() => {
          setPhase('idle');
        }, 550);
        return () => {
          clearTimeout(t1);
          clearTimeout(t2);
        };
      }

      setPhase('enter');
      const t1 = setTimeout(() => {
        setPhase('exit');
        onTransitionComplete();
      }, 700);

      const t2 = setTimeout(() => {
        setPhase('idle');
      }, 1400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isTransitioning, reducedMotion, onTransitionComplete]);

  if (phase === 'idle') return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden="true">
      {/* 1. Curtain Transition Style */}
      {transitionType === 'curtain' && (
        <div className="relative w-full h-full flex">
          <div
            className={`w-1/2 h-full bg-[#f6f1eb] transition-transform duration-700 ease-in-out shadow-2xl ${
              phase === 'enter' ? 'translate-x-0' : '-translate-x-full'
            }`}
            style={{
              backgroundImage: 'radial-gradient(circle at 100% 50%, rgba(200,180,150,0.15), transparent 70%)'
            }}
          />
          <div
            className={`w-1/2 h-full bg-[#f6f1eb] transition-transform duration-700 ease-in-out shadow-2xl ${
              phase === 'enter' ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{
              backgroundImage: 'radial-gradient(circle at 0% 50%, rgba(200,180,150,0.15), transparent 70%)'
            }}
          />
        </div>
      )}

      {/* 2. Water Ripple Expansion */}
      {transitionType === 'ripple' && (
        <div className="w-full h-full flex items-center justify-center bg-[#10141d]/80 backdrop-blur-md transition-opacity duration-600">
          <div
            className={`rounded-full border border-sky-200/50 transition-all duration-700 ${
              phase === 'enter' ? 'w-[180vmax] h-[180vmax] opacity-100' : 'w-[240vmax] h-[240vmax] opacity-0'
            }`}
          />
        </div>
      )}

      {/* 3. Cloud Mist Wipe */}
      {transitionType === 'mist' && (
        <div
          className={`w-full h-full bg-[#eef3f7] transition-all duration-700 ease-in-out backdrop-blur-md ${
            phase === 'enter' ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      )}

      {/* 4. Soft Aperture / Light */}
      {transitionType === 'aperture' && (
        <div
          className={`w-full h-full bg-[#faf6ed] transition-opacity duration-600 ease-out ${
            phase === 'enter' ? 'opacity-95' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
