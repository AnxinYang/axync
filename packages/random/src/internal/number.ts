/**
 * Returns a random integer number between the specified values.
 **/
export function getRandomIntegerNumber(min: number, max: number): number {
  if (min > max) {
    return NaN;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
