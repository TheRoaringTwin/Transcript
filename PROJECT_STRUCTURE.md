# Project Structure Overview 📁

Detailed guide to the project structure and architecture.

## Complete Directory Layout

```
d:\Transcript/
├── public/                         # Static files
│   └── index.html                  # HTML entry point
├── src/                            # Source code (React components)
│   ├── components/                 # Reusable React components
│   │   ├── Header.jsx              # App header & theme toggle
│   │   ├── InputSection.jsx        # Input form & document settings
│   │   ├── PreviewSection.jsx      # Preview & output controls
│   │   └── StatusMessage.jsx       # Status alert component
│   ├── utils/                      # Utility functions & classes
│   │   └── DocumentGenerator.js    # Document generation logic
│   ├── App.jsx                     # Main app component
│   ├── App.css                     # App styles & design tokens
│   ├── index.jsx                   # React entry point
│   └── index.css                   # Global base styles
├── .env.example                    # Example environment variables
├── .gitignore                      # Git ignore patterns
├── docker-compose.yml              # Docker Compose configuration
├── Dockerfile                      # Docker build instructions
├── package.json                    # Dependencies & npm scripts
├── README.md                       # Project documentation
├── QUICKSTART.md                   # Quick start guide
├── SETUP.md                        # Installation guide
└── PROJECT_STRUCTURE.md            # This file
```

---

## Directory Descriptions

### `public/`
Static assets served to browser. Contains only:
- `index.html` - HTML template where React mounts

### `src/`
All React source code. Organized by:
- `components/` - Reusable React components
- `utils/` - Utility classes and helper functions
- Application entry point and global styles

### `src/components/`
Reusable React components following single responsibility principle:

**Header.jsx**
- Displays app branding
- Theme toggle button
- Theme state management with localStorage

**InputSection.jsx**
- Tab interface (Transcript vs YouTube)
- Form inputs for document metadata
- Transcript textarea with character counter
- Checkboxes for optional sections
- Generate button with loading state

**PreviewSection.jsx**
- Document preview container
- Progress bar during generation
- Empty state messaging
- Output control buttons (Download, Copy, Reset)
- Status message display

**StatusMessage.jsx**
- Reusable status alert component
- Supports: success, error, info, warning
- Emoji icons for visual feedback

### `src/utils/`
Utility functions and classes:

**DocumentGenerator.js**
- ES6 class for document generation
- Methods for parsing, cleaning, extracting
- HTML generation with print-ready CSS
- Preview HTML generation

### Configuration Files

**package.json**
- Project metadata
- Dependencies list
- npm scripts (start, build, test)
- Build configuration

**.env.example**
- Template for environment variables
- Copy to `.env` to configure

**.gitignore**
- Patterns for Git to ignore
- node_modules, build, .env, etc.

**Dockerfile**
- Multi-stage Docker build
- Production-optimized image

**docker-compose.yml**
- Docker Compose configuration
- Service definition and networking

---

## Component Hierarchy

```
App (Root - State Management)
│
├── Header
│   └── ThemeToggle Button
│
├── InputSection (Left Panel)
│   ├── Tabs (Transcript / YouTube)
│   │
│   ├── Tab 1: Transcript Input
│   │   └── Textarea with character counter
│   │
│   ├── Tab 2: YouTube Input
│   │   └── URL input field
│   │
│   ├── Document Settings
│   │   ├── Title Input
│   │   ├── Author Input
│   │   ├── Subject Input
│   │   └── Checkboxes (TOC, Glossary, Formulas)
│   │
│   ├── Generate Button
│   │
│   └── StatusMessage
│
└── PreviewSection (Right Panel)
    ├── Preview Container
    │   └── Document Preview (HTML)
    │
    ├── Progress Bar (During Generation)
    │
    ├── StatusMessage
    │
    └── Output Controls (After Generation)
        ├── Download PDF Button
        ├── Copy HTML Button
        └── Reset Button
```

---

## Data Flow

### User Input → Processing → Display

```
User Input
  │
  ├─ Transcript Text / YouTube URL
  ├─ Document Metadata (Title, Author, Subject)
  └─ Options (TOC, Glossary, Formulas)
  │
  ↓
App.jsx (State Management)
  │
  ├─ handleTranscriptChange()
  ├─ handleYoutubeChange()
  ├─ generateDocument()
  └─ Other handlers
  │
  ↓
DocumentGenerator.js (Processing)
  │
  ├─ parse() - Extract sections by timestamp
  ├─ cleanText() - Remove filler words
  ├─ extractGlossary() - Find important terms
  ├─ extractFormulas() - Detect equations
  ├─ generateHTML() - Create PDF-ready HTML
  └─ generatePreview() - Create preview HTML
  │
  ↓
State Update
  │
  ├─ previewHTML - For preview display
  ├─ documentHTML - For download/copy
  └─ statusMessage - User feedback
  │
  ↓
Re-render Components
  │
  ├─ InputSection - Shows status
  └─ PreviewSection - Shows preview & controls
```

### Component Communication

```
App.jsx (Parent)
│
├─ Holds all state
│
├─ Props down to children:
│   ├─ data props (transcript, settings)
│   ├─ handler props (onChange, onClick)
│   └─ UI props (isGenerating, progress)
│
├─ Receives callbacks from children:
│   ├─ onTranscriptChange()
│   ├─ onGenerate()
│   ├─ onDownloadPDF()
│   ├─ onCopyHTML()
│   └─ onReset()
│
└─ Updates state and re-renders
```

---

## CSS Architecture

### Design Tokens (CSS Variables)

**Color Tokens:**
```css
--color-navy: #0F172A        /* Primary text */
--color-indigo: #6366F1      /* Accent */
--color-indigo-light: #818CF8 /* Hover */
--color-off-white: #F8FAFC   /* Background */
--color-slate: #64748B       /* Secondary text */
--color-slate-light: #E2E8F0 /* Borders */
--color-emerald: #10B981     /* Success */
--color-white: #FFFFFF       /* Cards */
--color-border: #CBD5E1      /* Borders */
```

**Spacing Scale (8px-based):**
```css
--spacing-xs: 0.5rem (4px)
--spacing-sm: 1rem (8px)
--spacing-md: 1.5rem (12px)
--spacing-lg: 2rem (16px)
--spacing-xl: 3rem (24px)
```

**Typography:**
```css
--font-sans: System fonts
--font-mono: Monospace fonts
```

**Shadows & Radius:**
```css
--shadow-sm: Light shadow
--shadow-md: Medium shadow
--radius-sm: 0.375rem
--radius-md: 0.5rem
--radius-lg: 0.75rem
```

### Theme System

**Dark Mode Implementation:**
- `@media (prefers-color-scheme: dark)` - System preference
- `:root[data-theme="dark"]` - Manual override
- `:root[data-theme="light"]` - Manual override

**How It Works:**
1. Check localStorage for saved theme
2. If not found, detect system preference
3. Apply theme by setting `data-theme` attribute
4. CSS variables update colors automatically
5. All components reflect theme instantly

### Responsive Design

**Breakpoints:**
- Mobile: < 768px (default, mobile-first)
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Key Changes:**
- Mobile: Single column, stacked buttons
- Tablet: Starting to split layout
- Desktop: Two-column layout with preview

---

## File Naming Conventions

### Components
- **Format**: PascalCase with `.jsx` extension
- **Example**: `Header.jsx`, `InputSection.jsx`
- **Rule**: One component per file

### CSS Classes
- **Format**: kebab-case
- **Prefix**: Based on component or purpose
- **Modifiers**: `.btn-primary`, `.btn:hover`
- **Semantic naming**: `.form-group`, `.preview-container`

### JavaScript Functions
- **Format**: camelCase
- **Handlers**: `handleClick`, `handleChange`
- **Getters**: `getDocumentTitle`, `getFormattedDate`

### JavaScript Variables
- **Format**: camelCase
- **Constants**: `UPPER_CASE`
- **State variables**: `isLoading`, `hasDocument`
- **Private**: `_internalFunction`

### Folder Structure
- **Components folder**: `/components/`
- **Utils folder**: `/utils/`
- **Clear, descriptive names**: No abbreviations

---

## Key Design Decisions

### 1. No External State Management
- App component holds all state with `useState`
- Props passed down to children
- Callbacks bubble up changes
- Sufficient for app complexity
- Easy to add Redux/Zustand later if needed

### 2. DocumentGenerator as Standalone Class
- Pure JavaScript, no React dependencies
- Can be tested independently
- Encapsulates all document logic
- Reusable in other projects
- Easy to optimize or replace

### 3. CSS Variables for Theming
- No styled-components or CSS-in-JS
- Pure CSS for simplicity
- Works with plain `.css` files
- Better performance for large apps
- Easy to customize

### 4. Component Composition
- One responsibility per component
- Props drilling acceptable at this scale
- Clear data flow (down) and events (up)
- Easy to test and reason about
- Modular and reusable

### 5. localStorage for Theme
- Remembers user preference
- No backend needed
- Works offline
- Respects system preference on first visit
- User can override

---

## Performance Considerations

### Already Optimized
- React.StrictMode for development checks
- Component splitting prevents re-renders
- CSS variables allow fast theme switching
- Event delegation for common actions

### Potential Future Optimizations
- `useMemo` for expensive calculations
- `useCallback` for stable function references
- `React.memo` for prevented component re-renders
- Code splitting with `React.lazy`
- Web Workers for DocumentGenerator

### Build Optimization
- Minification and tree-shaking by React Scripts
- CSS minification
- JS bundle splitting
- Gzip compression
- Production: ~115KB gzipped

---

## Browser Support

### Supported
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari, Chrome Mobile

### Requirements
- ES2020 JavaScript support
- CSS Grid and Flexbox
- localStorage API
- Clipboard API (for copy HTML)
- CSS Custom Properties

### Not Supported
- IE 11 and older
- Very old mobile browsers
- Browsers without ES2020 support

---

## Development Workflow

### Making Changes

1. Edit files in `src/`
2. Save (auto-reload with `npm start`)
3. Check browser for changes
4. Open DevTools (F12) if needed
5. Check console for errors

### Adding a Component

1. Create file: `src/components/MyComponent.jsx`
2. Write component with React hooks
3. Import in needed parent
4. Add to component hierarchy
5. Pass props as needed
6. Style in `App.css`

### Adding Utilities

1. Create file: `src/utils/myUtility.js`
2. Export functions/classes
3. Import in App.jsx or components
4. Use and test

### Styling Components

1. Open `App.css`
2. Add styles for component
3. Use CSS variables for colors
4. Follow spacing scale
5. Ensure responsive (mobile-first)
6. Test dark mode

---

## File Size Reference

### Development Bundle
- React + ReactDOM: ~300KB
- App code: ~100KB
- Dependencies: ~50KB
- Total before compression: ~450KB

### Production Build
- Main JavaScript (gzipped): ~100KB
- CSS (gzipped): ~15KB
- Other assets: ~5KB
- Total (gzipped): ~120KB

---

## Extension Points

### Easy to Add

1. **Features**
   - New components in `src/components/`
   - Update App.jsx for state/handlers
   - Add styles in `App.css`

2. **Utils**
   - New files in `src/utils/`
   - Import and use in components
   - Test independently

3. **Styles**
   - CSS variables for theming
   - Responsive media queries
   - Animation keyframes

### May Require Refactoring

1. **State Management** (if growing complex)
   - Add Redux or Zustand
   - Create actions and reducers
   - Update component props

2. **Routing** (if multi-page)
   - Add React Router
   - Create pages directory
   - Update component hierarchy

3. **Testing** (for quality assurance)
   - Add Jest and React Testing Library
   - Write unit tests
   - Setup CI/CD

---

## Related Documentation

- **README.md** - Feature overview
- **QUICKSTART.md** - 5-minute setup
- **SETUP.md** - Detailed installation
- This file - Architecture details

---

**This structure is designed to be scalable, maintainable, and easy to extend.** 🚀
