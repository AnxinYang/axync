# @axync/memorize

## Overview

The `@axync/memorize` package provides a utility function to cache (or "memorize") the results of expensive or frequently called functions. It allows for flexible configuration of cache behavior, including setting a time-to-live (TTL) for cached results and limiting the cache size.

## Installation

Install the package using npm:

```bash
npm install @axync/memorize
```

## Usage

### memorize

The `memorize` function wraps a given function with a caching layer that stores the results of function calls. This can be particularly useful for optimizing functions that are expensive to execute.

#### Example:

```typescript
import { memorize } from '@axync/memorize';

async function expensiveOperation(arg: number): Promise<number> {
  // Simulate an expensive operation
  return new Promise(resolve => setTimeout(() => resolve(arg * 2), 1000));
}

const [memorizedOperation, memoryControl] = memorize(expensiveOperation, {
  ttl: 5000, // Cache results for 5 seconds
  maxCacheSize: 3, // Only keep the 3 most recent results
});

const result = await memorizedOperation('key1', 5);
console.log(result); // Outputs: 10 (after 1 second)

const cachedResult = await memorizedOperation('key1', 5);
console.log(cachedResult); // Outputs: 10 (almost instantly)
```

### MemorizeOptions

The `MemorizeOptions` interface allows you to configure how the caching works:

- `ttl`: The time-to-live (in milliseconds) for cached results. After this time, cached results will be considered expired and will not be returned.
- `maxCacheSize`: The maximum number of results to store in the cache. If this limit is reached, the oldest cached result will be removed.

### Memory Control Functions

When you use the `memorize` function, it returns a tuple that includes not only the memorized function but also a set of control functions to manage the cache.

- `importMemory(memoryToImport)`: Imports a memory object into the current cache.
- `exportMemory()`: Exports the current memory object.
- `clearMemory()`: Clears all cached results.

#### Example:

```typescript
const [memorizedOperation, memoryControl] = memorize(expensiveOperation);

// Exporting the current cache
const currentMemory = memoryControl.exportMemory();

// Clearing the cache
memoryControl.clearMemory();

// Importing previously exported memory
memoryControl.importMemory(currentMemory);
```

## API Reference

### `memorize`

- **Usage**: `memorize<FunctionType>(fn: FunctionType, options?: MemorizeOptions): [MemorizedFunction<FunctionType>, MemoryControlFunctions<FunctionType>]`
  - `fn`: The function to be memorized.
  - `options`: Optional settings for cache behavior, including `ttl` and `maxCacheSize`.

- **Returns**: A tuple containing:
  1. `MemorizedFunction<FunctionType>`: The memorized function that can be called with a cache key and arguments.
  2. `MemoryControlFunctions<FunctionType>`: An object with functions to manage the cache (`importMemory`, `exportMemory`, and `clearMemory`).

## License

This package is licensed under the MIT License.