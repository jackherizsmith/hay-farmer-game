'use client';

import { useGameStore } from '@/stores/gameStore';
import { WeatherType } from '@/types/game';
import { WeatherSystem } from './WeatherSystem';
import { motion } from 'framer-motion';

export function GameCanvas() {
  const { weather, uncoveredHay, isMakingHay, makeHayProgress } = useGameStore();

  const getSkyGradient = (weatherType: WeatherType) => {
    switch (weatherType) {
      case WeatherType.SUNNY:
        return 'from-blue-400 via-blue-300 to-blue-200';
      case WeatherType.CLOUDY:
        return 'from-gray-400 via-gray-300 to-gray-200';
      case WeatherType.WINDY:
        return 'from-gray-500 via-gray-400 to-gray-300';
      case WeatherType.RAINY:
        return 'from-gray-600 via-gray-500 to-gray-400';
      case WeatherType.SNOWING:
        return 'from-gray-300 via-gray-200 to-white';
      default:
        return 'from-blue-400 via-blue-300 to-blue-200';
    }
  };

  const getGroundColor = (weatherType: WeatherType) => {
    switch (weatherType) {
      case WeatherType.SUNNY:
        return 'bg-green-600';
      case WeatherType.CLOUDY:
        return 'bg-green-700';
      case WeatherType.WINDY:
      case WeatherType.RAINY:
        return 'bg-green-800';
      case WeatherType.SNOWING:
        return 'bg-gray-200';
      default:
        return 'bg-green-600';
    }
  };

  const fieldHayCount = Math.max(0, Math.floor(uncoveredHay));
  const balesPerRow = 10;
  const baleSize = 32; // w-8 h-8 = 32px

  // Calculate grid layout (stacked from bottom up)
  const rows: number[][] = [];
  for (let i = 0; i < fieldHayCount; i++) {
    const rowIndex = Math.floor(i / balesPerRow);
    if (!rows[rowIndex]) {
      rows[rowIndex] = [];
    }
    rows[rowIndex].push(i);
  }

  return (
    <div className="relative w-full flex-1 overflow-hidden">
      {/* Sky */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${getSkyGradient(weather.current)} transition-all duration-1000`}
      >
        {/* Sun (only when sunny) */}
        {weather.current === WeatherType.SUNNY && (
          <motion.div
            className="absolute top-8 right-12 w-16 h-16 bg-yellow-400 rounded-full border-4 border-yellow-500"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ imageRendering: 'pixelated' }}
          />
        )}

        {/* Clouds */}
        {(weather.current === WeatherType.CLOUDY ||
          weather.current === WeatherType.RAINY ||
          weather.current === WeatherType.SNOWING) && (
          <div className="absolute top-12 left-16 flex gap-2">
            <div className="w-16 h-12 bg-white rounded-full opacity-80 border-2 border-gray-300" />
            <div className="w-20 h-14 bg-white rounded-full opacity-80 border-2 border-gray-300 -ml-6" />
            <div className="w-14 h-10 bg-white rounded-full opacity-80 border-2 border-gray-300 -ml-6" />
          </div>
        )}

        <WeatherSystem weather={weather.current} />
      </div>

      {/* Ground */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1/3 ${getGroundColor(weather.current)} transition-colors duration-1000`}
      >
        {/* Grass texture */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute bottom-0 w-1 bg-green-900"
              style={{
                left: `${(i * 5) % 100}%`,
                height: `${4 + Math.random() * 8}px`,
                imageRendering: 'pixelated',
              }}
            />
          ))}
        </div>
      </div>

      {/* Barn */}
      <div className="absolute bottom-[33%] left-12 z-10">
        <div className="relative">
          {/* Barn roof */}
          <div className="w-32 h-20 bg-red-800 border-4 border-red-900 relative">
            <div className="absolute inset-0 flex flex-col gap-1 p-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-1 bg-red-900 opacity-50" />
              ))}
            </div>
          </div>
          <div
            className="w-0 h-0 border-l-[70px] border-r-[70px] border-b-[40px] border-l-transparent border-r-transparent border-b-red-800 -mt-1 ml-[-4px]"
            style={{
              filter: 'drop-shadow(0 -2px 0 rgb(127 29 29))',
            }}
          />
          {/* Barn body */}
          <div className="w-32 h-28 bg-red-700 border-4 border-red-900 -mt-2">
            {/* Door */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-16 bg-amber-900 border-2 border-amber-950" />
          </div>
        </div>
      </div>

      {/* Field Hay bales - stacked from bottom up */}
      <div className="absolute bottom-[33%] left-1/2 transform -translate-x-1/2 z-10">
        <div className="relative" style={{ width: `${balesPerRow * baleSize}px` }}>
          {rows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="absolute flex"
              style={{
                bottom: `${rowIndex * baleSize}px`,
                left: 0,
              }}
            >
              {row.map((baleId) => (
                <motion.div
                  key={`hay-${baleId}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-8 h-8 bg-yellow-600 border-2 border-yellow-800 rounded relative"
                  style={{ imageRendering: 'pixelated' }}
                >
                  <div className="absolute inset-1 border border-yellow-700" />
                  <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-yellow-400" />
                </motion.div>
              ))}
            </div>
          ))}

          {/* Hay being made - show progress indicator */}
          {isMakingHay && (
            <div
              className="absolute flex"
              style={{
                bottom: `${rows.length * baleSize}px`,
                left: `${(fieldHayCount % balesPerRow) * baleSize}px`,
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-8 h-8 bg-yellow-400 border-2 border-yellow-600 rounded relative"
                style={{ imageRendering: 'pixelated' }}
              >
                <div className="absolute inset-1 border border-yellow-500" />
                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-yellow-800 opacity-50">
                  <div
                    className="h-full bg-green-500 transition-all duration-100"
                    style={{ width: `${makeHayProgress}%` }}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
