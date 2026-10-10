import React, { useState } from 'react';
import { WhisperData } from '../../types';
import { audioEngine } from '../../services/audioEngine';
import { particleEngine } from '../../services/particleEngine';
import { WaterSurface } from '../WaterSurface';

interface InfiniteGardenProps {
  reducedMotion: boolean;
  onDiscoverOddity: (id: string) => void;
  onHoverWhisper?: (whisper: WhisperData | null) => void;
}

interface FlowerCluster {
  id: string;
  name: string;
  left: string;
  top: string;
  size: string;
  bloomed: boolean;
  whisper: string;
}

export const InfiniteGarden: React.FC<InfiniteGardenProps> = ({
  reducedMotion,
  onDiscoverOddity,
  onHoverWhisper
}) => {
  const [flowers, setFlowers] = useState<FlowerCluster[]>([
    { id: 'f1', name: 'Pale Buttercup', left: '16%', top: '74%', size: 'w-16 h-16', bloomed: false, whisper: 'Petals that only open when someone stops waiting for news.' },
    { id: 'f2', name: 'Dream Anemone', left: '28%', top: '65%', size: 'w-14 h-14', bloomed: false, whisper: 'A blossom named by a traveler who fell asleep listening to the salt wind.' },
    { id: 'f3', name: 'Golden Yarrow', left: '68%', top: '70%', size: 'w-20 h-20', bloomed: false, whisper: 'Dried bunches of this herb were once hung above doors to keep hurry outside.' },
    { id: 'f4', name: 'Silverbells', left: '84%', top: '62%', size: 'w-16 h-16', bloomed: false, whisper: 'If the garden falls silent enough, each bell rings with the frequency of morning dew.' },
    { id: 'f5', name: 'Misty Chamomile', left: '42%', top: '56%', size: 'w-12 h-12', bloomed: false, whisper: 'A flower that smells faintly of apple peel and quiet afternoons.' }
  ]);

  const [inscriptionRevealed, setInscriptionRevealed] = useState<boolean>(false);
  const [cloudBoatRevealed, setCloudBoatRevealed] = useState<boolean>(false);
  const [pondExpanded, setPondExpanded] = useState<boolean>(false);

  // 1. Touch Flower
  const handleFlowerTouch = (flower: FlowerCluster, e: React.PointerEvent) => {
    audioEngine.playFlowerBloom();
    particleEngine.emitPollen(e.clientX, e.clientY, 24);
    particleEngine.emitPetals(e.clientX, e.clientY, 10);

    setFlowers(prev =>
      prev.map(f => (f.id === flower.id ? { ...f, bloomed: !f.bloomed } : f))
    );
  };

  // 2. Discover Inscription on Stone
  const handleStoneTouch = (e: React.PointerEvent) => {
    if (!inscriptionRevealed) {
      setInscriptionRevealed(true);
      audioEngine.playOddityDiscovery();
      particleEngine.emitLuminousDust(e.clientX, e.clientY, 26, '#e0edc5');
      onDiscoverOddity('singing-stone');
    } else {
      audioEngine.playCurtainBreeze();
      particleEngine.emitLuminousDust(e.clientX, e.clientY, 8, '#ffffff');
    }
  };

  // 3. Drifting Cloud / Paper Boat Discovery
  const handleCloudTouch = (e: React.PointerEvent) => {
    if (!cloudBoatRevealed) {
      setCloudBoatRevealed(true);
      audioEngine.playOddityDiscovery();
      particleEngine.emitLuminousDust(e.clientX, e.clientY, 30, '#fffbf0');
      onDiscoverOddity('paper-boat-cloud');
    } else {
      audioEngine.playCurtainBreeze();
      particleEngine.emitLuminousDust(e.clientX, e.clientY, 12, '#ffffff');
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* Background Garden Artwork */}
      <img
        src="/src/assets/images/scene_infinite_garden_1791619429422.jpg"
        alt="The Infinite Garden"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Atmospheric Garden Light Tint */}
      <div className="absolute inset-0 bg-[#e6ede1] opacity-[0.05] pointer-events-none" />

      {/* 1. DRIFTING CLOUD / PAPER BOAT (Top Sky Zone) */}
      <div
        onPointerDown={handleCloudTouch}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "Clouds that have memorized the shapes of paper things we left behind in childhood.", source: "The Upper Sky" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute top-[8%] left-[26%] w-[38%] h-[18%] z-10 cursor-pointer group flex items-center justify-center"
        title="Follow the drifting cloud"
      >
        {cloudBoatRevealed ? (
          <div className="flex items-center gap-2 px-3 py-1 bg-white/70 backdrop-blur-xs rounded-sm text-stone-700 shadow-xs text-xs font-serif italic animate-pulse">
            <span>⛵︎</span>
            <span>A folded paper boat sailing the clouds</span>
          </div>
        ) : (
          <div className="opacity-0 group-hover:opacity-60 transition-opacity text-xs font-serif italic text-stone-700 bg-white/60 px-2 py-0.5 rounded-sm">
            trace the drifting cloud
          </div>
        )}
      </div>

      {/* 2. INSCRIBED STONE (Lower middle path) */}
      <div
        onPointerDown={handleStoneTouch}
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "The limestone was brought here by a river that never had a name.", source: "Ancient Milestone" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className="absolute bottom-[24%] left-[46%] w-[14%] h-[12%] z-10 cursor-pointer group flex items-center justify-center"
        title="Inspect the moss-covered limestone"
      >
        <div
          className={`p-2 rounded-xs border transition-all duration-500 backdrop-blur-xs text-center ${
            inscriptionRevealed
              ? 'bg-[#f7f5ee]/90 border-amber-800/20 shadow-md scale-105'
              : 'bg-white/20 border-white/30 group-hover:bg-white/40'
          }`}
        >
          {inscriptionRevealed ? (
            <div className="text-[11px] font-serif italic text-stone-800 leading-tight">
              "You are allowed to remain here as long as you wish."
            </div>
          ) : (
            <div className="text-[11px] font-serif text-stone-700 opacity-70 group-hover:opacity-100">
              brush away ivy
            </div>
          )}
        </div>
      </div>

      {/* 3. INTERACTIVE WILDFLOWER CLUSTERS */}
      {flowers.map(flower => (
        <div
          key={flower.id}
          onPointerDown={e => handleFlowerTouch(flower, e)}
          onMouseEnter={() => {
            onHoverWhisper?.({ text: flower.whisper, source: flower.name });
            audioEngine.playWhisperTone();
          }}
          onMouseLeave={() => onHoverWhisper?.(null)}
          className={`absolute ${flower.size} z-20 cursor-pointer group flex items-center justify-center transition-transform duration-500`}
          style={{
            left: flower.left,
            top: flower.top,
            transform: flower.bloomed ? 'scale(1.22)' : 'scale(1)'
          }}
          title={`Touch the ${flower.name}`}
        >
          {/* Animated Botanical Flower Petals */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* 5 Petals */}
            {[0, 72, 144, 216, 288].map((angle, idx) => (
              <div
                key={idx}
                className="absolute w-3.5 h-5 bg-[#fff8eb]/90 rounded-full border border-amber-200/50 shadow-2xs transition-transform duration-500 origin-bottom"
                style={{
                  transform: `rotate(${angle}deg) translateY(${flower.bloomed ? -7 : -3}px) scale(${
                    flower.bloomed ? 1.15 : 0.95
                  })`
                }}
              />
            ))}
            {/* Center Core */}
            <div className="relative z-10 w-3 h-3 bg-[#f2cb63] rounded-full shadow-inner" />
          </div>

          {/* Hint */}
          <div className="absolute -top-6 opacity-0 group-hover:opacity-85 transition-opacity text-[11px] font-serif italic text-stone-800 bg-amber-50/90 px-2 py-0.5 rounded-sm shadow-xs whitespace-nowrap">
            {flower.name} · {flower.bloomed ? 'blooming' : 'touch to bloom'}
          </div>
        </div>
      ))}

      {/* 4. HIDDEN CORNER POND WITH REAL WATER RIPPLE CANVAS */}
      <div
        onMouseEnter={() => {
          onHoverWhisper?.({ text: "Water that remains cold even under the sun of three remembered summers.", source: "Spring Pool" });
          audioEngine.playWhisperTone();
        }}
        onMouseLeave={() => onHoverWhisper?.(null)}
        className={`absolute bottom-2 left-3 z-20 transition-all duration-700 rounded-sm overflow-hidden border border-emerald-950/20 shadow-md ${
          pondExpanded ? 'w-64 h-40 bg-[#c7dbd2]/40' : 'w-44 h-28 bg-[#c7dbd2]/25 hover:bg-[#c7dbd2]/35'
        }`}
      >
        <div className="absolute top-1 left-2 text-[10px] font-serif italic text-stone-700/80 pointer-events-none z-10">
          hidden spring pool
        </div>
        <WaterSurface
          tint="rgba(190, 225, 210, 0.55)"
          reducedMotion={reducedMotion}
          className="w-full h-full"
        />
        <button
          type="button"
          onClick={() => setPondExpanded(prev => !prev)}
          className="absolute bottom-1 right-1 text-[9px] text-stone-600/70 hover:text-stone-900 z-10 bg-white/60 px-1 py-0.5 rounded-2xs"
        >
          {pondExpanded ? 'contract' : 'expand'}
        </button>
      </div>
    </div>
  );
};
