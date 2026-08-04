"use client";

import React from "react";
import { CheckCircle2, RotateCcw, AlertCircle, Sparkles } from "lucide-react";
import { EvaluationScore } from "@/types/exercise";

interface SelfEvaluationModalProps {
  isOpen: boolean;
  onEvaluate: (score: EvaluationScore) => void;
  onReplay: () => void;
}

export default function SelfEvaluationModal({
  isOpen,
  onEvaluate,
  onReplay,
}: SelfEvaluationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl text-center flex flex-col items-center">
        {/* Icône de félicitations */}
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-inner">
          <Sparkles className="w-8 h-8" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">Exercice terminé !</h3>
        <p className="text-slate-400 text-sm mb-6 max-w-sm">
          Comment avez-vous ressenti votre exécution sur le piano ? Votre auto-évaluation ajuste automatiquement votre planning de révision espacée.
        </p>

        {/* Boutons d'auto-évaluation à 3 couleurs */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          {/* Rouge - Difficile */}
          <button
            onClick={() => onEvaluate("hard")}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold mb-2 shadow-lg shadow-rose-500/30 group-hover:scale-110 transition-transform">
              🔴
            </div>
            <span className="text-sm font-bold text-rose-300">Difficile</span>
            <span className="text-[10px] text-rose-400/80 mt-1">Revoir demain</span>
          </button>

          {/* Jaune - Correct */}
          <button
            onClick={() => onEvaluate("good")}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800/60 transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold mb-2 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
              🟡
            </div>
            <span className="text-sm font-bold text-amber-300">Correct</span>
            <span className="text-[10px] text-amber-400/80 mt-1">Dans 2-3 jours</span>
          </button>

          {/* Vert - Facile */}
          <button
            onClick={() => onEvaluate("easy")}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 transition-all hover:scale-105 active:scale-95 group"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold mb-2 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
              🟢
            </div>
            <span className="text-sm font-bold text-emerald-300">Facile</span>
            <span className="text-[10px] text-emerald-400/80 mt-1">Maîtrisé !</span>
          </button>
        </div>

        {/* Action Rejouer */}
        <button
          onClick={onReplay}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Rejouer l'exercice sans enregistrer</span>
        </button>
      </div>
    </div>
  );
}
