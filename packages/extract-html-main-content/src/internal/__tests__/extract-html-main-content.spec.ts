import { describe, it, expect, beforeEach } from "vitest";
import { HtmlMainContentExtractor } from "../extract-html-main-content.js";

describe("HtmlMainContentExtractor", () => {
  let extractor: HtmlMainContentExtractor;

  beforeEach(() => {
    extractor = new HtmlMainContentExtractor();
  });

  describe("basic functionality", () => {
    it("should return empty string for empty input", () => {
      expect(extractor.extract("")).toBe("");
    });

    it("should return empty string for null/undefined input", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(extractor.extract(null as any)).toBe("");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(extractor.extract(undefined as any)).toBe("");
    });

    it("should extract simple text content", () => {
      const html = "<html><body><p>Hello World</p></body></html>";
      const result = extractor.extract(html);
      expect(result).toBe("Hello World");
    });
  });

  describe("content removal", () => {
    it("should remove scripts, styles, and meta elements", () => {
      const html = `
        <html>
          <head>
            <title>Test Page</title>
            <meta charset="utf-8">
            <style>body { color: red; }</style>
            <link rel="stylesheet" href="style.css">
          </head>
          <body>
            <script>console.log('test');</script>
            <noscript>No JavaScript</noscript>
            <p>Main content</p>
          </body>
        </html>
      `;
      const result = extractor.extract(html);
      expect(result).toBe("Main content");
    });

    it("should remove hidden elements when tryRemoveHiddenElement is true", () => {
      const html = `
        <html>
          <body>
            <div style="display:none">Hidden div</div>
            <div style="display: none">Hidden div 2</div>
            <div style="visibility:hidden">Invisible div</div>
            <div style="visibility: hidden">Invisible div 2</div>
            <div class="hidden">Hidden by class</div>
            <div class="hide">Hidden by class 2</div>
            <div hidden>Hidden attribute</div>
            <p>Visible content</p>
          </body>
        </html>
      `;
      const result = extractor.extract(html, { tryRemoveHiddenElement: true });
      expect(result).toBe("Visible content");
    });

    it("should keep hidden elements when tryRemoveHiddenElement is false", () => {
      const html = `
        <html>
          <body>
            <div>
              <div style="display:none">Hidden content</div>
              <p>Visible content</p>
            </div>
          </body>
        </html>
      `;
      const result = extractor.extract(html, { tryRemoveHiddenElement: false });
      expect(result).toContain("Hidden content");
      expect(result).toContain("Visible content");
    });

    it("should remove HTML comments", () => {
      const html = `
        <html>
          <body>
            <!-- This is a comment -->
            <p>Main content</p>
            <!-- Another comment -->
          </body>
        </html>
      `;
      const result = extractor.extract(html);
      expect(result).toBe("Main content");
      expect(result).not.toContain("comment");
    });
  });

  describe("content selection", () => {
    it("should select the largest content node", () => {
      const html = `
        <html>
          <body>
            <div>Short text</div>
            <div>This is a much longer text content that should be selected as the main content</div>
            <div>Medium text here</div>
          </body>
        </html>
      `;
      const result = extractor.extract(html);
      expect(result).toContain("much longer text content");
    });

    it("should handle body with no child nodes", () => {
      const html = `
        <html>
          <body>Direct body text content</body>
        </html>
      `;
      const result = extractor.extract(html);
      expect(result).toBe("Direct body text content");
    });

    it("should handle HTML without body tag", () => {
      const html = "<html><div>No body tag</div></html>";
      const result = extractor.extract(html);
      expect(result).toBe("No body tag");
    });
  });

  describe("markdown conversion", () => {
    it("should convert headings to markdown", () => {
      const html = `
        <html>
          <body>
            <div>
              <h1>Main Title</h1>
              <h2>Subtitle</h2>
              <h3>Section</h3>
              <h4>Subsection</h4>
              <h5>Minor heading</h5>
              <h6>Smallest heading</h6>
            </div>
          </body>
        </html>
      `;
      const result = extractor.extract(html);
      expect(result).toContain("# Main Title");
      expect(result).toContain("## Subtitle");
      expect(result).toContain("### Section");
      expect(result).toContain("#### Subsection");
      expect(result).toContain("##### Minor heading");
      expect(result).toContain("###### Smallest heading");
    });

    it("should convert paragraphs correctly", () => {
      const html = `
        <html>
          <body>
            <div>
              <p>First paragraph</p>
              <p>Second paragraph</p>
            </div>
          </body>
        </html>
      `;
      const result = extractor.extract(html);
      expect(result).toContain("First paragraph");
      expect(result).toContain("Second paragraph");
    });

    it("should convert text formatting", () => {
      const html = `
        <html>
          <body>
            <div>
              <strong>Bold text</strong>
              <b>Bold text 2</b>
              <em>Italic text</em>
              <i>Italic text 2</i>
              <code>Code text</code>
            </div>
          </body>
        </html>
      `;
      const result = extractor.extract(html);
      expect(result).toContain("**Bold text**");
      expect(result).toContain("**Bold text 2**");
      expect(result).toContain("*Italic text*");
      expect(result).toContain("*Italic text 2*");
      expect(result).toContain("`Code text`");
    });

    it("should convert blockquotes", () => {
      const html = `
        <html>
          <body>
            <div>
              <blockquote>This is a quote</blockquote>
            </div>
          </body>
        </html>
      `;
      const result = extractor.extract(html);
      expect(result).toContain("> This is a quote");
    });

    it("should convert list items", () => {
      const html = `
        <html>
          <body>
            <div>
              <ul>
                <li>First item</li>
                <li>Second item</li>
              </ul>
            </div>
          </body>
        </html>
      `;
      const result = extractor.extract(html);
      expect(result).toContain("- First item");
      expect(result).toContain("- Second item");
    });
  });

  describe("link handling", () => {
    it("should include link href when includeLinkHref is true", () => {
      const html = `
        <html>
          <body>
            <div>
              <a href="https://example.com">Visit Example</a>
            </div>
          </body>
        </html>
      `;
      const result = extractor.extract(html, { includeLinkHref: true });
      expect(result).toContain("[Visit Example](https://example.com)");
    });

    it("should exclude link href when includeLinkHref is false", () => {
      const html = `
        <html>
          <body>
            <div>
              <a href="https://example.com">Visit Example</a>
            </div>
          </body>
        </html>
      `;
      const result = extractor.extract(html, { includeLinkHref: false });
      expect(result).toBe("Visit Example");
      expect(result).not.toContain("https://example.com");
    });

    it("should handle links without href attribute", () => {
      const html = `
        <html>
          <body>
            <div>
              <a>Link without href</a>
            </div>
          </body>
        </html>
      `;
      const result = extractor.extract(html, { includeLinkHref: true });
      expect(result).toBe("Link without href");
    });
  });

  describe("complex HTML structures", () => {
    it("should handle nested elements correctly", () => {
      const html = `
        <html>
          <body>
            <article>
              <header>
                <h1>Article Title</h1>
              </header>
              <section>
                <p>This is the main content with <strong>bold text</strong> and <em>italic text</em>.</p>
                <ul>
                  <li>List item 1</li>
                  <li>List item 2</li>
                </ul>
                <blockquote>A meaningful quote</blockquote>
              </section>
            </article>
          </body>
        </html>
      `;
      const result = extractor.extract(html);
      expect(result).toContain("# Article Title");
      expect(result).toContain("**bold text**");
      expect(result).toContain("*italic text*");
      expect(result).toContain("- List item 1");
      expect(result).toContain("- List item 2");
      expect(result).toContain("> A meaningful quote");
    });

    it("should handle multiple content sections and select the largest", () => {
      const html = `
        <html>
          <body>
            <nav>
              <a href="/home">Home</a>
              <a href="/about">About</a>
            </nav>
            <main>
              <h1>Main Article</h1>
              <p>This is a very long article with lots of content that should be selected as the main content because it contains much more text than the navigation or sidebar.</p>
              <p>Another paragraph with more detailed information about the topic.</p>
            </main>
            <aside>
              <h3>Related Links</h3>
              <a href="/related">Related</a>
            </aside>
          </body>
        </html>
      `;
      const result = extractor.extract(html);
      expect(result).toContain("# Main Article");
      expect(result).toContain("very long article");
      expect(result).not.toContain("Home");
      expect(result).not.toContain("Related Links");
    });
  });

  describe("edge cases", () => {
    it("should handle malformed HTML", () => {
      const html = `
        <html>
        <body>
        <p>Unclosed paragraph
        <div>Nested without closing p
        <span>Some text</span>
        </div>
        </body>
        </html>
      `;
      const result = extractor.extract(html);
      expect(result).toContain("Some text");
    });

    it("should handle empty elements", () => {
      const html = `
        <html>
          <body>
            <div></div>
            <p></p>
            <span>   </span>
            <div>Actual content</div>
          </body>
        </html>
      `;
      const result = extractor.extract(html);
      expect(result.trim()).toBe("Actual content");
    });

    it("should handle elements with only whitespace", () => {
      const html = `
        <html>
          <body>
            <div>
              <p>   </p>
              <div>Real content here</div>
            </div>
          </body>
        </html>
      `;
      const result = extractor.extract(html);
      expect(result.trim()).toBe("Real content here");
    });
  });

  describe("default options", () => {
    it("should use default options when none provided", () => {
      const html = `
        <html>
          <body>
            <div style="display:none">Hidden</div>
            <div>
              <a href="https://example.com">Link</a>
            </div>
          </body>
        </html>
      `;
      const result = extractor.extract(html);
      expect(result).toBe("[Link](https://example.com)");
      expect(result).not.toContain("Hidden");
    });
  });
});
