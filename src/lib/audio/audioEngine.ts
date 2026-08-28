import * as Tone from "tone";
import { KeyTarget } from "@/types/curriculum";

class AudioEngineService {
  private synth: Tone.PolySynth | null = null;
  private metronomeHigh: Tone.MembraneSynth | null = null;
  private metronomeLow: Tone.MembraneSynth | null = null;
  private isInitialized = false;
  private currentSequenceTimeouts: NodeJS.Timeout[] = [];

  private async ensureInit() {
    if (this.isInitialized) return;
    if (typeof window === "undefined") return;

    try {
      await Tone.start();
      
      this.synth = new Tone.PolySynth(Tone.Synth, {
        oscillator: { type: "triangle8" },
        envelope: { attack: 0.005, decay: 1.2, sustain: 0.2, release: 1.4 },
      }).toDestination();
      this.synth.volume.value = -4;

      this.metronomeHigh = new Tone.MembraneSynth({
        pitchDecay: 0.005,
        octaves: 2,
        envelope: { attack: 0.001, decay: 0.08, sustain: 0 },
      }).toDestination();
      this.metronomeHigh.volume.value = -6;

      this.metronomeLow = new Tone.MembraneSynth({
        pitchDecay: 0.005,
        octaves: 2,
        envelope: { attack: 0.001, decay: 0.08, sustain: 0 },
      }).toDestination();
      this.metronomeLow.volume.value = -12;

      this.isInitialized = true;
    } catch (e) {
      console.warn("AudioEngine init warning:", e);
    }
  }

  public async playNote(note: string, duration: string | number = "4n") {
    await this.ensureInit();
    if (!this.synth) return;
    try {
      this.synth.triggerAttackRelease(note, duration);
    } catch (e) {
      console.error("playNote error", e);
    }
  }

  public async playChord(notes: string[], duration: string | number = "2n") {
    await this.ensureInit();
    if (!this.synth) return;
    try {
      this.synth.triggerAttackRelease(notes, duration);
    } catch (e) {
      console.error("playChord error", e);
    }
  }

  public async playMetronomeClick(accent: boolean = false) {
    await this.ensureInit();
    try {
      if (accent && this.metronomeHigh) {
        this.metronomeHigh.triggerAttackRelease("C5", "32n");
      } else if (this.metronomeLow) {
        this.metronomeLow.triggerAttackRelease("G3", "32n");
      }
    } catch (e) {
      console.error("playMetronomeClick error", e);
    }
  }

  public stopSequence() {
    this.currentSequenceTimeouts.forEach((t) => clearTimeout(t));
    this.currentSequenceTimeouts = [];
  }

  public async playSequence(
    sequence: KeyTarget[],
    bpm: number = 60,
    onNoteTrigger?: (target: KeyTarget, index: number) => void,
    onEnd?: () => void
  ) {
    this.stopSequence();
    await this.ensureInit();
    if (!this.synth || sequence.length === 0) return;

    const beatDurationMs = (60 / bpm) * 1000;
    let accumulatedTimeMs = 0;

    sequence.forEach((item, index) => {
      const beats = item.durationBeats || 1;
      const delay = accumulatedTimeMs;
      
      const timeout = setTimeout(() => {
        const noteDurationSeconds = Math.max(0.1, (beats * beatDurationMs) / 1000 * 0.9);
        this.synth?.triggerAttackRelease(item.note, noteDurationSeconds);
        onNoteTrigger?.(item, index);
      }, delay);

      this.currentSequenceTimeouts.push(timeout);
      accumulatedTimeMs += beats * beatDurationMs;
    });

    const finalTimeout = setTimeout(() => {
      onEnd?.();
    }, accumulatedTimeMs + 200);

    this.currentSequenceTimeouts.push(finalTimeout);
  }
}

export const audioEngine = new AudioEngineService();
