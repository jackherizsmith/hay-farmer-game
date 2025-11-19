'use client';

import { useGameStore } from '@/stores/gameStore';
import { calculateCoverDuration } from '@/lib/utils';

export function ActionButtons() {
  const {
    makeHay,
    startCovering,
    stopCovering,
    canMakeHay,
    canStartCovering,
    canStopCovering,
    uncoveredHay,
    isCovering
  } = useGameStore();

  const makeHayEnabled = canMakeHay();
  const canStartCover = canStartCovering();
  const canStopCover = canStopCovering();

  const coverDuration = uncoveredHay > 0 ? calculateCoverDuration(uncoveredHay) : 0;

  return (
    <div className="w-full bg-amber-100 border-t-4 border-amber-900 px-6 py-6">
      <div className="max-w-4xl mx-auto flex gap-4 justify-center">
        <button
          onClick={makeHay}
          disabled={!makeHayEnabled}
          className={`
            flex-1 max-w-xs py-6 px-8 rounded-lg border-4 font-bold text-xl font-mono
            transition-all transform active:scale-95
            ${
              makeHayEnabled
                ? 'bg-green-500 hover:bg-green-600 border-green-700 text-white cursor-pointer shadow-lg'
                : 'bg-gray-400 border-gray-600 text-gray-200 cursor-not-allowed opacity-50'
            }
          `}
          style={{ imageRendering: 'pixelated' }}
        >
          Make Hay
          <div className="text-sm mt-1">+1 🌾</div>
        </button>

        {!isCovering ? (
          <button
            onClick={startCovering}
            disabled={!canStartCover}
            className={`
              flex-1 max-w-xs py-6 px-8 rounded-lg border-4 font-bold text-xl font-mono
              transition-all transform active:scale-95
              ${
                canStartCover
                  ? 'bg-blue-500 hover:bg-blue-600 border-blue-700 text-white cursor-pointer shadow-lg'
                  : 'bg-gray-400 border-gray-600 text-gray-200 cursor-not-allowed opacity-50'
              }
            `}
            style={{ imageRendering: 'pixelated' }}
          >
            Cover Hay
            {canStartCover && (
              <div className="text-sm mt-1">🏚️ ({coverDuration.toFixed(1)}s)</div>
            )}
          </button>
        ) : (
          <button
            onClick={stopCovering}
            disabled={!canStopCover}
            className={`
              flex-1 max-w-xs py-6 px-8 rounded-lg border-4 font-bold text-xl font-mono
              transition-all transform active:scale-95
              ${
                canStopCover
                  ? 'bg-red-500 hover:bg-red-600 border-red-700 text-white cursor-pointer shadow-lg'
                  : 'bg-gray-400 border-gray-600 text-gray-200 cursor-not-allowed opacity-50'
              }
            `}
            style={{ imageRendering: 'pixelated' }}
          >
            Stop Covering
            <div className="text-sm mt-1">⛔ Cancel</div>
          </button>
        )}
      </div>
    </div>
  );
}
