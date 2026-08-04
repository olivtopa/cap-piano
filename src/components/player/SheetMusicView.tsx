"use client";

import React, { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental, StaveConnector } from "vexflow";
import { NoteEvent } from "@/types/exercise";

interface SheetMusicViewProps {
  notes: NoteEvent[];
  activeNotes: Map<string, { hand: "right" | "left"; finger: number }>;
  timeSignature?: [number, number];
}

export default function SheetMusicView({
  notes,
  activeNotes,
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

    const PURE_WHITE = "#ffffff";
    const GREEN_RIGHT = "#10b981"; // Vert Émeraude Vif
    const INDIGO_LEFT = "#6366f1"; // Indigo Vif

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

    // Construction des StaveNotes avec marquage précis de la main et de l'état actif
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

        // Vérification stricte : la note doit être active ET correspondre à la bonne main
        const activeInfo = activeNotes.get(e.note);
        const isCurrentlyActive = !!activeInfo && activeInfo.hand === targetHand;
        const activeColor = clef === "treble" ? GREEN_RIGHT : INDIGO_LEFT;

        const staveNote = new StaveNote({
          clef: clef,
          keys: [key],
          duration: e.duration.replace("n", ""),
        });

        if (hasAccidental) {
          const acc = new Accidental(accSymbol);
          acc.setStyle({
            fillStyle: isCurrentlyActive ? activeColor : PURE_WHITE,
            strokeStyle: isCurrentlyActive ? activeColor : PURE_WHITE,
          });
          staveNote.addModifier(acc);
        }

        if (isCurrentlyActive) {
          staveNote.setStyle({
            fillStyle: activeColor,
            strokeStyle: activeColor,
            shadowColor: activeColor,
            shadowBlur: 20,
          });
        } else {
          staveNote.setStyle({ fillStyle: PURE_WHITE, strokeStyle: PURE_WHITE });
        }

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

    // CSS Post-Processing : Blanchir systématiquement tous les éléments statiques SVG (portées, clés, 4/4) sans altérer les notes actives
    if (containerRef.current) {
      // 1. Blanchir les lignes de portée, clés et connecteurs
      const stavePaths = containerRef.current.querySelectorAll(".vf-stave path, .vf-stave line, .vf-clef path, .vf-timesignature path");
      stavePaths.forEach((p) => {
        p.setAttribute("fill", PURE_WHITE);
        p.setAttribute("stroke", PURE_WHITE);
      });

      // 2. Traiter les têtes de note non actives
      const noteGroups = containerRef.current.querySelectorAll(".vf-stavenote");
      noteGroups.forEach((group) => {
        const strokeAttr = group.getAttribute("stroke");
        const fillAttr = group.getAttribute("fill");
        const isGroupActive = strokeAttr === GREEN_RIGHT || strokeAttr === INDIGO_LEFT || fillAttr === GREEN_RIGHT || fillAttr === INDIGO_LEFT;

        if (!isGroupActive) {
          group.querySelectorAll("path, line").forEach((child) => {
            const cFill = child.getAttribute("fill");
            const cStroke = child.getAttribute("stroke");
            if (cFill !== GREEN_RIGHT && cFill !== INDIGO_LEFT) {
              child.setAttribute("fill", PURE_WHITE);
            }
            if (cStroke !== GREEN_RIGHT && cStroke !== INDIGO_LEFT) {
              child.setAttribute("stroke", PURE_WHITE);
            }
          });
        }
      });
    }
  }, [notes, activeNotes, timeSignature]);

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
