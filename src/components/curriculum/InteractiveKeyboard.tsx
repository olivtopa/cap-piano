"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { KeyTarget } from "@/types/curriculum";
import { audioEngine } from "@/lib/audio/audioEngine";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

interface PianoKeyDef {
  note: string;
  isBlack: boolean;
  label: string;
  octave: number;
}

const OCTAVES = [2, 3, 4, 5];
const NOTE_PATTERNS: { name: string; isBlack: boolean }[] = [
  { name: "C", isBlack: false },
  { name: "C#", isBlack: true },
  { name: "D", isBlack: false },
  { name: "D#", isBlack: true },
  { name: "E", isBlack: false },
  { name: "F", isBlack: false },
  { name: "F#", isBlack: true },
  { name: "G", isBlack: false },
  { name: "G#", isBlack: true },
  { name: "A", isBlack: false },
  { name: "A#", isBlack: true },
  { name: "B", isBlack: false },
];

export const ALL_PIANO_KEYS: PianoKeyDef[] = [
  ...OCTAVES.flatMap((octave) =>
    NOTE_PATTERNS.map((p) => ({
      note: `${p.name}${octave}`,
      isBlack: p.isBlack,
      label: p.name,
      octave,
    }))
  ),
  { note: "C6", isBlack: false, label: "C", octave: 6 },
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
  const containerRef = useRef<HTMLDivElement>(null);

  // Range offset (center octave shift, 0 means centered around C4)
  const [octaveOffset, setOctaveOffset] = useState<number>(0);
  const [visibleWhiteKeyCount, setVisibleWhiteKeyCount] = useState<number>(15);

  // Map of active keys for quick lookup
  const activeKeysMap = useMemo(() => {
    const map = new Map<string, KeyTarget>();
    activeKeys.forEach((k) => map.set(k.note, k));
    return map;
  }, [activeKeys]);

  // Dynamically calculate the number of white keys that fit in the container without scrolling
  useEffect(() => {
    const calculateCapacity = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      if (width <= 0) return;

      // On mobile (<500px): ~28px -> 14-17 white keys (2+ octaves)
      // On tablet / iPad 10" (500-900px): ~32px -> 21-28 white keys (3 to 4 octaves)
      // On desktop (>900px): fits all 29 white keys (4 octaves C2 to C6)
      const targetKeyWidth = width < 500 ? 28 : width < 850 ? 32 : 36;
      const whiteKeys = Math.min(29, Math.max(10, Math.floor((width - 24) / targetKeyWidth)));
      setVisibleWhiteKeyCount(whiteKeys);
    };

    calculateCapacity();

    const observer = new ResizeObserver(calculateCapacity);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    window.addEventListener("resize", calculateCapacity);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", calculateCapacity);
    };
  }, []);

  // Compute the visible slice of keys centered around Middle C (C4) and adjusted by octaveOffset
  const visibleKeys = useMemo(() => {
    // Find index of C4 in all keys
    const c4Index = ALL_PIANO_KEYS.findIndex((k) => k.note === "C4");
    // Center point adjusted by offset (each octave is 12 keys)
    const targetCenterIndex = Math.max(0, Math.min(ALL_PIANO_KEYS.length - 1, c4Index + octaveOffset * 12));

    // Target white keys on each side of center
    const halfWhite = Math.floor(visibleWhiteKeyCount / 2);

    let left = targetCenterIndex;
    let right = targetCenterIndex + 1;
    let whiteCount = ALL_PIANO_KEYS[targetCenterIndex]?.isBlack ? 0 : 1;

    // Expand to left and right until we have desired white keys
    while (whiteCount < visibleWhiteKeyCount && (left > 0 || right < ALL_PIANO_KEYS.length)) {
      if (left > 0 && (whiteCount < visibleWhiteKeyCount || ALL_PIANO_KEYS[left - 1].isBlack)) {
        left--;
        if (!ALL_PIANO_KEYS[left].isBlack) whiteCount++;
      }
      if (right < ALL_PIANO_KEYS.length && (whiteCount < visibleWhiteKeyCount || ALL_PIANO_KEYS[right].isBlack)) {
        right++;
        if (!ALL_PIANO_KEYS[right - 1].isBlack) whiteCount++;
      }
    }

    // Ensure we start and end on white keys for clean visual alignment
    while (left > 0 && ALL_PIANO_KEYS[left].isBlack) {
      left--;
    }
    while (right < ALL_PIANO_KEYS.length && ALL_PIANO_KEYS[right - 1].isBlack) {
      right++;
    }

    return ALL_PIANO_KEYS.slice(left, right);
  }, [visibleWhiteKeyCount, octaveOffset]);

  // If an active key is played during demo that is outside the visible slice, automatically adjust offset
  useEffect(() => {
    if (activeKeys.length > 0) {
      const activeNote = activeKeys[0].note;
      const isVisible = visibleKeys.some((k) => k.note === activeNote);
      if (!isVisible) {
        // Find which octave the note belongs to
        const noteDef = ALL_PIANO_KEYS.find((k) => k.note === activeNote);
        if (noteDef) {
          if (noteDef.octave <= 2 && octaveOffset > -1) setOctaveOffset(-1);
          else if (noteDef.octave >= 5 && octaveOffset < 1) setOctaveOffset(1);
        }
      }
    }
  }, [activeKeys, visibleKeys, octaveOffset]);

  const handleKeyClick = (note: string) => {
    audioEngine.playNote(note, "4n");
    if (mode === "spotting" && onKeyClick) {
      onKeyClick(note);
    }
  };

  return (
    <div ref={containerRef} className={`w-full select-none space-y-2 ${className}`}>
      {/* Keyboard Header Navigation for Octaves */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-400">
        <button
          type="button"
          onClick={() => setOctaveOffset((prev) => Math.max(-1, prev - 1))}
          disabled={octaveOffset <= -1}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 transition font-medium"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Plus Grave (Octaves 2-3)</span>
        </button>

        <div className="flex items-center gap-2">
          {octaveOffset !== 0 && (
            <button
              type="button"
              onClick={() => setOctaveOffset(0)}
              className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 text-[11px] font-semibold hover:bg-sky-500/30 transition"
            >
              Recentrer Do Central
            </button>
          )}
          <span className="hidden sm:inline font-mono text-[11px] text-slate-400">
            {visibleKeys[0]?.note} à {visibleKeys[visibleKeys.length - 1]?.note}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOctaveOffset((prev) => Math.min(1, prev + 1))}
          disabled={octaveOffset >= 1}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 transition font-medium"
        >
          <span>Plus Aigu (Octaves 4-5)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Responsive Piano Surface (No horizontal scroll, 100% width) */}
      <div className="relative flex w-full bg-slate-900/95 p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-slate-800 justify-center items-stretch min-h-[180px] sm:min-h-[220px]">
        {visibleKeys.map((k) => {
          const activeTarget = activeKeysMap.get(k.note);
          const isSelectedByUser = userSelection.includes(k.note);
          const isFeedbackCorrect = spottingFeedback?.correct.includes(k.note);
          const isFeedbackIncorrect = spottingFeedback?.incorrect.includes(k.note);

          if (k.isBlack) {
            let blackBg = "bg-slate-900 border-slate-950 hover:bg-slate-800 text-slate-400";

            if (mode === "playback" && activeTarget) {
              blackBg = "bg-gradient-to-b from-sky-500 to-indigo-600 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.9)] text-white ring-2 ring-sky-300";
            } else if (isFeedbackCorrect) {
              blackBg = "bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.9)] text-white";
            } else if (isFeedbackIncorrect) {
              blackBg = "bg-rose-600 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.9)] text-white";
            } else if (isSelectedByUser) {
              blackBg = "bg-sky-600 border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.8)] text-white";
            }

            return (
              <button
                key={k.note}
                type="button"
                onClick={() => handleKeyClick(k.note)}
                className={`relative z-10 -mx-[3.2%] sm:-mx-[3%] w-[6.4%] sm:w-[6%] max-w-[36px] min-w-[18px] h-32 sm:h-40 md:h-44 rounded-b-md border-x border-b-4 transition-all duration-75 flex flex-col justify-end items-center pb-2 active:scale-y-95 active:brightness-125 focus:outline-none ${blackBg}`}
                title={k.note}
              >
                {/* Fingering Badge */}
                {showFingeringBadges && activeTarget?.finger && (
                  <span
                    className={`absolute top-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-md ${
                      activeTarget.hand === "LH"
                        ? "bg-emerald-500 ring-2 ring-emerald-300"
                        : "bg-blue-500 ring-2 ring-blue-300"
                    }`}
                  >
                    {activeTarget.finger}
                  </span>
                )}
                <span className="text-[9px] font-mono opacity-50 hidden sm:inline">
                  {k.note}
                </span>
              </button>
            );
          }

          // White key styling
          let whiteBg = "bg-gradient-to-b from-slate-100 to-slate-200 border-slate-300 hover:from-white hover:to-slate-100 text-slate-700";

          if (mode === "playback" && activeTarget) {
            whiteBg = "bg-gradient-to-b from-sky-200 to-sky-400 border-sky-500 shadow-[0_0_18px_rgba(56,189,248,0.95)] text-sky-950 font-black ring-2 ring-sky-400";
          } else if (isFeedbackCorrect) {
            whiteBg = "bg-gradient-to-b from-emerald-200 to-emerald-400 border-emerald-500 shadow-[0_0_18px_rgba(16,185,129,0.95)] text-emerald-950 font-black";
          } else if (isFeedbackIncorrect) {
            whiteBg = "bg-gradient-to-b from-rose-200 to-rose-400 border-rose-500 shadow-[0_0_18px_rgba(244,63,94,0.95)] text-rose-950 font-black";
          } else if (isSelectedByUser) {
            whiteBg = "bg-gradient-to-b from-sky-200 to-sky-400 border-sky-500 shadow-[0_0_14px_rgba(56,189,248,0.85)] text-sky-950 font-black";
          }

          const isMiddleC = k.note === "C4";

          return (
            <button
              key={k.note}
              type="button"
              onClick={() => handleKeyClick(k.note)}
              className={`relative z-0 flex-1 min-w-[28px] max-w-[60px] h-48 sm:h-56 md:h-64 rounded-b-lg border-x border-b-4 transition-all duration-75 flex flex-col justify-end items-center pb-2 active:scale-y-95 active:brightness-95 focus:outline-none ${whiteBg}`}
              title={k.note}
            >
              {/* Middle C marker dot */}
              {isMiddleC && (
                <div
                  className="absolute top-3 w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-pulse"
                  title="Do Central (Middle C - C4)"
                />
              )}

              {/* Fingering Badge */}
              {showFingeringBadges && activeTarget?.finger && (
                <span
                  className={`absolute top-8 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white shadow-md ${
                    activeTarget.hand === "LH"
                      ? "bg-emerald-600 ring-2 ring-emerald-300"
                      : "bg-blue-600 ring-2 ring-blue-300"
                  }`}
                >
                  {activeTarget.finger}
                </span>
              )}

              <div className="flex flex-col items-center">
                <span className="text-[11px] sm:text-xs font-bold tracking-tight">
                  {k.label}
                </span>
                <span className="text-[9px] font-mono text-slate-500">
                  {k.note.replace(/[A-G#]/g, "")}
                </span>
              </div>
            </button>
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
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block shadow-sm" />
            <span>Do Central (C4)</span>
          </div>
        </div>

        {mode === "spotting" && (
          <div className="text-sky-400 font-semibold">
            🎯 Cliquez sur les touches visibles pour valider votre réponse
          </div>
        )}
      </div>
    </div>
  );
}
