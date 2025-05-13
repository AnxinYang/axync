import { describe, it, expect } from "vitest";
import {
  extractJson,
  extractJsonSync,
  extractStream,
} from "../extract-json.js";

describe("Performance Tests for @axync/extract-json", () => {
  const NUM_OBJECTS = 100000; // Number of JSON objects to generate for testing

  const generateLargeJsonString = (count: number): string => {
    const jsonObjects = Array.from(
      { length: count },
      (_, i) => `{"key${i}": "value${i}"}`
    );
    return jsonObjects.join(" ") + " [1, 2, 3]";
  };

  it("should measure performance of extractJson with a large string", async () => {
    const largeString = generateLargeJsonString(NUM_OBJECTS);
    const startTime = performance.now();

    const result = await extractJson(largeString);

    const endTime = performance.now();
    console.log(
      `extractJson processed ${result.length} JSON objects in ${(endTime - startTime).toFixed(2)}ms`
    );

    expect(result.length).toBe(NUM_OBJECTS + 1); // NUM_OBJECTS + 1 array
  });

  it("should measure performance of extractJsonSync with a large string", () => {
    const largeString = generateLargeJsonString(NUM_OBJECTS);
    const startTime = performance.now();

    const result = extractJsonSync(largeString);

    const endTime = performance.now();
    console.log(
      `extractJsonSync processed ${result.length} JSON objects in ${(endTime - startTime).toFixed(2)}ms`
    );

    expect(result.length).toBe(NUM_OBJECTS + 1); // NUM_OBJECTS + 1 array
  });

  it("should measure performance of extractStream with a large string", async () => {
    const largeString = generateLargeJsonString(NUM_OBJECTS);
    const startTime = performance.now();

    const result: unknown[] = [];
    for await (const json of extractStream(largeString)) {
      result.push(json);
    }

    const endTime = performance.now();
    console.log(
      `extractStream processed ${result.length} JSON objects in ${(endTime - startTime).toFixed(2)}ms`
    );

    expect(result.length).toBe(NUM_OBJECTS + 1); // NUM_OBJECTS + 1 array
  });

  it("should compare performance of extractJson, extractJsonSync, and extractStream", async () => {
    const largeString = generateLargeJsonString(NUM_OBJECTS);

    // Measure extractJson
    const startExtractJson = performance.now();
    const resultExtractJson = await extractJson(largeString);
    const endExtractJson = performance.now();
    const extractJsonTime = endExtractJson - startExtractJson;

    // Measure extractJsonSync
    const startExtractJsonSync = performance.now();
    const resultExtractJsonSync = extractJsonSync(largeString);
    const endExtractJsonSync = performance.now();
    const extractJsonSyncTime = endExtractJsonSync - startExtractJsonSync;

    // Measure extractStream
    const startExtractStream = performance.now();
    const resultExtractStream: unknown[] = [];
    for await (const json of extractStream(largeString)) {
      resultExtractStream.push(json);
    }
    const endExtractStream = performance.now();
    const extractStreamTime = endExtractStream - startExtractStream;

    console.log(`extractJson time: ${extractJsonTime.toFixed(2)}ms`);
    console.log(`extractJsonSync time: ${extractJsonSyncTime.toFixed(2)}ms`);
    console.log(`extractStream time: ${extractStreamTime.toFixed(2)}ms`);

    expect(resultExtractJson.length).toBe(resultExtractJsonSync.length);
    expect(resultExtractJson.length).toBe(resultExtractStream.length);
    expect(resultExtractJson.length).toBe(NUM_OBJECTS + 1); // NUM_OBJECTS + 1 array
  });
});
