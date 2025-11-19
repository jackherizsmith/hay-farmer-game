import { useEffect, useRef } from 'react';
import { useGameStore } from '@/stores/gameStore';
import { GAME_CONSTANTS } from '@/types/game';

export function useGameLoop() {
  const { isPlaying, isPaused, tick } = useGameStore();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      intervalRef.current = setInterval(() => {
        tick();
      }, GAME_CONSTANTS.TICK_RATE);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, isPaused, tick]);
}
