import React, { useRef, useEffect, useCallback } from 'react';
import { particleEngine } from '../services/particleEngine';
import { audioEngine } from '../services/audioEngine';

interface WaterSurfaceProps {
  className?: string;
  tint?: string;
  reducedMotion?: boolean;
}

interface Wave {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  amplitude: number;
  frequency: number;
  speed: number;
  alpha: number;
  decay: number;
}

export const WaterSurface: React.FC<WaterSurfaceProps> = ({
  className = '',
  tint = 'rgba(215, 230, 245, 0.35)',
  reducedMotion = false
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wavesRef = useRef<Wave[]>([]);
  const isPointerDownRef = useRef<boolean>(false);
  const lastTouchTimeRef = useRef<number>(0);
  const lastCoordRef = useRef<{ x: number; y: number } | null>(null);

  const createRipple = useCallback((x: number, y: number, intensity = 1.0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const localX = x - rect.left;
    const localY = y - rect.top;

    if (localX < 0 || localX > rect.width || localY < 0 || localY > rect.height) return;

    // Pitch variation based on horizontal position (creates an expressive harp-like liquid instrument)
    const pitchMod = 0.85 + (localX / rect.width) * 0.4;
    audioEngine.playWaterRipple(pitchMod);

    // Visual particles
    particleEngine.emitWaterDroplets(x, y, Math.floor(4 * intensity));
    particleEngine.emitRipple(x, y, 160 * intensity);

    if (reducedMotion) return;

    // Add physical wave to local simulation
    if (wavesRef.current.length < 16) {
      wavesRef.current.push({
        x: localX,
        y: localY,
        radius: 2,
        maxRadius: Math.min(rect.width * 0.55, 220 * intensity),
        amplitude: 14 * intensity,
        frequency: 0.12,
        speed: 1.6 + Math.random() * 0.4,
        alpha: 0.75,
        decay: 0.007
      });
    }
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      if (!reducedMotion) {
        const waves = wavesRef.current;
        for (let i = waves.length - 1; i >= 0; i--) {
          const w = waves[i];
          w.radius += w.speed;
          w.alpha -= w.decay;
          w.amplitude *= 0.985;

          if (w.alpha <= 0 || w.radius >= w.maxRadius) {
            waves.splice(i, 1);
            continue;
          }

          // Draw multiple concentric refractive rings with caustic shimmer
          const ringCount = 3;
          for (let r = 0; r < ringCount; r++) {
            const currentR = w.radius - r * 14;
            if (currentR <= 0) continue;

            const ringAlpha = Math.max(0, w.alpha * (1 - r * 0.28));
            
            // Refractive outer crest
            ctx.save();
            ctx.beginPath();
            // Perspective ellipse matching water angle
            ctx.ellipse(w.x, w.y, currentR, currentR * 0.42, 0, 0, Math.PI * 2);
            ctx.strokeStyle = tint;
            ctx.lineWidth = Math.max(0.8, (2.4 - r * 0.6) * (w.alpha / 0.8));
            ctx.globalAlpha = ringAlpha * 0.65;
            ctx.stroke();

            // Specular caustic bright edge
            ctx.beginPath();
            ctx.ellipse(w.x, w.y, currentR * 0.96, currentR * 0.40, 0, 0, Math.PI * 2);
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 0.9;
            ctx.globalAlpha = ringAlpha * 0.45;
            ctx.stroke();

            ctx.restore();
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [tint, reducedMotion]);

  const handlePointerDown = (e: React.PointerEvent) => {
    isPointerDownRef.current = true;
    lastCoordRef.current = { x: e.clientX, y: e.clientY };
    createRipple(e.clientX, e.clientY, 1.2);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPointerDownRef.current) return;
    const now = performance.now();
    if (now - lastTouchTimeRef.current < 85) return; // Cooldown for smooth drag without clutter

    const last = lastCoordRef.current;
    if (last) {
      const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y);
      if (dist > 18) {
        lastTouchTimeRef.current = now;
        lastCoordRef.current = { x: e.clientX, y: e.clientY };
        createRipple(e.clientX, e.clientY, 0.7);
      }
    }
  };

  const handlePointerUp = () => {
    isPointerDownRef.current = false;
    lastCoordRef.current = null;
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none touch-none cursor-pointer ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      role="region"
      aria-label="Interactive reflective water surface. Touch or drag to create ripples."
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-none"
      />
    </div>
  );
};
