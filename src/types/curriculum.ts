export type Hand = 'RH' | 'LH' | 'both';

export type Finger = 1 | 2 | 3 | 4 | 5;

export interface KeyTarget {
  note: string;         // Ex: 'C4', 'G3', 'F#4'
  finger?: Finger;      // Doigté recommandé (1=Pouce, 2=Index, 3=Majeur, 4=Annulaire, 5=Auriculaire)
  hand?: Hand;          // Main Droite ('RH') ou Main Gauche ('LH')
  durationBeats?: number;
}

export type EvaluationType = 
  | 'spotting'          // Cliquer sur les bonnes touches du clavier virtuel
  | 'sound-to-symbol'   // Identifier une note, un degré ou un accord à l'écoute
  | 'theory-quiz'       // QCM de validation théorique
  | 'self-check';       // Validation assistée par critères objectifs

export interface EvaluationItem {
  id: string;
  type: EvaluationType;
  prompt: string;
  audioPromptNotes?: string[]; // Notes to play if sound-to-symbol (e.g. ['C4'], ['C4', 'E4', 'G4'], etc.)
  audioPromptUrl?: string;
  targetKeys?: string[];       // Target notes to spot on keyboard (e.g. ['C4'], ['C4', 'E4', 'G4'])
  options?: string[];
  correctAnswerIndex?: number;
  explanation: string;
}

export interface PracticeGuide {
  instructions: string[];
  bpmTarget: number;
  hand: Hand;
  fingeringPattern: string;
  selfChecklist: string[];
}

export interface Lesson {
  id: string;
  title: string;
  category: 'Anatomy' | 'Notation' | 'Rhythm' | 'Technique' | 'Harmony';
  description: string;
  theoryHtml: string;
  demonstration?: {
    sequence: KeyTarget[];
    bpm: number;
  };
  practiceGuide: PracticeGuide;
  evaluation: EvaluationItem[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface LessonCompletion {
  score: number;
  completedAt: string;
}

export interface CurriculumProgress {
  unlockedLessons: string[];
  completedLessons: Record<string, LessonCompletion>;
}
