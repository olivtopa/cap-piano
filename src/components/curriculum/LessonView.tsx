"use client";

import React, { useState, useEffect } from "react";
import { Lesson, KeyTarget } from "@/types/curriculum";
import InteractiveKeyboard from "./InteractiveKeyboard";
import PracticeCoach from "./PracticeCoach";
import LessonEvaluator from "./LessonEvaluator";
import { completeLessonInStore } from "@/lib/store/progressStore";
import { audioEngine } from "@/lib/audio/audioEngine";
import { BookOpen, Music, CheckCircle2, Play, Pause, RotateCcw, Sparkles, ChevronRight, Layers } from "lucide-react";

export interface LessonViewProps {
  lesson: Lesson;
  onNavigateLesson: (lessonId: string) => void;
}

export default function LessonView({ lesson, onNavigateLesson }: LessonViewProps) {
  const [activeTab, setActiveTab] = useState<"theory" | "practice" | "eval">("theory");

  // Demonstration playback state
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [activeDemoKeys, setActiveDemoKeys] = useState<KeyTarget[]>([]);

  // When lesson changes, reset tab to theory & stop audio
  useEffect(() => {
    setActiveTab("theory");
    setIsDemoPlaying(false);
    setActiveDemoKeys([]);
    audioEngine.stopSequence();
  }, [lesson.id]);

  const handlePlayDemo = () => {
    if (!lesson.demonstration || lesson.demonstration.sequence.length === 0) return;

    if (isDemoPlaying) {
      audioEngine.stopSequence();
      setIsDemoPlaying(false);
      setActiveDemoKeys([]);
      return;
    }

    setIsDemoPlaying(true);
    const { sequence, bpm } = lesson.demonstration;

    audioEngine.playSequence(
      sequence,
      bpm,
      (currentNote) => {
        setActiveDemoKeys([currentNote]);
      },
      () => {
        setIsDemoPlaying(false);
        setActiveDemoKeys([]);
      }
    );
  };

  const handleEvaluationComplete = (score: number, passed: boolean) => {
    const result = completeLessonInStore(lesson.id, score);
    if (result.passed && result.nextLessonId) {
      // Unlocked
    }
  };

  const handleNextLesson = () => {
    const result = completeLessonInStore(lesson.id, 100);
    if (result.nextLessonId) {
      onNavigateLesson(result.nextLessonId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Lesson Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
            {lesson.category}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {lesson.id.toUpperCase()}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
          {lesson.title}
        </h1>
        <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-4xl">
          {lesson.description}
        </p>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 p-1.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 overflow-x-auto">
          <button
            onClick={() => setActiveTab("theory")}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeTab === "theory"
                ? "bg-sky-600 text-white shadow-md shadow-sky-900/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Théorie & Démo</span>
          </button>

          <button
            onClick={() => setActiveTab("practice")}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeTab === "practice"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <Music className="w-4 h-4" />
            <span>2. Pratique Piano</span>
          </button>

          <button
            onClick={() => setActiveTab("eval")}
            className={`flex-1 min-w-[120px] py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              activeTab === "eval"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>3. Épreuve Validante</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Theory & Demonstration */}
      {activeTab === "theory" && (
        <div className="space-y-6 animate-fade-in">
          {/* Theory Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
            <h3 className="text-base sm:text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-400" />
              Notions Fondamentales
            </h3>

            <div
              className="prose prose-invert prose-sky max-w-none text-slate-300 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: lesson.theoryHtml }}
            />
          </div>

          {/* Demonstration Card */}
          {lesson.demonstration && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Démonstration Visuelle & Sonore
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tempo de démo : {lesson.demonstration.bpm} BPM • Les touches s'animent avec les pastilles de doigtés
                  </p>
                </div>

                <button
                  onClick={handlePlayDemo}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 shadow-lg ${
                    isDemoPlaying
                      ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30"
                      : "bg-sky-600 hover:bg-sky-500 text-white shadow-sky-900/30"
                  }`}
                >
                  {isDemoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isDemoPlaying ? "Interrompre la Démo" : "Lancer la Démo 🎹"}</span>
                </button>
              </div>

              {/* Interactive Keyboard in Playback Mode */}
              <InteractiveKeyboard
                mode="playback"
                activeKeys={activeDemoKeys}
                showFingeringBadges={true}
              />
            </div>
          )}

          {/* Quick link to practice */}
          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab("practice")}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition flex items-center gap-2 shadow-lg shadow-indigo-900/30"
            >
              <span>Passer à la Pratique sur Instrument</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Practice Coach */}
      {activeTab === "practice" && (
        <div className="animate-fade-in">
          <PracticeCoach
            targetBpm={lesson.practiceGuide.bpmTarget}
            pattern={lesson.practiceGuide.fingeringPattern}
            instructions={lesson.practiceGuide.instructions}
            checklist={lesson.practiceGuide.selfChecklist}
            onReadyForEvaluation={() => setActiveTab("eval")}
          />
        </div>
      )}

      {/* Tab 3: Evaluation */}
      {activeTab === "eval" && (
        <div className="animate-fade-in">
          <LessonEvaluator
            evaluationItems={lesson.evaluation}
            passingScore={80}
            onComplete={handleEvaluationComplete}
            onNextLesson={handleNextLesson}
          />
        </div>
      )}
    </div>
  );
}
