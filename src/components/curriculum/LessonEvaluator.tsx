"use client";

import React, { useState, useEffect } from "react";
import { EvaluationItem } from "@/types/curriculum";
import InteractiveKeyboard from "./InteractiveKeyboard";
import { audioEngine } from "@/lib/audio/audioEngine";
import { Award, CheckCircle2, XCircle, Volume2, ArrowRight, RotateCcw, Sparkles, HelpCircle, Lock, Unlock } from "lucide-react";

export interface LessonEvaluatorProps {
  evaluationItems: EvaluationItem[];
  passingScore?: number;
  onComplete: (score: number, passed: boolean) => void;
  onNextLesson?: () => void;
  isSidebarCollapsed?: boolean;
}

export default function LessonEvaluator({
  evaluationItems,
  passingScore = 80,
  onComplete,
  onNextLesson,
  isSidebarCollapsed,
}: LessonEvaluatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userSelectedKeys, setUserSelectedKeys] = useState<string[]>([]);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ isCorrect: boolean; explanation: string }[]>([]);
  const [isEvaluationFinished, setIsEvaluationFinished] = useState(false);

  const currentItem = evaluationItems[currentIndex];

  // Reset answer states when switching question
  useEffect(() => {
    setSelectedOption(null);
    setUserSelectedKeys([]);
    setIsAnswerSubmitted(false);
  }, [currentIndex]);

  const handlePlayAudioPrompt = () => {
    if (!currentItem?.audioPromptNotes || currentItem.audioPromptNotes.length === 0) return;
    
    // Play sequence
    if (currentItem.audioPromptNotes.length === 1) {
      audioEngine.playNote(currentItem.audioPromptNotes[0], "2n");
    } else {
      const sequence = currentItem.audioPromptNotes.map((n) => ({
        note: n,
        durationBeats: 1,
      }));
      audioEngine.playSequence(sequence, 90);
    }
  };

  const handleKeyClickInSpotting = (note: string) => {
    if (isAnswerSubmitted) return;

    setUserSelectedKeys((prev) => {
      if (prev.includes(note)) {
        return prev.filter((k) => k !== note);
      } else {
        const requiredCount = currentItem.targetKeys?.length || 1;
        // If single note expected, replace selection
        if (requiredCount === 1) {
          return [note];
        }
        return [...prev, note];
      }
    });
  };

  const handleValidateCurrentQuestion = () => {
    if (isAnswerSubmitted || !currentItem) return;

    let isCorrect = false;

    if (currentItem.type === "theory-quiz" || currentItem.type === "sound-to-symbol") {
      isCorrect = selectedOption === currentItem.correctAnswerIndex;
    } else if (currentItem.type === "spotting") {
      const target = currentItem.targetKeys || [];
      const userKeys = userSelectedKeys;
      isCorrect = target.length === userKeys.length && target.every((k) => userKeys.includes(k));
    }

    const updatedAnswers = [
      ...userAnswers,
      { isCorrect, explanation: currentItem.explanation },
    ];

    setUserAnswers(updatedAnswers);
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < evaluationItems.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Evaluation finished
      finishEvaluation();
    }
  };

  const finishEvaluation = () => {
    const correctCount = userAnswers.filter((a) => a.isCorrect).length;
    const finalScore = Math.round((correctCount / evaluationItems.length) * 100);
    const passed = finalScore >= passingScore;

    setIsEvaluationFinished(true);
    onComplete(finalScore, passed);
  };

  const restartEvaluation = () => {
    setCurrentIndex(0);
    setUserAnswers([]);
    setSelectedOption(null);
    setUserSelectedKeys([]);
    setIsAnswerSubmitted(false);
    setIsEvaluationFinished(false);
  };

  // ----------------------------------------------------
  // RESULT SCREEN
  // ----------------------------------------------------
  if (isEvaluationFinished) {
    const correctCount = userAnswers.filter((a) => a.isCorrect).length;
    const finalScore = Math.round((correctCount / evaluationItems.length) * 100);
    const passed = finalScore >= passingScore;

    return (
      <div
        className={`bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl animate-fade-in mr-0 transition-all ${
          isSidebarCollapsed
            ? "w-full ml-0"
            : "w-full lg:w-[calc(100%+21.25rem)] lg:-ml-[21.25rem]"
        }`}
      >
        <div className="inline-flex p-4 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-inner">
          {passed ? (
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20">
              <Award className="w-12 h-12 animate-bounce" />
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-lg shadow-rose-500/20">
              <XCircle className="w-12 h-12" />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-2xl font-black text-white">
            {passed ? "Félicitations ! Épreuve Réussie" : "Validation Non Atteinte"}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {passed
              ? "Vous avez validé les compétences de cette leçon et débloqué l'étape suivante."
              : `Un score minimum de ${passingScore}% est requis pour déverrouiller la suite du parcours.`}
          </p>
        </div>

        {/* Score Gauge */}
        <div className="inline-flex flex-col items-center p-5 rounded-2xl bg-slate-950/60 border border-slate-800 min-w-[220px]">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Score Obtenu</span>
          <span
            className={`text-5xl font-black font-mono my-1 ${
              passed ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {finalScore}%
          </span>
          <span className="text-xs text-slate-500">
            {correctCount} / {evaluationItems.length} réponses exactes
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={restartEvaluation}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center justify-center gap-2 border border-slate-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Recommencer le Test</span>
          </button>

          {passed && onNextLesson && (
            <button
              onClick={onNextLesson}
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 font-semibold"
            >
              <span>Leçon Suivante</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // QUESTION IN PROGRESS
  // ----------------------------------------------------
  const isCurrentCorrect = isAnswerSubmitted ? userAnswers[currentIndex]?.isCorrect : null;

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-6 shadow-xl mr-0 transition-all ${
        isSidebarCollapsed
          ? "w-full ml-0"
          : "w-full lg:w-[calc(100%+21.25rem)] lg:-ml-[21.25rem]"
      }`}
    >
      {/* Header with Progress Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-bold text-xs border border-sky-500/30">
            Question {currentIndex + 1} / {evaluationItems.length}
          </span>
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            {currentItem.type === "spotting" && "Repérage Clavier"}
            {currentItem.type === "sound-to-symbol" && "Écoute & Analyse"}
            {currentItem.type === "theory-quiz" && "QCM Théorique"}
          </span>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5">
          {evaluationItems.map((_, idx) => (
            <div
              key={idx}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                idx === currentIndex
                  ? "bg-sky-400 scale-125 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                  : idx < userAnswers.length
                  ? userAnswers[idx]?.isCorrect
                    ? "bg-emerald-500"
                    : "bg-rose-500"
                  : "bg-slate-800"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Prompt Question */}
      <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5">
        <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
          {currentItem.prompt}
        </h4>

        {/* Audio Button for Sound-to-Symbol */}
        {currentItem.type === "sound-to-symbol" && currentItem.audioPromptNotes && (
          <div className="mt-4">
            <button
              onClick={handlePlayAudioPrompt}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-sky-900/30 transition active:scale-95"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span>Écouter l'Extrait Sonore 🎵</span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive Mode: Spotting on Keyboard */}
      {currentItem.type === "spotting" && (
        <div className="space-y-3">
          <div className="w-full pt-1">
            <InteractiveKeyboard
              mode="spotting"
              userSelection={userSelectedKeys}
              onKeyClick={handleKeyClickInSpotting}
              spottingFeedback={
                isAnswerSubmitted
                  ? {
                      correct: currentItem.targetKeys || [],
                      incorrect: userSelectedKeys.filter((k) => !(currentItem.targetKeys || []).includes(k)),
                    }
                  : undefined
              }
            />
          </div>
          <div className="text-center text-xs text-slate-400">
            Touches sélectionnées :{" "}
            {userSelectedKeys.length > 0 ? (
              <span className="font-mono font-bold text-sky-400">
                {userSelectedKeys.join(", ")}
              </span>
            ) : (
              <span className="italic text-slate-500">Aucune (cliquez sur le clavier ci-dessus)</span>
            )}
          </div>
        </div>
      )}

      {/* Multiple Choice Options (Theory-Quiz & Sound-to-Symbol) */}
      {(currentItem.type === "theory-quiz" || currentItem.type === "sound-to-symbol") &&
        currentItem.options && (
          <div className="grid grid-cols-1 gap-2.5">
            {currentItem.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              const isCorrectOption = optIdx === currentItem.correctAnswerIndex;

              let optionStyle = "bg-slate-950/40 border-slate-800 hover:bg-slate-800/60 text-slate-200";

              if (isAnswerSubmitted) {
                if (isCorrectOption) {
                  optionStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-200 font-semibold";
                } else if (isSelected && !isCorrectOption) {
                  optionStyle = "bg-rose-950/40 border-rose-500 text-rose-200";
                } else {
                  optionStyle = "bg-slate-950/20 border-slate-900 text-slate-600 opacity-60";
                }
              } else if (isSelected) {
                optionStyle = "bg-sky-950/50 border-sky-500 text-sky-200 ring-1 ring-sky-500/50";
              }

              return (
                <button
                  key={optIdx}
                  disabled={isAnswerSubmitted}
                  onClick={() => setSelectedOption(optIdx)}
                  className={`w-full p-3.5 rounded-xl border text-left text-sm transition flex items-center justify-between gap-3 ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-800 font-mono text-xs flex items-center justify-center font-bold text-slate-300 shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {isAnswerSubmitted && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  )}
                  {isAnswerSubmitted && isSelected && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

      {/* Explanation & Validation Feedback */}
      {isAnswerSubmitted && (
        <div
          className={`p-4 rounded-2xl border transition-all animate-fade-in ${
            isCurrentCorrect
              ? "bg-emerald-950/30 border-emerald-800/60 text-emerald-200"
              : "bg-rose-950/30 border-rose-800/60 text-rose-200"
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm mb-1">
            {isCurrentCorrect ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Excellente réponse !</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-400" />
                <span>Réponse incorrecte</span>
              </>
            )}
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            {currentItem.explanation}
          </p>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex justify-end pt-2">
        {!isAnswerSubmitted ? (
          <button
            disabled={
              (currentItem.type === "spotting" && userSelectedKeys.length === 0) ||
              ((currentItem.type === "theory-quiz" || currentItem.type === "sound-to-symbol") &&
                selectedOption === null)
            }
            onClick={handleValidateCurrentQuestion}
            className="px-6 py-3 rounded-xl font-bold bg-sky-600 hover:bg-sky-500 disabled:opacity-40 disabled:cursor-not-allowed text-white transition flex items-center gap-2 shadow-lg shadow-sky-900/30"
          >
            <span>Valider ma réponse</span>
            <CheckCircle2 className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            className="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white transition flex items-center gap-2 shadow-lg shadow-indigo-900/30"
          >
            <span>
              {currentIndex + 1 < evaluationItems.length
                ? "Question Suivante"
                : "Voir mes Résultats"}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
