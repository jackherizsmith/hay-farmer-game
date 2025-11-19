export enum WeatherType {
  SUNNY = "sunny",
  CLOUDY = "cloudy",
  WINDY = "windy",
  RAINY = "rainy",
  SNOWING = "snowing",
}

export interface WeatherState {
  current: WeatherType;
  nextChangeAt: number;
  duration: number;
}

export interface GameState {
  // Game status
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;

  // Time
  startTime: number;
  elapsedTime: number;
  gameTimeHour: number;

  // Hay tracking
  uncoveredHay: number; // Hay in the field (vulnerable to weather)
  coveredHay: number; // Hay safely stored in barn

  // Making hay action
  isMakingHay: boolean;
  makeHayProgress: number;
  makeHayStartTime: number | null;

  // Covering action
  isCovering: boolean;
  coverProgress: number;
  coverStartTime: number | null;
  coverDuration: number;
  hayBeingTransferred: number; // Amount of hay being moved to barn
  startUncoveredHay: number; // Field hay when covering started
  startCoveredHay: number; // Barn hay when covering started

  // Weather
  weather: WeatherState;

  // Score
  finalScore: number;
}

export interface GameAction {
  type:
    | "make_hay"
    | "start_cover"
    | "complete_cover"
    | "weather_change"
    | "hay_loss";
  timestamp: number;
  data?: {
    amount?: number;
    weather?: WeatherType;
    [key: string]: unknown;
  };
}

export interface WeatherConfig {
  canMakeHay: boolean;
  hayLossRate: number;
  minDuration: number;
  maxDuration: number;
  possibleTransitions: WeatherType[];
}

export const WEATHER_CONFIGS: Record<WeatherType, WeatherConfig> = {
  [WeatherType.SUNNY]: {
    canMakeHay: true,
    hayLossRate: 0,
    minDuration: 2,
    maxDuration: 6,
    possibleTransitions: [
      WeatherType.SUNNY,
      WeatherType.SUNNY,
      WeatherType.SUNNY,
      WeatherType.CLOUDY,
      WeatherType.WINDY,
    ],
  },
  [WeatherType.CLOUDY]: {
    canMakeHay: false,
    hayLossRate: 0,
    minDuration: 2,
    maxDuration: 3,
    possibleTransitions: [
      WeatherType.SUNNY,
      WeatherType.SUNNY,
      WeatherType.SUNNY,
      WeatherType.WINDY,
      WeatherType.RAINY,
    ],
  },
  [WeatherType.WINDY]: {
    canMakeHay: false,
    hayLossRate: 1.5,
    minDuration: 2,
    maxDuration: 3,
    possibleTransitions: [
      WeatherType.SUNNY,
      WeatherType.SUNNY,
      WeatherType.CLOUDY,
      WeatherType.RAINY,
    ],
  },
  [WeatherType.RAINY]: {
    canMakeHay: false,
    hayLossRate: 3,
    minDuration: 2,
    maxDuration: 3,
    possibleTransitions: [
      WeatherType.SUNNY,
      WeatherType.CLOUDY,
      WeatherType.WINDY,
      WeatherType.SNOWING,
    ],
  },
  [WeatherType.SNOWING]: {
    canMakeHay: false,
    hayLossRate: 5,
    minDuration: 1,
    maxDuration: 2,
    possibleTransitions: [
      WeatherType.SUNNY,
      WeatherType.SUNNY,
      WeatherType.CLOUDY,
    ],
  },
};

export const GAME_CONSTANTS = {
  GAME_DURATION: 90, // seconds (2 minutes)
  BASE_COVER_TIME: 2, // seconds
  COVER_SCALING_FACTOR: 0.1, // seconds per hay
  MAKE_HAY_DURATION: 0.25, // seconds (250ms)
  TICK_RATE: 100, // milliseconds
  GAME_START_HOUR: 5, // 5am
  GAME_HOURS: 18, // 5am to 11pm
  MAX_FIELD_HAY: 90, // maximum hay bales in field
};
