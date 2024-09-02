# @axync/random

## Overview

The `@axync/random` package provides utility functions for generating random strings and integers. It is designed to be flexible and customizable, allowing you to specify character sets, prefixes, and suffixes for the generated strings.

## Installation

Install the package using npm:

```bash
npm install @axync/random
```

## Usage

### RandomStringGenerator

The `RandomStringGenerator` class allows you to generate random strings with customizable character sets, prefixes, and suffixes.

#### Example:

```typescript
import { RandomStringGenerator } from '@axync/random';

const generator = new RandomStringGenerator({
  charset: 'abcdef012345',
  prefix: 'PRE-',
  suffix: '-SUF',
});

const randomString = generator.generate(10);
console.log(randomString); // Output might be something like: "PRE-d34c5ba012-SUF"
```

#### Configuration Options

The `RandomStringGeneratorConfig` interface allows you to customize the behavior of the `RandomStringGenerator`:

- `charset`: The character set to use for generating random strings. Defaults to `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`.
- `prefix`: A string to prepend to the generated random string.
- `suffix`: A string to append to the generated random string.

### getRandomString

The `getRandomString` function is a convenient way to generate a random string using the default configuration.

#### Example:

```typescript
import { getRandomString } from '@axync/random';

const randomString = getRandomString(10);
console.log(randomString); // Output might be something like: "aBcD1234Ef"
```

### getRandomIntegerNumber

The `getRandomIntegerNumber` function returns a random integer between the specified minimum and maximum values.

#### Example:

```typescript
import { getRandomIntegerNumber } from '@axync/random';

const randomNumber = getRandomIntegerNumber(1, 100);
console.log(randomNumber); // Output might be any integer between 1 and 100
```

## API Reference

### `RandomStringGenerator`

- **Constructor**: `constructor(input?: RandomStringGeneratorConfig)`
  - `input.charset` (optional): The character set to use for generating random strings.
  - `input.prefix` (optional): A string to prepend to the generated random string.
  - `input.suffix` (optional): A string to append to the generated random string.

- **generate**: `generate(length: number): string`
  - Generates a random string of the specified length.

### `getRandomString`

- **Usage**: `getRandomString(length: number): string`
  - Generates a random string of the specified length using the default configuration.

### `getRandomIntegerNumber`

- **Usage**: `getRandomIntegerNumber(min: number, max: number): number`
  - Returns a random integer between the specified minimum and maximum values.

## License

This package is licensed under the MIT License.