'use client';

import { useGameStore } from '@/stores/gameStore';
import { calculateCoverDuration } from '@/lib/utils';

export function ActionButtons() {
  const { makeHay, toggleCover, canMakeHay, canToggleCover, uncoveredHay, coveredHay } = useGameStore();

  const makeHayEnabled = canMakeHay();
  const toggleEnabled = canToggleCover();

  // Determine if we're covering or uncovering
  const isCovering = uncoveredHay > 0;
  const hayCount = isCovering ? uncoveredHay : coveredHay;
  const duration = hayCount > 0 ? calculateCoverDuration(hayCount) : 0;
  const buttonLabel = isCovering ? 'Cover Hay' : 'Uncover Hay';
  const buttonIcon = isCovering ? '🛡️' : '🔓';

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

        <button
          onClick={toggleCover}
          disabled={!toggleEnabled}
          className={`
            flex-1 max-w-xs py-6 px-8 rounded-lg border-4 font-bold text-xl font-mono
            transition-all transform active:scale-95
            ${
              toggleEnabled
                ? isCovering
                  ? 'bg-blue-500 hover:bg-blue-600 border-blue-700 text-white cursor-pointer shadow-lg'
                  : 'bg-orange-500 hover:bg-orange-600 border-orange-700 text-white cursor-pointer shadow-lg'
                : 'bg-gray-400 border-gray-600 text-gray-200 cursor-not-allowed opacity-50'
            }
          `}
          style={{ imageRendering: 'pixelated' }}
        >
          {buttonLabel}
          {toggleEnabled && (
            <div className="text-sm mt-1">{buttonIcon} ({duration.toFixed(1)}s)</div>
          )}
        </button>
      </div>
    </div>
  );
}
