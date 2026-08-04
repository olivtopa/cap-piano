"use client";

import PianoVisualPlayer from "@/components/player/PianoVisualPlayer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 p-4 md:p-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-5xl">
        <PianoVisualPlayer />
      </div>
    </main>
  );
}
