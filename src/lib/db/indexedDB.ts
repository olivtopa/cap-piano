import { openDB, DBSchema, IDBPDatabase } from "idb";
import { ExerciseProgress } from "@/types/exercise";

interface CapPianoDB extends DBSchema {
  progress: {
    key: string;
    value: ExerciseProgress;
  };
}

const DB_NAME = "cap-piano-db";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<CapPianoDB>> | null = null;

function getDB() {
  if (typeof window === "undefined") return null;
  if (!dbPromise) {
    dbPromise = openDB<CapPianoDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("progress")) {
          db.createObjectStore("progress", { keyPath: "exerciseId" });
        }
      },
    });
  }
  return dbPromise;
}

export async function saveExerciseProgress(progress: ExerciseProgress): Promise<void> {
  const db = await getDB();
  if (!db) return;
  await db.put("progress", progress);
}

export async function getExerciseProgress(exerciseId: string): Promise<ExerciseProgress | undefined> {
  const db = await getDB();
  if (!db) return undefined;
  return db.get("progress", exerciseId);
}

export async function getAllProgress(): Promise<ExerciseProgress[]> {
  const db = await getDB();
  if (!db) return [];
  return db.getAll("progress");
}
