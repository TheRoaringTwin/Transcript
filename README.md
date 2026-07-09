# Transcript to PDF Converter - React App

A modern React web application that converts YouTube video transcripts into professionally formatted PDF documents.

## Features

### Input Options
- **Paste Transcript Directly**: Copy-paste video transcripts with timestamps
- **YouTube URL Support**: Enter YouTube URLs for future backend integration
- **Timestamp Parsing**: Automatically extracts sections based on `[HH:MM]` or `[H:MM:SS]` formatted timestamps

### Smart Processing
- Removes common filler words (um, uh, you know, like, etc.)
- Capitalizes proper sentences automatically
- Extracts technical terms for glossary
- Detects mathematical formulas
- Cleans up duplicate spaces and improper formatting

### Document Generation
- **Professional Title Page**: Document metadata with author, subject, and date
- **Table of Contents**: Auto-generated from section headings and timestamps
- **Structured Sections**: Hierarchical headings with timestamps preserved
- **Glossary**: Automatically extracted important terms (optional)
- **Formula List**: Mathematical expressions and equations (optional)
- **Print-Ready Typography**: Professional serif fonts and spacing for PDF output

### Export Options
- **Download PDF**: Ready-to-print professional documents (requires html2pdf integration)
- **Copy HTML**: Export HTML content to clipboard for further editing
- **Reset**: Clear all inputs and start over

### Design Features
- **Dark/Light Mode**: Toggle theme with automatic system preference detection
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Professional UI**: Clean, modern interface with proper typography and spacing
- **Accessibility**: Keyboard navigation and focus states

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Installation

```bash
# Navigate to project folder
cd d:\Transcript

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open automatically at `http://localhost:3000`

## Usage

### Basic Workflow

1. **Input Your Content**:
   - Click the "Transcript" tab
   - Paste your video transcript
   - Include timestamps like `[0:00]` to mark section breaks

2. **Configure Document Settings**:
   - Enter a document title
   - Add author name (optional)
   - Add subject/topic (optional)
   - Choose which sections to include (TOC, Glossary, Formulas)

3. **Generate Document**:
   - Click "Generate PDF"
   - Wait for processing to complete
   - Preview appears in the right panel

4. **Download or Export**:
   - Click "Download PDF" to save as file
   - Click "Copy HTML" to export HTML content
   - Click "Reset" to start over

### Timestamp Format Examples

```
[0:00] Introduction
Here's the introduction content...

[2:30] Section One
Content for section one...

[5:15] Section Two
Content for section two...

[10:45:30] Detailed Example
Content with detailed timestamp...
```

## Project Structure

```
d:\Transcript/
├── src/
│   ├── components/
│   │   ├── Header.jsx              # App header with theme toggle
│   │   ├── InputSection.jsx        # Input form and settings
│   │   ├── PreviewSection.jsx      # Document preview and output
│   │   └── StatusMessage.jsx       # Status alerts
│   ├── utils/
│   │   └── DocumentGenerator.js    # Document generation logic
│   ├── App.jsx                     # Main app component
│   ├── App.css                     # App styles
│   ├── index.jsx                   # React entry point
│   └── index.css                   # Global styles
├── public/
│   └── index.html                  # HTML template
├── package.json                    # Dependencies and scripts
├── Dockerfile                      # Docker configuration
├── docker-compose.yml              # Docker Compose setup
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore patterns
└── README.md                       # This file
```

## Component Overview

### App.jsx
Main application component managing:
- Global state (transcript, settings, document)
- Form input handling
- Document generation flow
- Status messages and progress

### Header.jsx
- Application title and branding
- Theme toggle button
- Theme persistence to localStorage

### InputSection.jsx
- Transcript input textarea
- YouTube URL input
- Document settings form
- Include sections checkboxes
- Generate button with loading state

### PreviewSection.jsx
- Document preview container
- Progress bar during generation
- Empty state when no document exists
- Output control buttons
- Status messages

### StatusMessage.jsx
- Reusable status alert component
- Support for success, error, info, warning types
- Emoji icons for visual feedback

### DocumentGenerator.js
Utility class handling:
- Transcript parsing and section extraction
- Timestamp extraction and formatting
- Filler word removal
- Glossary term extraction
- Formula detection
- HTML generation with print-ready CSS
- Preview HTML generation

## Styling and Design System

### Color Palette
- **Navy**: `#0F172A` (text, headings)
- **Indigo**: `#6366F1` (accent, interactive elements)
- **Off-white**: `#F8FAFC` (backgrounds)
- **Slate**: `#64748B` (secondary text)
- **Slate Light**: `#E2E8F0` (borders, dividers)
- **Emerald**: `#10B981` (success states)

### Typography
- **Display/Body**: System fonts (-apple-system, BlinkMacSystemFont, Segoe UI, etc.)
- **Monospace**: SF Mono, Monaco, Courier New for code and technical content
- **Type Scale**: Professional hierarchy with proper sizing and weights

### Spacing System
- xs: 0.5rem
- sm: 1rem
- md: 1.5rem
- lg: 2rem
- xl: 3rem

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Generated PDF Structure

The output PDF includes:

1. **Title Page**
   - Document title
   - Author/Creator name
   - Subject
   - Generation date

2. **Table of Contents** (if enabled)
   - Section numbers and titles
   - Timestamps

3. **Main Content**
   - Numbered sections with timestamps
   - Formatted paragraphs
   - Proper heading hierarchy

4. **Glossary** (if enabled)
   - Technical terms extracted from content
   - Definitions

5. **Formulas List** (if enabled)
   - Mathematical expressions detected in content

## Advanced Features

### Dark Mode
- Automatically detects system preference
- Manual toggle via theme button
- Saves preference to localStorage
- All components support both themes

### Content Processing
- Filler words removed during parsing
- Sentence capitalization normalized
- Multiple spaces collapsed to single space
- Timestamp parsing from various formats

### Accessibility
- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus visible states on all interactive elements
- High contrast color combinations

## Docker Support

### Build and Run with Docker Compose
```bash
docker-compose up -d
```

The app will be available at `http://localhost:3000`

### View Logs
```bash
docker-compose logs -f transcript-converter
```

### Stop the Service
```bash
docker-compose down
```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

## Environment Variables

Optional environment variables (create a `.env` file):

```
REACT_APP_API_KEY=your_api_key
REACT_APP_MAX_FILE_SIZE=10485760
```

## Dependencies

- **React 18.2**: UI framework
- **React DOM 18.2**: DOM rendering
- **React Scripts**: Build tooling
- **html2pdf.js**: PDF generation (optional, for download feature)

## Available Scripts

### Development
```bash
npm start
```
Runs the app in development mode with hot reloading.

### Build
```bash
npm run build
```
Builds the app for production to the `build` folder.

### Test
```bash
npm test
```
Launches the test runner in interactive watch mode.

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

Minimum requirements:
- ES2020 support
- CSS Grid and Flexbox
- localStorage API
- Clipboard API
- CSS Custom Properties

## Troubleshooting

### npm: command not found
- Node.js/npm not installed or not in PATH
- Solution: Install Node.js from https://nodejs.org/

### Port 3000 already in use
```bash
PORT=3001 npm start
```

### Dependencies won't install
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Blank page on localhost
1. Check browser console for errors (F12)
2. Clear cache: `Ctrl+Shift+R` or `Cmd+Shift+R`
3. Verify Node server is running

## Future Enhancements

- YouTube API integration for automatic transcript fetching
- PDF download without external library
- Additional export formats (DOCX, EPUB)
- Text highlighting and annotations
- Custom CSS templates
- Multi-language support
- Cloud storage integration
- Collaborative editing

## Performance Tips

- For large transcripts (>100KB), processing may take longer
- Disable optional sections (Glossary, Formulas) for faster generation
- Use a modern browser for best performance
- Close other tabs to free up system resources

## Getting Help

For issues, questions, or suggestions:
1. Check the console for error messages (F12 → Console)
2. Review component code comments
3. Test with different transcript formats
4. Search for similar issues

## License

MIT License - Feel free to use for personal and commercial projects.

---

**Built with ❤️ using React and modern web technologies**
