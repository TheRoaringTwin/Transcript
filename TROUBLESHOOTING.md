# Complete Troubleshooting Guide 🔧

Solutions for all common errors and issues.

---

## Error: "getTranscript is not a function"

**Cause:** Backend dependencies not installed correctly.

**Solution:**

```bash
cd d:\Transcript\server

# Clear everything
rmdir /s node_modules
del package-lock.json

# Reinstall fresh
npm install

# Start server
npm start
```

**Expected output:**
```
✅ Server running on http://localhost:3001
📝 API: http://localhost:3001/api/transcript
```

---

## Error: "Cannot connect to backend server"

**Cause:** Backend not running or wrong URL.

**Checklist:**
1. ✅ Is backend terminal open and showing "✅ Server running"?
2. ✅ Is `.env` file created in `d:\Transcript`?
3. ✅ Does `.env` contain: `REACT_APP_API_URL=http://localhost:3001`?
4. ✅ Did you restart React after creating `.env`?

**Fix:**

```bash
# Terminal 1: Backend
cd d:\Transcript\server
npm start

# Terminal 2: Frontend (NEW TERMINAL)
cd d:\Transcript

# Create .env file
echo REACT_APP_API_URL=http://localhost:3001 > .env

# Start React
npm start
```

---

## Error: "Failed to fetch transcript"

**Causes & Solutions:**

### 1. Invalid YouTube URL
- ✅ Check URL format: `https://www.youtube.com/watch?v=VIDEO_ID`
- ✅ Or just video ID: `dQw4w9WgXcQ`
- ✅ Make sure it's copied correctly (no extra spaces)

### 2. Video doesn't have transcripts
- ✅ Try a different video
- ✅ Check if video has captions enabled
- ✅ Some videos don't have transcripts available

**Workaround:**
- Manually get transcript from YouTube
- Copy from "Show transcript" under the video
- Paste in "Transcript" tab instead

### 3. YouTube blocks requests
- ✅ This happens sometimes due to rate limiting
- ✅ Wait 5 minutes and try again
- ✅ Try a different video

### 4. Backend error
- ✅ Check backend console for error messages
- ✅ Restart backend: Ctrl+C then `npm start`

---

## Error: "EADDRINUSE: address already in use :::3001"

**Cause:** Port 3001 already in use by another program.

**Solution 1: Use different port**

```bash
cd d:\Transcript\server
PORT=3002 npm start
```

Then update `.env`:
```
REACT_APP_API_URL=http://localhost:3002
```

Restart frontend (Ctrl+C, then `npm start`)

**Solution 2: Find and stop other process**

```bash
# Find what's using port 3001
netstat -ano | findstr :3001

# Stop the process (replace PID with actual number)
taskkill /PID 12345 /F

# Now start backend
npm start
```

---

## Error: "npm: command not found"

**Cause:** Node.js not installed or not in PATH.

**Solution:**

1. Download Node.js: https://nodejs.org/
2. Install (accept all defaults)
3. **Restart your computer**
4. Open new command prompt
5. Try again: `npm --version`

Should show version like `8.19.2`

---

## Error: "npm ERR! code EACCES"

**Cause:** Permission issues with npm.

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
cd d:\Transcript\server
npm install

cd d:\Transcript
npm install
```

---

## Error: "Module not found: youtube-transcript"

**Cause:** Dependency not installed.

**Solution:**

```bash
cd d:\Transcript\server
npm install youtube-transcript
npm start
```

If that fails, use simplified backend (already included):

```bash
npm start
# Backend will work with fallback method
```

---

## Error: "Preview is empty / No content showing"

**Checklist:**

1. ✅ Did you click "Generate PDF" button?
2. ✅ Did you paste a transcript or YouTube URL?
3. ✅ Is there an error message visible?
4. ✅ Check browser console (F12) for red errors

**Solutions:**

```bash
# Option 1: Restart everything
# Stop both servers (Ctrl+C)
# Delete node_modules in frontend AND backend
# Reinstall: npm install
# Restart both servers

# Option 2: Clear browser cache
# Press Ctrl+Shift+Delete in browser
# Select all time, clear all data
# Refresh page: F5
```

---

## Error: "PDF download not working / Blank PDF"

**Checklist:**

1. ✅ Preview shows content on right side?
2. ✅ Message shows "Document generated successfully!"?
3. ✅ You clicked "Download PDF" button?

**Solutions:**

**Method 1: Use Copy HTML instead**
1. Click "📋 Copy HTML"
2. Open Notepad
3. Paste
4. Save as `document.html`
5. Open in browser
6. Press Ctrl+P to print
7. Choose "Save as PDF"

**Method 2: Refresh and try again**
```bash
# Frontend
Ctrl+C  # Stop React
npm start  # Restart

# In browser
F5  # Refresh page
```

---

## Error: "CORS error" in browser console

**Cause:** Frontend can't reach backend.

**Solution:**

1. Check backend is running: `http://localhost:3001/api/health` in browser
   - Should show: `{"status":"Server is running"}`
2. Check `.env` has correct URL
3. Restart both servers
4. Clear browser cache (Ctrl+Shift+Delete)

---

## Everything is broken - Start Fresh

**Nuclear option - clean everything:**

### Backend:
```bash
cd d:\Transcript\server
Ctrl+C  # Stop if running
rmdir /s node_modules
del package-lock.json
npm install
npm start
```

### Frontend:
```bash
cd d:\Transcript
Ctrl+C  # Stop if running
rmdir /s node_modules
del package-lock.json
del .env
npm install

# Create .env
echo REACT_APP_API_URL=http://localhost:3001 > .env

npm start
```

---

## Verify Everything Works

### Test 1: Backend is running

Open browser and visit:
```
http://localhost:3001/api/health
```

Should show:
```json
{
  "status": "Server is running",
  "timestamp": "2024-01-15T...",
  "port": 3001
}
```

### Test 2: Paste simple transcript

1. Frontend should be open at `http://localhost:3000`
2. Click **Transcript** tab
3. Paste:
```
[0:00] Test
This is a test to verify everything works.
```
4. Click "Generate PDF"
5. Preview should appear on right side

### Test 3: Download PDF

1. After preview appears
2. Click "📥 Download PDF"
3. File should download

---

## Common Mistakes

❌ **Mistake 1:** Only starting backend, not frontend
- ✅ You need BOTH running in separate terminals

❌ **Mistake 2:** Starting frontend before backend
- ✅ Start backend FIRST, then frontend

❌ **Mistake 3:** Closing the backend terminal
- ✅ Keep backend terminal open while using app

❌ **Mistake 4:** No .env file
- ✅ Create `.env` in `d:\Transcript` with API URL

❌ **Mistake 5:** Forgetting to restart React after creating .env
- ✅ Stop React (Ctrl+C), start again (`npm start`)

---

## Getting Help

### Check These First:
1. **Backend console** - Look for error messages
2. **Browser console** - F12, click Console tab, look for red errors
3. **Network tab** - F12, click Network tab, try generating PDF, look for failed requests
4. **.env file** - Make sure it exists and has correct URL

### If still stuck:

Show me:
1. Screenshot of backend terminal (with full output)
2. Screenshot of error message
3. Browser console errors (F12)
4. `.env` file contents
5. What you're trying to do (YouTube URL or transcript)

---

## Backend Console Error Messages

### "youtube-transcript not available"
- Normal! Backend uses fallback method
- Will still work, but might need manual transcript for some videos

### "Failed to fetch transcript via API"
- YouTube video doesn't have captions
- Try a different video
- Use manual transcript instead

### "Cannot connect to YouTube"
- YouTube might be blocking requests
- Wait a few minutes
- Try different video
- Use manual transcript

---

## Performance Issues

### App is slow:

```bash
# Backend
Ctrl+C
npm start

# Frontend  
Ctrl+C
npm start
```

Restart both.

### Large transcript takes long time:

- This is normal
- Very long transcripts (1+ hour) take 30+ seconds
- Be patient, progress bar will move

### PDF generation is slow:

- Normal for large documents
- 30-60 seconds for long transcripts
- HTML to PDF conversion takes time

---

## Can't Find What You Need?

**Check these files:**

1. **RUNNING.md** - How to run everything
2. **FULLSTACK_SETUP.md** - Architecture and deployment
3. **README.md** - Feature overview
4. **SETUP.md** - Detailed installation
5. **PROJECT_STRUCTURE.md** - Code organization

---

## Still Having Issues?

The most common solutions:

1. **Restart both servers** - Stop (Ctrl+C), start fresh
2. **Clear browser cache** - Ctrl+Shift+Delete
3. **Reinstall dependencies** - Delete node_modules, run `npm install`
4. **Check .env file** - Make sure it exists with correct URL
5. **Check ports** - Make sure 3000 and 3001 aren't used by other apps

---

## Quick Fixes Checklist

- [ ] Backend running? (look for "✅ Server running")
- [ ] Frontend running? (should auto-open browser)
- [ ] .env file created with API URL?
- [ ] Restarted React after creating .env?
- [ ] Pasted valid YouTube URL or transcript?
- [ ] Clicked "Generate PDF" button?
- [ ] Browser console shows no red errors? (F12)
- [ ] Backend console shows no red errors?

If all checked, it should work! 🎉

---

**Need more help? Restart with RUNNING.md or START_BACKEND.bat + START_FRONTEND.bat**
