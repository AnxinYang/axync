---
"@axync/extract-json": minor
---

### New Features:
- **Nested JSON Support**: Enhanced the parser to handle deeply nested JSON objects and arrays.
- **Truly Asynchronous `extract`**: Refactored the `extract` method to be fully asynchronous, ensuring non-blocking behavior.
- **Synchronous API**: Introduced a `sync` version of the `extract` method for use cases where async behavior is not required.
- **Streaming API**: Added an `extractStream` method as an async generator, enabling incremental JSON extraction for large strings or real-time data processing.
