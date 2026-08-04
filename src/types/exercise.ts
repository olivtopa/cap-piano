export type Hand = "right" | "left" | "both";

export interface NoteEvent {
  id?: string;
  time: string;       // ex: "0:0:0", "0:1:0" (Format Tone.Time)
  note: string;       // ex: "C4", "E4", "G4"
  duration: string;   // ex: "4n", "8n"
  hand: "right" | "left";
  finger: number;     // Doigté: 1 (Pouce) à 5 (Auriculaire)
  clef?: "treble" | "bass";
}

export interface ExerciseData {
  id: string;
  title: string;
  description: string;
  bpm: number;
  timeSignature: [number, number];
  notes: NoteEvent[];
}

export type EvaluationScore = "again" | "hard" | "good" | "easy"; // Red = hard/again, Yellow = good, Green = easy

export interface ExerciseProgress {
  exerciseId: string;
  interval: number;       // Repetition interval in days
  repetition: number;     // Repetition count
  efactor: number;        // Easiness factor (SM-2 default starts at 2.5)
  nextDueDate: string;    // ISO Date string
  lastEvaluated: string;  // ISO Date string
  lastRating: EvaluationScore;
}
