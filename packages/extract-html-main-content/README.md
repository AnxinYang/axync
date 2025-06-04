# @axync/extract-html-main-content
![Test](https://github.com/AnxinYang/axync/actions/workflows/test.yml/badge.svg)


A powerful TypeScript library that intelligently extracts the main content from HTML documents and converts it to clean, readable Markdown format. Perfect for web scraping, content processing, LLM preprocessing, and text extraction from HTML pages.

## Features

- 🚀 **Smart Content Detection** - Automatically identifies the largest content block as main content
- 🧹 **Intelligent Cleaning** - Removes scripts, styles, comments, and hidden elements
- 📝 **Markdown Conversion** - Converts HTML to properly formatted Markdown
- 🔗 **Configurable Links** - Choose whether to include or exclude href attributes
- ⚙️ **Flexible Options** - Customize extraction behavior
- 🎯 **Minimal Dependencies** - Only requires Cheerio for HTML parsing
- 📦 **Full TypeScript Support** - Complete type definitions included
- 🚫 **Zero Runtime Errors** - Graceful handling of malformed HTML

## Installation

```bash
npm install @axync/extract-html-main-content
```

## Quick Start

### Using the Class (Recommended)

```typescript
import { HtmlMainContentExtractor } from '@axync/extract-html-main-content';

const extractor = new HtmlMainContentExtractor();

const html = `
<html>
  <body>
    <nav>Navigation menu</nav>
    <main>
      <h1>Main Article</h1>
      <p>This is the <strong>main content</strong> of the page.</p>
      <ul>
        <li>First point</li>
        <li>Second point</li>
      </ul>
      <a href="https://example.com">Learn more</a>
    </main>
    <aside>Sidebar content</aside>
  </body>
</html>`;

const result = extractor.extract(html);
console.log(result);
// Output:
// # Main Article
//
// This is the **main content** of the page.
//
// - First point
// - Second point
//
// [Learn more](https://example.com)
```

### Using the Function (Simple Cases)

```typescript
import { extractHtmlMainContent } from '@axync/extract-html-main-content';

const result = extractHtmlMainContent('<html><body><h1>Title</h1><p>Content</p></body></html>');
// Returns: "# Title\n\nContent\n"
```

## Configuration Options

```typescript
interface ExtractorOptions {
  tryRemoveHiddenElement?: boolean;  // Default: true
  includeLinkHref?: boolean;         // Default: true
}
```

### Examples with Options

```typescript
// Keep hidden elements, exclude link URLs
const result = extractor.extract(html, {
  tryRemoveHiddenElement: false,
  includeLinkHref: false
});

// Only remove hidden elements (default behavior)
const result = extractor.extract(html);
```

## API Reference

### `HtmlMainContentExtractor`

Main class for HTML content extraction.

#### `extract(html: string, options?: ExtractorOptions): string`

Extracts and converts HTML to Markdown.

**Parameters:**
- `html` - Raw HTML string to process
- `options` - Optional configuration object

**Returns:** Cleaned Markdown content

### `extractHtmlMainContent(html: string, options?: ExtractorOptions): string`

Convenience function using a singleton extractor instance.

### `ExtractorOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tryRemoveHiddenElement` | `boolean` | `true` | Remove hidden elements (display:none, visibility:hidden, .hidden classes, [hidden] attribute) |
| `includeLinkHref` | `boolean` | `true` | Include href in link conversion: `[text](url)` vs `text` only |

## Supported HTML Elements

| HTML | Markdown Output |
|------|-----------------|
| `<h1>` to `<h6>` | `# Heading` to `###### Heading` |
| `<p>` | Text with line breaks |
| `<strong>`, `<b>` | `**bold**` |
| `<em>`, `<i>` | `*italic*` |
| `<code>` | `` `code` `` |
| `<blockquote>` | `> quote` |
| `<li>` | `- list item` |
| `<a href="url">text</a>` | `[text](url)` or `text` |

## How It Works

1. **Parse HTML** - Load HTML with Cheerio
2. **Clean Up** - Remove scripts, styles, meta tags, comments
3. **Remove Hidden** - Optionally remove hidden elements  
4. **Find Main Content** - Identify the largest text content block
5. **Convert to Markdown** - Transform HTML elements to Markdown format

### Automatically Removed Elements

- `<script>`, `<style>`, `<noscript>`
- `<link rel="stylesheet">`, `<meta>`, `<title>`, `<head>`
- HTML comments
- Hidden elements (when enabled):
  - Inline styles: `display:none`, `visibility:hidden`
  - Classes: `.hidden`, `.hide`, `.invisible`, `.sr-only`, `.screen-reader-only`
  - Attributes: `[hidden]`

## Use Cases

- **Web Scraping** - Extract clean content from web pages
- **Content Processing** - Prepare HTML content for further processing
- **LLM Preprocessing** - Convert HTML to Markdown for AI model input
- **Documentation** - Extract readable content from HTML documents
- **Data Mining** - Clean and structure web content for analysis

## Real-World Examples

### Blog Article Extraction
```typescript
const blogHtml = `
<html>
  <head><title>My Blog</title></head>
  <body>
    <header>Blog Header</header>
    <nav>Navigation</nav>
    <article>
      <h1>How to Use This Library</h1>
      <p>This library makes it easy to extract content...</p>
      <h2>Installation</h2>
      <p>Simply run: <code>npm install</code></p>
    </article>
    <aside>Related Articles</aside>
    <footer>Copyright 2025</footer>
  </body>
</html>`;

const content = extractHtmlMainContent(blogHtml);
// Returns the article content only, ignoring navigation and footer
```

### News Article with Hidden Elements
```typescript
const newsHtml = `
<div>
  <div class="advertisement" style="display:none">Ad content</div>
  <h1>Breaking News</h1>
  <p>Important news content here...</p>
  <div hidden>Hidden tracking pixel</div>
</div>`;

const cleanContent = extractHtmlMainContent(newsHtml);
// Returns: "# Breaking News\n\nImportant news content here..."
```

## Error Handling

The library gracefully handles edge cases:

```typescript
// Empty input
extractHtmlMainContent('') // Returns: ''

// Invalid HTML
extractHtmlMainContent('<html><body><p>Unclosed paragraph') 
// Returns: 'Unclosed paragraph'

// No body tag
extractHtmlMainContent('<div>Content</div>') 
// Returns: ''

// Only whitespace
extractHtmlMainContent('<html><body>   </body></html>') 
// Returns: ''
```

## TypeScript Support

Full TypeScript definitions with IntelliSense:

```typescript
import { 
  HtmlMainContentExtractor, 
  ExtractorOptions, 
  extractHtmlMainContent 
} from '@axync/extract-html-main-content';

const extractor: HtmlMainContentExtractor = new HtmlMainContentExtractor();
const options: ExtractorOptions = {
  tryRemoveHiddenElement: true,
  includeLinkHref: false
};

const result: string = extractor.extract(html, options);
```

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License - see LICENSE file for details.