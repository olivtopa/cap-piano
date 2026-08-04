"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, StaveConnector } from "vexflow";
import { NoteEvent } from "@/types/exercise";

interface SheetMusicViewProps {
  notes: NoteEvent[];
  activeNotes?: Map<string, { hand: "right" | "left"; finger: number }>;
  timeSignature?: [number, number];
}

export default function SheetMusicView({
  notes,
  timeSignature = [4, 4],
}: SheetMusicViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    containerRef.current.innerHTML = "";

    const width = containerRef.current.clientWidth || 720;
    const height = 210;

    const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();

    // Blanc pur pour l'intégralité de la partition
    const PURE_WHITE = "#ffffff";

    // Portée Main Droite (Clé de Sol)
    const staveTreble = new Stave(35, 10, width - 70);
    staveTreble.setContext(context);
    staveTreble.setStyle({ strokeStyle: PURE_WHITE, fillStyle: PURE_WHITE });
    staveTreble.addClef("treble").addTimeSignature(`${timeSignature[0]}/${timeSignature[1]}`);
    staveTreble.draw();

    // Portée Main Gauche (Clé de Fa)
    const staveBass = new Stave(35, 110, width - 70);
    staveBass.setContext(context);
    staveBass.setStyle({ strokeStyle: PURE_WHITE, fillStyle: PURE_WHITE });
    staveBass.addClef("bass").addTimeSignature(`${timeSignature[0]}/${timeSignature[1]}`);
    staveBass.draw();

    // Accolade Grand Staff (Piano Brace)
    const brace = new StaveConnector(staveTreble, staveBass);
    brace.setType(StaveConnector.type.BRACE);
    brace.setStyle({ strokeStyle: PURE_WHITE, fillStyle: PURE_WHITE });
    brace.setContext(context).draw();

    const lineLeft = new StaveConnector(staveTreble, staveBass);
    lineLeft.setType(StaveConnector.type.SINGLE_LEFT);
    lineLeft.setStyle({ strokeStyle: PURE_WHITE, fillStyle: PURE_WHITE });
    lineLeft.setContext(context).draw();

    const lineRight = new StaveConnector(staveTreble, staveBass);
    lineRight.setType(StaveConnector.type.SINGLE_RIGHT);
    lineRight.setStyle({ strokeStyle: PURE_WHITE, fillStyle: PURE_WHITE });
    lineRight.setContext(context).draw();

    // Construction des StaveNotes statiques et propres
    const buildStaveNotes = (noteEvents: NoteEvent[], clef: "treble" | "bass") => {
      const targetHand = clef === "treble" ? "right" : "left";
      const filtered = noteEvents.filter((n) => n.hand === targetHand);

      if (filtered.length === 0) {
        const wholeRest = new StaveNote({
          clef: clef,
          keys: [clef === "treble" ? "b/4" : "d/3"],
          duration: "1r",
        });
        wholeRest.setStyle({ fillStyle: PURE_WHITE, strokeStyle: PURE_WHITE });
        return [wholeRest];
      }

      return filtered.map((e) => {
        const pitch = e.note.slice(0, -1).toLowerCase();
        const octave = e.note.slice(-1);
        let key = `${pitch}/${octave}`;
        let hasAccidental = false;
        let accSymbol = "";

        if (pitch.includes("#")) {
          hasAccidental = true;
          accSymbol = "#";
          key = `${pitch.replace("#", "")}/${octave}`;
        }

        const staveNote = new StaveNote({
          clef: clef,
          keys: [key],
          duration: e.duration.replace("n", ""),
        });

        if (hasAccidental) {
          const acc = new Accidental(accSymbol);
          acc.setStyle({ fillStyle: PURE_WHITE, strokeStyle: PURE_WHITE });
          staveNote.addModifier(acc);
        }

        staveNote.setStyle({ fillStyle: PURE_WHITE, strokeStyle: PURE_WHITE });
        return staveNote;
      });
    };

    const trebleNotes = buildStaveNotes(notes, "treble");
    const bassNotes = buildStaveNotes(notes, "bass");

    // Formater et aligner les voix
    const voiceTreble = new Voice({
      numBeats: timeSignature[0] * 2,
      beatValue: timeSignature[1],
    }).setMode(Voice.Mode.SOFT);
    voiceTreble.addTickables(trebleNotes);

    const voiceBass = new Voice({
      numBeats: timeSignature[0] * 2,
      beatValue: timeSignature[1],
    }).setMode(Voice.Mode.SOFT);
    voiceBass.addTickables(bassNotes);

    new Formatter().joinVoices([voiceTreble]).format([voiceTreble], width - 110);
    new Formatter().joinVoices([voiceBass]).format([voiceBass], width - 110);

    voiceTreble.draw(context, staveTreble);
    voiceBass.draw(context, staveBass);

    // CSS Post-Processing Infaillible : Forcer ABSOLUMENT TOUS les éléments du conteneur SVG en Blanc Pur (#ffffff)
    if (containerRef.current) {
      const allSvgElements = containerRef.current.querySelectorAll("path, line, rect, text, circle, polygon");
      allSvgElements.forEach((el) => {
        el.setAttribute("fill", PURE_WHITE);
        el.setAttribute("stroke", PURE_WHITE);
        (el as SVGElement).style.fill = PURE_WHITE;
        (el as SVGElement).style.stroke = PURE_WHITE;
      });
    }
  }, [notes, timeSignature]);

  return (
    <div className="w-full bg-slate-900/95 border border-slate-800 rounded-3xl p-3 md:p-4 shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center relative">
      <div className="flex items-center gap-2 mb-1 self-start px-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
          Partition Grand Staff (Clé de Sol & Clé de Fa)
        </span>
      </div>
      <div ref={containerRef} className="w-full flex justify-center min-w-[650px]" />
    </div>
  );
}
