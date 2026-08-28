"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Timer, CheckCircle2, ChevronRight, Volume2, Music, Sparkles } from "lucide-react";
import { audioEngine } from "@/lib/audio/audioEngine";

export interface PracticeCoachProps {
  targetBpm: number;
  pattern: string;
  checklist: string[];
  instructions: string[];
  onReadyForEvaluation: () => void;
}

export default function PracticeCoach({
  targetBpm,
  pattern,
  checklist,
  instructions,
  onReadyForEvaluation,
}: PracticeCoachProps) {
  // Metronome State
  const [bpm, setBpm] = useState(targetBpm);
  const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
  const [beatCount, setBeatCount] = useState(0);
  const beatsPerMeasure = 4;

  // Timer State
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);

  // Checklist State
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  // Metronome interval ref
  const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Metronome tick logic
  const handleTick = useCallback(() => {
    setBeatCount((prev) => {
      const nextBeat = (prev % beatsPerMeasure) + 1;
      const isAccent = nextBeat === 1;
      audioEngine.playMetronomeClick(isAccent);
      return nextBeat;
    });
  }, [beatsPerMeasure]);

  useEffect(() => {
    if (isMetronomePlaying) {
      const intervalMs = (60 / bpm) * 1000;
      metronomeIntervalRef.current = setInterval(handleTick, intervalMs);
    } else {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
        metronomeIntervalRef.current = null;
      }
      setBeatCount(0);
    }

    return () => {
      if (metronomeIntervalRef.current) {
        clearInterval(metronomeIntervalRef.current);
      }
    };
  }, [isMetronomePlaying, bpm, handleTick]);

  // Practice Timer logic
  useEffect(() => {
    let timerInterval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeLeft > 0) {
      timerInterval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isTimerRunning && timeLeft === 0) {
      setIsTimerRunning(false);
      setTimerFinished(true);
      setIsMetronomePlaying(false);
      audioEngine.playChord(["C5", "E5", "G5", "C6"], "1m");
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [isTimerRunning, timeLeft]);

  const toggleMetronome = () => {
    setIsMetronomePlaying((prev) => !prev);
  };

  const handleTimerPreset = (minutes: number) => {
    setTimerMinutes(minutes);
    setTimeLeft(minutes * 60);
    setIsTimerRunning(false);
    setTimerFinished(false);
  };

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(timerMinutes * 60);
      setTimerFinished(false);
    }
    setIsTimerRunning((prev) => !prev);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimeLeft(timerMinutes * 60);
    setTimerFinished(false);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleCheckItem = (idx: number) => {
    setCheckedItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const allChecked = checklist.length > 0 && checklist.every((_, idx) => !!checkedItems[idx]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Instructions for Real Instrument */}
      <div className="bg-gradient-to-r from-sky-950/70 via-indigo-950/60 to-slate-900 border border-sky-800/40 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
            <Music className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Consignes d'Exécution sur Piano Réel</h3>
            <p className="text-xs text-sky-300">Doigté recommandé : <span className="font-mono font-semibold text-white">{pattern}</span></p>
          </div>
        </div>

        <ul className="space-y-2">
          {instructions.map((inst, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-slate-200">
              <span className="w-5 h-5 rounded-full bg-sky-500/20 text-sky-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{inst}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Grid: Metronome & Session Timer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Metronome Tool */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-indigo-400" />
              <span className="font-semibold text-slate-200 text-sm">Métronome Précision</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Cible : {targetBpm} BPM
            </span>
          </div>

          <div className="flex items-center justify-center gap-6 my-2">
            <button
              onClick={() => setBpm((b) => Math.max(40, b - 5))}
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold text-lg transition flex items-center justify-center border border-slate-700"
            >
              -5
            </button>
            <div className="text-center">
              <div className="text-4xl font-extrabold text-white font-mono">{bpm}</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Battements / min</div>
            </div>
            <button
              onClick={() => setBpm((b) => Math.min(208, b + 5))}
              className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 font-bold text-lg transition flex items-center justify-center border border-slate-700"
            >
              +5
            </button>
          </div>

          {/* Beat visualizer (4 dots) */}
          <div className="flex justify-center gap-2 my-3">
            {[1, 2, 3, 4].map((b) => (
              <div
                key={b}
                className={`w-3 h-3 rounded-full transition-all duration-75 ${
                  beatCount === b
                    ? b === 1
                      ? "bg-amber-400 scale-125 shadow-[0_0_10px_rgba(251,191,36,0.9)]"
                      : "bg-indigo-400 scale-110 shadow-[0_0_8px_rgba(129,140,248,0.8)]"
                    : "bg-slate-800"
                }`}
              />
            ))}
          </div>

          <button
            onClick={toggleMetronome}
            className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${
              isMetronomePlaying
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/30"
            }`}
          >
            {isMetronomePlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isMetronomePlaying ? "Arrêter le Métronome" : "Démarrer le Métronome"}
          </button>
        </div>

        {/* Practice Session Timer */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-amber-400" />
              <span className="font-semibold text-slate-200 text-sm">Minuteur de Séance</span>
            </div>
            {timerFinished && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-bounce">
                🎉 Temps écoulé !
              </span>
            )}
          </div>

          <div className="text-center my-1">
            <div className={`text-4xl font-extrabold font-mono tracking-wider ${timeLeft <= 60 && isTimerRunning ? "text-rose-400 animate-pulse" : "text-white"}`}>
              {formatTimer(timeLeft)}
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="flex justify-center gap-2 my-2">
            {[5, 10, 15, 20, 30].map((m) => (
              <button
                key={m}
                onClick={() => handleTimerPreset(m)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                  timerMinutes === m && !isTimerRunning
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                }`}
              >
                {m}m
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleTimer}
              className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${
                isTimerRunning
                  ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/30"
                  : "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-900/20"
              }`}
            >
              {isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isTimerRunning ? "Pause" : "Lancer le Minuteur"}
            </button>
            <button
              onClick={resetTimer}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Réinitialiser"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Technical Self-Checklist */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Check-list Technique d'Auto-Évaluation
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Cochez les critères validés sur votre instrument avant de passer à l'épreuve de validation.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
            {Object.values(checkedItems).filter(Boolean).length} / {checklist.length}
          </span>
        </div>

        <div className="space-y-2.5">
          {checklist.map((item, idx) => (
            <label
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer select-none ${
                checkedItems[idx]
                  ? "bg-emerald-950/20 border-emerald-800/50 text-emerald-100"
                  : "bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50 text-slate-300"
              }`}
            >
              <input
                type="checkbox"
                checked={!!checkedItems[idx]}
                onChange={() => toggleCheckItem(idx)}
                className="mt-0.5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-950 w-4 h-4 cursor-pointer"
              />
              <span className="text-sm font-medium leading-relaxed">{item}</span>
            </label>
          ))}
        </div>

        {/* CTA: Go to evaluation */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            {allChecked ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5 justify-center sm:justify-start">
                <Sparkles className="w-4 h-4" /> Vous êtes prêt(e) pour le test de validation !
              </span>
            ) : (
              <span>Prenez le temps d'assimiler les gestes sur votre clavier avant l'épreuve.</span>
            )}
          </div>

          <button
            onClick={onReadyForEvaluation}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
              allChecked
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-900/30 scale-105"
                : "bg-sky-600 hover:bg-sky-500 text-white shadow-sky-900/30"
            }`}
          >
            <span>Passer à l'Évaluation</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
