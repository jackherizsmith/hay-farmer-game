/**
 * Seeded random number generator using mulberry32 algorithm
 * Provides deterministic random numbers based on a seed
 */

function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Creates a seed from a date string (YYYY-MM-DD format)
 * This ensures the same seed is used for the same day
 */
export function createDateSeed(date: Date = new Date()): number {
  const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * SeededRandom class for generating deterministic random numbers
 * Usage:
 *   const rng = new SeededRandom(); // Uses today's date as seed
 *   const rng = new SeededRandom(12345); // Uses custom seed
 *   rng.next(); // Returns random number between 0 and 1
 *   rng.nextInt(min, max); // Returns random integer between min and max (inclusive)
 *   rng.pick(array); // Returns random element from array
 */
export class SeededRandom {
  private generator: () => number;
  public readonly seed: number;

  constructor(seed?: number) {
    this.seed = seed ?? createDateSeed();
    this.generator = mulberry32(this.seed);
  }

  /**
   * Returns a random number between 0 (inclusive) and 1 (exclusive)
   */
  next(): number {
    return this.generator();
  }

  /**
   * Returns a random integer between min and max (inclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Returns a random number between min and max
   */
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Returns a random element from the array
   */
  pick<T>(array: T[]): T {
    return array[Math.floor(this.next() * array.length)];
  }

  /**
   * Creates a new SeededRandom with a derived seed
   * Useful for creating independent random streams
   */
  derive(): SeededRandom {
    return new SeededRandom(Math.floor(this.next() * 2147483647));
  }
}

/**
 * Get the daily game seed (same for everyone on the same day)
 */
export function getDailySeed(): number {
  return createDateSeed(new Date());
}

/**
 * Get the date string for display (e.g., "December 2, 2025")
 */
export function getGameDateString(): string {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
