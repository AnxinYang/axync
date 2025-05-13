export class JsonExtractor {
  /**
   * Tries to parse the raw string as JSON.
   */
  private tryDirectParse<T = unknown>(rawString: string): T | undefined {
    try {
      return JSON.parse(rawString);
    } catch {
      return;
    }
  }

  /**
   * Shared helper function to process a single JSON candidate.
   */
  private processJsonCandidate<T>(
    remainingString: string
  ): { parsed?: T; updatedString: string } {
    const startIndex = remainingString.search(/[[{]/); // Find the start of a JSON object/array
    if (startIndex === -1) {
      return { updatedString: '' }; // No more potential JSON objects/arrays
    }

    let openBrackets = 0;
    let endIndex = -1;

    // Find the matching closing bracket
    for (let i = startIndex; i < remainingString.length; i++) {
      const char = remainingString[i];
      if (char === '{' || char === '[') {
        openBrackets++;
      } else if (char === '}' || char === ']') {
        openBrackets--;
      }

      if (openBrackets === 0) {
        endIndex = i + 1; // Include the closing bracket
        break;
      }
    }

    if (endIndex === -1) {
      // No valid closing bracket found, move past the current start index
      return { updatedString: remainingString.slice(startIndex + 1) };
    }

    const jsonCandidate = remainingString.slice(startIndex, endIndex);
    try {
      const parsed = JSON.parse(jsonCandidate);
      const updatedString = remainingString.slice(endIndex); // Move past the parsed JSON
      return { parsed, updatedString };
    } catch {
      // If parsing fails, move past the current start index and continue
      const updatedString = remainingString.slice(startIndex + 1);
      return { updatedString };
    }
  }

  /**
   * Tries to parse the raw string as JSON (async version).
   */
  private async tryParse<T = unknown[]>(
    rawString: string,
    limit = Infinity
  ): Promise<T[]> {
    const results: T[] = [];
    let remainingString = rawString;

    while (results.length < limit && remainingString.length > 0) {
      const { parsed, updatedString } = this.processJsonCandidate<T>(remainingString);
      remainingString = updatedString.trim(); // Ensure we trim whitespace to avoid getting stuck

      if (parsed !== undefined) {
        results.push(parsed);
      }

      // Yield control back to the event loop to make it truly async
      await Promise.resolve();
    }

    return results;
  }

  /**
   * Tries to parse the raw string as JSON (sync version).
   */
  private tryParseSync<T = unknown[]>(
    rawString: string,
    limit = Infinity
  ): T[] {
    const results: T[] = [];
    let remainingString = rawString;

    while (results.length < limit && remainingString.length > 0) {
      const { parsed, updatedString } = this.processJsonCandidate<T>(remainingString);
      remainingString = updatedString.trim(); // Ensure we trim whitespace to avoid getting stuck

      if (parsed !== undefined) {
        results.push(parsed);
      }
    }

    return results;
  }

  /**
   * Extracts JSON objects and arrays from the raw string (async version).
   * When providing a limit, the extraction will only try to extract
   * up to the specified number of objects/arrays.
   */
  async extract<T = unknown>(
    rawString: string,
    limit = Infinity
  ): Promise<T[]> {
    if (!rawString) {
      return [];
    }
    const directParsed = this.tryDirectParse<T>(rawString);
    if (directParsed) {
      return [directParsed];
    }

    return this.tryParse(rawString, limit);
  }

  /**
   * Extracts JSON objects and arrays from the raw string (sync version).
   * When providing a limit, the extraction will only try to extract
   * up to the specified number of objects/arrays.
   */
  extractSync<T = unknown>(rawString: string, limit = Infinity): T[] {
    if (!rawString) {
      return [];
    }
    const directParsed = this.tryDirectParse<T>(rawString);
    if (directParsed) {
      return [directParsed];
    }

    return this.tryParseSync(rawString, limit);
  }
}

const jsonExtractor = new JsonExtractor();

/**
 * Extracts JSON objects and arrays from the raw string (async version).
 * When providing a limit, the extraction will only try to extract
 * up to the specified number of objects/arrays.
 */
export const extractJson = jsonExtractor.extract.bind(jsonExtractor);

/**
 * Extracts JSON objects and arrays from the raw string (sync version).
 * When providing a limit, the extraction will only try to extract
 * up to the specified number of objects/arrays.
 */
export const extractJsonSync = jsonExtractor.extractSync.bind(jsonExtractor);
