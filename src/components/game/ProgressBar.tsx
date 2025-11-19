'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  visible: boolean;
}

export function ProgressBar({ progress, visible }: ProgressBarProps) {
  if (!visible) return null;

  return (
    <div className="w-full bg-amber-100 border-y-4 border-amber-900 px-6 py-3">
      <div className="max-w-4xl mx-auto">
        <div className="text-center text-sm font-bold text-amber-900 mb-2">
          Moving Hay to Barn... {Math.floor(progress)}%
        </div>
        <div className="w-full bg-amber-200 border-4 border-amber-800 rounded-full h-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 border-r-4 border-blue-700"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>
      </div>
    </div>
  );
}
