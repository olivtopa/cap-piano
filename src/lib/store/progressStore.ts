import { useEffect, useState } from "react";
import { CurriculumProgress } from "@/types/curriculum";
import { CURRICULUM_DATA } from "@/data/curriculumData";

const STORAGE_KEY = "cap_piano_curriculum_progress_v1";

const DEFAULT_PROGRESS: CurriculumProgress = {
  unlockedLessons: ["lesson-1-1"],
  completedLessons: {},
};

// Flatten all lesson IDs in order
export const ALL_LESSON_IDS: string[] = CURRICULUM_DATA.flatMap((mod) =>
  mod.lessons.map((l) => l.id)
);

export function getInitialProgress(): CurriculumProgress {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.unlockedLessons)) {
      if (!parsed.unlockedLessons.includes("lesson-1-1")) {
        parsed.unlockedLessons.push("lesson-1-1");
      }
      return parsed;
    }
  } catch (e) {
    console.error("Error reading curriculum progress:", e);
  }
  return DEFAULT_PROGRESS;
}

export function saveProgress(progress: CurriculumProgress) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    window.dispatchEvent(new Event("curriculum_progress_updated"));
  } catch (e) {
    console.error("Error saving curriculum progress:", e);
  }
}

export function completeLessonInStore(lessonId: string, score: number): { nextLessonId?: string; passed: boolean } {
  const current = getInitialProgress();
  const passed = score >= 80;

  // Record completion
  const previousBest = current.completedLessons[lessonId]?.score ?? 0;
  current.completedLessons[lessonId] = {
    score: Math.max(previousBest, score),
    completedAt: new Date().toISOString(),
  };

  let nextLessonId: string | undefined = undefined;

  if (passed) {
    const currentIndex = ALL_LESSON_IDS.indexOf(lessonId);
    if (currentIndex !== -1 && currentIndex + 1 < ALL_LESSON_IDS.length) {
      nextLessonId = ALL_LESSON_IDS[currentIndex + 1];
      if (!current.unlockedLessons.includes(nextLessonId)) {
        current.unlockedLessons.push(nextLessonId);
      }
    }
  }

  saveProgress(current);
  return { nextLessonId, passed };
}

export function resetCurriculumProgress() {
  saveProgress(DEFAULT_PROGRESS);
}

export function useCurriculumProgress() {
  const [progress, setProgress] = useState<CurriculumProgress>(DEFAULT_PROGRESS);

  useEffect(() => {
    setProgress(getInitialProgress());

    const handleUpdate = () => {
      setProgress(getInitialProgress());
    };

    window.addEventListener("curriculum_progress_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("curriculum_progress_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return progress;
}
