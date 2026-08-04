import { ExerciseData } from "@/types/exercise";

export const EXERCISES_DATABASE: ExerciseData[] = [
  {
    id: "ex-1",
    title: "1. Gamme de Do Majeur & Harmonies Base",
    description: "Entraînement au passage du pouce et coordination des deux mains.",
    bpm: 75,
    timeSignature: [4, 4],
    notes: [
      // Main Droite (Clé de Sol)
      { time: "0:0:0", note: "C4", duration: "4n", hand: "right", finger: 1 },
      { time: "0:1:0", note: "D4", duration: "4n", hand: "right", finger: 2 },
      { time: "0:2:0", note: "E4", duration: "4n", hand: "right", finger: 3 },
      { time: "0:3:0", note: "F4", duration: "4n", hand: "right", finger: 1 },
      { time: "1:0:0", note: "G4", duration: "4n", hand: "right", finger: 2 },
      { time: "1:1:0", note: "A4", duration: "4n", hand: "right", finger: 3 },
      { time: "1:2:0", note: "B4", duration: "4n", hand: "right", finger: 4 },
      { time: "1:3:0", note: "C5", duration: "4n", hand: "right", finger: 5 },
      // Main Gauche (Clé de Fa)
      { time: "0:0:0", note: "C3", duration: "2n", hand: "left", finger: 5 },
      { time: "0:2:0", note: "G3", duration: "2n", hand: "left", finger: 1 },
      { time: "1:0:0", note: "C3", duration: "2n", hand: "left", finger: 5 },
      { time: "1:2:0", note: "G3", duration: "2n", hand: "left", finger: 1 },
    ],
  },
  {
    id: "ex-2",
    title: "2. Tierces Suspendues & Indépendance",
    description: "Travail de l'écartement des doigts (3e et 4e doigts) et soutien de la basse.",
    bpm: 70,
    timeSignature: [4, 4],
    notes: [
      // Main Droite
      { time: "0:0:0", note: "C4", duration: "4n", hand: "right", finger: 1 },
      { time: "0:1:0", note: "E4", duration: "4n", hand: "right", finger: 3 },
      { time: "0:2:0", note: "D4", duration: "4n", hand: "right", finger: 2 },
      { time: "0:3:0", note: "F4", duration: "4n", hand: "right", finger: 4 },
      { time: "1:0:0", note: "E4", duration: "4n", hand: "right", finger: 3 },
      { time: "1:1:0", note: "G4", duration: "4n", hand: "right", finger: 5 },
      { time: "1:2:0", note: "D4", duration: "4n", hand: "right", finger: 2 },
      { time: "1:3:0", note: "C4", duration: "4n", hand: "right", finger: 1 },
      // Main Gauche
      { time: "0:0:0", note: "C3", duration: "4n", hand: "left", finger: 5 },
      { time: "0:1:0", note: "G3", duration: "4n", hand: "left", finger: 1 },
      { time: "0:2:0", note: "C3", duration: "4n", hand: "left", finger: 5 },
      { time: "0:3:0", note: "G3", duration: "4n", hand: "left", finger: 1 },
      { time: "1:0:0", note: "C3", duration: "4n", hand: "left", finger: 5 },
      { time: "1:1:0", note: "G3", duration: "4n", hand: "left", finger: 1 },
      { time: "1:2:0", note: "C3", duration: "2n", hand: "left", finger: 5 },
    ],
  },
  {
    id: "ex-3",
    title: "3. Enchaînement d'Accords Do-Fa-Sol-Do",
    description: "Introduction à l'accompagnement harmonique populaire et cadence parfaite.",
    bpm: 65,
    timeSignature: [4, 4],
    notes: [
      // Main Droite
      { time: "0:0:0", note: "E4", duration: "2n", hand: "right", finger: 3 },
      { time: "0:2:0", note: "F4", duration: "2n", hand: "right", finger: 4 },
      { time: "1:0:0", note: "D4", duration: "2n", hand: "right", finger: 2 },
      { time: "1:2:0", note: "C4", duration: "2n", hand: "right", finger: 1 },
      // Main Gauche
      { time: "0:0:0", note: "C3", duration: "2n", hand: "left", finger: 5 },
      { time: "0:2:0", note: "F3", duration: "2n", hand: "left", finger: 2 },
      { time: "1:0:0", note: "G3", duration: "2n", hand: "left", finger: 1 },
      { time: "1:2:0", note: "C3", duration: "2n", hand: "left", finger: 5 },
    ],
  },
  {
    id: "ex-4",
    title: "4. Arpèges Fluides Do Majeur",
    description: "Développement de la régularité du toucher et du délié des doigts.",
    bpm: 80,
    timeSignature: [4, 4],
    notes: [
      // Main Droite
      { time: "0:0:0", note: "C4", duration: "4n", hand: "right", finger: 1 },
      { time: "0:1:0", note: "E4", duration: "4n", hand: "right", finger: 2 },
      { time: "0:2:0", note: "G4", duration: "4n", hand: "right", finger: 3 },
      { time: "0:3:0", note: "C5", duration: "4n", hand: "right", finger: 5 },
      { time: "1:0:0", note: "G4", duration: "4n", hand: "right", finger: 3 },
      { time: "1:1:0", note: "E4", duration: "4n", hand: "right", finger: 2 },
      { time: "1:2:0", note: "C4", duration: "2n", hand: "right", finger: 1 },
      // Main Gauche
      { time: "0:0:0", note: "C3", duration: "1m", hand: "left", finger: 5 },
      { time: "1:0:0", note: "G3", duration: "1m", hand: "left", finger: 1 },
    ],
  },
];
