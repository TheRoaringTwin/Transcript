import sys
import io
import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
import requests
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.units import inch
import re

# Fix encoding for Windows console
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

app = Flask(__name__)
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"],
        "supports_credentials": False,
        "max_age": 3600
    }
})

def extract_video_id(url):
    """Extract video ID from YouTube URL"""
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})',
        r'^([a-zA-Z0-9_-]{11})$'
    ]

    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    return None

def format_transcript(captions):
    """Format captions with timestamps"""
    if not captions:
        return None

    transcript = ""
    last_time = 0
    section_count = 1

    for i, caption in enumerate(captions):
        # Handle both FetchedTranscriptSnippet objects (1.2.4+) and dicts (older versions)
        if hasattr(caption, 'text'):
            # Object with attributes (new API)
            text = caption.text.strip()
            start_time = caption.start
        else:
            # Dict format (old API)
            text = caption.get('text', '').strip()
            start_time = caption.get('start', 0)

        if not text:
            continue

        current_time = int(start_time)

        # Add section header every 2 minutes
        if i == 0 or current_time - last_time >= 120:
            minutes = current_time // 60
            seconds = current_time % 60
            transcript += f"\n[{minutes}:{seconds:02d}] Section {section_count}\n"
            section_count += 1

        transcript += f"{text} "
        last_time = current_time

    return transcript.strip() if transcript.strip() else None

@app.route('/api/transcript', methods=['POST'])
def get_transcript():
    """Main endpoint to fetch YouTube transcript"""
    try:
        data = request.json
        url = data.get('url', '').strip()

        if not url:
            return jsonify({
                'success': False,
                'error': 'YouTube URL is required'
            }), 400

        # Extract video ID
        video_id = extract_video_id(url)
        if not video_id:
            return jsonify({
                'success': False,
                'error': 'Invalid YouTube URL or video ID'
            }), 400

        print(f"\n{'='*60}")
        print(f"📥 Fetching transcript for: {video_id}")
        print(f"{'='*60}")

        # Fetch transcript using YouTube API key if available
        api_key = os.getenv('YOUTUBE_API_KEY')
        captions = None

        try:
            # Try youtube-transcript-api first
            captions = YouTubeTranscriptApi.get_transcript(video_id)
            print(f"✅ Got {len(captions)} captions using youtube-transcript-api")
        except Exception as e:
            print(f"❌ youtube-transcript-api failed: {str(e)}")

            # Try using YouTube API if key is available
            if api_key:
                try:
                    print("🔄 Trying YouTube API with API key...")
                    # Get caption tracks
                    url = f"https://www.googleapis.com/youtube/v3/captions"
                    params = {
                        'videoId': video_id,
                        'key': api_key
                    }
                    response = requests.get(url, params=params, timeout=10)

                    if response.status_code == 200:
                        data = response.json()
                        items = data.get('items', [])

                        if items:
                            # Try to get English captions first
                            caption_id = None
                            for item in items:
                                if item.get('snippet', {}).get('language') == 'en':
                                    caption_id = item['id']
                                    break

                            # If no English, get first available
                            if not caption_id:
                                caption_id = items[0]['id']

                            # Download caption track
                            download_url = f"https://www.googleapis.com/youtube/v3/captions/{caption_id}"
                            download_params = {'key': api_key, 'tfmt': 'vtt'}
                            caption_response = requests.get(download_url, params=download_params, timeout=10)

                            if caption_response.status_code == 200:
                                # Parse VTT format
                                lines = caption_response.text.split('\n')
                                captions = []
                                for line in lines:
                                    if '-->' not in line and line.strip() and not line.startswith('WEBVTT'):
                                        captions.append({'text': line.strip(), 'start': 0})

                                if captions:
                                    print(f"✅ Got {len(captions)} captions using YouTube API")
                except Exception as api_error:
                    print(f"❌ YouTube API failed: {str(api_error)}")

            # Fallback to yt-dlp if YouTube API didn't work
            if not captions:
                try:
                    import yt_dlp
                    print("🔄 Trying yt-dlp as final fallback...")

                    ydl_opts = {
                        'quiet': True,
                        'no_warnings': True,
                        'writesubtitles': True,
                        'writeautomaticsub': True,
                        'skip_download': True,
                        'socket_timeout': 30,
                    }

                    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                        info = ydl.extract_info(f'https://www.youtube.com/watch?v={video_id}', download=False)

                        if info.get('subtitles'):
                            first_lang = list(info['subtitles'].keys())[0]
                            subs = info['subtitles'][first_lang]
                            captions = [{'text': item['text'], 'start': item.get('start', 0)} for item in subs]
                            print(f"✅ Got {len(captions)} captions using yt-dlp")
                        elif info.get('automatic_captions'):
                            first_lang = list(info['automatic_captions'].keys())[0]
                            subs = info['automatic_captions'][first_lang]
                            captions = [{'text': item['text'], 'start': item.get('start', 0)} for item in subs]
                            print(f"✅ Got {len(captions)} auto-generated captions using yt-dlp")
                except Exception as e2:
                    print(f"❌ All methods failed: {str(e2)}")
                    return jsonify({
                        'success': False,
                        'error': f'This video does not have available transcripts. Error: {str(e2)}'
                    }), 400

        if not captions:
            return jsonify({
                'success': False,
                'error': 'No transcripts found. Please try a different video.'
            }), 400

        # Format transcript
        transcript = format_transcript(captions)

        if not transcript:
            return jsonify({
                'success': False,
                'error': 'Transcript is empty'
            }), 400

        print(f"✅ Transcript formatted: {len(transcript)} characters")
        print(f"✅ SUCCESS\n")

        return jsonify({
            'success': True,
            'transcript': transcript,
            'videoId': video_id,
            'message': 'Transcript fetched successfully'
        }), 200

    except Exception as e:
        print(f"❌ ERROR: {str(e)}\n")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/generate-pdf', methods=['POST'])
def generate_pdf():
    """Generate PDF from transcript"""
    try:
        data = request.json
        transcript = data.get('transcript', '')
        title = data.get('title', 'Transcript')

        if not transcript:
            return jsonify({
                'success': False,
                'error': 'Transcript is required'
            }), 400

        from reportlab.lib.pagesizes import letter
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
        from reportlab.lib.units import inch
        from io import BytesIO

        # Create PDF in memory
        pdf_buffer = BytesIO()
        doc = SimpleDocTemplate(pdf_buffer, pagesize=letter,
                               topMargin=0.5*inch, bottomMargin=0.5*inch,
                               leftMargin=0.75*inch, rightMargin=0.75*inch)

        # Build the PDF
        story = []
        styles = getSampleStyleSheet()

        # Add title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor='#000000',
            spaceAfter=0.3*inch,
            borderPadding=10,
            borderColor='#000000',
            borderWidth=2
        )
        story.append(Paragraph(title, title_style))
        story.append(Spacer(1, 0.2*inch))

        # Add transcript content
        body_style = ParagraphStyle(
            'CustomBody',
            parent=styles['BodyText'],
            fontSize=11,
            alignment=4,  # Justify
            spaceAfter=0.15*inch,
            leading=14
        )

        # Split transcript into paragraphs for better rendering
        paragraphs = transcript.split('\n\n')
        for para in paragraphs:
            if para.strip():
                story.append(Paragraph(para.strip(), body_style))

        # Build PDF
        doc.build(story)

        # Send PDF
        pdf_buffer.seek(0)
        filename = re.sub(r'[^a-z0-9]', '_', title.lower()) + '.pdf'

        return send_file(
            pdf_buffer,
            mimetype='application/pdf',
            as_attachment=True,
            download_name=filename
        )

    except Exception as e:
        print(f"PDF generation error: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'PDF generation failed: {str(e)}'
        }), 500

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'Server running',
        'backend': 'Python Flask',
        'library': 'youtube-transcript-api'
    }), 200

if __name__ == '__main__':
    import os
    port = int(os.getenv('PORT', 3001))
    host = os.getenv('HOST', '0.0.0.0')
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'

    print("\n" + "="*70)
    print("✅ PYTHON TRANSCRIPT SERVER RUNNING")
    print("="*70)
    print(f"🌐 Backend running on http://{host}:{port}")
    print("="*70 + "\n")
    app.run(host=host, port=port, debug=debug, use_reloader=False)
