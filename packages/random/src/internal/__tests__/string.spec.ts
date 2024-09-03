import { describe, it, expect} from "vitest";
import { RandomStringGenerator, getRandomString } from '../string.js';

describe('RandomStringGenerator', () => {
  describe('generate', () => {
    it('should generate a random string of the specified length', () => {
      const generator = new RandomStringGenerator();
      const length = 10;
      const result = generator.generate(length);
      expect(result.length).toBe(length);
    });

    it('should generate a random string with the specified prefix', () => {
      const generator = new RandomStringGenerator({ prefix: 'pre-' });
      const length = 10;
      const result = generator.generate(length);
      expect(result.startsWith('pre-')).toBe(true);
    });

    it('should generate a random string with the specified suffix', () => {
      const generator = new RandomStringGenerator({ suffix: '-suf' });
      const length = 10;
      const result = generator.generate(length);
      expect(result.endsWith('-suf')).toBe(true);
    });

    it('should generate a random string with the specified charset', () => {
      const generator = new RandomStringGenerator({ charset: 'abc' });
      const length = 10;
      const result = generator.generate(length);
      expect(result).toMatch(/^[abc]{10}$/);
    });

    it('should generate a random string with the specified prefix, suffix, and charset', () => {
      const generator = new RandomStringGenerator({
        prefix: 'pre-',
        suffix: '-suf',
        charset: 'abc',
      });
      const length = 10;
      const result = generator.generate(length);
      expect(result).toMatch(/^pre-[abc]{10}-suf$/);
    });
  });
});


describe('getRandomString', () => {
  it('should be an instance of RandomStringGenerator', async () => {
    const length = 10;
    const result = getRandomString(length);
    expect(result.length).toBe(length);
  });
});
