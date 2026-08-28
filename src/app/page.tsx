"use client";

import React, { useState, useMemo } from "react";
import PianoVisualPlayer from "@/components/player/PianoVisualPlayer";
import CurriculumSidebar from "@/components/curriculum/CurriculumSidebar";
import LessonView from "@/components/curriculum/LessonView";
import { CURRICULUM_DATA } from "@/data/curriculumData";
import { useCurriculumProgress } from "@/lib/store/progressStore";
import { GraduationCap, Music, Sparkles, Layers, BookOpen } from "lucide-react";

export default function Home() {
  const [appMode, setAppMode] = useState<"curriculum" | "free-play">("curriculum");
  const [currentLessonId, setCurrentLessonId] = useState<string>("lesson-1-1");
  const progress = useCurriculumProgress();

  // Find current lesson object
  const currentLesson = useMemo(() => {
    for (const mod of CURRICULUM_DATA) {
      const found = mod.lessons.find((l) => l.id === currentLessonId);
      if (found) return found;
    }
    return CURRICULUM_DATA[0].lessons[0];
  }, [currentLessonId]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-teal-400 p-0.5 shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Music className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">CAP PIANO</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  v2.0 Pédagogique
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Méthode Sound-to-Symbol & Pratique Autonome
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
            <button
              onClick={() => setAppMode("curriculum")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                appMode === "curriculum"
                  ? "bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-900/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Parcours Fondamental</span>
            </button>

            <button
              onClick={() => setAppMode("free-play")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                appMode === "free-play"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-900/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Atelier & Exercices Libres</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 md:p-6">
        {appMode === "curriculum" ? (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <CurriculumSidebar
              currentLessonId={currentLessonId}
              onSelectLesson={(id) => setCurrentLessonId(id)}
              progress={progress}
            />

            <div className="flex-1 w-full min-w-0">
              <LessonView
                lesson={currentLesson}
                onNavigateLesson={(id) => setCurrentLessonId(id)}
              />
            </div>
          </div>
        ) : (
          <div className="w-full">
            <PianoVisualPlayer />
          </div>
        )}
      </div>
    </main>
  );
}
