# Quick Start Guide ⚡

Get the Transcript to PDF Converter running in 5 minutes!

## Installation (2 minutes)

### 1. Open Command Prompt/PowerShell
- Press `Win + R`
- Type `cmd` or `powershell`
- Press Enter

### 2. Navigate to Transcript Folder
```bash
cd d:\Transcript
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the App
```bash
npm start
```

✅ App opens automatically at `http://localhost:3000`

---

## Using the App (3 minutes)

### Step 1: Paste Your Transcript
- Click the **"Transcript"** tab (should already be selected)
- Paste your video transcript into the text area
- Include timestamps like this:

```
[0:00] Welcome
Welcome to this tutorial on web development.

[2:30] What is React
React is a JavaScript library for building user interfaces.

[5:00] Components
Components are the building blocks of React applications.
```

### Step 2: Add Document Details
- **Document Title**: "Introduction to Web Development"
- **Author**: Your name (optional)
- **Subject**: "Web Development" (optional)
- Check the boxes for sections you want: TOC, Glossary, Formulas

### Step 3: Generate
- Click the blue **"📄 Generate PDF"** button
- Watch the progress bar
- Preview appears on the right side

### Step 4: Export
- **Download PDF**: Save as PDF file
- **Copy HTML**: Copy to clipboard for editing in Word, etc.
- **Reset**: Start over with new content

---

## Sample Transcript (Test This!)

Copy and paste this into the app to see it in action:

```
[0:00] Introduction
Hello everyone and welcome to this course on Python programming. 
Today we're going to learn the fundamentals of Python and how to write your first program.

[1:45] What is Python
Python is a high-level programming language known for its simplicity and readability. 
It's used in web development, data science, artificial intelligence, and automation.

[4:30] Installing Python
Before we can start coding, we need to install Python on our computer. 
You can download it from python.org. Make sure to check the box to add Python to your PATH.

[7:15] Your First Program
Let's write our first Python program. The classic starter program is hello world. 
We simply print the text "Hello, World!" to the console using the print function.

[9:00] Variables and Data Types
Variables are containers for storing data values. Python has several built-in data types 
including integers, floats, strings, and booleans. You can create a variable by assigning a value to a name.

[11:30] Basic Operations
We can perform mathematical operations on numbers. Addition, subtraction, multiplication, 
and division are the most common operations. Python follows standard mathematical order of operations.
```

---

## Common Issues & Fixes

### "npm is not recognized"
- Node.js isn't installed
- Solution: Download from https://nodejs.org/
- Install it, then restart your computer
- Try again: `npm start`

### "Port 3000 already in use"
- Another app is using port 3000
- Solution: Use a different port
- Run: `PORT=3001 npm start`

### App Won't Start
- Try clearing cache:
```bash
npm cache clean --force
```
- Delete node_modules:
```bash
rmdir /s node_modules
```
- Reinstall:
```bash
npm install
npm start
```

### Preview Not Showing
- Check if timestamps are correct: `[H:MM]` or `[HH:MM:SS]`
- Make sure there's a space after the bracket: `[0:00] Title`
- Try clicking "Generate PDF" again

---

## Tips & Tricks

### Timestamps
✅ Correct format:
- `[0:00] Section Title`
- `[1:30] Another Section`
- `[12:45:30] Long section`

❌ Incorrect format:
- `[0:00]Section Title` (no space)
- `0:00 Section Title` (missing brackets)
- `[0:0] Section Title` (wrong format)

### Content
- The app automatically removes "um", "uh", "you know"
- Proper capitalization is automatic
- Use ALL_CAPS for important terms (will go in glossary)
- Include formulas like: `E = mc²`

### Document Quality
- ✅ Always include TOC for long documents
- ✅ Enable Glossary if content has technical terms
- ✅ Enable Formulas if content has equations
- ✅ Use clear, descriptive section titles

---

## Keyboard Shortcuts

| Action | Key |
|--------|-----|
| Focus transcript field | `Tab` multiple times |
| Generate | `Ctrl + Return` (in some browsers) |
| Copy selected text | `Ctrl + C` |
| Toggle dark mode | Click moon icon 🌙 |

---

## What Happens After Generation

### In Preview (Right Side)
- Title page appears
- All sections with timestamps
- Glossary count (if enabled)
- Formula count (if enabled)

### Download Options Appear
- **📥 Download PDF**: Save document as .pdf file
- **📋 Copy HTML**: Copy formatted HTML to clipboard
- **🔄 Reset**: Clear everything and start fresh

---

## Export Your Document

### As PDF
- Click "📥 Download PDF"
- File saves to your Downloads folder
- Open with any PDF reader

### As Word Document
- Click "📋 Copy HTML"
- Open Microsoft Word
- Paste (Ctrl + V)
- Save as .docx
- Edit and format as needed

### As Markdown
- Click "📋 Copy HTML"
- Use online converter: https://pandoc.org/try/
- Paste HTML and select Markdown output
- Copy result

---

## Next Steps

1. ✅ **Test it out** - Use the sample transcript above
2. 📖 **Read README.md** - Full feature documentation
3. 🎨 **Customize** - Edit `src/App.css` for colors/fonts
4. 🚀 **Deploy** - Use Docker or cloud platform

---

## Getting More Help

| Topic | File |
|-------|------|
| Full Features | README.md |
| Installation | See below |
| Project Structure | PROJECT_STRUCTURE.md |
| Deployment | Use Docker |

---

## Installation Troubleshooting

### Node.js Not Installed?

**Windows:**
1. Go to https://nodejs.org/
2. Click "LTS" (Long Term Support)
3. Run the installer
4. Click through defaults
5. Restart your computer
6. Try `npm start` again

**macOS:**
```bash
brew install node
npm start
```

**Linux:**
```bash
sudo apt-get install nodejs npm
npm start
```

---

## Production Deployment

### Using Docker

```bash
# Build and run
docker-compose up -d

# Access at http://localhost:3000
```

### Build for Production

```bash
npm run build
```

Creates optimized files in `build/` folder.

---

## Tips for Best Results

### Good Transcripts
- Include meaningful timestamps at section breaks
- Use clear, descriptive section titles
- Write in complete sentences
- Capitalize proper nouns

### Large Documents
- Split into multiple sections (one per topic)
- Use timestamps every 2-3 minutes
- Disable Glossary if it becomes cluttered
- Check preview quality before download

### After Export
- Review the PDF/HTML document
- Add images or diagrams if needed
- Check formatting in your target application
- Customize styles if using Word/Google Docs

---

**That's it! Enjoy converting transcripts!** 🎉

Need more details? See README.md or SETUP.md
