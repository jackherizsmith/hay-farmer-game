'use client';

import { useGameStore } from '@/stores/gameStore';
import { motion } from 'framer-motion';

interface GameOverProps {
  onPlayAgain: () => void;
}

export function GameOver({ onPlayAgain }: GameOverProps) {
  const { finalScore, isGameOver } = useGameStore();

  if (!isGameOver) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-amber-50 border-8 border-amber-900 rounded-lg p-8 max-w-md w-full mx-4"
        style={{
          imageRendering: 'pixelated',
        }}
      >
        <h2 className="text-4xl font-bold text-amber-900 text-center mb-6 font-mono">
          Game Over!
        </h2>

        <div className="bg-amber-100 border-4 border-amber-800 rounded p-6 mb-6">
          <div className="text-center">
            <div className="text-lg text-amber-900 mb-2">Final Score</div>
            <div className="text-6xl font-bold text-green-600 font-mono">
              {finalScore}
            </div>
            <div className="text-sm text-amber-700 mt-2">Hay Bales Covered</div>
          </div>
        </div>

        <button
          onClick={onPlayAgain}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg border-4 border-green-800 text-xl font-mono transition-colors"
        >
          Play Again
        </button>
      </motion.div>
    </motion.div>
  );
}
