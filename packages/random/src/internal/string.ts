export interface RandomStringGeneratorConfig {
  /**
   * The charset to use for generating random strings.
   **/
  charset?: string;
  /**
   * The suffix to append to generated strings.
   **/
  suffix?: string;
  /**
   * The prefix to prepend to generated strings.
   **/
  prefix?: string;
}

const defaultCharset =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

export class RandomStringGenerator {
  private charset: string;
  private suffix: string;
  private prefix: string;

  constructor(input: RandomStringGeneratorConfig = {}) {
    this.charset = input.charset || defaultCharset;
    this.suffix = input.suffix || "";
    this.prefix = input.prefix || "";
  }

  /**
   * Generates a random string of the specified length.
   *
   * @param length - The length of the string to generate.
   *
   * @returns The generated string.
   **/
  public generate(length: number): string {
    let result = "";
    const charactersLength = this.charset.length;
    for (let i = 0; i < length; i++) {
      result += this.charset.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    return this.prefix + result + this.suffix;
  }
}

const randomStringGenerator = new RandomStringGenerator();

/**
 * Generates a random string of the specified length.
 * It is the {@link RandomStringGenerator.generate} method from the {@link RandomStringGenerator} with default config.
 */
export const getRandomString = randomStringGenerator.generate.bind(randomStringGenerator);
