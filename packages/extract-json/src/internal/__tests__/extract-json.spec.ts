/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { JsonExtractor, extractJson } from '../extract-json.js'; // Update with actual path

describe('JsonExtractor', () => {
  const jsonExtractor = new JsonExtractor();

  describe('tryDirectParse', () => {
    it('should return parsed JSON for a valid JSON string', () => {
      const jsonString = '{"key": "value"}';
      const result = (jsonExtractor as any).tryDirectParse(jsonString);
      expect(result).toEqual({ key: 'value' });
    });

    it('should return undefined for an invalid JSON string', () => {
      const invalidJsonString = '{key: "value"}';
      const result = (jsonExtractor as any).tryDirectParse(invalidJsonString);
      expect(result).toBeUndefined();
    });
  });

  describe('findAllStartIndexes', () => {
    it('should return indexes of all JSON object/array starts', () => {
      const rawString = 'text { "key": "value" } [1, 2, 3]';
      const result = (jsonExtractor as any).findAllStartIndexes(rawString);
      expect(result).toEqual([5, 24]);
    });

    it('should return an empty array if no JSON start characters are found', () => {
      const rawString = 'just some text without JSON';
      const result = (jsonExtractor as any).findAllStartIndexes(rawString);
      expect(result).toEqual([]);
    });
  });

  describe('tryParse', () => {
    it('should return a parsed JSON object when valid JSON is found', async () => {
      const rawString = '{ "key": "value" } more text';
      const result = await (jsonExtractor as any).tryParse(rawString, 0);
      expect(result).toEqual({ key: 'value' });
    });

    it('should return undefined for incomplete JSON', async () => {
      const rawString = '{ "key": "value" more text';
      const result = await (jsonExtractor as any).tryParse(rawString, 0);
      expect(result).toBeUndefined();
    });
  });

  describe('extract', () => {
    it('should extract multiple JSON objects/arrays from a string', async () => {
      const rawString = `
        some text before a JSON object: {"key": "value"} 
        and another one: {"anotherKey": 123} 
        and an array: [1, 2, 3]
      `;
      const result = await jsonExtractor.extract(rawString);
      expect(result).toEqual([
        { key: 'value' },
        { anotherKey: 123 },
        [1, 2, 3],
      ]);
    });

    it('should respect the limit parameter', async () => {
      const rawString = `
        {"key": "value"} 
        {"anotherKey": 123} 
        [1, 2, 3]
      `;
      const result = await jsonExtractor.extract(rawString, 2);
      expect(result).toEqual([{ key: 'value' }, { anotherKey: 123 }]);
    });

    it('should return an empty array if no JSON objects/arrays are found', async () => {
      const rawString = 'just some text without JSON';
      const result = await jsonExtractor.extract(rawString);
      expect(result).toEqual([]);
    });

    it('should return an empty array if the raw string is empty', async () => {
      const rawString = '';
      const result = await jsonExtractor.extract(rawString);
      expect(result).toEqual([]);
    });
  });
});

describe('extractJson', () => {
  it('should be an instance of JsonExtractor.extract', async () => {
    const rawString = '{"key": "value"}';
    const result = await extractJson(rawString);
    expect(result).toEqual([{ key: 'value' }]);
  });
});
