import { EnvironmentId } from '../types';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.65;
  private currentEnv: EnvironmentId = 'quiet-room';
  private isInitialized: boolean = false;
  private isPlayingAmbient: boolean = false;
  
  // Ambient oscillators & timers
  private ambientNodes: {
    oscillators: OscillatorNode[];
    gains: GainNode[];
    filters: BiquadFilterNode[];
    noiseSources: AudioBufferSourceNode[];
    intervals: number[];
  } = {
    oscillators: [],
    gains: [],
    filters: [],
    noiseSources: [],
    intervals: []
  };

  public init(): boolean {
    if (this.ctx && this.ctx.state !== 'closed') {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return true;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;

      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
      this.ambientGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.isInitialized = true;
      return true;
    } catch {
      return false;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.ctx && this.masterGain) {
      const targetGain = muted ? 0 : this.volume;
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.08);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (!this.isMuted && this.ctx && this.masterGain) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public async startAudio(env: EnvironmentId = 'quiet-room') {
    if (!this.init()) return;
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }
    this.currentEnv = env;
    this.startAmbientForEnvironment(env);
  }

  public switchEnvironment(newEnv: EnvironmentId) {
    this.currentEnv = newEnv;
    if (!this.isPlayingAmbient || !this.ctx) return;

    // Crossfade: fade down old ambient gain, build new ambient, then fade up
    const now = this.ctx.currentTime;
    if (this.ambientGain) {
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.linearRampToValueAtTime(0.01, now + 1.2);
    }

    setTimeout(() => {
      this.stopCurrentAmbient();
      this.startAmbientForEnvironment(newEnv);
      if (this.ctx && this.ambientGain) {
        this.ambientGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.ambientGain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 1.2);
      }
    }, 1200);
  }

  private stopCurrentAmbient() {
    this.ambientNodes.intervals.forEach(id => clearInterval(id));
    this.ambientNodes.intervals = [];

    this.ambientNodes.oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore already stopped
      }
    });
    this.ambientNodes.oscillators = [];

    this.ambientNodes.noiseSources.forEach(src => {
      try {
        src.stop();
        src.disconnect();
      } catch {
        // ignore
      }
    });
    this.ambientNodes.noiseSources = [];

    this.ambientNodes.gains.forEach(g => {
      try { g.disconnect(); } catch { /* ignore */ }
    });
    this.ambientNodes.gains = [];

    this.ambientNodes.filters.forEach(f => {
      try { f.disconnect(); } catch { /* ignore */ }
    });
    this.ambientNodes.filters = [];
  }

  private createNoiseBuffer(durationSeconds = 4): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * durationSeconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    // Pink noise approximation for warm organic air
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }
    return buffer;
  }

  private startAmbientForEnvironment(env: EnvironmentId) {
    if (!this.ctx || !this.ambientGain) return;
    this.stopCurrentAmbient();
    this.isPlayingAmbient = true;

    switch (env) {
      case 'quiet-room':
        this.buildQuietRoomAmbience();
        break;
      case 'infinite-garden':
        this.buildGardenAmbience();
        break;
      case 'floating-shore':
        this.buildShoreAmbience();
        break;
      case 'cloud-observatory':
        this.buildObservatoryAmbience();
        break;
      case 'night-window':
        this.buildNightWindowAmbience();
        break;
    }
  }

  // 1. The Quiet Room: Warm sunlit pad + soft distant wind + sparse Rhodes-like notes
  private buildQuietRoomAmbience() {
    if (!this.ctx || !this.ambientGain) return;

    // Warm chord drone: Fmaj9 / Cmaj9 (frequencies: 130.81 [C3], 196.00 [G3], 246.94 [B3], 329.63 [E4])
    const chordFreqs = [130.81, 196.00, 246.94, 329.63];
    chordFreqs.forEach((freq, idx) => {
      if (!this.ctx || !this.ambientGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Lowpass warmth
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(480 + idx * 60, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.045 / chordFreqs.length, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);
      osc.start();

      this.ambientNodes.oscillators.push(osc);
      this.ambientNodes.gains.push(gain);
      this.ambientNodes.filters.push(filter);
    });

    // Gentle wind noise
    const noiseBuf = this.createNoiseBuffer(5);
    if (noiseBuf) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuf;
      noise.loop = true;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
      noiseFilter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.02, this.ctx.currentTime);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ambientGain);
      noise.start();

      this.ambientNodes.noiseSources.push(noise);
      this.ambientNodes.gains.push(noiseGain);
      this.ambientNodes.filters.push(noiseFilter);
    }

    // Sparse, quiet melodic piano note generator (C major pentatonic: C4, D4, E4, G4, A4, C5)
    const notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
    const interval = window.setInterval(() => {
      if (!this.isPlayingAmbient || this.currentEnv !== 'quiet-room') return;
      const noteFreq = notes[Math.floor(Math.random() * notes.length)];
      this.playGentleChime(noteFreq, 0.04, 3.2);
    }, 7000);
    this.ambientNodes.intervals.push(interval);
  }

  // 2. The Infinite Garden: Airy flutter tones + faint leaf rustle + crystalline notes
  private buildGardenAmbience() {
    if (!this.ctx || !this.ambientGain) return;

    // Airy high drone (A major: 220, 277.18, 329.63, 440, 554.37)
    const freqs = [220.00, 329.63, 440.00, 554.37];
    freqs.forEach(freq => {
      if (!this.ctx || !this.ambientGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.5, this.ctx.currentTime);
      filter.Q.setValueAtTime(0.8, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.028 / freqs.length, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);
      osc.start();

      this.ambientNodes.oscillators.push(osc);
      this.ambientNodes.gains.push(gain);
      this.ambientNodes.filters.push(filter);
    });

    // Faint rustling texture
    const noiseBuf = this.createNoiseBuffer(4);
    if (noiseBuf) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuf;
      noise.loop = true;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.012, this.ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);
      noise.start();

      this.ambientNodes.noiseSources.push(noise);
      this.ambientNodes.gains.push(gain);
      this.ambientNodes.filters.push(filter);
    }

    // High garden chimes
    const chimes = [554.37, 659.25, 830.61, 880.00, 1108.73];
    const interval = window.setInterval(() => {
      if (!this.isPlayingAmbient || this.currentEnv !== 'infinite-garden') return;
      const chimeFreq = chimes[Math.floor(Math.random() * chimes.length)];
      this.playGentleChime(chimeFreq, 0.035, 4.0);
    }, 6200);
    this.ambientNodes.intervals.push(interval);
  }

  // 3. The Floating Shore: Deep oceanic tidal swell + liquid resonances
  private buildShoreAmbience() {
    if (!this.ctx || !this.ambientGain) return;

    // Low ocean swell: Eb major (77.78 [Eb2], 116.54 [Bb2], 155.56 [Eb3], 233.08 [Bb3])
    const chord = [77.78, 116.54, 155.56, 233.08];
    chord.forEach((freq, idx) => {
      if (!this.ctx || !this.ambientGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260 + idx * 40, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.05 / chord.length, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);
      osc.start();

      this.ambientNodes.oscillators.push(osc);
      this.ambientNodes.gains.push(gain);
      this.ambientNodes.filters.push(filter);
    });

    // Tidal wash: pink noise modulated slowly like gentle waves
    const noiseBuf = this.createNoiseBuffer(6);
    if (noiseBuf) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuf;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);

      // LFO for wave ebb and flow (every 9 seconds)
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(1 / 9, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start();

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);
      noise.start();

      this.ambientNodes.noiseSources.push(noise);
      this.ambientNodes.oscillators.push(lfo);
      this.ambientNodes.gains.push(gain, lfoGain);
      this.ambientNodes.filters.push(filter);
    }
  }

  // 4. The Cloud Observatory: Suspended glass harmonica / overtone harmony
  private buildObservatoryAmbience() {
    if (!this.ctx || !this.ambientGain) return;

    // Ethereal pure sine overtones (D major 9th: 146.83, 220.00, 293.66, 369.99, 440.00, 587.33)
    const tones = [146.83, 293.66, 440.00, 587.33];
    tones.forEach((freq, idx) => {
      if (!this.ctx || !this.ambientGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.032 / tones.length, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);
      osc.start();

      this.ambientNodes.oscillators.push(osc);
      this.ambientNodes.gains.push(gain);
      this.ambientNodes.filters.push(filter);
    });

    // Rare glass harmonica bell note
    const glassNotes = [587.33, 739.99, 880.00, 1174.66];
    const interval = window.setInterval(() => {
      if (!this.isPlayingAmbient || this.currentEnv !== 'cloud-observatory') return;
      const noteFreq = glassNotes[Math.floor(Math.random() * glassNotes.length)];
      this.playGlassResonance(noteFreq, 0.03);
    }, 8000);
    this.ambientNodes.intervals.push(interval);
  }

  // 5. The Night Window: Warm low-frequency drone + quiet nocturnal textures
  private buildNightWindowAmbience() {
    if (!this.ctx || !this.ambientGain) return;

    // Warm deep nocturnal pad (G minor / Bb major: 98.00 [G2], 146.83 [D3], 196.00 [G3], 233.08 [Bb3])
    const nocturnalChord = [98.00, 146.83, 196.00, 233.08];
    nocturnalChord.forEach((freq, idx) => {
      if (!this.ctx || !this.ambientGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04 / nocturnalChord.length, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ambientGain);
      osc.start();

      this.ambientNodes.oscillators.push(osc);
      this.ambientNodes.gains.push(gain);
      this.ambientNodes.filters.push(filter);
    });

    // Distant warm celesta notes
    const nightCelesta = [392.00, 466.16, 523.25, 587.33, 698.46, 783.99];
    const interval = window.setInterval(() => {
      if (!this.isPlayingAmbient || this.currentEnv !== 'night-window') return;
      const noteFreq = nightCelesta[Math.floor(Math.random() * nightCelesta.length)];
      this.playGentleChime(noteFreq, 0.028, 4.5);
    }, 9500);
    this.ambientNodes.intervals.push(interval);
  }

  // === INTERACTIVE SOUND EFFECTS ===

  // 1. Water Ripple: Liquid drop + resonant dispersion
  public playWaterRipple(pitchMod = 1) {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const baseFreq = 420 * pitchMod;

      // Resonant droplet
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      // Pitch envelope: rapid drop like water droplet hitting surface
      osc.frequency.setValueAtTime(baseFreq * 1.6, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq, now + 0.08);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(baseFreq, now);
      filter.Q.setValueAtTime(3.5, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.65);

      // Low ripple body resonance
      const bodyOsc = this.ctx.createOscillator();
      const bodyGain = this.ctx.createGain();
      bodyOsc.type = 'sine';
      bodyOsc.frequency.setValueAtTime(baseFreq * 0.45, now);
      bodyGain.gain.setValueAtTime(0.06, now);
      bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.85);

      bodyOsc.connect(bodyGain);
      bodyGain.connect(this.sfxGain);
      bodyOsc.start(now);
      bodyOsc.stop(now + 0.9);
    } catch {
      // Audio error catch
    }
  }

  // 2. Flower Bloom: Crystalline pentatonic bell chime
  public playFlowerBloom() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const freqs = [587.33, 739.99, 880.00, 1046.50, 1174.66];
      const freq = freqs[Math.floor(Math.random() * freqs.length)];
      this.playGentleChime(freq, 0.09, 2.8);
    } catch {
      // ignore
    }
  }

  // 3. Curtain Breeze: Soft organic swoosh
  public playCurtainBreeze() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const noiseBuf = this.createNoiseBuffer(1.2);
      if (!noiseBuf) return;

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuf;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(280, now);
      filter.frequency.exponentialRampToValueAtTime(540, now + 0.5);
      filter.frequency.exponentialRampToValueAtTime(220, now + 1.1);
      filter.Q.setValueAtTime(1.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(now);
      noise.stop(now + 1.2);
    } catch {
      // ignore
    }
  }

  // 4. Paper Rustle & Turn: Tactile organic texture
  public playPaperTurn() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const noiseBuf = this.createNoiseBuffer(0.4);
      if (!noiseBuf) return;

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuf;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, now);
      filter.Q.setValueAtTime(2.2, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.065, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      noise.start(now);
      noise.stop(now + 0.4);
    } catch {
      // ignore
    }
  }

  // 5. Glass Resonance: Crystal bowl / prism pure bell overtone
  public playGlassResonance(freq = 659.25, volume = 0.08) {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const overtoneOsc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      overtoneOsc.type = 'sine';
      overtoneOsc.frequency.setValueAtTime(freq * 2.76, now); // Natural non-harmonic bell ratio

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

      osc.connect(gain);
      overtoneOsc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      overtoneOsc.start(now);
      osc.stop(now + 3.3);
      overtoneOsc.stop(now + 3.3);
    } catch {
      // ignore
    }
  }

  // 6. Lamp Click / Window Latch: Subtle warm tactile click
  public playLampClick() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.06);

      gain.gain.setValueAtTime(0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // ignore
    }
  }

  // 7. Little Oddity Discovery: Celestial musical interval
  public playOddityDiscovery() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const chords = [392.00, 493.88, 587.33, 739.99]; // G maj7
      chords.forEach((f, i) => {
        setTimeout(() => {
          this.playGentleChime(f, 0.06, 3.5);
        }, i * 90);
      });
    } catch {
      // ignore
    }
  }

  private playGentleChime(freq: number, volume = 0.05, decay = 2.5) {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + decay + 0.1);
    } catch {
      // ignore
    }
  }

  // 8. Memory Whisper: Ultra-soft harmonic breath
  private lastWhisperTime: number = 0;
  public playWhisperTone() {
    if (!this.ctx || !this.sfxGain || this.isMuted) return;
    const nowMs = performance.now();
    if (nowMs - this.lastWhisperTime < 1800) return; // Cooldown
    this.lastWhisperTime = nowMs;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Soft high overtone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.8);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.02, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch {
      // ignore
    }
  }
}

export const audioEngine = new AudioEngine();
