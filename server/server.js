import express from 'express';
import cors from 'cors';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

async function fetchTranscript(videoId) {
  console.log(`\n📥 Fetching transcript for: ${videoId}\n`);

  // Method 1: Direct YouTube API with browser headers
  try {
    console.log('🔄 Method 1: YouTube Direct API...');
    const response = await axios.get(
      `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://www.youtube.com/',
        },
        timeout: 15000
      }
    );

    if (response.data && response.data.includes('<text')) {
      console.log('✅ Got transcript!');
      return parseXmlTranscript(response.data);
    }
  } catch (e) {
    console.log('❌ Method 1 failed:', e.message);
  }

  // Method 2: YouTube JSON format API
  try {
    console.log('🔄 Method 2: YouTube JSON API...');
    const response = await axios.get(
      `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=json3`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 15000
      }
    );

    if (response.data?.events) {
      console.log('✅ Got transcript!');
      return parseJsonTranscript(response.data);
    }
  } catch (e) {
    console.log('❌ Method 2 failed:', e.message);
  }

  // Method 3: Fetch with accept header for XML
  try {
    console.log('🔄 Method 3: Direct fetch with XML headers...');
    const response = await axios.get(
      `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&kind=standard`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/xml, text/xml',
        },
        timeout: 15000
      }
    );

    if (response.data && response.data.includes('<text')) {
      console.log('✅ Got transcript!');
      return parseXmlTranscript(response.data);
    }
  } catch (e) {
    console.log('❌ Method 3 failed:', e.message);
  }

  // Method 4: Alternative service
  try {
    console.log('🔄 Method 4: Alternative transcript service...');
    const response = await axios.get(
      `https://www.yt-subs.com/transcript/download/${videoId}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0',
        },
        timeout: 15000
      }
    );

    if (response.data) {
      console.log('✅ Got transcript!');
      return formatTranscript(response.data);
    }
  } catch (e) {
    console.log('❌ Method 4 failed:', e.message);
  }

  throw new Error('Unable to fetch transcript. Please try manual paste instead.');
}

function parseXmlTranscript(xmlData) {
  let transcript = '';
  let lastTime = 0;
  let sectionCount = 1;

  const textMatches = xmlData.match(/<text[^>]*start="([\d.]+)"[^>]*>([^<]+)<\/text>/g) || [];

  if (textMatches.length === 0) {
    throw new Error('No captions found');
  }

  for (let i = 0; i < textMatches.length; i++) {
    const timeMatch = textMatches[i].match(/start="([\d.]+)"/);
    const textMatch = textMatches[i].match(/>([^<]+)<\/text>/);

    if (timeMatch && textMatch) {
      let text = textMatch[1]
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#39;/g, "'")
        .trim();

      if (!text) continue;

      const currentTime = Math.floor(parseFloat(timeMatch[1]));

      if (i === 0 || currentTime - lastTime >= 120) {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        transcript += `\n[${minutes}:${seconds.toString().padStart(2, '0')}] Section ${sectionCount}\n`;
        sectionCount++;
      }

      transcript += `${text} `;
      lastTime = currentTime;
    }
  }

  if (transcript.trim().length < 50) {
    throw new Error('Transcript too short');
  }

  return transcript.trim();
}

function parseJsonTranscript(jsonData) {
  let transcript = '';
  let lastTime = 0;
  let sectionCount = 1;

  if (!jsonData.events || jsonData.events.length === 0) {
    throw new Error('No events in JSON');
  }

  for (let i = 0; i < jsonData.events.length; i++) {
    const event = jsonData.events[i];
    if (!event.segs) continue;

    const time = event.tStartMs ? Math.floor(event.tStartMs / 1000) : 0;
    const text = event.segs.map(seg => seg.utf8).join('').trim();

    if (!text) continue;

    if (i === 0 || time - lastTime >= 120) {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      transcript += `\n[${minutes}:${seconds.toString().padStart(2, '0')}] Section ${sectionCount}\n`;
      sectionCount++;
    }

    transcript += `${text} `;
    lastTime = time;
  }

  if (transcript.trim().length < 50) {
    throw new Error('Transcript too short');
  }

  return transcript.trim();
}

function formatTranscript(data) {
  if (typeof data === 'object') {
    data = JSON.stringify(data);
  }

  let transcript = '';
  let lastTime = 0;
  let sectionCount = 1;

  const lines = data.split('\n').filter(line => line.trim());

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const currentTime = Math.floor(i * 2);

    if (i === 0 || currentTime - lastTime >= 120) {
      const minutes = Math.floor(currentTime / 60);
      const seconds = currentTime % 60;
      transcript += `\n[${minutes}:${seconds.toString().padStart(2, '0')}] Section ${sectionCount}\n`;
      sectionCount++;
    }

    transcript += `${line} `;
    lastTime = currentTime;
  }

  return transcript.trim();
}

app.post('/api/transcript', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        error: 'YouTube URL is required'
      });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid YouTube URL'
      });
    }

    console.log(`${'='.repeat(60)}`);
    console.log(`🎬 PROCESSING: ${videoId}`);
    console.log(`${'='.repeat(60)}`);

    const transcript = await fetchTranscript(videoId);

    console.log(`✅ SUCCESS: ${transcript.length} characters extracted\n`);

    return res.json({
      success: true,
      transcript: transcript,
      videoId: videoId,
      message: 'Transcript fetched successfully'
    });

  } catch (error) {
    console.error('❌ FAILED:', error.message);
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server running', port: PORT });
});

app.use(express.static(path.join(__dirname, '../build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n✅ SERVER READY\nApp: http://localhost:3000\nBackend: http://localhost:${PORT}\n`);
});

process.on('SIGINT', () => {
  console.log('\n📴 Shutting down...\n');
  process.exit(0);
});
