/**
 * Array generation utility functions for benchmarking
 * All functions generate arrays with sequential numbers [0, 1, 2, ..., size-1]
 */

/**
 * Create array using Array constructor with for loop
 */
export function createArrayWithConstructor(size: number): number[] {
  const arr = new Array(size);
  for (let i = 0; i < size; i++) {
    arr[i] = i;
  }
  return arr;
}

/**
 * Create array using Array.from with mapper function
 */
export function createArrayWithFromMapper(size: number): number[] {
  return Array.from({ length: size }, (_, i) => i);
}

/**
 * Create array using spread operator with map
 */
export function createArrayWithSpread(size: number): number[] {
  return [...Array(size)].map((_, i) => i);
}

/**
 * Create array using Array.fill then map
 */
export function createArrayWithFill(size: number): number[] {
  return Array(size)
    .fill(0)
    .map((_, i) => i);
}

/**
 * Create array using for loop with push
 */
export function createArrayWithForPush(size: number): number[] {
  const arr: number[] = [];
  for (let i = 0; i < size; i++) {
    arr.push(i);
  }
  return arr;
}

/**
 * Create array using Array.of with Array.from
 */
export function createArrayWithOf(size: number): number[] {
  return Array.from(Array.of(...new Array(size)), (_, i) => i);
}

/**
 * All array generation functions
 */
export const arrayGenerationFunctions = {
  createArrayWithConstructor,
  createArrayWithFromMapper,
  createArrayWithSpread,
  createArrayWithFill,
  createArrayWithForPush,
  createArrayWithOf,
} as const;
