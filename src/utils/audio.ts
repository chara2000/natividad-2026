// Web Audio API Synthesizer for Festive Sound Effects
// No external assets required, 100% reliable offline in PWA!

class FestiveSoundFX {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('natividad_sound_enabled');
        if (stored !== null) {
          this.soundEnabled = stored === 'true';
        }
      } catch {
        // SSR safe fallback
      }
    }
  }

  private initCtx() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('natividad_sound_enabled', String(this.soundEnabled));
      } catch {}
    }
    if (this.soundEnabled) {
      this.playJingleBell();
    }
    return this.soundEnabled;
  }

  // Gentle Festive Bell Chime (Jingle)
  public playJingleBell() {
    if (!this.soundEnabled || typeof window === 'undefined') return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [1760, 2093, 2637]; // A6, C7, E7 bright crystal harmonics

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.08, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.85);
      });
    } catch {
      // Audio playback best effort
    }
  }

  // Tambourine / Maraca Shake for Novena Gozos
  public playTambourine() {
    if (!this.soundEnabled || typeof window === 'undefined') return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const freqs = [3500, 4200, 5800, 7200, 8500];

      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f + (Math.random() * 200 - 100), now);

        gain.gain.setValueAtTime(0.06, now + idx * 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.01);
        osc.stop(now + 0.18);
      });
    } catch {
      // Best effort
    }
  }

  // Coin / Payment Registered Sound
  public playPaymentChime() {
    if (!this.soundEnabled || typeof window === 'undefined') return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [987.77, 1318.51];

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);

        gain.gain.setValueAtTime(0.12, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.45);
      });
    } catch {
      // Best effort
    }
  }

  // Magical Secret Santa Reveal Fanfare
  public playMagicReveal() {
    if (!this.soundEnabled || typeof window === 'undefined') return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);

        gain.gain.setValueAtTime(0.1, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.65);
      });
    } catch {
      // Best effort
    }
  }

  // Soft click / interaction
  public playClick() {
    if (!this.soundEnabled || typeof window === 'undefined') return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Best effort
    }
  }

  // Bingo Ball Extraction Sound
  public playBingoBall() {
    if (!this.soundEnabled || typeof window === 'undefined') return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Quick rolling pops
      [600, 750, 900, 1200].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.08, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.14);
      });
    } catch {
      // Best effort
    }
  }

  // Timer Tick or Alarm for Aguinaldos
  public playTimerBeep(isFinal: boolean = false) {
    if (!this.soundEnabled || typeof window === 'undefined') return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isFinal ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(isFinal ? 880 : 520, now);

      gain.gain.setValueAtTime(isFinal ? 0.15 : 0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isFinal ? 0.4 : 0.08));

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + (isFinal ? 0.45 : 0.1));
    } catch {
      // Best effort
    }
  }

  // Triumphant Victory Fanfare for Bingo and Aguinaldos
  public playVictoryFanfare() {
    if (!this.soundEnabled || typeof window === 'undefined') return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Fanfare: C5, E5, G5, C6 (held)
      const notes = [
        { f: 523.25, t: 0, d: 0.15 },
        { f: 659.25, t: 0.14, d: 0.15 },
        { f: 783.99, t: 0.28, d: 0.2 },
        { f: 1046.50, t: 0.48, d: 0.8 },
      ];

      notes.forEach(({ f, t, d }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0.12, now + t);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + t + d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + t);
        osc.stop(now + t + d + 0.05);
      });
    } catch {
      // Best effort
    }
  }

  // Play a cheerful synthesizer Christmas carol melody
  private activeMelodyOscs: OscillatorNode[] = [];

  public stopMelody() {
    try {
      this.activeMelodyOscs.forEach(osc => {
        try { osc.stop(); } catch {}
      });
      this.activeMelodyOscs = [];
    } catch {}
  }

  public playCarolSnippet(name: 'tutaina' | 'jingle' | 'noche') {
    if (!this.soundEnabled || typeof window === 'undefined') return;
    try {
      this.stopMelody();
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime + 0.05;
      let notes: { f: number; d: number }[] = [];

      if (name === 'jingle') {
        // E E E - E E E - E G C D E
        const E = 659.25, G = 783.99, C = 523.25, D = 587.33;
        notes = [
          { f: E, d: 0.2 }, { f: E, d: 0.2 }, { f: E, d: 0.4 },
          { f: E, d: 0.2 }, { f: E, d: 0.2 }, { f: E, d: 0.4 },
          { f: E, d: 0.2 }, { f: G, d: 0.2 }, { f: C, d: 0.3 }, { f: D, d: 0.2 }, { f: E, d: 0.6 }
        ];
      } else if (name === 'tutaina') {
        // Tutaina tuturuma: G G E A G E D C
        const G = 783.99, E = 659.25, A = 880.00, D = 587.33, C = 523.25;
        notes = [
          { f: G, d: 0.22 }, { f: G, d: 0.22 }, { f: E, d: 0.22 }, { f: A, d: 0.35 },
          { f: G, d: 0.25 }, { f: E, d: 0.25 }, { f: D, d: 0.25 }, { f: C, d: 0.55 }
        ];
      } else {
        // Noche de Paz: G A G E - G A G E
        const G = 783.99, A = 880.00, E = 659.25, D = 587.33, C = 523.25, B = 493.88;
        notes = [
          { f: G, d: 0.4 }, { f: A, d: 0.25 }, { f: G, d: 0.35 }, { f: E, d: 0.6 },
          { f: G, d: 0.4 }, { f: A, d: 0.25 }, { f: G, d: 0.35 }, { f: E, d: 0.6 },
          { f: D, d: 0.4 }, { f: D, d: 0.3 }, { f: B, d: 0.6 },
          { f: C, d: 0.4 }, { f: C, d: 0.3 }, { f: G, d: 0.7 }
        ];
      }

      let curTime = now;
      notes.forEach(({ f, d }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, curTime);

        gain.gain.setValueAtTime(0.09, curTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, curTime + d - 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(curTime);
        osc.stop(curTime + d);
        this.activeMelodyOscs.push(osc);

        curTime += d;
      });
    } catch {
      // Best effort
    }
  }
}

export const soundFX = new FestiveSoundFX();
