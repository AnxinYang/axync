import * as cheerio from "cheerio";

export class HtmlMainContentExtractor {
  extract(rawHtmlString: string): string {
    if (!rawHtmlString) {
      return "";
    }    // Load the HTML into Cheerio
    const $ = cheerio.load(rawHtmlString);

    // Remove scripts, styles, and other non-visible elements
    $("script, style, noscript, link[rel='stylesheet'], meta, title, head").remove();
    
    // // Remove elements with display: none or visibility: hidden
    // $("[style*='display:none'], [style*='display: none']").remove();
    // $("[style*='visibility:hidden'], [style*='visibility: hidden']").remove();
    
    // // Remove common hidden elements by class/id patterns
    // $(".hidden, .hide, .invisible, .sr-only, .screen-reader-only").remove();
    // $("[hidden]").remove();
    
    // Remove comment nodes
    $("*").contents().filter(function() {
      return this.nodeType === 8; // Comment nodes
    }).remove();

    // Find the body element
    const body = $("body");
    if (body.length === 0) {
      return "";
    }

    // Get all child nodes of the body
    const childNodes = body.children();

    if (childNodes.length === 0) {
      // If there are no child nodes, return the body text
      const mainContent = body.text().trim();
      return mainContent;
    }
    // Find the largest text node among the child nodes
    // This will help us identify the main content of the page
    let largestNode = childNodes.first();
    let largestNodeSize = largestNode.text().trim().length;

    childNodes.each((_, element) => {
      const childNode = $(element);

      const innerText = childNode.text() || "";

      if (innerText.length > largestNodeSize) {
        largestNode = childNode;
        largestNodeSize = innerText.length;
      }
    });
    let result = ""; // Extract all descendant nodes under largestNode
    let blankNodeCount = 0;
    largestNode.find("*").each((_, element) => {
      const node = $(element);
      const tagName = node.prop("tagName")?.toLowerCase() || "div";
      const directTextContent = node
        .contents()
        .filter(function () {
          return this.nodeType === 3; // Text node
        })
        .text()
        .trim();      if (directTextContent) {
        blankNodeCount = 0; // Reset blank node count
        // Convert to Markdown format based on tag type
        const markdownContent = this.convertToMarkdown(
          tagName,
          directTextContent,
          node
        );
        result += markdownContent + " ";
      } else if (blankNodeCount < 2) {
        result += "\n";
        blankNodeCount++;
      }
    });    // If no descendant nodes found, use the largestNode itself
    if (result.trim() === "") {
      const tagName = largestNode.prop("tagName")?.toLowerCase() || "div";
      const textContent = largestNode.text().trim();
      if (textContent) {
        const markdownContent = this.convertToMarkdown(tagName, textContent, largestNode);
        result += markdownContent + "\n";
      }
    }

    return result.trim();
  }
  private convertToMarkdown(tagName: string, textContent: string, node?: { attr: (name: string) => string | undefined }): string {
    switch (tagName) {
      case "h1":
        return `\n# ${textContent}\n`;
      case "h2":
        return `\n## ${textContent}\n`;
      case "h3":
        return `\n### ${textContent}\n`;
      case "h4":
        return `\n#### ${textContent}\n`;
      case "h5":
        return `\n##### ${textContent}\n`;
      case "h6":
        return `\n###### ${textContent}\n`;
      case "p":
        return textContent;
      case "strong":
      case "b":
        return `**${textContent}**`;
      case "em":
      case "i":
        return `*${textContent}*`;
      case "code":
        return `\`${textContent}\``;
      case "blockquote":
        return `> ${textContent}`;
      case "li":
        return `\n- ${textContent}\n`;
      case "a":
        if (node) {
          const href = node.attr('href');
          if (href) {
            return `[${textContent}](${href})`;
          }
        }
        return textContent;
      default:
        return textContent;
    }
  }
}
