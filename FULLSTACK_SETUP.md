# Full Stack Setup Guide 🚀

Complete guide to running both the React frontend and Node.js backend.

## What's New

✅ **YouTube Transcript Fetching** - Automatically extract transcripts from YouTube URLs
✅ **Backend API** - Express.js server for secure transcript processing
✅ **Full Integration** - Frontend and backend working together seamlessly

---

## System Requirements

- **Node.js**: v14 or higher
- **npm**: v6 or higher
- Two terminal windows (one for backend, one for frontend)
- Internet connection (for YouTube access)

---

## Quick Start (5 minutes)

### Terminal 1: Start Backend Server

```bash
# Navigate to server folder
cd d:\Transcript\server

# Install dependencies
npm install

# Start the server
npm start
```

Expected output:
```
✅ Server running on http://localhost:3001
📝 API: http://localhost:3001/api/transcript
```

**Keep this terminal open!**

---

### Terminal 2: Start React Frontend

```bash
# Navigate to project root
cd d:\Transcript

# Install dependencies (if not already done)
npm install

# Start the React app
npm start
```

Expected output:
```
Compiled successfully!
On Your Network: http://localhost:3000
```

**Browser will automatically open at http://localhost:3000**

---

## Using the App

### Method 1: Paste YouTube URL (New!)

1. Click the **"YouTube"** tab
2. Paste a YouTube URL:
   ```
   https://www.youtube.com/watch?v=dQw4w9WgXcQ
   ```
   or just the video ID:
   ```
   dQw4w9WgXcQ
   ```
3. Fill in document details (title, author, etc.)
4. Click **"📄 Generate PDF"**
5. The backend automatically fetches and processes the transcript!

### Method 2: Paste Transcript Text (Original Way)

1. Click the **"Transcript"** tab
2. Paste your transcript with timestamps:
   ```
   [0:00] Introduction
   Welcome to this tutorial...

   [2:30] Main Topic
   Let me explain...
   ```
3. Click **"📄 Generate PDF"**
4. Download or export as needed

---

## Detailed Installation

### Step 1: Install Backend Dependencies

```bash
cd d:\Transcript\server
npm install
```

This installs:
- `express` - Web server framework
- `cors` - Cross-origin request handling
- `youtube-transcript` - YouTube transcript fetcher
- `axios` - HTTP client (optional)

### Step 2: Start Backend Server

```bash
npm start
```

The server runs on `http://localhost:3001`

### Step 3: Install Frontend Dependencies

In a **new terminal window**:

```bash
cd d:\Transcript
npm install
```

### Step 4: Start React Frontend

```bash
npm start
```

The app opens at `http://localhost:3000`

---

## Architecture

```
User Browser (http://localhost:3000)
        ↓
React Frontend (src/)
        ↓
API Call: POST /api/transcript
        ↓
Express Backend (server/)
        ↓
YouTube Transcript Library
        ↓
YouTube API
        ↓
Returns Transcript
        ↓
React Frontend Process & Display
        ↓
Generate PDF
```

---

## API Endpoints

### POST /api/transcript

Fetch transcript from YouTube URL.

**Request:**
```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

or

```json
{
  "url": "VIDEO_ID"
}
```

**Response (Success):**
```json
{
  "success": true,
  "transcript": "Welcome to this tutorial... [formatted with timestamps]",
  "videoId": "VIDEO_ID",
  "message": "Transcript fetched successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Video not found or is unavailable"
}
```

### GET /api/health

Check if server is running.

**Response:**
```json
{
  "status": "Server is running"
}
```

---

## Configuration

### Environment Variables

Create a `.env` file in project root:

```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENABLE_YOUTUBE_FETCH=true
REACT_APP_ENABLE_PDF_DOWNLOAD=true
```

**Note:** Variable names must start with `REACT_APP_` to be accessible in React

---

## Troubleshooting

### "Cannot find module 'youtube-transcript'"

**Solution:**
```bash
cd d:\Transcript\server
npm install youtube-transcript
npm start
```

### "EADDRINUSE: address already in use :::3001"

**Cause:** Port 3001 is already in use

**Solution:**
```bash
# Use different port
PORT=3002 npm start
```

Then update `.env`:
```env
REACT_APP_API_URL=http://localhost:3002
```

### "Failed to fetch transcript"

**Causes:**
- YouTube URL is invalid
- Video doesn't have transcripts enabled
- Server isn't running
- YouTube API rate limit

**Solution:**
1. Check backend is running: `http://localhost:3001/api/health`
2. Verify YouTube URL is correct
3. Try a different video
4. Wait a few minutes and retry

### "CORS error" in browser console

**Cause:** Frontend can't reach backend

**Solution:**
1. Make sure backend is running on port 3001
2. Check `.env` has correct `REACT_APP_API_URL`
3. Refresh browser (Ctrl+R)

### "React app won't start"

**Solution:**
```bash
cd d:\Transcript
npm cache clean --force
rm -rf node_modules
npm install
npm start
```

---

## Running in Production

### Build React App

```bash
cd d:\Transcript
npm run build
```

Creates optimized `build/` folder

### Run Backend + Frontend Together

```bash
cd d:\Transcript\server
npm install
npm start
```

Backend serves the React build automatically at `http://localhost:3001`

### Deploy to Production

**Option 1: Heroku**

```bash
# Install Heroku CLI
# Then:
heroku create your-app-name
git push heroku main
```

**Option 2: DigitalOcean/AWS/Azure**

1. Build React: `npm run build`
2. Upload `build/` folder to server
3. Setup Node.js on server
4. Run backend server with process manager (PM2)

**Option 3: Docker**

```bash
docker-compose up -d
```

---

## Development Workflow

### Making Changes

**Frontend:**
1. Edit files in `src/`
2. Save (auto-reloads at `http://localhost:3000`)
3. Check browser for changes

**Backend:**
1. Edit files in `server/`
2. For auto-restart, use: `npm run dev`
3. Restart manually: Stop server (Ctrl+C), run `npm start`

### Adding Features

**New API Endpoint:**
1. Add to `server/server.js`
2. Call from React component
3. Test with http://localhost:3001/api/endpoint

**New React Component:**
1. Create file in `src/components/`
2. Import in `App.jsx`
3. Test in browser

---

## API Usage Examples

### Using curl (Command Line)

```bash
curl -X POST http://localhost:3001/api/transcript \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"https://www.youtube.com/watch?v=dQw4w9WgXcQ\"}"
```

### Using JavaScript Fetch

```javascript
const response = await fetch('http://localhost:3001/api/transcript', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://www.youtube.com/watch?v=VIDEO_ID'
  })
});

const data = await response.json();
console.log(data.transcript);
```

### Using Postman

1. Open Postman
2. Create new POST request
3. URL: `http://localhost:3001/api/transcript`
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
   ```json
   {
     "url": "https://www.youtube.com/watch?v=VIDEO_ID"
   }
   ```
6. Send

---

## Performance Tips

### Frontend
- Disable optional sections (Glossary, Formulas) for faster processing
- Use modern browser for best performance
- Clear browser cache if issues occur

### Backend
- Server can handle ~10 requests/second
- YouTube API has rate limits (~600 requests/day)
- Long transcripts take longer to process

### Overall
- Keep both servers running in separate terminals
- Use `.env` to configure URLs
- Monitor console for errors

---

## Security Considerations

✅ **CORS enabled** - Frontend can communicate with backend
✅ **Input validation** - URLs are validated before processing
✅ **Error handling** - Clear error messages without exposing system details
⚠️ **YouTube API** - Rate limits apply (YouTube's policy)
⚠️ **Transcripts** - Only fetch from public videos with available transcripts

---

## Next Steps

1. ✅ Start both servers (backend then frontend)
2. 🧪 Test with a YouTube URL
3. 📥 Download a PDF
4. 🚀 Deploy to production (optional)

---

## File Structure

```
d:\Transcript/
├── src/                    # React frontend
│   ├── components/
│   ├── utils/
│   ├── App.jsx
│   └── index.jsx
├── server/                 # Node.js backend
│   ├── server.js
│   └── package.json
├── public/
├── build/                  # Production build
├── package.json
├── .env                    # Environment variables
└── FULLSTACK_SETUP.md      # This file
```

---

## Support

**Backend Issues:**
- Check `server/` logs
- Verify Node.js version: `node --version`
- Ensure port 3001 is available

**Frontend Issues:**
- Check browser console (F12)
- Verify `.env` has correct API URL
- Clear cache and refresh

**YouTube Issues:**
- Video must have transcripts enabled
- Some videos don't have transcripts
- YouTube may rate-limit requests
- Try again later if rate-limited

---

**Everything is now fully functional!** 🎉

Run the backend and frontend together, and you have a complete transcript-to-PDF converter with YouTube support!
