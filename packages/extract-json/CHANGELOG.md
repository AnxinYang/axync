# @axync/extract-json

## 1.1.0

### Minor Changes

- a64c97b: ### New Features:
  - **Nested JSON Support**: Enhanced the parser to handle deeply nested JSON objects and arrays.
  - **Truly Asynchronous `extract`**: Refactored the `extract` method to be fully asynchronous, ensuring non-blocking behavior.
  - **Synchronous API**: Introduced a `sync` version of the `extract` method for use cases where async behavior is not required.
  - **Streaming API**: Added an `extractStream` method as an async generator, enabling incremental JSON extraction for large strings or real-time data processing.

## 1.0.2

### Patch Changes

- 46474b0: Update code for eslint

## 1.0.1

### Patch Changes

- 0f76506: @axync/extract-json: fix package name in readme

## 1.0.0

### Major Changes

- 579e7c6: Release @axync/extract-json
