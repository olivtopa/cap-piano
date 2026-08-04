import { ExerciseProgress, EvaluationScore } from "@/types/exercise";

/**
 * Algorithme SuperMemo-2 (SM-2) pour la Répétition Espacée.
 * Évaluation :
 * - "hard" (🔴 Rouge) : q = 1 (Révision immédiate / dès demain avec intervalle court)
 * - "good" (🟡 Jaune) : q = 3 (Validé partiellement, révision sous 2-3 jours)
 * - "easy" (🟢 Vert)  : q = 5 (Validé avec aisance, intervalle augmenté)
 */
export function calculateSM2(
  rating: EvaluationScore,
  previousProgress?: ExerciseProgress
): Omit<ExerciseProgress, "exerciseId" | "lastEvaluated"> {
  const currentInterval = previousProgress?.interval ?? 0;
  const currentRepetition = previousProgress?.repetition ?? 0;
  const currentEFactor = previousProgress?.efactor ?? 2.5;

  let quality = 3;
  if (rating === "again" || rating === "hard") quality = 1;
  else if (rating === "good") quality = 3;
  else if (rating === "easy") quality = 5;

  let newInterval: number;
  let newRepetition: number;
  let newEFactor: number;

  if (quality < 3) {
    // Échec / Difficile -> Réinitialiser le cycle
    newRepetition = 0;
    newInterval = 1; // Revoir demain
  } else {
    // Succès
    if (currentRepetition === 0) {
      newInterval = 1;
    } else if (currentRepetition === 1) {
      newInterval = quality === 5 ? 4 : 2; // 2 à 4 jours
    } else {
      newInterval = Math.round(currentInterval * currentEFactor);
    }
    newRepetition = currentRepetition + 1;
  }

  // Calcul du nouvel Easiness Factor (EF)
  // EF' = EF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  newEFactor = currentEFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEFactor < 1.3) newEFactor = 1.3; // Plafond minimal

  const nextDueDate = new Date();
  nextDueDate.setDate(nextDueDate.getDate() + newInterval);

  return {
    interval: newInterval,
    repetition: newRepetition,
    efactor: Number(newEFactor.toFixed(2)),
    nextDueDate: nextDueDate.toISOString(),
    lastRating: rating,
  };
}
