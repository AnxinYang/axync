import { describe, it, expect, vi } from "vitest";
import { memorize } from "../memorize.js";

describe("withMemorized", () => {
  it("should return the cached result if within TTL", async () => {
    const mockFn = vi.fn(async (num: number) => num * 2);
    const [memorizedFunction] = memorize(mockFn, { ttl: 1000 });

    const result1 = await memorizedFunction("key1", 2);
    const result2 = await memorizedFunction("key1", 2);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(result1).toBe(4);
    expect(result2).toBe(4);
  });

  it("should recompute the result if TTL has expired", async () => {
    const mockFn = vi.fn(async (num: number) => num * 2);
    const [memorizedFunction] = memorize(mockFn, { ttl: 10 });

    const result1 = await memorizedFunction("key1", 2);
    await new Promise((resolve) => setTimeout(resolve, 20)); // Wait for TTL to expire
    const result2 = await memorizedFunction("key1", 2);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(result1).toBe(4);
    expect(result2).toBe(4);
  });

  it("should not exceed max cache size", async () => {
    const mockFn = vi.fn(async (num: number) => num * 2);
    const [memorizedFunction] = memorize(mockFn, { maxCacheSize: 2 });

    await memorizedFunction("key1", 2);
    await memorizedFunction("key2", 3);
    await memorizedFunction("key3", 4);

    const result3 = await memorizedFunction("key3", 4);
    const result2 = await memorizedFunction("key2", 3);
    const result1 = await memorizedFunction("key1", 2);

    // key1 should have been evicted
    expect(mockFn).toHaveBeenCalledTimes(4);
    expect(result1).toBe(4); // Recomputed because key1 was evicted
    expect(result2).toBe(6);
    expect(result3).toBe(8);
  });

  it("should allow importing and exporting memory", async () => {
    const mockFn = vi.fn(async (num: number) => num * 2);
    const [memorizedFunction, { exportMemory }] = memorize(mockFn);

    const result1 = await memorizedFunction("key1", 2);
    const exportedMemory = exportMemory();

    const [newMemorizedFunction, { importMemory: newImportMemory }] =
      memorize(mockFn);
    newImportMemory(exportedMemory);

    const result2 = await newMemorizedFunction("key1", 2);

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(result1).toBe(4);
    expect(result2).toBe(4); // Should be retrieved from imported memory
  });

  it("should clear the memory", async () => {
    const mockFn = vi.fn(async (num: number) => num * 2);
    const [memorizedFunction, { clearMemory }] = memorize(mockFn);

    const result1 = await memorizedFunction("key1", 2);
    clearMemory();
    const result2 = await memorizedFunction("key1", 2);

    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(result1).toBe(4);
    expect(result2).toBe(4);
  });
});
