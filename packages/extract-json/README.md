# @axync/extract-json
![Test](https://github.com/AnxinYang/axync/actions/workflows/test.yml/badge.svg)


## Overview

`@axync/extract-json` is a utility for extracting JSON objects and arrays from a raw string. This package is particularly useful when dealing with large or malformed JSON data where you need to extract valid JSON objects or arrays from a larger text.

> This package only extracts Objects and Arrays from string.

## Installation

You can install the package using npm:

```bash
npm install @axync/extract-json
```

## Usage

The primary function provided by this package is `extractJson`, which allows you to extract JSON objects and arrays from a raw string. 

### Example

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

### Extract with Limit

You can also specify a limit to control the number of JSON objects or arrays extracted:

```typescript
const jsonObjects = await extractJson(rawString, 2);

console.log(jsonObjects);
// Output: [{ "key": "value" }, { "anotherKey": 123 }]
```

## API

### `extractJson(rawString: string, limit?: number): Promise<any[]>`

- **rawString**: The string containing potential JSON objects or arrays.
- **limit**: (Optional) The maximum number of JSON objects/arrays to extract. Defaults to `Infinity`.

**Returns**: A `Promise` that resolves to an array of extracted JSON objects and arrays.

## How It Works

1. **Direct Parsing**: The `JsonExtractor` class first attempts to directly parse the entire string as JSON.
  
2. **Finding Start Indexes**: If direct parsing fails, it scans the string for potential start indexes of JSON objects (`{`, `[`) and arrays.
  
3. **Parsing Substrings**: The class then attempts to parse substrings starting from each identified index, searching for valid JSON objects and arrays.

4. **Extraction**: The method returns an array containing all successfully extracted JSON objects and arrays.

## Limitations

- This package only extracts JSON objects (`{}`) and arrays (`[]`). It does not extract other JSON data types like strings, numbers, or booleans.

## License

This project is licensed under the MIT License. 
