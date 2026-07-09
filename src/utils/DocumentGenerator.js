export class DocumentGenerator {
  constructor(transcript, title, author, subject, options) {
    this.transcript = transcript;
    this.title = title || 'Untitled Document';
    this.author = author || 'Unknown';
    this.subject = subject || '';
    this.options = options;
    this.sections = [];
    this.glossary = new Map();
    this.formulas = [];
  }

  parse() {
    const lines = this.transcript.split('\n');
    let currentSection = null;
    let currentContent = [];

    for (const line of lines) {
      if (!line.trim()) continue;

      if (line.match(/^\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]/)) {
        if (currentSection) {
          currentSection.content = currentContent.join('\n').trim();
          this.sections.push(currentSection);
        }

        const match = line.match(/^\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]\s*(.+)/);
        if (match) {
          const [, hours, minutes, seconds, heading] = match;
          currentSection = {
            heading: this.cleanText(heading),
            timestamp: `${hours}:${minutes}${seconds ? ':' + seconds : ''}`,
            content: ''
          };
          currentContent = [];
        }
      } else if (currentSection) {
        currentContent.push(this.cleanText(line));
      }
    }

    if (currentSection) {
      currentSection.content = currentContent.join('\n').trim();
      this.sections.push(currentSection);
    }

    if (this.sections.length === 0) {
      this.sections.push({
        heading: 'Main Content',
        timestamp: '0:00',
        content: this.cleanText(this.transcript)
      });
    }

    this.extractGlossary();
    this.extractFormulas();
  }

  cleanText(text) {
    const fillers = [
      /\bum\b/gi,
      /\buh\b/gi,
      /\byou know\b/gi,
      /\blike\b/gi,
      /\bkinda\b/gi,
      /\bsorta\b/gi,
      /\bliterally\b/gi,
      /\bamazing\b/gi
    ];

    let cleaned = text;
    fillers.forEach(filler => {
      cleaned = cleaned.replace(filler, '');
    });

    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  extractGlossary() {
    const allText = this.sections.map(s => s.content).join(' ');
    const capsPattern = /\b[A-Z]{2,}\b/g;
    const matches = allText.match(capsPattern);

    if (matches) {
      const uniqueTerms = [...new Set(matches)].slice(0, 10);
      uniqueTerms.forEach(term => {
        if (term.length > 2) {
          this.glossary.set(term, `Technical term related to the subject matter.`);
        }
      });
    }
  }

  extractFormulas() {
    // eslint-disable-next-line no-useless-escape
    const formulaPattern = /([A-Za-z]\s*=\s*[A-Za-z0-9+\-*/()²³⁴\s]+)/g;
    const allText = this.sections.map(s => s.content).join(' ');
    const matches = allText.match(formulaPattern);

    if (matches) {
      this.formulas = [...new Set(matches)].slice(0, 5);
    }
  }

  generateHTML() {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${this.escapeHTML(this.title)}</title>
    <style>
        body {
            font-family: Georgia, 'Times New Roman', serif;
            line-height: 1.8;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.5in;
            color: #333;
        }

        h1 {
            font-size: 2em;
            margin-bottom: 0.5em;
            border-bottom: 2px solid #333;
            padding-bottom: 0.5em;
        }

        .timestamp {
            font-size: 0.9em;
            color: #999;
            font-family: 'Courier New', monospace;
            margin: 0.5em 0;
            font-style: italic;
        }

        p {
            margin: 0 0 1em 0;
            text-align: justify;
        }

        .glossary {
            page-break-before: always;
            margin-top: 2em;
        }

        .glossary h2 {
            margin-top: 0;
        }

        .glossary-entry {
            margin-bottom: 1.5em;
            page-break-inside: avoid;
        }

        .glossary-entry strong {
            color: #333;
        }

        .glossary-entry .definition {
            margin-top: 0.25em;
            color: #666;
            font-size: 0.95em;
        }

        .formulas {
            page-break-before: always;
            margin-top: 2em;
        }

        .formulas h2 {
            margin-top: 0;
        }

        .formula {
            background-color: #f9f9f9;
            padding: 1em;
            margin: 1em 0;
            border-left: 4px solid #333;
            font-family: 'Courier New', monospace;
            font-size: 1.05em;
            page-break-inside: avoid;
        }

        code {
            background-color: #f0f0f0;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
        }

        @media print {
            body {
                padding: 0;
            }
        }
    </style>
</head>
<body>`;

    html += `<h1>Transcript</h1>`;

    const allContent = this.sections.map(s => s.content).join('\n\n');
    html += `<p>${this.formatContent(allContent)}</p>`;

    if (this.options.includeGlossary && this.glossary.size > 0) {
      html += `
    <div class="glossary">
        <h2>Glossary of Important Terms</h2>`;
      for (const [term, definition] of this.glossary) {
        html += `
        <div class="glossary-entry">
            <strong>${this.escapeHTML(term)}</strong>
            <div class="definition">${this.escapeHTML(definition)}</div>
        </div>`;
      }
      html += `
    </div>`;
    }

    if (this.options.includeFormulas && this.formulas.length > 0) {
      html += `
    <div class="formulas">
        <h2>List of Formulas and Equations</h2>`;
      this.formulas.forEach((formula) => {
        html += `
        <div class="formula">${this.escapeHTML(formula)}</div>`;
      });
      html += `
    </div>`;
    }

    html += `
</body>
</html>`;

    return html;
  }

  generatePreview() {
    const allContent = this.sections.map(s => s.content).join('\n\n');
    const previewHTML = `
<div class="document-preview">
    <h1>Transcript</h1>
    <p>${this.formatContent(allContent)}</p>

    ${this.options.includeGlossary && this.glossary.size > 0 ? `
    <div class="preview-section" style="margin-top: 2em; padding-top: 1em; border-top: 1px solid #ddd;">
        <h2>Glossary</h2>
        <p><em>${this.glossary.size} terms defined</em></p>
    </div>
    ` : ''}

    ${this.options.includeFormulas && this.formulas.length > 0 ? `
    <div class="preview-section" style="margin-top: 2em; padding-top: 1em; border-top: 1px solid #ddd;">
        <h2>Formulas</h2>
        <p><em>${this.formulas.length} formulas included</em></p>
    </div>
    ` : ''}
</div>`;

    return previewHTML;
  }

  formatContent(content) {
    return content
      .replace(/\n+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
