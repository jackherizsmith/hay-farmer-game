'use client';

import { useGameStore } from '@/stores/gameStore';

export function StatsDisplay() {
  const { uncoveredHay, coveredHay } = useGameStore();

  return (
    <div className="w-full bg-amber-100 border-y-4 border-amber-900 px-6 py-4">
      <div className="max-w-4xl mx-auto flex justify-around items-center gap-8">
        {/* Field Hay */}
        <div className="text-center flex-1">
          <div className="text-sm font-bold text-amber-900 mb-2">Field Hay</div>
          <div className="relative inline-block">
            <div className="text-8xl" style={{ imageRendering: 'pixelated' }}>🌾</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-orange-500 border-4 border-orange-700 rounded-lg px-4 py-2 shadow-lg">
                <div className="text-3xl font-bold text-white font-mono">
                  {Math.max(0, Math.floor(uncoveredHay))}
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs text-red-700 font-bold mt-2">⚠️ Vulnerable to weather</div>
        </div>

        {/* Barn Hay */}
        <div className="text-center flex-1">
          <div className="text-sm font-bold text-amber-900 mb-2">Barn Hay (Score)</div>
          <div className="relative inline-block">
            <div className="text-8xl" style={{ imageRendering: 'pixelated' }}>🏚️</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-green-500 border-4 border-green-700 rounded-lg px-4 py-2 shadow-lg">
                <div className="text-3xl font-bold text-white font-mono">
                  {Math.max(0, coveredHay)}
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs text-green-700 font-bold mt-2">✓ Safe & protected</div>
        </div>
      </div>
    </div>
  );
}
