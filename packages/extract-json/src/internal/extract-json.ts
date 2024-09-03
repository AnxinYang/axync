export class JsonExtractor {
  /**
   * Tries to parse the raw string as JSON.
   */
  private tryDirectParse(rawString: string): any {
    try {
      return JSON.parse(rawString);
    } catch (error) {
      return;
    }
  }

  /**
   * Finds all the start indexes of JSON objects in the raw string.
   */
  private findAllStartIndexes(rawString: string): number[] {
    const startIndexes: number[] = [];

    for (let i = 0; i < rawString.length; i++) {
      if (rawString[i] === "{" || rawString[i] === "[") {
        startIndexes.push(i);
      }
    }

    return startIndexes;
  }

  /**
   * Tries to parse the raw string as JSON.
   */
  private async tryParse(rawString: string, startIndex: number): Promise<any> {
    let bracketCount = 1;
    let endIndex = startIndex + 1;

    while (endIndex <= rawString.length) {
      if (rawString[endIndex] === "{" || rawString[endIndex] === "[") {
        bracketCount++;
      } else if (rawString[endIndex] === "}" || rawString[endIndex] === "]") {
        bracketCount--;
      }

      if (bracketCount === 0) {
        const trimmedString = rawString
          .substring(startIndex, endIndex + 1)
          .trim();
        return this.tryDirectParse(trimmedString);
      }
      endIndex++;
    }

    return;
  }

  /**
   * Extracts JSON objects and arrays from the raw string.
   * When providing a limit, the extraction will only try to extract
   * up to the specified number of objects/arrays.
   */
  async extract(rawString: string, limit = Infinity): Promise<any[]> {
    if (!rawString) {
      return [];
    }

    const startIndexes = this.findAllStartIndexes(rawString);
    const results: any[] = [];

    for (const startIndex of startIndexes) {
      const result = await this.tryParse(rawString, startIndex);
      if (result !== undefined) {
        results.push(result);
      }
      if (results.length >= limit) {
        break;
      }
    }

    return results;
  }
}


const jsonExtractor = new JsonExtractor();

/**
 * Extracts JSON objects and arrays from the raw string.
 * When providing a limit, the extraction will only try to extract
 * up to the specified number of objects/arrays.
 */
export const extractJson = jsonExtractor.extract.bind(jsonExtractor);
