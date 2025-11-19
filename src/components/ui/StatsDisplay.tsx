'use client';

import { useGameStore } from '@/stores/gameStore';

export function StatsDisplay() {
  const { uncoveredHay, coveredHay } = useGameStore();

  return (
    <div className="w-full bg-amber-100 border-y-4 border-amber-900 px-6 py-3">
      <div className="max-w-4xl mx-auto flex justify-around items-center">
        <div className="text-center">
          <div className="text-sm font-bold text-amber-900 mb-1">Uncovered Hay</div>
          <div className="text-3xl font-bold text-red-600 font-mono">
            {Math.floor(uncoveredHay)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold text-amber-900 mb-1">Covered Hay (Score)</div>
          <div className="text-3xl font-bold text-green-600 font-mono">
            {coveredHay}
          </div>
        </div>
      </div>
    </div>
  );
}
