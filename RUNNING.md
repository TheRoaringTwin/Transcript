# How to Run the Full Stack Application 🚀

Complete guide to running the Transcript to PDF Converter with YouTube transcript fetching.

## Quick Start (Easiest Way)

### Windows Users

Simply run these two batch files:

**Step 1: Start Backend**
- Double-click `START_BACKEND.bat`
- Wait for message: "✅ Server running on http://localhost:3001"
- Keep this window open

**Step 2: Start Frontend**
- Double-click `START_FRONTEND.bat`
- Browser automatically opens at http://localhost:3000
- You're ready to go!

---

## Manual Start (Command Line)

If batch files don't work, use command prompt:

### Step 1: Open First Command Prompt/PowerShell

```bash
cd d:\Transcript\server
npm install
npm start
```

**Wait for:**
```
✅ Server running on http://localhost:3001
📝 API: http://localhost:3001/api/transcript
```

Keep this window open.

### Step 2: Open Second Command Prompt/PowerShell

```bash
cd d:\Transcript
npm install
npm start
```

**Wait for:**
```
Compiled successfully!
You can now view transcript-to-pdf in the browser.
```

Browser opens automatically at `http://localhost:3000`

---

## Using the App

### Fetching from YouTube (New Feature!)

1. **Click "YouTube" tab** in the left panel
2. **Paste YouTube URL:**
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```
   Or just the video ID:
   ```
   dQw4w9WgXcQ
   ```
3. **Fill in document details** (optional but recommended)
   - Document Title
   - Author
   - Subject
4. **Check options:** TOC, Glossary, Formulas
5. **Click "📄 Generate PDF"**
6. **Watch the progress bar** as it:
   - Connects to backend
   - Fetches transcript from YouTube
   - Processes and formats content
   - Generates document
7. **Preview appears** on the right side
8. **Download PDF** using "📥 Download PDF" button

### Pasting Transcript (Original Method)

1. **Click "Transcript" tab**
2. **Paste your transcript** with timestamps:
   ```
   [0:00] Section Title
   Your content here...

   [2:30] Another Section
   More content...
   ```
3. **Fill in document details**
4. **Click "📄 Generate PDF"**
5. **Download or export**

---

## Testing

### Test with Sample YouTube Videos

These videos have transcripts available:

- TED Talks: https://www.youtube.com/watch?v=_sI_Ps7JSoE
- Educational: https://www.youtube.com/watch?v=Ks-_Mh1QhMc
- Technology: https://www.youtube.com/watch?v=dQw4w9WgXcQ

Just paste any of these URLs into the YouTube tab and click "Generate PDF"!

---

## Troubleshooting

### Issue: Backend won't start

**Error:** `npm: command not found` or similar

**Solution:**
1. Install Node.js from https://nodejs.org/
2. Restart command prompt
3. Try again

---

### Issue: "Cannot connect to server"

**Error:** "Failed to fetch transcript" or connection error

**Solution:**
1. Check backend is running (first window should say "Server running on http://localhost:3001")
2. Check `.env` file exists with correct API URL
3. Refresh browser (F5)

---

### Issue: YouTube URL not working

**Error:** "Invalid YouTube URL" or "Video unavailable"

**Solution:**
1. Check URL is correct (from address bar)
2. Make sure video is public (not private/unlisted)
3. Check if video has transcripts enabled
4. Try a different video
5. Check backend console for detailed error

---

### Issue: PDF download not working

**Error:** "Error downloading PDF" or blank PDF

**Solution:**
1. Wait for "Document generated successfully!"
2. Check preview on right side shows content
3. Try "Copy HTML" instead, open in browser, then print to PDF (Ctrl+P)
4. Refresh page and try again

---

### Issue: Preview is empty

**Error:** Preview shows "No document yet"

**Solution:**
1. Make sure you clicked "Generate PDF" button
2. Check console (F12) for errors
3. If using YouTube, backend must be running
4. Check transcript/URL is not empty

---

### Issue: App opens but nothing happens

**Error:** Blank page or console errors

**Solution:**
1. Open browser console (F12)
2. Look for red error messages
3. Check both servers are running
4. Clear browser cache (Ctrl+Shift+Delete)
5. Close and reopen browser

---

## Port Issues

### If port 3001 is in use (backend)

```bash
cd d:\Transcript\server
PORT=3002 npm start
```

Then create/update `.env`:
```
REACT_APP_API_URL=http://localhost:3002
```

### If port 3000 is in use (frontend)

```bash
cd d:\Transcript
PORT=3001 npm start
```

---

## Stopping the Servers

**To stop backend:** 
- Press `Ctrl+C` in backend terminal

**To stop frontend:**
- Press `Ctrl+C` in frontend terminal

Both windows will close.

---

## Restarting

If something goes wrong:

1. **Stop both servers** (Ctrl+C in each window)
2. **Close all windows**
3. **Start fresh:**
   - Run `START_BACKEND.bat`
   - Wait for "Server running..."
   - Run `START_FRONTEND.bat`

---

## Advanced Usage

### Using Different API Port

**In `server/server.js` or via environment:**
```bash
PORT=8080 npm start
```

**Update React `.env`:**
```
REACT_APP_API_URL=http://localhost:8080
```

### Development Mode (Auto-restart on changes)

**Backend with auto-restart:**
```bash
cd d:\Transcript\server
npm install -g nodemon
npm run dev
```

**Frontend auto-refreshes** already (default with `npm start`)

### Building for Production

```bash
# Build React app
cd d:\Transcript
npm run build

# Backend automatically serves build when running
cd server
npm start

# Access at http://localhost:3001
```

---

## Performance Tips

### Make it Faster

1. **Disable optional sections:** Uncheck "Glossary" and "Formulas" for faster processing
2. **Use shorter transcripts:** First 10-15 minutes processes faster
3. **Use modern browser:** Chrome/Firefox/Edge are faster than IE
4. **Close other apps:** Free up RAM and CPU

### Keep it Stable

1. **Don't close windows:** Keep both servers running
2. **Monitor resources:** Watch Task Manager
3. **Clear cache:** If app gets slow, clear browser cache (Ctrl+Shift+Delete)
4. **Restart if stuck:** Stop and restart both servers

---

## Features Now Available

✅ **YouTube Transcript Fetching** - Automatically extract from videos
✅ **Professional PDF Generation** - Download ready-to-print PDFs
✅ **HTML Export** - Copy and edit in Word, Google Docs, etc.
✅ **Dark Mode** - Easy on the eyes
✅ **Responsive Design** - Works on any screen size
✅ **Auto Formatting** - Removes filler words, proper capitalization
✅ **Multiple Export Options** - PDF, HTML, or print
✅ **Glossary & Formulas** - Optional sections for technical content

---

## What's Running Where

```
http://localhost:3000 (React Frontend)
  ↓ sends request to
http://localhost:3001 (Express Backend)
  ↓ connects to
YouTube API
  ↓ returns
Transcript
  ↓ sent back to
Frontend
  ↓ processed by
DocumentGenerator.js
  ↓ displayed as
PDF Preview & Download
```

---

## Common Questions

**Q: Do I need two windows open?**
A: Yes, backend and frontend run separately. Both must stay open.

**Q: Can I close the backend window?**
A: No, frontend needs it to fetch YouTube transcripts.

**Q: Does it work without internet?**
A: For pasting transcripts yes, for YouTube URLs no (needs YouTube access).

**Q: Can I host this online?**
A: Yes! Follow FULLSTACK_SETUP.md → "Deploy to Production" section.

**Q: How often does it update?**
A: It automatically fetches latest transcripts each time.

**Q: Is my data saved?**
A: Only in your browser session. Close browser = data is gone.

---

## Still Having Issues?

1. **Check console:** Press F12 in browser, look for red errors
2. **Check backend logs:** Look at backend command window for errors
3. **Restart everything:** Stop both servers, close windows, start fresh
4. **Check Node.js:** Run `node --version` (should be v14+)
5. **Check ports:** Make sure 3000 and 3001 aren't used by other apps

---

## Next Steps

✅ **Now running:** Full-stack Transcript to PDF Converter
🎯 **Try:** Paste a YouTube URL and generate a PDF
🚀 **Deploy:** Follow FULLSTACK_SETUP.md for production

---

**Everything is ready to use!** 🎉

Start with `START_BACKEND.bat` then `START_FRONTEND.bat` and you're good to go!
