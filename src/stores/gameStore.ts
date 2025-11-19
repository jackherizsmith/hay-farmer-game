import { create } from 'zustand';
import { GameState, WeatherType, GameAction, WEATHER_CONFIGS, GAME_CONSTANTS } from '@/types/game';
import { calculateCoverDuration, getRandomWeatherDuration, getNextWeather, clamp } from '@/lib/utils';

interface GameStore extends GameState {
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  tick: () => void;
  makeHay: () => void;
  toggleCover: () => void;
  updateWeather: () => void;

  // Computed
  canMakeHay: () => boolean;
  canToggleCover: () => boolean;
  getRemainingTime: () => number;

  // History
  actionHistory: GameAction[];
  addAction: (action: GameAction) => void;
}

const initialWeatherDuration = getRandomWeatherDuration(WeatherType.SUNNY);

const initialState: GameState = {
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  startTime: 0,
  elapsedTime: 0,
  gameTimeHour: 5,
  uncoveredHay: 0,
  coveredHay: 0,
  isCovering: false,
  isUncovering: false,
  coverProgress: 0,
  coverStartTime: null,
  coverDuration: 0,
  hayBeingTransferred: 0,
  startUncoveredHay: 0,
  startCoveredHay: 0,
  weather: {
    current: WeatherType.SUNNY,
    nextChangeAt: initialWeatherDuration,
    duration: initialWeatherDuration,
  },
  finalScore: 0,
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...initialState,
  actionHistory: [],

  startGame: () => {
    const now = Date.now();
    const weatherDuration = getRandomWeatherDuration(WeatherType.SUNNY);
    set({
      ...initialState,
      isPlaying: true,
      startTime: now,
      weather: {
        current: WeatherType.SUNNY,
        nextChangeAt: weatherDuration,
        duration: weatherDuration,
      },
      actionHistory: [],
    });
  },

  pauseGame: () => {
    set({ isPaused: true });
  },

  resumeGame: () => {
    set({ isPaused: false });
  },

  endGame: () => {
    const state = get();
    set({
      isPlaying: false,
      isGameOver: true,
      finalScore: state.coveredHay,
    });
  },

  resetGame: () => {
    const weatherDuration = getRandomWeatherDuration(WeatherType.SUNNY);
    set({
      ...initialState,
      weather: {
        current: WeatherType.SUNNY,
        nextChangeAt: weatherDuration,
        duration: weatherDuration,
      },
      actionHistory: [],
    });
  },

  tick: () => {
    const state = get();
    if (!state.isPlaying || state.isPaused || state.isGameOver) return;

    const now = Date.now();
    const deltaTime = (now - state.startTime) / 1000;
    const newElapsedTime = deltaTime;

    // Check if game is over
    if (newElapsedTime >= GAME_CONSTANTS.GAME_DURATION) {
      get().endGame();
      return;
    }

    const updates: Partial<GameState> = {
      elapsedTime: newElapsedTime,
    };

    // Handle covering/uncovering progress with gradual transfer
    if ((state.isCovering || state.isUncovering) && state.coverStartTime !== null) {
      const coverElapsed = (now - state.coverStartTime) / 1000;
      const progress = clamp((coverElapsed / state.coverDuration) * 100, 0, 100);
      const progressRatio = progress / 100;

      if (state.isCovering) {
        // Covering: gradually move hay from uncovered to covered
        const transferred = Math.floor(state.hayBeingTransferred * progressRatio);
        updates.coveredHay = state.startCoveredHay + transferred;
        updates.uncoveredHay = Math.max(0, state.startUncoveredHay - transferred);

        if (progress >= 100) {
          // Covering complete
          updates.isCovering = false;
          updates.coverProgress = 0;
          updates.coverStartTime = null;
          updates.hayBeingTransferred = 0;
          updates.coveredHay = state.startCoveredHay + state.hayBeingTransferred;
          updates.uncoveredHay = Math.max(0, state.startUncoveredHay - state.hayBeingTransferred);

          get().addAction({
            type: 'complete_cover',
            timestamp: now,
            data: { amount: state.hayBeingTransferred },
          });
        } else {
          updates.coverProgress = progress;
        }
      } else if (state.isUncovering) {
        // Uncovering: gradually move hay from covered to uncovered
        const transferred = Math.floor(state.hayBeingTransferred * progressRatio);
        updates.uncoveredHay = state.startUncoveredHay + transferred;
        updates.coveredHay = Math.max(0, state.startCoveredHay - transferred);

        if (progress >= 100) {
          // Uncovering complete
          updates.isUncovering = false;
          updates.coverProgress = 0;
          updates.coverStartTime = null;
          updates.hayBeingTransferred = 0;
          updates.uncoveredHay = state.startUncoveredHay + state.hayBeingTransferred;
          updates.coveredHay = Math.max(0, state.startCoveredHay - state.hayBeingTransferred);

          get().addAction({
            type: 'complete_cover',
            timestamp: now,
            data: { amount: state.hayBeingTransferred },
          });
        } else {
          updates.coverProgress = progress;
        }
      }
    }

    // Handle weather-based hay loss (only affects uncovered hay)
    if (!state.isCovering && !state.isUncovering && state.uncoveredHay > 0) {
      const weatherConfig = WEATHER_CONFIGS[state.weather.current];
      if (weatherConfig.hayLossRate > 0) {
        const lossAmount = (weatherConfig.hayLossRate * GAME_CONSTANTS.TICK_RATE) / 1000;
        const newUncoveredHay = Math.max(0, state.uncoveredHay - lossAmount);

        if (newUncoveredHay !== state.uncoveredHay) {
          updates.uncoveredHay = newUncoveredHay;

          if (lossAmount >= 0.1) {
            get().addAction({
              type: 'hay_loss',
              timestamp: now,
              data: { amount: lossAmount, weather: state.weather.current },
            });
          }
        }
      }
    }

    // Handle weather changes
    if (newElapsedTime >= state.weather.nextChangeAt) {
      const newWeather = getNextWeather(state.weather.current);
      const newDuration = getRandomWeatherDuration(newWeather);

      updates.weather = {
        current: newWeather,
        nextChangeAt: newElapsedTime + newDuration,
        duration: newDuration,
      };

      get().addAction({
        type: 'weather_change',
        timestamp: now,
        data: { weather: newWeather },
      });
    }

    set(updates);
  },

  makeHay: () => {
    const state = get();
    if (!get().canMakeHay()) return;

    set({ uncoveredHay: state.uncoveredHay + 1 });

    get().addAction({
      type: 'make_hay',
      timestamp: Date.now(),
      data: { amount: 1 },
    });
  },

  toggleCover: () => {
    const state = get();
    const now = Date.now();

    // If currently covering, switch to uncovering (if there's covered hay)
    if (state.isCovering && state.coveredHay > 0) {
      const amountToUncover = state.coveredHay;
      const duration = calculateCoverDuration(amountToUncover);

      set({
        isCovering: false,
        isUncovering: true,
        coverProgress: 0,
        coverStartTime: now,
        coverDuration: duration,
        hayBeingTransferred: amountToUncover,
        startUncoveredHay: state.uncoveredHay,
        startCoveredHay: state.coveredHay,
      });

      get().addAction({
        type: 'start_cover',
        timestamp: now,
        data: { amount: amountToUncover, duration, action: 'uncover' },
      });
      return;
    }

    // If currently uncovering, switch to covering (if there's uncovered hay)
    if (state.isUncovering && state.uncoveredHay > 0) {
      const amountToCover = state.uncoveredHay;
      const duration = calculateCoverDuration(amountToCover);

      set({
        isCovering: true,
        isUncovering: false,
        coverProgress: 0,
        coverStartTime: now,
        coverDuration: duration,
        hayBeingTransferred: amountToCover,
        startUncoveredHay: state.uncoveredHay,
        startCoveredHay: state.coveredHay,
      });

      get().addAction({
        type: 'start_cover',
        timestamp: now,
        data: { amount: amountToCover, duration, action: 'cover' },
      });
      return;
    }

    // Not currently doing anything - start new action
    if (!get().canToggleCover()) return;

    // If we have uncovered hay, cover it
    if (state.uncoveredHay > 0) {
      const amountToCover = state.uncoveredHay;
      const duration = calculateCoverDuration(amountToCover);

      set({
        isCovering: true,
        isUncovering: false,
        coverProgress: 0,
        coverStartTime: now,
        coverDuration: duration,
        hayBeingTransferred: amountToCover,
        startUncoveredHay: state.uncoveredHay,
        startCoveredHay: state.coveredHay,
      });

      get().addAction({
        type: 'start_cover',
        timestamp: now,
        data: { amount: amountToCover, duration, action: 'cover' },
      });
    }
    // If we have covered hay, uncover it
    else if (state.coveredHay > 0) {
      const amountToUncover = state.coveredHay;
      const duration = calculateCoverDuration(amountToUncover);

      set({
        isCovering: false,
        isUncovering: true,
        coverProgress: 0,
        coverStartTime: now,
        coverDuration: duration,
        hayBeingTransferred: amountToUncover,
        startUncoveredHay: state.uncoveredHay,
        startCoveredHay: state.coveredHay,
      });

      get().addAction({
        type: 'start_cover',
        timestamp: now,
        data: { amount: amountToUncover, duration, action: 'uncover' },
      });
    }
  },

  updateWeather: () => {
    const state = get();
    const newWeather = getNextWeather(state.weather.current);
    const newDuration = getRandomWeatherDuration(newWeather);

    set({
      weather: {
        current: newWeather,
        nextChangeAt: state.elapsedTime + newDuration,
        duration: newDuration,
      },
    });
  },

  canMakeHay: () => {
    const state = get();
    // Cannot make hay if covering/uncovering, or if hay is already covered
    if (!state.isPlaying || state.isPaused || state.isGameOver || state.isCovering || state.isUncovering) {
      return false;
    }
    // Cannot make hay if there is covered hay (must uncover first)
    if (state.coveredHay > 0) {
      return false;
    }
    const weatherConfig = WEATHER_CONFIGS[state.weather.current];
    return weatherConfig.canMakeHay;
  },

  canToggleCover: () => {
    const state = get();
    // Can always toggle if playing and there's hay in either state
    // This allows interrupting cover/uncover actions
    return (
      state.isPlaying &&
      !state.isPaused &&
      !state.isGameOver &&
      (state.uncoveredHay > 0 || state.coveredHay > 0)
    );
  },

  getRemainingTime: () => {
    const state = get();
    return Math.max(0, GAME_CONSTANTS.GAME_DURATION - state.elapsedTime);
  },

  addAction: (action: GameAction) => {
    set((state) => ({
      actionHistory: [...state.actionHistory, action],
    }));
  },
}));
