'use client';

import { WeatherType } from '@/types/game';
import { motion } from 'framer-motion';

interface WeatherSystemProps {
  weather: WeatherType;
}

function RainParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 50 }).map((_, i) => {
        const xPosition = Math.random() * 100;
        return (
          <motion.div
            key={i}
            className="absolute w-0.5 h-4 bg-blue-400 opacity-70"
            style={{
              left: `${xPosition}%`,
              imageRendering: 'pixelated',
            }}
            initial={{
              y: -20,
            }}
            animate={{
              y: '100vh',
            }}
            transition={{
              duration: 1 + Math.random() * 0.5,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
}

function SnowParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 40 }).map((_, i) => {
        const xStart = Math.random() * 100;
        const xEnd = Math.random() * 100;
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-80"
            style={{
              imageRendering: 'pixelated',
            }}
            initial={{
              left: `${xStart}%`,
              y: -20,
            }}
            animate={{
              y: '100vh',
              left: `${xEnd}%`,
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'linear',
            }}
          />
        );
      })}
    </div>
  );
}

function WindLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-0.5 bg-gray-400 opacity-50"
          style={{
            width: `${20 + Math.random() * 40}px`,
            top: `${Math.random() * 100}%`,
            imageRendering: 'pixelated',
          }}
          initial={{
            x: '-100%',
          }}
          animate={{
            x: '100vw',
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

export function WeatherSystem({ weather }: WeatherSystemProps) {
  return (
    <>
      {weather === WeatherType.RAINY && <RainParticles />}
      {weather === WeatherType.SNOWING && <SnowParticles />}
      {weather === WeatherType.WINDY && <WindLines />}
    </>
  );
}
