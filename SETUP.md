# Installation and Setup Guide 🛠️

Comprehensive guide to installing and running the Transcript to PDF Converter.

## System Requirements

- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher
- **Browser**: Modern browser with ES6 support (Chrome, Firefox, Safari, Edge)
- **RAM**: Minimum 2GB
- **Disk Space**: ~500MB for node_modules

## Quick Start (Recommended)

```bash
# 1. Navigate to project
cd d:\Transcript

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

App opens at `http://localhost:3000` ✅

---

## Step-by-Step Installation

### Step 1: Verify Node.js Installation

Check if Node.js is installed:

```bash
node --version
npm --version
```

Expected output (v14 or higher):
```
v18.12.0
8.19.2
```

### If Node.js is Not Installed

**Windows:**
1. Visit https://nodejs.org/
2. Download "LTS" version
3. Run installer
4. Accept defaults
5. Click "Install"
6. Restart your computer
7. Open new Command Prompt and verify

**macOS:**
```bash
# Using Homebrew
brew install node

# Verify
node --version
npm --version
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install nodejs npm

# Verify
node --version
npm --version
```

### Step 2: Navigate to Project Directory

Open Command Prompt/PowerShell:

```bash
cd d:\Transcript
```

Or if in different location:
```bash
cd "C:\Users\YourName\path\to\Transcript"
```

### Step 3: Create Environment File (Optional)

Copy example environment file:

**Windows:**
```bash
copy .env.example .env
```

**macOS/Linux:**
```bash
cp .env.example .env
```

Edit `.env` with your settings (optional for basic use).

### Step 4: Install Dependencies

```bash
npm install
```

This installs all packages from `package.json`:
- React 18.2
- React DOM 18.2
- React Scripts
- html2pdf
- Supporting libraries

Wait for installation to complete (2-5 minutes depending on connection).

### Step 5: Start Development Server

```bash
npm start
```

The app automatically:
- Compiles React code
- Opens browser to `http://localhost:3000`
- Enables hot reloading (changes auto-refresh)

---

## Using Different Ports

If port 3000 is in use, specify a different port:

**Windows (Command Prompt):**
```bash
set PORT=3001 && npm start
```

**Windows (PowerShell):**
```bash
$env:PORT=3001; npm start
```

**macOS/Linux:**
```bash
PORT=3001 npm start
```

Access at `http://localhost:3001`

---

## Development Commands

### Start Development Server
```bash
npm start
```
- Runs on http://localhost:3000
- Hot reloading enabled
- Shows errors in terminal and browser
- Open browser DevTools (F12) for debugging

### Build for Production
```bash
npm run build
```
- Creates optimized `build/` folder
- Minified and compressed
- Ready to deploy
- Takes 1-3 minutes

### Run Tests
```bash
npm test
```
- Launches test runner
- Watch mode enabled
- Press `q` to quit

---

## Docker Installation

### Prerequisites
- Docker Desktop installed (https://www.docker.com/products/docker-desktop)
- Running on Windows, macOS, or Linux

### Build and Run with Docker

```bash
# Navigate to project
cd d:\Transcript

# Build and run
docker-compose up -d

# App available at http://localhost:3000
```

### Docker Commands

**View logs:**
```bash
docker-compose logs -f transcript-converter
```

**Stop service:**
```bash
docker-compose down
```

**Rebuild image:**
```bash
docker-compose build --no-cache
```

**Run shell in container:**
```bash
docker-compose exec transcript-converter sh
```

---

## Yarn Installation (Alternative to npm)

If you prefer Yarn:

```bash
# Install Yarn globally
npm install -g yarn

# Install dependencies
yarn install

# Start development server
yarn start

# Build for production
yarn build
```

---

## IDE Setup

### Visual Studio Code

1. Install VS Code from https://code.visualstudio.com/
2. Install extensions:
   - ES7+ React/Redux/React-Native snippets
   - Prettier - Code formatter
   - ESLint
   - Thunder Client (API testing)

3. Create `.vscode/settings.json` in project root:
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.fontSize": 14,
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### WebStorm / IntelliJ IDEA

1. Open project in WebStorm
2. Built-in React support enabled by default
3. Go to Settings > Languages & Frameworks > JavaScript
4. Ensure language level is ES2020+
5. Ready to code!

---

## Troubleshooting

### "npm: command not found" (Windows, macOS, Linux)

**Cause:** Node.js/npm not installed or not in system PATH

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart terminal/command prompt
3. Verify: `npm --version`

### "Port 3000 already in use" (Windows, macOS, Linux)

**Cause:** Another application using port 3000

**Windows (Find and kill process):**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Or use different port:
```bash
set PORT=3001 && npm start
```

**macOS/Linux:**
```bash
lsof -i :3000
kill -9 <PID>
```

Or use different port:
```bash
PORT=3001 npm start
```

### "npm ERR! code EACCES" (macOS, Linux)

**Cause:** Permission issues with npm global modules

**Solution:**
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH

# Restart and try again
npm install
npm start
```

### "ModuleNotFoundError" or "Cannot find module"

**Cause:** Dependencies not installed or corrupted

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Windows: use `rmdir /s node_modules` and delete package-lock.json

# Reinstall
npm install

# Start
npm start
```

### "npm ERR! network getaddrinfo" (Internet Connection)

**Cause:** NPM can't reach registry (network issues)

**Solution:**
```bash
# Check internet connection
ping google.com

# If connection is fine, try npm registry mirror:
npm config set registry https://registry.npmjs.org/

# Clear cache and try again
npm cache clean --force
npm install
```

### "Blank page on localhost:3000"

**Cause:** React failed to load or compile error

**Solution:**
1. Check browser console: Press F12, click Console tab
2. Look for red error messages
3. Fix errors in code (shown in terminal)
4. Clear browser cache: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (macOS)
5. Refresh page

### "build failed" during npm install

**Cause:** Node version incompatibility or missing build tools

**Solution:**
```bash
# Use Node 18 LTS (recommended)
node --version  # Check your version

# If not LTS, update from https://nodejs.org/

# Try with increased memory
NODE_OPTIONS=--max_old_space_size=4096 npm install

# Clear and reinstall
npm cache clean --force
npm install
```

---

## Verification

After installation, verify everything works:

1. **Check server is running**
   - Terminal shows: "Compiled successfully!"
   - No red error messages

2. **Access the app**
   - Browser shows: "Transcript Converter"
   - Input field visible on left
   - Preview area visible on right

3. **Test functionality**
   - Paste sample transcript (see QUICKSTART.md)
   - Click "Generate PDF"
   - See preview appear
   - Click "Copy HTML"
   - Verify no errors in console (F12)

---

## Production Build

### Create Optimized Build

```bash
npm run build
```

Generates `build/` folder with:
- Minified JavaScript (~100KB gzipped)
- Optimized CSS (~15KB gzipped)
- Assets properly bundled

### Serve Production Build Locally

```bash
# Install serve globally
npm install -g serve

# Serve the build
serve -s build -l 3000
```

Accesses at http://localhost:3000

### Deploy to Production

**Vercel (Recommended - Easiest):**
```bash
npm install -g vercel
vercel
```

**Netlify:**
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `build`
4. Deploy

**Traditional Server:**
1. Run `npm run build`
2. Upload `build/` folder to server
3. Configure web server to serve from `build/`
4. Restart server

---

## Environment Configuration

### .env File

Create `.env` file in project root (copy from `.env.example`):

```env
# Backend API
REACT_APP_API_URL=http://localhost:3001

# YouTube API (future)
REACT_APP_YOUTUBE_API_KEY=your_key_here

# Features
REACT_APP_ENABLE_PDF_DOWNLOAD=true
REACT_APP_ENABLE_YOUTUBE_FETCH=false

# Limits
REACT_APP_MAX_TRANSCRIPT_SIZE=10485760
```

**Note:** Only variables prefixed with `REACT_APP_` are available in React code

### Using Environment Variables in Code

```javascript
const apiUrl = process.env.REACT_APP_API_URL;
const maxSize = process.env.REACT_APP_MAX_TRANSCRIPT_SIZE;
```

---

## Performance Optimization

### Development Performance

- Close unnecessary browser tabs
- Use development mode (default with `npm start`)
- Check browser extensions aren't slowing things down

### Production Performance

- Run `npm run build`
- Analyze bundle size:
```bash
npm install -g source-map-explorer
source-map-explorer 'build/static/js/*.js'
```

### Memory Issues During Build

If build fails with memory error:

```bash
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

---

## Git Setup (Optional)

Initialize git repository:

```bash
git init
git add .
git commit -m "Initial commit"

# Add remote (if using GitHub)
git remote add origin https://github.com/your-username/transcript-to-pdf.git
git push -u origin main
```

---

## Next Steps

After successful installation:

1. ✅ **Run the app**: `npm start`
2. 📖 **Read documentation**: Open README.md
3. 🎨 **Customize**: Edit `src/App.css`
4. 🧪 **Test features**: Use QUICKSTART.md examples
5. 🚀 **Deploy**: Follow production build steps

---

## Getting Help

If you encounter issues:

1. Check this SETUP.md file
2. Review error messages in terminal
3. Check browser console (F12 → Console)
4. Search GitHub issues
5. Ask in relevant forums/communities

---

**Installation Complete!** 🎉

You're ready to use Transcript to PDF Converter. Start with:
```bash
npm start
```
