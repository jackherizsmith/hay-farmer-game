'use client';

import { useGameStore } from '@/stores/gameStore';
import { formatGameTime, getWeatherEmoji, getWeatherLabel } from '@/lib/utils';

export function Header() {
  const { elapsedTime, weather } = useGameStore();

  return (
    <div className="w-full bg-gradient-to-r from-amber-900 to-amber-800 text-amber-50 px-6 py-4 border-b-4 border-amber-950">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="text-lg font-bold font-mono">
          Time: {formatGameTime(elapsedTime)}
        </div>
        <div className="flex items-center gap-2 text-lg font-mono">
          <span className="text-2xl">{getWeatherEmoji(weather.current)}</span>
          <span className="font-bold">{getWeatherLabel(weather.current)}</span>
        </div>
      </div>
    </div>
  );
}
