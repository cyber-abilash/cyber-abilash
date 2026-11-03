"use client";

// Web Audio API Synthesizer for Classified Sci-Fi UI Feedback
// Zero external file dependencies - 100% synthesized in-memory audio
// Sound is strictly OFF by default and requires explicit user activation

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;

  private initContext() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }

    if (this.ctx && this.ctx.state === "suspended") {
      void this.ctx.resume();
    }
  }

  public setEnabled(enable: boolean) {
    this.enabled = enable;
    if (enable) {
      this.initContext();
      this.playChirp(880, 0.04);
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public playKeyBlip() {
    if (!this.enabled || !this.ctx) return;
    this.playTone(600 + Math.random() * 200, 0.03, "sine", 0.05);
  }

  public playBootStep() {
    if (!this.enabled || !this.ctx) return;
    this.playTone(440, 0.06, "triangle", 0.08);
  }

  public playAccessGranted() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.playToneAtTime(523.25, 0.08, "sine", 0.1, now); // C5
    this.playToneAtTime(659.25, 0.08, "sine", 0.1, now + 0.07); // E5
    this.playToneAtTime(783.99, 0.14, "sine", 0.12, now + 0.14); // G5
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
    volume: number = 0.08
  ) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        this.ctx.currentTime + duration
      );

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore audio failure gracefully
    }
  }

  private playToneAtTime(
    freq: number,
    duration: number,
    type: OscillatorType = "sine",
    volume: number = 0.08,
    startTime: number = 0
  ) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch {
      // Ignore audio failure gracefully
    }
  }

  private playChirp(freq: number, duration: number) {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(
        freq * 1.5,
        this.ctx.currentTime + duration
      );

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        this.ctx.currentTime + duration
      );

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore audio failure gracefully
    }
  }

  public destroy() {
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
    this.enabled = false;
  }
}

export const sound = new SoundSynthesizer();

