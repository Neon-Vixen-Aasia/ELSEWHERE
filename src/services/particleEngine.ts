export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  maxAlpha: number;
  decay: number;
  color: string;
  rotation: number;
  vRot: number;
  type: 'dust' | 'pollen' | 'petal' | 'droplet' | 'sparkle';
  wobbleSpeed?: number;
  wobbleAmount?: number;
  seed?: number;
}

export interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
  decay: number;
  lineWidth: number;
  color: string;
}

class ParticleEngine {
  private particles: Particle[] = [];
  private ripples: Ripple[] = [];
  private ambientParticles: Particle[] = [];
  private width: number = window.innerWidth;
  private height: number = window.innerHeight;
  private maxParticles: number = 240;
  private reducedMotion: boolean = false;

  constructor() {
    this.initAmbientDust();
  }

  public setReducedMotion(reduced: boolean) {
    this.reducedMotion = reduced;
    if (reduced) {
      this.particles = [];
      this.ambientParticles = [];
    } else if (this.ambientParticles.length === 0) {
      this.initAmbientDust();
    }
  }

  public resize(w: number, h: number) {
    this.width = w;
    this.height = h;
    if (!this.reducedMotion && this.ambientParticles.length < 25) {
      this.initAmbientDust();
    }
  }

  private initAmbientDust() {
    this.ambientParticles = [];
    const count = Math.min(30, Math.floor((this.width * this.height) / 45000));
    for (let i = 0; i < count; i++) {
      this.ambientParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -0.1 - Math.random() * 0.25,
        size: 1 + Math.random() * 2,
        alpha: 0.1 + Math.random() * 0.35,
        maxAlpha: 0.45,
        decay: 0.0005,
        color: '#f4ede2',
        rotation: 0,
        vRot: 0,
        type: 'dust',
        seed: Math.random() * 100
      });
    }
  }

  // 1. Golden pollen burst on touching flowers
  public emitPollen(x: number, y: number, count = 18) {
    if (this.reducedMotion) return;
    const actualCount = Math.min(count, this.maxParticles - this.particles.length);
    const colors = ['#f5e6a3', '#ecd58a', '#fff8db', '#dfbf72'];

    for (let i = 0; i < actualCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2.2;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8, // subtle upward drift
        size: 1.8 + Math.random() * 2.4,
        alpha: 0.9,
        maxAlpha: 0.95,
        decay: 0.012 + Math.random() * 0.014,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: 0,
        vRot: 0,
        type: 'pollen',
        wobbleSpeed: 0.05 + Math.random() * 0.08,
        wobbleAmount: 0.8 + Math.random() * 1.2
      });
    }
  }

  // 2. Translucent flower petals
  public emitPetals(x: number, y: number, count = 8) {
    if (this.reducedMotion) return;
    const actualCount = Math.min(count, this.maxParticles - this.particles.length);
    const colors = ['#fdfaf3', '#fceddb', '#f5e4e0'];

    for (let i = 0; i < actualCount; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.8;
      const speed = 1.0 + Math.random() * 2.5;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        size: 4 + Math.random() * 5,
        alpha: 0.85,
        maxAlpha: 0.9,
        decay: 0.009 + Math.random() * 0.008,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.04,
        type: 'petal',
        wobbleSpeed: 0.03,
        wobbleAmount: 1.5
      });
    }
  }

  // 3. Water droplets & sparkles from ripples
  public emitWaterDroplets(x: number, y: number, count = 10) {
    if (this.reducedMotion) return;
    const actualCount = Math.min(count, this.maxParticles - this.particles.length);
    for (let i = 0; i < actualCount; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
      const speed = 0.8 + Math.random() * 3.0;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.5 + Math.random() * 2.2,
        alpha: 0.9,
        maxAlpha: 0.9,
        decay: 0.02 + Math.random() * 0.025,
        color: '#e4f0f8',
        rotation: 0,
        vRot: 0,
        type: 'droplet'
      });
    }
  }

  // 4. Luminous celestial dust & oddity discovery sparkles
  public emitLuminousDust(x: number, y: number, count = 22, tint = '#f8eed7') {
    if (this.reducedMotion) return;
    const actualCount = Math.min(count, this.maxParticles - this.particles.length);
    for (let i = 0; i < actualCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 2.6;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.4,
        size: 1.2 + Math.random() * 2.8,
        alpha: 0.95,
        maxAlpha: 1.0,
        decay: 0.01 + Math.random() * 0.012,
        color: tint,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.08,
        type: 'sparkle'
      });
    }
  }

  // 5. Expandable water ripple rings
  public emitRipple(x: number, y: number, maxRadius = 140, color = 'rgba(235, 245, 255, 0.45)') {
    if (this.reducedMotion) return;
    this.ripples.push({
      x,
      y,
      radius: 4,
      maxRadius,
      speed: 1.4 + Math.random() * 0.6,
      alpha: 0.65,
      decay: 0.009,
      lineWidth: 1.8,
      color
    });

    // Spawn 2-3 concentric secondary echoes
    setTimeout(() => {
      if (this.ripples.length < 18) {
        this.ripples.push({
          x,
          y,
          radius: 3,
          maxRadius: maxRadius * 0.85,
          speed: 1.1,
          alpha: 0.45,
          decay: 0.011,
          lineWidth: 1.2,
          color
        });
      }
    }, 180);
  }

  public updateAndRender(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Render ambient floating dust motes
    if (!this.reducedMotion) {
      for (let i = 0; i < this.ambientParticles.length; i++) {
        const p = this.ambientParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.seed) p.x += Math.sin(p.y * 0.02 + p.seed) * 0.2;

        if (p.y < -10) {
          p.y = this.height + 10;
          p.x = Math.random() * this.width;
        }
        if (p.x < -10) p.x = this.width + 10;
        if (p.x > this.width + 10) p.x = -10;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 2. Render ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += r.speed;
      r.alpha -= r.decay;

      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        this.ripples.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.strokeStyle = r.color;
      ctx.globalAlpha = Math.max(0, r.alpha);
      ctx.lineWidth = r.lineWidth;
      ctx.beginPath();
      // Elliptical perspective for water surface
      ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.52, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 3. Render dynamic interactive particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.vRot;
      p.alpha -= p.decay;

      // Gravity / air resistance
      if (p.type === 'droplet') {
        p.vy += 0.09; // gravity
        p.vx *= 0.98;
      } else if (p.type === 'pollen' || p.type === 'dust') {
        p.vx *= 0.985;
        p.vy *= 0.985;
        if (p.wobbleSpeed && p.wobbleAmount) {
          p.x += Math.sin(p.y * p.wobbleSpeed) * p.wobbleAmount * 0.1;
        }
      } else if (p.type === 'petal') {
        p.vy += 0.02; // slow fall
        p.vx += Math.sin(p.rotation) * 0.08;
      }

      if (p.alpha <= 0 || p.y > this.height + 20 || p.x < -20 || p.x > this.width + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);

      if (p.type === 'petal') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 1.5, p.size * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'sparkle') {
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        // Diamond 4-point star
        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(0, -s * 1.6);
        ctx.lineTo(s * 0.4, 0);
        ctx.lineTo(0, s * 1.6);
        ctx.lineTo(-s * 0.4, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }
}

export const particleEngine = new ParticleEngine();
