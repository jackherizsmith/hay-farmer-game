'use client';

import { Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get game data from URL params
  const finalScore = parseInt(searchParams.get('score') || '0');
  const uncoveredHay = parseInt(searchParams.get('uncovered') || '0');
  const actionHistory = searchParams.get('history');

  const stats = useMemo(() => {
    if (!actionHistory) {
      return {
        hayMade: 0,
        hayLost: 0,
        coverActions: 0,
        weatherChanges: 0,
      };
    }

    let hayMade = 0;
    let hayLost = 0;
    let coverActions = 0;
    const weatherChanges: string[] = [];

    try {
      const actions = JSON.parse(decodeURIComponent(actionHistory));
      actions.forEach((action: any) => {
        switch (action.type) {
          case 'make_hay':
            hayMade += action.data?.amount || 0;
            break;
          case 'hay_loss':
            hayLost += action.data?.amount || 0;
            break;
          case 'start_cover':
            if (action.data?.action === 'cover') {
              coverActions++;
            }
            break;
          case 'weather_change':
            if (action.data?.weather) {
              weatherChanges.push(action.data.weather as string);
            }
            break;
        }
      });
    } catch (e) {
      console.error('Failed to parse action history', e);
    }

    return {
      hayMade: Math.floor(hayMade),
      hayLost: Math.floor(hayLost),
      coverActions,
      weatherChanges: weatherChanges.length,
    };
  }, [actionHistory]);

  const handlePlayAgain = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-amber-50 border-8 border-amber-900 rounded-lg p-8 max-w-2xl w-full"
        style={{
          imageRendering: 'pixelated',
        }}
      >
        <h2 className="text-4xl font-bold text-amber-900 text-center mb-6 font-mono">
          Game Over!
        </h2>

        {/* Final Score */}
        <div className="bg-gradient-to-br from-green-100 to-green-200 border-4 border-green-800 rounded p-6 mb-6">
          <div className="text-center">
            <div className="text-lg text-green-900 mb-2 font-bold">Final Score</div>
            <div className="text-7xl font-bold text-green-700 font-mono mb-2">
              {finalScore}
            </div>
            <div className="text-sm text-green-800 font-bold">🌾 Hay Bales Covered & Protected 🌾</div>
          </div>
        </div>

        {/* Game Statistics */}
        <div className="bg-amber-100 border-4 border-amber-800 rounded p-6 mb-6">
          <h3 className="text-xl font-bold text-amber-900 mb-4 text-center font-mono">Game Statistics</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border-2 border-amber-700 rounded p-3 text-center">
              <div className="text-2xl font-bold text-amber-900 font-mono">{stats.hayMade}</div>
              <div className="text-xs text-amber-700 font-bold">Hay Made</div>
            </div>

            <div className="bg-white border-2 border-amber-700 rounded p-3 text-center">
              <div className="text-2xl font-bold text-red-600 font-mono">{stats.hayLost}</div>
              <div className="text-xs text-amber-700 font-bold">Hay Lost to Weather</div>
            </div>

            <div className="bg-white border-2 border-amber-700 rounded p-3 text-center">
              <div className="text-2xl font-bold text-blue-600 font-mono">{stats.coverActions}</div>
              <div className="text-xs text-amber-700 font-bold">Times Moved to Barn</div>
            </div>

            <div className="bg-white border-2 border-amber-700 rounded p-3 text-center">
              <div className="text-2xl font-bold text-purple-600 font-mono">{stats.weatherChanges}</div>
              <div className="text-xs text-amber-700 font-bold">Weather Changes</div>
            </div>

            <div className="bg-white border-2 border-amber-700 rounded p-3 text-center">
              <div className="text-2xl font-bold text-orange-600 font-mono">{Math.floor(uncoveredHay)}</div>
              <div className="text-xs text-amber-700 font-bold">Hay Left in Field</div>
            </div>

            <div className="bg-white border-2 border-amber-700 rounded p-3 text-center">
              <div className="text-2xl font-bold text-green-600 font-mono">{finalScore}</div>
              <div className="text-xs text-amber-700 font-bold">Hay in Barn</div>
            </div>
          </div>

          {uncoveredHay > 0 && (
            <div className="mt-4 p-3 bg-red-100 border-2 border-red-600 rounded text-center">
              <div className="text-sm text-red-800 font-bold">
                ⚠️ You lost {Math.floor(uncoveredHay)} hay bales by leaving them in the field!
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handlePlayAgain}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg border-4 border-green-800 text-xl font-mono transition-all transform hover:scale-105"
        >
          Play Again
        </button>
      </motion.div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <div className="text-2xl font-bold text-amber-900 font-mono">Loading results...</div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
