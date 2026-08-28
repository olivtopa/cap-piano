"use client";

import React from "react";
import { CURRICULUM_DATA } from "@/data/curriculumData";
import { CurriculumProgress, Lesson } from "@/types/curriculum";
import { CheckCircle2, Lock, Unlock, BookOpen, Sparkles, Trophy, ChevronRight, RotateCcw } from "lucide-react";
import { resetCurriculumProgress } from "@/lib/store/progressStore";

export interface CurriculumSidebarProps {
  currentLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  progress: CurriculumProgress;
}

export default function CurriculumSidebar({
  currentLessonId,
  onSelectLesson,
  progress,
}: CurriculumSidebarProps) {
  const totalLessons = CURRICULUM_DATA.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedCount = Object.keys(progress.completedLessons).length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const handleReset = () => {
    if (window.confirm("Êtes-vous sûr(e) de vouloir réinitialiser toute votre progression de cours ?")) {
      resetCurriculumProgress();
    }
  };

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 flex flex-col justify-between shadow-xl space-y-6">
      {/* Top Header & Global Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Parcours Piano</h2>
              <span className="text-[11px] text-slate-400">Curriculum Fondamental</span>
            </div>
          </div>

          <button
            onClick={handleReset}
            title="Réinitialiser la progression"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Progression Globale
            </span>
            <span className="font-bold font-mono text-sky-400">{progressPercent}%</span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="text-[10px] text-slate-500 text-right">
            {completedCount} / {totalLessons} leçons validées (≥ 80%)
          </div>
        </div>

        {/* Modules & Lessons List */}
        <div className="space-y-4 max-h-[calc(100vh-340px)] overflow-y-auto pr-1">
          {CURRICULUM_DATA.map((module, modIdx) => (
            <div key={module.id} className="space-y-1.5">
              <div className="px-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Module {modIdx + 1}
              </div>

              <div className="space-y-1">
                {module.lessons.map((lesson) => {
                  const isUnlocked = progress.unlockedLessons.includes(lesson.id);
                  const isCompleted = !!progress.completedLessons[lesson.id];
                  const completionScore = progress.completedLessons[lesson.id]?.score;
                  const isSelected = currentLessonId === lesson.id;

                  return (
                    <button
                      key={lesson.id}
                      disabled={!isUnlocked}
                      onClick={() => onSelectLesson(lesson.id)}
                      className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? "bg-sky-600/20 border border-sky-500/50 text-white ring-1 ring-sky-500/30"
                          : isUnlocked
                          ? "bg-slate-950/40 hover:bg-slate-800/60 border border-slate-800 text-slate-300"
                          : "bg-slate-950/20 border border-slate-900 text-slate-600 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : isUnlocked ? (
                          <Unlock className="w-4 h-4 text-sky-400 shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                        )}

                        <span className="text-xs font-semibold truncate">
                          {lesson.title}
                        </span>
                      </div>

                      {/* Status / Score Tag */}
                      <div className="shrink-0">
                        {isCompleted && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                            {completionScore}%
                          </span>
                        )}
                        {!isCompleted && isUnlocked && isSelected && (
                          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-[11px] text-slate-500 text-center pt-2 border-t border-slate-800/60">
        Méthode Sound-to-Symbol & Solfège Interactif
      </div>
    </aside>
  );
}
