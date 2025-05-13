/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { JsonExtractor, extractJson } from '../extract-json.js'; // Update with actual path

describe('JsonExtractor', () => {
  const jsonExtractor = new JsonExtractor();

  describe('extractJson', () => {
    it('should be an instance of JsonExtractor.extract', async () => {
      const rawString = '{"key": "value"}';
      const result = await extractJson(rawString);
      expect(result).toEqual([{ key: 'value' }]);
    });
  });

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

  describe('tryParse', () => {
    it('should return parsed JSON objects/arrays when valid JSON is found', async () => {
      const rawString = '{"key": "value"} more text [1, 2, 3]';
      const result = await (jsonExtractor as any).tryParse(rawString, 2);
      expect(result).toEqual([{ key: 'value' }, [1, 2, 3]]);
    });

    it('should return an empty array if no valid JSON is found', async () => {
      const rawString = 'just some text without JSON';
      const result = await (jsonExtractor as any).tryParse(rawString, 2);
      expect(result).toEqual([]);
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

    it('should handle edge cases with nested JSON', async () => {
      const rawString = `
        {"key": {"nestedKey": "nestedValue"}} 
        [1, {"key": "value"}]
      `;
      const result = await jsonExtractor.extract(rawString);
      expect(result).toEqual([
        { key: { nestedKey: 'nestedValue' } },
        [1, { key: 'value' }],
      ]);
    });

    it('should extract a single JSON object from a string with extra text', async () => {
      const rawString = 'Extra text before {"key": "value"} and after';
      const result = await jsonExtractor.extract(rawString);
      expect(result).toEqual([{ key: 'value' }]);
    });

    it('should extract multiple JSON arrays from a string', async () => {
      const rawString = '[1, 2, 3] some text [4, 5, 6]';
      const result = await jsonExtractor.extract(rawString);
      expect(result).toEqual([[1, 2, 3], [4, 5, 6]]);
    });

    it('should handle deeply nested JSON objects', async () => {
      const rawString = '{"key": {"nestedKey": {"deepKey": "deepValue"}}}';
      const result = await jsonExtractor.extract(rawString);
      expect(result).toEqual([{ key: { nestedKey: { deepKey: 'deepValue' } } }]);
    });

    it('should handle invalid JSON gracefully and continue parsing', async () => {
      const rawString = '{"key": "value"} invalid text [1, 2, 3]';
      const result = await jsonExtractor.extract(rawString);
      expect(result).toEqual([{ key: 'value' }, [1, 2, 3]]);
    });

    it('should handle a mix of valid and invalid JSON', async () => {
      const rawString = '{"key": "value"} {invalid} [1, 2, 3]';
      const result = await jsonExtractor.extract(rawString);
      expect(result).toEqual([{ key: 'value' }, [1, 2, 3]]);
    });

    it('should extract JSON objects with special characters in keys and values', async () => {
      const rawString = '{"key-with-dash": "value_with_underscore"}';
      const result = await jsonExtractor.extract(rawString);
      expect(result).toEqual([{ 'key-with-dash': 'value_with_underscore' }]);
    });

    it('should handle JSON objects with arrays as values', async () => {
      const rawString = '{"key": [1, 2, 3]}';
      const result = await jsonExtractor.extract(rawString);
      expect(result).toEqual([{ key: [1, 2, 3] }]);
    });

    it('should handle JSON arrays with objects as elements', async () => {
      const rawString = '[{"key1": "value1"}, {"key2": "value2"}]';
      const result = await jsonExtractor.extract(rawString);
      expect(result).toEqual([[{ key1: 'value1' }, { key2: 'value2' }]]);
    });

    it('should handle strings with only whitespace', async () => {
      const rawString = '   ';
      const result = await jsonExtractor.extract(rawString);
      expect(result).toEqual([]);
    });

    it('should handle strings with multiple valid JSON objects separated by whitespace', async () => {
      const rawString = '{"key1": "value1"}   {"key2": "value2"}';
      const result = await jsonExtractor.extract(rawString);
      expect(result).toEqual([{ key1: 'value1' }, { key2: 'value2' }]);
    });

    it('should handle strings with escaped characters in JSON', async () => {
      const rawString = '{"key": "value with \\"escaped quotes\\""}';
      const result = await jsonExtractor.extract(rawString);
      expect(result).toEqual([{ key: 'value with "escaped quotes"' }]);
    });

    it('should handle strings with JSON containing Unicode characters', async () => {
      const rawString = '{"key": "value with unicode: \\u2764"}';
      const result = await jsonExtractor.extract(rawString);
      expect(result).toEqual([{ key: 'value with unicode: ❤' }]);
    });
  });
});

