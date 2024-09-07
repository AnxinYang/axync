/**
 * Options for memorizing function results.
 */
interface MemorizeOptions {
  /**
   * Time-to-live in milliseconds for a cached result. 
   * If not provided, results will be cached indefinitely.
   */
  ttl?: number;

  /**
   * Maximum number of results to store in the cache. 
   * If the cache exceeds this size, the oldest result will be removed.
   */
  maxCacheSize?: number;
}

/**
 * Structure of a memorized result stored in cache.
 * 
 * @template T - The type of the cached result.
 */
interface MemorizedResult<T> {
  /** The cached value. */
  value: T;

  /** The expiration timestamp for this cached value. */
  expiration: number;
}

/** 
 * Type representing a generic input function.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InputFunctionType = (...args: any[]) => any;

/**
 * Type representing a function that returns a memorized result.
 * 
 * @template FunctionType - The type of the original function.
 */
type MemorizedFunction<FunctionType extends InputFunctionType> = (
  key: string,
  ...args: Parameters<FunctionType>
) => Promise<ReturnType<FunctionType>>;

/**
 * Interface for controlling the memory used by the memorized function.
 * 
 * @template FunctionType - The type of the original function.
 */
interface MemoryControlFunctions<FunctionType extends InputFunctionType> {
  /**
   * Imports a memory object into the current cache.
   * 
   * @param memory - The memory object to import.
   */
  importMemory: (
    memoryToImport: Record<string, MemorizedResult<ReturnType<FunctionType>>>
  ) => void;

  /**
   * Exports the current memory object.
   * 
   * @returns The current memory object.
   */
  exportMemory: () => Record<string, MemorizedResult<ReturnType<FunctionType>>>;

  /**
   * Clears all cached results.
   */
  clearMemory: () => void;
}

/**
 * Wraps a function with a caching layer that memorizes its results.
 * 
 * @template FunctionType - The type of the function to memorize.
 * 
 * @param fn - The function to be memorized.
 * @param options - Optional settings for cache behavior.
 * 
 * @returns A tuple where the first item is the memorized function and the second item is a set of memory control functions.
 */
export function memorize<FunctionType extends InputFunctionType>(
  fn: FunctionType,
  options: MemorizeOptions = {}
): [MemorizedFunction<FunctionType>, MemoryControlFunctions<FunctionType>] {
  const { ttl, maxCacheSize } = options;
  let memory: Record<string, MemorizedResult<ReturnType<FunctionType>>> = {};
  let cacheOrder: string[] = []; // Tracks the order of cache keys

  /**
   * Retrieves a cached result if it exists and is still valid.
   * 
   * @param key - The key associated with the cached result.
   * @returns The cached result if valid, otherwise `undefined`.
   */
  const getCachedResult = (
    key: string
  ): ReturnType<FunctionType> | undefined => {
    const cachedResult = memory[key];
    if (cachedResult && cachedResult.expiration > Date.now()) {
      return cachedResult.value;
    }
    return undefined;
  };

  /**
   * Stores a result in the cache.
   * 
   * @param key - The key to associate with the result.
   * @param result - The result to store in the cache.
   */
  const storeInCache = (key: string, result: ReturnType<FunctionType>) => {
    memory[key] = {
      value: result,
      expiration: ttl ? Date.now() + ttl : Infinity,
    };

    cacheOrder.push(key);
    if (maxCacheSize && cacheOrder.length > maxCacheSize) {
      const keyToRemove = cacheOrder.shift() as string;
      delete memory[keyToRemove];
    }
  };

  /**
   * The memorized function that will return cached results if available.
   * 
   * @param key - The key associated with the result.
   * @param args - The arguments to pass to the original function.
   * @returns The cached or freshly computed result.
   */
  const memorizedFunction: MemorizedFunction<FunctionType> = async (
    key: string,
    ...args: Parameters<FunctionType>
  ): Promise<ReturnType<FunctionType>> => {
    const cachedValue = getCachedResult(key);
    if (cachedValue !== undefined) {
      return cachedValue;
    }

    const result = await fn(...args);
    storeInCache(key, result);

    return result;
  };

  /**
   * Imports a memory object into the current cache.
   * 
   * @param memoryToImport - The memory object to import.
   */
  const importMemory = (
    memoryToImport: Record<string, MemorizedResult<ReturnType<FunctionType>>>
  ) => {
    memory = memoryToImport;
  };

  /**
   * Exports the current memory object.
   * 
   * @returns The current memory object.
   */
  const exportMemory = () => memory;

  /**
   * Clears all cached results.
   */
  const clearMemory = () => {
    memory = {};
    cacheOrder = [];
  };

  return [
    memorizedFunction,
    {
      importMemory,
      exportMemory,
      clearMemory,
    },
  ];
}
