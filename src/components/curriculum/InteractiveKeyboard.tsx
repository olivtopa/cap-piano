"use client";

import React, { useMemo } from "react";
import { KeyTarget } from "@/types/curriculum";
import { audioEngine } from "@/lib/audio/audioEngine";

export interface InteractiveKeyboardProps {
  mode?: "playback" | "spotting" | "read-only";
  activeKeys?: KeyTarget[];
  onKeyClick?: (note: string) => void;
  showFingeringBadges?: boolean;
  userSelection?: string[];
  spottingFeedback?: {
    correct: string[];
    incorrect: string[];
  };
  className?: string;
}

interface WhiteKeyDef {
  note: string;
  label: string;
  octave: number;
  blackKeyNote?: string;
}

// 3 Octaves: C3 to C6 (22 white keys, 15 black keys)
const THREE_OCTAVE_WHITE_KEYS: WhiteKeyDef[] = [
  // Octave 3
  { note: "C3", label: "C", octave: 3, blackKeyNote: "C#3" },
  { note: "D3", label: "D", octave: 3, blackKeyNote: "D#3" },
  { note: "E3", label: "E", octave: 3 },
  { note: "F3", label: "F", octave: 3, blackKeyNote: "F#3" },
  { note: "G3", label: "G", octave: 3, blackKeyNote: "G#3" },
  { note: "A3", label: "A", octave: 3, blackKeyNote: "A#3" },
  { note: "B3", label: "B", octave: 3 },
  // Octave 4 (Middle C)
  { note: "C4", label: "C", octave: 4, blackKeyNote: "C#4" },
  { note: "D4", label: "D", octave: 4, blackKeyNote: "D#4" },
  { note: "E4", label: "E", octave: 4 },
  { note: "F4", label: "F", octave: 4, blackKeyNote: "F#4" },
  { note: "G4", label: "G", octave: 4, blackKeyNote: "G#4" },
  { note: "A4", label: "A", octave: 4, blackKeyNote: "A#4" },
  { note: "B4", label: "B", octave: 4 },
  // Octave 5
  { note: "C5", label: "C", octave: 5, blackKeyNote: "C#5" },
  { note: "D5", label: "D", octave: 5, blackKeyNote: "D#5" },
  { note: "E5", label: "E", octave: 5 },
  { note: "F5", label: "F", octave: 5, blackKeyNote: "F#5" },
  { note: "G5", label: "G", octave: 5, blackKeyNote: "G#5" },
  { note: "A5", label: "A", octave: 5, blackKeyNote: "A#5" },
  { note: "B5", label: "B", octave: 5 },
  // Octave 6 (End C6)
  { note: "C6", label: "C", octave: 6 },
];

export default function InteractiveKeyboard({
  mode = "read-only",
  activeKeys = [],
  onKeyClick,
  showFingeringBadges = true,
  userSelection = [],
  spottingFeedback,
  className = "",
}: InteractiveKeyboardProps) {
  // Map of active keys for fast lookup
  const activeKeysMap = useMemo(() => {
    const map = new Map<string, KeyTarget>();
    activeKeys.forEach((k) => map.set(k.note, k));
    return map;
  }, [activeKeys]);

  const handleKeyClick = (note: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playNote(note, "4n");
    if (mode === "spotting" && onKeyClick) {
      onKeyClick(note);
    }
  };

  return (
    <div className={`w-full select-none space-y-2.5 ${className}`}>
      {/* Piano Surface Container: 100% width, 22 White Keys filling evenly */}
      <div className="relative flex w-full bg-slate-950 p-2 sm:p-3 rounded-2xl shadow-2xl border border-slate-800/80 items-stretch">
        {THREE_OCTAVE_WHITE_KEYS.map((wk) => {
          const whiteActiveTarget = activeKeysMap.get(wk.note);
          const isWhiteSelected = userSelection.includes(wk.note);
          const isWhiteCorrect = spottingFeedback?.correct.includes(wk.note);
          const isWhiteIncorrect = spottingFeedback?.incorrect.includes(wk.note);

          // White key styling
          let whiteBg = "bg-gradient-to-b from-slate-100 via-slate-100 to-slate-200 border-slate-300 hover:from-white hover:to-slate-100 text-slate-700";

          if (mode === "playback" && whiteActiveTarget) {
            whiteBg = "bg-gradient-to-b from-sky-200 via-sky-300 to-sky-400 border-sky-500 shadow-[0_0_20px_rgba(56,189,248,0.95)] text-sky-950 font-black ring-2 ring-sky-400";
          } else if (isWhiteCorrect) {
            whiteBg = "bg-gradient-to-b from-emerald-200 to-emerald-400 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.95)] text-emerald-950 font-black";
          } else if (isWhiteIncorrect) {
            whiteBg = "bg-gradient-to-b from-rose-200 to-rose-400 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.95)] text-rose-950 font-black";
          } else if (isWhiteSelected) {
            whiteBg = "bg-gradient-to-b from-sky-200 to-sky-400 border-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.85)] text-sky-950 font-black";
          }

          const isMiddleC = wk.note === "C4";

          // Black key details if exists
          const bkNote = wk.blackKeyNote;
          const blackActiveTarget = bkNote ? activeKeysMap.get(bkNote) : undefined;
          const isBlackSelected = bkNote ? userSelection.includes(bkNote) : false;
          const isBlackCorrect = bkNote ? spottingFeedback?.correct.includes(bkNote) : false;
          const isBlackIncorrect = bkNote ? spottingFeedback?.incorrect.includes(bkNote) : false;

          let blackBg = "bg-slate-900 border-slate-950 hover:bg-slate-800 text-slate-400";
          if (mode === "playback" && blackActiveTarget) {
            blackBg = "bg-gradient-to-b from-sky-500 to-indigo-600 border-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.95)] text-white ring-2 ring-sky-300";
          } else if (isBlackCorrect) {
            blackBg = "bg-emerald-500 border-emerald-400 shadow-[0_0_18px_rgba(16,185,129,0.95)] text-white";
          } else if (isBlackIncorrect) {
            blackBg = "bg-rose-600 border-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.95)] text-white";
          } else if (isBlackSelected) {
            blackBg = "bg-sky-600 border-sky-400 shadow-[0_0_14px_rgba(56,189,248,0.85)] text-white";
          }

          return (
            <div
              key={wk.note}
              className="relative flex-1 flex flex-col justify-end items-stretch"
            >
              {/* White Key */}
              <button
                type="button"
                onClick={(e) => handleKeyClick(wk.note, e)}
                className={`relative z-0 w-full h-40 sm:h-48 md:h-56 rounded-b-lg border-x border-b-4 transition-all duration-75 flex flex-col justify-end items-center pb-2.5 active:scale-y-95 active:brightness-95 focus:outline-none ${whiteBg}`}
                title={wk.note}
              >
                {/* Middle C Dot Marker */}
                {isMiddleC && (
                  <div
                    className="absolute top-3 w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,1)] animate-pulse"
                    title="Do Central (Middle C - C4)"
                  />
                )}

                {/* White Key Fingering Badge */}
                {showFingeringBadges && whiteActiveTarget?.finger && (
                  <span
                    className={`absolute bottom-8 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shadow-lg ${
                      whiteActiveTarget.hand === "LH"
                        ? "bg-emerald-600 ring-2 ring-emerald-300"
                        : "bg-blue-600 ring-2 ring-blue-300"
                    }`}
                  >
                    {whiteActiveTarget.finger}
                  </span>
                )}

                <div className="flex flex-col items-center pointer-events-none">
                  <span className="text-[11px] sm:text-xs font-extrabold tracking-tight">
                    {wk.label}
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    {wk.octave}
                  </span>
                </div>
              </button>

              {/* Absolute Overlay Black Key (Centered between this white key and the next) */}
              {bkNote && (
                <button
                  type="button"
                  onClick={(e) => handleKeyClick(bkNote, e)}
                  className={`absolute right-0 top-0 translate-x-1/2 z-20 w-[60%] h-[60%] rounded-b-md border-x border-b-4 transition-all duration-75 flex flex-col justify-end items-center pb-2 active:scale-y-95 active:brightness-125 focus:outline-none shadow-xl ${blackBg}`}
                  title={bkNote}
                >
                  {/* Black Key Fingering Badge */}
                  {showFingeringBadges && blackActiveTarget?.finger && (
                    <span
                      className={`absolute top-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-md ${
                        blackActiveTarget.hand === "LH"
                          ? "bg-emerald-500 ring-2 ring-emerald-300"
                          : "bg-blue-500 ring-2 ring-blue-300"
                      }`}
                    >
                      {blackActiveTarget.finger}
                    </span>
                  )}

                  <span className="text-[8px] sm:text-[9px] font-mono opacity-60 hidden sm:inline">
                    {bkNote}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend & Helpers */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 px-1 pt-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 inline-block shadow-sm" />
            <span>Main Droite (RH)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm" />
            <span>Main Gauche (LH)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm" />
            <span>Do Central (C4)</span>
          </div>
        </div>

        <div className="font-mono text-[11px] text-slate-400">
          Étendue : 3 Octaves complètes (C3 à C6)
        </div>
      </div>
    </div>
  );
}
