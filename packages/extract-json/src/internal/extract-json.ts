export class JsonExtractor {
  /**
   * Tries to parse the raw string as JSON.
   */
  private tryDirectParse<T=unknown>(rawString: string): T | undefined {
    try {
      return JSON.parse(rawString);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return;
    }
  }

  /**
   * Tries to parse the raw string as JSON.
   */
  private async tryParse<T = unknown[]>(
    rawString: string,
    limit = Infinity
  ): Promise<T[]> {
    const results: T[] = [];
    let remainingString = rawString;

    while (results.length < limit && remainingString.length > 0) {
      const startIndex = remainingString.search(/[[{]/); // Find the start of a JSON object/array
      if (startIndex === -1) {
        break; // No more potential JSON objects/arrays
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
        break; // No valid closing bracket found
      }

      const jsonCandidate = remainingString.slice(startIndex, endIndex);
      try {
        const parsed = JSON.parse(jsonCandidate);
        results.push(parsed);
        remainingString = remainingString.slice(endIndex); // Move past the parsed JSON
      } catch {
        // If parsing fails, move past the current start index and continue
        remainingString = remainingString.slice(startIndex + 1);
      }

      // Yield control back to the event loop to make it truly async
      await Promise.resolve();
    }

    return results;
  }

  /**
   * Extracts JSON objects and arrays from the raw string.
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
}

const jsonExtractor = new JsonExtractor();

/**
 * Extracts JSON objects and arrays from the raw string.
 * When providing a limit, the extraction will only try to extract
 * up to the specified number of objects/arrays.
 */
export const extractJson = jsonExtractor.extract.bind(jsonExtractor);
