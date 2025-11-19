'use client';

import { motion } from 'framer-motion';
import { useGameStore } from '@/stores/gameStore';

interface ProgressBarProps {
  progress: number;
  visible: boolean;
}

export function ProgressBar({ progress, visible }: ProgressBarProps) {
  const { isCovering, isUncovering } = useGameStore();

  if (!visible) return null;

  const label = isCovering ? 'Covering Hay...' : 'Uncovering Hay...';
  const colorClass = isCovering
    ? 'bg-gradient-to-r from-blue-400 to-blue-600 border-r-4 border-blue-700'
    : 'bg-gradient-to-r from-orange-400 to-orange-600 border-r-4 border-orange-700';

  return (
    <div className="w-full bg-amber-100 border-y-4 border-amber-900 px-6 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="text-center text-sm font-bold text-amber-900 mb-2">
          {label} {Math.floor(progress)}%
        </div>
        <div className="w-full bg-amber-200 border-4 border-amber-800 rounded-full h-8 overflow-hidden">
          <motion.div
            className={`h-full ${colorClass}`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </div>
  );
}
