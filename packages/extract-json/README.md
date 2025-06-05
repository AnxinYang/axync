# @axync/extract-json
![Test](https://github.com/AnxinYang/axync/actions/workflows/publish.yml/badge.svg)

## Overview

`@axync/extract-json` is a powerful utility designed to extract valid JSON objects and arrays from raw text. Whether you're working with large text data, processing logs, or parsing responses from Large Language Models (LLMs), this package helps you efficiently extract structured JSON data from unstructured strings.

Key features include:
- **Asynchronous and Streaming Support**: Process large strings incrementally without blocking the event loop.
- **Flexible JSON Extraction**: Extract multiple JSON objects or arrays from mixed or noisy text.
- **Real-Time Data Processing**: Ideal for real-time applications like log parsing or API response handling.
- **Error Resilience**: Skips invalid JSON gracefully while continuing to parse valid data.

> Note: This package focuses on extracting JSON objects (`{}`) and arrays (`[]`) only. Other JSON types like strings, numbers, or booleans are not supported.

With `@axync/extract-json`, you can seamlessly integrate JSON extraction into your workflows, making it an essential tool for developers working with unstructured text or LLM outputs.

## Installation

You can install the package using npm:

```bash
npm install @axync/extract-json
```

## Usage

The primary functions provided by this package are `extractJson` (asynchronous) and `extractJsonSync` (synchronous), which allow you to extract JSON objects and arrays from a raw string.

### Example (Async)

```typescript
import { extractJson } from '@axync/extract-json';

const rawString = `
  Here is some text before a JSON object: {"key": "value"} 
  and another one: {"anotherKey": 123} and here is an array: [1, 2, 3]
`;

const jsonObjects = await extractJson(rawString);

console.log(jsonObjects);
// Output: [{ "key": "value" }, { "anotherKey": 123 }, [1, 2, 3]]
```

### Example (Sync)

```typescript
import { extractJsonSync } from '@axync/extract-json';

const rawString = `
  Here is some text before a JSON object: {"key": "value"} 
  and another one: {"anotherKey": 123} and here is an array: [1, 2, 3]
`;

const jsonObjects = extractJsonSync(rawString);

console.log(jsonObjects);
// Output: [{ "key": "value" }, { "anotherKey": 123 }, [1, 2, 3]]
```

### Example (Async Streaming)

The `extractStream` function allows you to process JSON objects incrementally, which is useful for large strings or real-time data processing.

```typescript
import { extractStream } from '@axync/extract-json';

const rawString = `
  {"key1": "value1"} {"key2": "value2"} {"key3": "value3"}
`;

for await (const json of extractStream(rawString)) {
  console.log(json);
}
// Output:
// { key1: "value1" }
// { key2: "value2" }
// { key3: "value3" }
```

### Extract with Limit

You can also specify a limit to control the number of JSON objects or arrays extracted:

#### Async
```typescript
const jsonObjects = await extractJson(rawString, 2);

console.log(jsonObjects);
// Output: [{ "key": "value" }, { "anotherKey": 123 }]
```

#### Sync
```typescript
const jsonObjects = extractJsonSync(rawString, 2);

console.log(jsonObjects);
// Output: [{ "key": "value" }, { "anotherKey": 123 }]
```

## API

### `extractJson(rawString: string, limit?: number): Promise<T[]>`

- **rawString**: The string containing potential JSON objects or arrays.
- **limit**: (Optional) The maximum number of JSON objects/arrays to extract. Defaults to `Infinity`.

**Returns**: A `Promise` that resolves to an array of extracted JSON objects and arrays.

---

### `extractJsonSync(rawString: string, limit?: number): T[]`

- **rawString**: The string containing potential JSON objects or arrays.
- **limit**: (Optional) The maximum number of JSON objects/arrays to extract. Defaults to `Infinity`.

**Returns**: An array of extracted JSON objects and arrays.

---

### `extractStream(rawString: string): AsyncGenerator<T>`

- **rawString**: The string containing potential JSON objects or arrays.

**Returns**: An `AsyncGenerator` that yields JSON objects and arrays as they are parsed.

## How It Works

1. **Direct Parsing**: The `JsonExtractor` class first attempts to directly parse the entire string as JSON.
  
2. **Finding Start Indexes**: If direct parsing fails, it scans the string for potential start indexes of JSON objects (`{`, `[`) and arrays.
  
3. **Parsing Substrings**: The class then attempts to parse substrings starting from each identified index, searching for valid JSON objects and arrays.

4. **Streaming**: The `extractStream` method processes the string incrementally and yields JSON objects as they are parsed.

## Performance

Performance tests were conducted to evaluate the efficiency of the three primary functions provided by `@axync/extract-json`. Below are the results for processing 100,000 JSON objects and an array:

- **extractJson**: Processed in approximately `86.25ms`.
- **extractJsonSync**: Processed in approximately `78.93ms`.
- **extractStream**: Processed in approximately `108.98ms`.

### Test Environment
- **CPU**: 13th Gen Intel(R) Core(TM) i9-13900K, 24 cores, 3.0 GHz

### Observations
- `extractJsonSync` is the fastest for synchronous operations but blocks the event loop.
- `extractJson` provides asynchronous processing, making it suitable for non-blocking operations.
- `extractStream` is ideal for streaming large data incrementally.

## Limitations

- This package only extracts JSON objects (`{}`) and arrays (`[]`). It does not extract other JSON data types like strings, numbers, or booleans.

## License

This project is licensed under the MIT License.
