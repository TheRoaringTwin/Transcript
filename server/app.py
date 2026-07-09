import sys
import io
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
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

        # Fetch transcript
        captions = None

        try:
            # Try to get English transcript first
            captions = YouTubeTranscriptApi.get_transcript(video_id, languages=['en'])
            print(f"✅ Got {len(captions)} captions in English")
        except Exception as e:
            print(f"❌ Failed to get English captions: {str(e)}")
            # Try to get any available transcript without language preference
            try:
                captions = YouTubeTranscriptApi.get_transcript(video_id)
                print(f"✅ Got {len(captions)} captions in default language")
            except Exception as e_default:
                print(f"❌ Failed to get default transcript: {str(e_default)}")
                # Try to list and fetch available transcripts
                try:
                    transcripts = YouTubeTranscriptApi.list_transcripts(video_id)
                    print(f"📋 Available transcripts: {transcripts}")

                    # Try to get any available transcript
                    captions = None
                    try:
                        # Try manually created first
                        if transcripts.manually_created_transcripts:
                            captions = transcripts.manually_created_transcripts[0].fetch()
                            print(f"✅ Using manual transcript")
                        # Then try generated
                        elif transcripts.generated_transcripts:
                            captions = transcripts.generated_transcripts[0].fetch()
                            print(f"✅ Using auto-generated transcript")
                        else:
                            raise Exception("No transcripts available")
                    except Exception as fetch_error:
                        print(f"❌ Could not fetch available transcript: {str(fetch_error)}")
                        raise

                    if not captions:
                        raise Exception("No usable transcripts available")
                except Exception as e2:
                    print(f"❌ Error: {str(e2)}")
                    return jsonify({
                        'success': False,
                        'error': f'This video does not have available transcripts. Error: {str(e2)}'
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
