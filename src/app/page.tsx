"use client";

import PianoVisualPlayer from "@/components/player/PianoVisualPlayer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 p-2 md:p-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-7xl">
        <PianoVisualPlayer />
      </div>
    </main>
  );
}
