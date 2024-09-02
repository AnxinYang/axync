import { describe, it, expect} from "vitest";
import { getRandomIntegerNumber } from '../number.js';

describe('getRandomIntegerNumber', () => {
  it('should return a random integer number between the specified values', () => {
    const min = 1;
    const max = 10;
    const randomNumber = getRandomIntegerNumber(min, max);
    expect(randomNumber).toBeGreaterThanOrEqual(min);
    expect(randomNumber).toBeLessThanOrEqual(max);
    expect(Number.isInteger(randomNumber)).toBe(true);
  });

  it('should return the minimum value when min and max are the same', () => {
    const min = 5;
    const max = 5;
    const randomNumber = getRandomIntegerNumber(min, max);
    expect(randomNumber).toBe(min);
  });

  it('should return a random integer number when min and max are negative', () => {
    const min = -10;
    const max = -1;
    const randomNumber = getRandomIntegerNumber(min, max);
    expect(randomNumber).toBeGreaterThanOrEqual(min);
    expect(randomNumber).toBeLessThanOrEqual(max);
    expect(Number.isInteger(randomNumber)).toBe(true);
  });

  it('should return NaN when min is greater than max', () => {
    const min = 10;
    const max = 5;
    const randomNumber = getRandomIntegerNumber(min, max);
    expect(randomNumber).toBeNaN();
  });
});