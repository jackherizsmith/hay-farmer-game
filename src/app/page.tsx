'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { useGameLoop } from '@/hooks/useGameLoop';
import { Header } from '@/components/ui/Header';
import { StatsDisplay } from '@/components/ui/StatsDisplay';
import { GameCanvas } from '@/components/game/GameCanvas';
import { ProgressBar } from '@/components/game/ProgressBar';
import { ActionButtons } from '@/components/game/ActionButtons';
import { GameOver } from '@/components/ui/GameOver';

export default function Home() {
  const { isPlaying, isCovering, coverProgress, startGame, resetGame } = useGameStore();

  useGameLoop();

  const handlePlayAgain = () => {
    resetGame();
    startGame();
  };

  const showProgressBar = isCovering;

  return (
    <div className="min-h-screen flex flex-col bg-amber-50">
      {!isPlaying ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center max-w-lg">
            <h1 className="text-6xl font-bold text-amber-900 mb-4 font-mono" style={{ imageRendering: 'pixelated' }}>
              🌾 Hay Farmer 🌾
            </h1>
            <p className="text-xl text-amber-800 mb-8 leading-relaxed">
              Make hay while the sun shines! Cover your hay before bad weather destroys it.
              You have 2 minutes to maximise your score.
            </p>
            <div className="bg-amber-100 border-4 border-amber-800 rounded-lg p-6 mb-8 text-left">
              <h2 className="font-bold text-lg mb-3 text-amber-900">How to Play:</h2>
              <ul className="space-y-2 text-amber-900">
                <li>☀️ <strong>Sunny:</strong> Make hay (+1 per click)</li>
                <li>☁️ <strong>Cloudy:</strong> Cannot make hay, no loss</li>
                <li>💨 <strong>Windy:</strong> Lose 1.5 hay/sec from field</li>
                <li>🌧️ <strong>Rainy:</strong> Lose 3 hay/sec from field</li>
                <li>❄️ <strong>Snowing:</strong> Lose 5 hay/sec from field (brutal!)</li>
                <li>🏚️ <strong>Cover Hay:</strong> Move field hay to barn (safe forever!)</li>
                <li>⛔ <strong>Stop Covering:</strong> Cancel covering to make more hay</li>
                <li>⚠️ <strong>Note:</strong> Cannot make hay whilst covering!</li>
              </ul>
            </div>
            <button
              onClick={startGame}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-12 rounded-lg border-4 border-green-800 text-2xl font-mono transition-all transform hover:scale-105"
              style={{ imageRendering: 'pixelated' }}
            >
              Start Game
            </button>
          </div>
        </div>
      ) : (
        <>
          <Header />
          <StatsDisplay />
          <GameCanvas />
          <ProgressBar progress={coverProgress} visible={showProgressBar} />
          <ActionButtons />
          <GameOver onPlayAgain={handlePlayAgain} />
        </>
      )}
    </div>
  );
}
