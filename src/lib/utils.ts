import { WeatherType, WEATHER_CONFIGS, GAME_CONSTANTS } from '@/types/game';

export function calculateCoverDuration(hayCount: number): number {
  return GAME_CONSTANTS.BASE_COVER_TIME + hayCount * GAME_CONSTANTS.COVER_SCALING_FACTOR;
}

export function getRandomWeatherDuration(weather: WeatherType): number {
  const config = WEATHER_CONFIGS[weather];
  return Math.random() * (config.maxDuration - config.minDuration) + config.minDuration;
}

export function getNextWeather(currentWeather: WeatherType): WeatherType {
  const config = WEATHER_CONFIGS[currentWeather];
  const possibleWeathers = config.possibleTransitions;
  return possibleWeathers[Math.floor(Math.random() * possibleWeathers.length)];
}

export function calculateGameTime(elapsedSeconds: number): { hour: number; minute: number; period: 'AM' | 'PM' } {
  const gameHours = GAME_CONSTANTS.GAME_HOURS;
  const startHour = GAME_CONSTANTS.GAME_START_HOUR;
  const gameDuration = GAME_CONSTANTS.GAME_DURATION;

  const progress = elapsedSeconds / gameDuration;
  const totalMinutes = progress * gameHours * 60;
  const hour24 = startHour + Math.floor(totalMinutes / 60);
  const minute = Math.floor(totalMinutes % 60);

  const hour12 = hour24 > 12 ? hour24 - 12 : hour24;
  const period = hour24 >= 12 ? 'PM' : 'AM';

  return { hour: hour12, minute, period };
}

export function formatGameTime(elapsedSeconds: number): string {
  const { hour, minute, period } = calculateGameTime(elapsedSeconds);
  return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
}

export function getWeatherEmoji(weather: WeatherType): string {
  switch (weather) {
    case WeatherType.SUNNY:
      return '☀️';
    case WeatherType.CLOUDY:
      return '☁️';
    case WeatherType.WINDY:
      return '💨';
    case WeatherType.RAINY:
      return '🌧️';
    case WeatherType.SNOWING:
      return '❄️';
    default:
      return '☀️';
  }
}

export function getWeatherLabel(weather: WeatherType): string {
  return weather.charAt(0).toUpperCase() + weather.slice(1);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
