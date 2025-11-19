'use client';

import { useGameStore } from '@/stores/gameStore';

export function StatsDisplay() {
  const { uncoveredHay, coveredHay } = useGameStore();

  return (
    <div className="w-full bg-amber-100 border-y-4 border-amber-900 px-6 py-2">
      <div className="max-w-4xl mx-auto flex justify-around items-center text-center">
        <div>
          <span className="text-sm text-amber-900 font-bold">Field: </span>
          <span className="text-xl font-bold text-orange-600 font-mono">
            {Math.max(0, Math.floor(uncoveredHay))}
          </span>
        </div>
        <div>
          <span className="text-sm text-amber-900 font-bold">Barn (Score): </span>
          <span className="text-xl font-bold text-green-600 font-mono">
            {Math.max(0, coveredHay)}
          </span>
        </div>
      </div>
    </div>
  );
}
