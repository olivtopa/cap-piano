"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";
import { Play, Pause, RotateCcw, Music, Sparkles, Sliders, ChevronLeft, ChevronRight, BookOpen, Timer as TimerIcon, Bell } from "lucide-react";
import dynamic from "next/dynamic";
import { ExerciseData, Hand, EvaluationScore, NoteEvent } from "@/types/exercise";
import SelfEvaluationModal from "./SelfEvaluationModal";
import { calculateSM2 } from "@/lib/srs/sm2Algorithm";
import { saveExerciseProgress, getExerciseProgress } from "@/lib/db/indexedDB";
import { EXERCISES_DATABASE } from "@/lib/exercisesData";

const SheetMusicView = dynamic(() => import("./SheetMusicView"), {
  ssr: false,
});

const PIANO_KEYS = [
  { note: "C3", isBlack: false }, { note: "C#3", isBlack: true },
  { note: "D3", isBlack: false }, { note: "D#3", isBlack: true },
  { note: "E3", isBlack: false },
  { note: "F3", isBlack: false }, { note: "F#3", isBlack: true },
  { note: "G3", isBlack: false }, { note: "G#3", isBlack: true },
  { note: "A3", isBlack: false }, { note: "A#3", isBlack: true },
  { note: "B3", isBlack: false },
  { note: "C4", isBlack: false }, { note: "C#4", isBlack: true },
  { note: "D4", isBlack: false }, { note: "D#4", isBlack: true },
  { note: "E4", isBlack: false },
  { note: "F4", isBlack: false }, { note: "F#4", isBlack: true },
  { note: "G4", isBlack: false }, { note: "G#4", isBlack: true },
  { note: "A4", isBlack: false }, { note: "A#4", isBlack: true },
  { note: "B4", isBlack: false },
  { note: "C5", isBlack: false },
];

export default function PianoVisualPlayer() {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const exercise = EXERCISES_DATABASE[currentExerciseIndex];

  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(exercise.bpm);
  const [selectedHand, setSelectedHand] = useState<Hand>("both");
  const [isLooping, setIsLooping] = useState(true);
  const [metronomeEnabled, setMetronomeEnabled] = useState(true);
  const [showEvaluation, setShowEvaluation] = useState(false);

  // --- Gestion du Minuteur de Séance d'Apprentissage ---
  const [timerMinutes, setTimerMinutes] = useState<number>(15); // Durée réglable (default 15 min)
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(15 * 60);
  const [timerActive, setTimerActive] = useState<boolean>(false);
  const [showTimerAlert, setShowTimerAlert] = useState<boolean>(false);

  const [activeNotes, setActiveNotes] = useState<
    Map<string, { hand: "right" | "left"; finger: number }>
  >(new Map());

  const synthRef = useRef<Tone.PolySynth | null>(null);
  const metronomeRef = useRef<Tone.MembraneSynth | null>(null);
  const partRef = useRef<Tone.Part | null>(null);

  // Mettre à jour le BPM si on change d'exercice
  useEffect(() => {
    setBpm(exercise.bpm);
  }, [currentExerciseIndex, exercise.bpm]);

  // Décompte du Minuteur
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timeLeftSeconds === 0 && timerActive) {
      setTimerActive(false);
      setShowTimerAlert(true);
      if (synthRef.current) {
        try {
          synthRef.current.triggerAttackRelease(["C5", "E5", "G5"], "2n");
        } catch (e) {}
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeftSeconds]);

  // Changer la durée réglée du minuteur
  const handleTimerDurationChange = (minutes: number) => {
    setTimerMinutes(minutes);
    setTimeLeftSeconds(minutes * 60);
    setTimerActive(false);
    setShowTimerAlert(false);
  };

  const toggleTimerActive = () => {
    if (timeLeftSeconds === 0) {
      setTimeLeftSeconds(timerMinutes * 60);
    }
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeftSeconds(timerMinutes * 60);
    setShowTimerAlert(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle8" },
      envelope: { attack: 0.005, decay: 1.2, sustain: 0.2, release: 1.4 },
    }).toDestination();
    synth.volume.value = -6;

    const click = new Tone.MembraneSynth({
      pitchDecay: 0.008,
      octaves: 2,
      envelope: { attack: 0.001, decay: 0.1, sustain: 0 },
    }).toDestination();
    click.volume.value = -14;

    synthRef.current = synth;
    metronomeRef.current = click;

    return () => {
      synth.dispose();
      click.dispose();
    };
  }, []);

  useEffect(() => {
    Tone.Transport.bpm.value = bpm;
  }, [bpm]);

  const setupTransport = useCallback(() => {
    if (partRef.current) {
      partRef.current.dispose();
    }

    Tone.Transport.cancel();

    const filteredNotes = exercise.notes.filter((n) => {
      if (selectedHand === "both") return true;
      return n.hand === selectedHand;
    });

    const part = new Tone.Part(
      (time, event) => {
        const noteEv = event as NoteEvent;
        if (!noteEv || !noteEv.note) return;
        synthRef.current?.triggerAttackRelease(noteEv.note, noteEv.duration, time);

        Tone.Draw.schedule(() => {
          setActiveNotes((prev) => {
            const next = new Map(prev);
            next.set(noteEv.note, { hand: noteEv.hand, finger: noteEv.finger });
            return next;
          });

          const durationSeconds = Tone.Time(noteEv.duration).toSeconds();
          setTimeout(() => {
            setActiveNotes((prev) => {
              const next = new Map(prev);
              next.delete(noteEv.note);
              return next;
            });
          }, durationSeconds * 1000);
        }, time);
      },
      filteredNotes.map((n) => ({ ...n }))
    );

    part.loop = isLooping;
    part.loopEnd = "2:0:0";
    part.start(0);
    partRef.current = part;

    if (metronomeEnabled) {
      Tone.Transport.scheduleRepeat((time) => {
        metronomeRef.current?.triggerAttackRelease("C6", "16n", time);
      }, "4n");
    }

    Tone.Transport.loop = isLooping;
    Tone.Transport.loopEnd = "2:0:0";

    Tone.Transport.scheduleOnce(() => {
      if (!isLooping) {
        Tone.Draw.schedule(() => {
          setIsPlaying(false);
          setShowEvaluation(true);
        }, Tone.Transport.seconds);
      }
    }, "2:0:0");
  }, [exercise, selectedHand, isLooping, metronomeEnabled]);

  useEffect(() => {
    setupTransport();
  }, [setupTransport]);

  const togglePlay = async () => {
    await Tone.start();
    if (isPlaying) {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      Tone.Transport.start();
      setIsPlaying(true);
      if (!timerActive && timeLeftSeconds > 0) {
        setTimerActive(true);
      }
    }
  };

  const stopPlay = () => {
    Tone.Transport.stop();
    setIsPlaying(false);
    setActiveNotes(new Map());
  };

  const handleNextExercise = () => {
    stopPlay();
    setCurrentExerciseIndex((prev) => (prev + 1) % EXERCISES_DATABASE.length);
  };

  const handlePrevExercise = () => {
    stopPlay();
    setCurrentExerciseIndex((prev) => (prev - 1 + EXERCISES_DATABASE.length) % EXERCISES_DATABASE.length);
  };

  const handleSelfEvaluation = async (score: EvaluationScore) => {
    setShowEvaluation(false);
    stopPlay();

    const existingProgress = await getExerciseProgress(exercise.id);
    const updatedMetrics = calculateSM2(score, existingProgress);

    await saveExerciseProgress({
      exerciseId: exercise.id,
      ...updatedMetrics,
      lastEvaluated: new Date().toISOString(),
    });

    if (score === "good" || score === "easy") {
      handleNextExercise();
    }
  };

  return (
    <div className="flex flex-col gap-3 md:gap-4 bg-slate-950 text-slate-100 p-4 md:p-6 rounded-[2rem] shadow-2xl border border-slate-800/80 max-w-5xl mx-auto select-none backdrop-blur-xl relative overflow-hidden max-h-[96vh] justify-between">
      {/* Halo de lumière */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Modal Fin de Temps de Séance */}
      {showTimerAlert && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full text-center flex flex-col items-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 animate-bounce">
              <Bell className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">Séance d'apprentissage terminée !</h3>
            <p className="text-slate-400 text-xs mb-5">
              Bravo ! Vous avez atteint votre objectif de pratique ({timerMinutes} min). Prenez une pause ou poursuivez à votre rythme.
            </p>
            <button
              onClick={resetTimer}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition-all"
            >
              Compris !
            </button>
          </div>
        </div>
      )}

      {/* Modal d'Auto-Évaluation */}
      <SelfEvaluationModal
        isOpen={showEvaluation}
        onEvaluate={handleSelfEvaluation}
        onReplay={() => {
          setShowEvaluation(false);
          stopPlay();
        }}
      />

      {/* En-tête avec Sélecteur d'Exercices & Minuteur Agrandit */}
      <div className="flex flex-row items-center justify-between pb-3 border-b border-slate-800/80 gap-2">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <BookOpen className="w-3 h-3" /> Exercice {currentExerciseIndex + 1} / {EXERCISES_DATABASE.length}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
            {exercise.title}
          </h1>
        </div>

        {/* Minuteur Agrandit & Navigation Exercices */}
        <div className="flex items-center gap-3">
          {/* Minuteur de Pratique Lisible avec Reset */}
          <div className="flex items-center gap-2.5 bg-slate-900/90 px-3.5 py-2 rounded-2xl border border-slate-700/80 shadow-md">
            <TimerIcon className={`w-5 h-5 ${timerActive ? "text-amber-400 animate-pulse" : "text-slate-400"}`} />
            
            <button
              onClick={toggleTimerActive}
              className={`text-sm md:text-base font-mono font-black tracking-wider transition-colors ${
                timeLeftSeconds <= 60 && timerActive
                  ? "text-rose-400 animate-ping"
                  : timerActive
                  ? "text-amber-400"
                  : "text-slate-100"
              }`}
              title="Cliquer pour Démarrer/Mettre en pause le minuteur"
            >
              {formatTime(timeLeftSeconds)}
            </button>

            {/* Bouton Réinitialiser le Minuteur */}
            <button
              onClick={resetTimer}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
              title="Réinitialiser le minuteur"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Sélecteur de Durée */}
            <select
              value={timerMinutes}
              onChange={(e) => handleTimerDurationChange(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-xs font-bold text-slate-200 rounded-xl px-2 py-1 cursor-pointer focus:outline-none focus:border-amber-500/50"
              title="Changer la durée de la séance"
            >
              <option value={5}>5 min</option>
              <option value={10}>10 min</option>
              <option value={15}>15 min</option>
              <option value={20}>20 min</option>
              <option value={30}>30 min</option>
            </select>
          </div>

          {/* Navigation Exercices */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevExercise}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-all active:scale-95"
              title="Exercice Précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-400 px-0.5">
              {currentExerciseIndex + 1}/{EXERCISES_DATABASE.length}
            </span>
            <button
              onClick={handleNextExercise}
              className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-emerald-400 transition-all active:scale-95 flex items-center gap-1 font-bold text-xs"
              title="Exercice Suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Partition VexFlow */}
      <div className="w-full">
        <SheetMusicView
          notes={exercise.notes}
          timeSignature={exercise.timeSignature}
        />
      </div>

      {/* Clavier Virtuel 2D */}
      <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800/80 flex flex-col items-center shadow-xl">
        <div className="w-full flex items-center justify-between mb-1.5 px-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-400" /> Clavier Synchronisé & Doigtés (1-5)
          </span>
          <div className="flex items-center gap-3 text-[11px] font-medium">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Main Droite
            </span>
            <span className="flex items-center gap-1 text-indigo-400">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> Main Gauche
            </span>
          </div>
        </div>

        <div className="relative flex justify-center h-36 md:h-40 w-full max-w-4xl overflow-x-auto pb-1 pt-1 scrollbar-none">
          {PIANO_KEYS.map((k) => {
            const activeInfo = activeNotes.get(k.note);
            const isActive = !!activeInfo;
            const isRightHand = activeInfo?.hand === "right";

            return (
              <div
                key={k.note}
                className={`relative flex-shrink-0 transition-all duration-100 ${
                  k.isBlack
                    ? "w-7 h-24 -mx-3.5 z-10 bg-slate-900 border border-slate-700/80 rounded-b-lg shadow-xl"
                    : "w-9 md:w-10 h-36 bg-gradient-to-b from-slate-100 to-slate-200 border border-slate-300 rounded-b-xl shadow-md"
                } ${
                  isActive
                    ? isRightHand
                      ? "!bg-gradient-to-b !from-emerald-400 !to-emerald-600 border-emerald-300 shadow-lg shadow-emerald-500/50 scale-[1.02]"
                      : "!bg-gradient-to-b !from-indigo-400 !to-indigo-600 border-indigo-300 shadow-lg shadow-indigo-500/50 scale-[1.02]"
                    : ""
                }`}
              >
                {isActive && (
                  <div
                    className={`absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black text-white shadow-lg animate-bounce ${
                      isRightHand ? "bg-emerald-700 border border-emerald-400" : "bg-indigo-700 border border-indigo-400"
                    }`}
                  >
                    {activeInfo.finger}
                  </div>
                )}
                {k.note.startsWith("C") && !k.isBlack && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-extrabold text-slate-500 uppercase tracking-tighter">
                    {k.note}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Barre de Contrôle */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center bg-slate-900/90 p-3 rounded-2xl border border-slate-800/80 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-2.5 justify-center md:justify-start">
          <button
            onClick={togglePlay}
            className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/25 transition-all transform active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>
          <button
            onClick={stopPlay}
            className="p-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/60 text-slate-300 transition-all active:scale-95 shadow-md"
            title="Réinitialiser la lecture"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowEvaluation(true)}
            className="px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-all flex items-center gap-1 shadow-sm ml-1"
          >
            <Sparkles className="w-3.5 h-3.5" /> Évaluer
          </button>
        </div>

        <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800/90 justify-center shadow-inner">
          {(["left", "both", "right"] as Hand[]).map((h) => (
            <button
              key={h}
              onClick={() => setSelectedHand(h)}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold capitalize transition-all ${
                selectedHand === h
                  ? "bg-slate-800 text-emerald-400 shadow-md border border-slate-700/80"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {h === "left" ? "Main Gauche" : h === "right" ? "Main Droite" : "2 Mains"}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 justify-center md:justify-end">
          <div className="flex items-center gap-1.5 bg-slate-950/60 px-2.5 py-1.5 rounded-xl border border-slate-800">
            <Sliders className="w-3 h-3 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-400">BPM</span>
            <input
              type="range"
              min="40"
              max="160"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-16 accent-emerald-500 cursor-pointer"
            />
            <span className="text-xs font-extrabold text-emerald-400 w-6 text-right">{bpm}</span>
          </div>

          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
              isLooping
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-emerald-500/10"
                : "bg-slate-800/80 border-slate-700/60 text-slate-500"
            }`}
          >
            Boucle
          </button>

          <button
            onClick={() => setMetronomeEnabled(!metronomeEnabled)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
              metronomeEnabled
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-emerald-500/10"
                : "bg-slate-800/80 border-slate-700/60 text-slate-500"
            }`}
          >
            Clic
          </button>
        </div>
      </div>
    </div>
  );
}
