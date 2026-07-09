import React, { useState, useCallback, useRef, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import InputSection from './components/InputSection';
import PreviewSection from './components/PreviewSection';
import { DocumentGenerator } from './utils/DocumentGenerator';

export default function App() {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [subject, setSubject] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [previewHTML, setPreviewHTML] = useState(null);
  const [documentHTML, setDocumentHTML] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const [includeTOC, setIncludeTOC] = useState(true);
  const [includeGlossary, setIncludeGlossary] = useState(true);
  const [includeFormulas, setIncludeFormulas] = useState(false);

  const progressInterval = useRef(null);
  const html2pdfRef = useRef(null);

  // Load html2pdf library
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
    script.onload = () => {
      html2pdfRef.current = window.html2pdf;
    };
    document.body.appendChild(script);
  }, []);

  const handleUrlChange = (e) => {
    setYoutubeUrl(e.target.value);
  };

  const showStatus = useCallback((message, type = 'info') => {
    setStatusMessage({ message, type });
    if (type !== 'error') {
      setTimeout(() => setStatusMessage(null), 4000);
    }
  }, []);

  const generateDocument = useCallback(async () => {
    const url = youtubeUrl.trim();

    if (!url) {
      showStatus('❌ Please enter a YouTube URL', 'error');
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        if (prev > 90) return 90;
        return prev + Math.random() * 25;
      });
    }, 200);

    try {
      setProgress(10);
      showStatus('📥 Fetching transcript from YouTube...', 'info');

      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

      const response = await fetch(`${API_URL}/api/transcript`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch transcript');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch transcript');
      }

      setProgress(50);
      showStatus('⚙️ Processing transcript...', 'info');

      const transcript = data.transcript;
      setProgress(70);

      const options = {
        includeTOC,
        includeGlossary,
        includeFormulas
      };

      const generator = new DocumentGenerator(
        transcript,
        docTitle || 'YouTube Video Transcript',
        author,
        subject,
        options
      );

      generator.parse();
      const html = generator.generateHTML();
      const preview = generator.generatePreview();

      setDocumentHTML(html);
      setPreviewHTML(preview);

      clearInterval(progressInterval.current);
      setProgress(100);

      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
        showStatus('✅ Transcript extracted and formatted!', 'success');
      }, 300);
    } catch (error) {
      clearInterval(progressInterval.current);
      setIsGenerating(false);
      setProgress(0);
      console.error('Error:', error);
      showStatus(`❌ ${error.message}`, 'error');
    }
  }, [youtubeUrl, docTitle, author, subject, includeTOC, includeGlossary, includeFormulas, showStatus]);

  const handleDownloadPDF = useCallback(async () => {
    if (!previewHTML) return;

    try {
      showStatus('📄 Generating PDF...', 'info');

      // Extract plain text from preview HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = previewHTML;
      const transcript = tempDiv.textContent || tempDiv.innerText || '';

      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

      const response = await fetch(`${API_URL}/api/generate-pdf`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: transcript,
          title: docTitle || 'Transcript'
        })
      });

      if (!response.ok) {
        throw new Error('PDF generation failed');
      }

      // Get the PDF blob and download it
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = (docTitle || 'transcript').replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showStatus('✅ PDF downloaded!', 'success');
    } catch (error) {
      console.error('Error:', error);
      showStatus(`❌ Download failed: ${error.message}`, 'error');
    }
  }, [previewHTML, docTitle, showStatus]);

  const handleCopyHTML = useCallback(() => {
    if (!documentHTML) return;

    navigator.clipboard.writeText(documentHTML).then(() => {
      showStatus('✅ HTML copied!', 'success');
    }).catch(() => {
      showStatus('❌ Copy failed', 'error');
    });
  }, [documentHTML, showStatus]);

  const handleReset = useCallback(() => {
    setYoutubeUrl('');
    setDocTitle('');
    setAuthor('');
    setSubject('');
    setPreviewHTML(null);
    setDocumentHTML(null);
    setStatusMessage(null);
  }, []);

  return (
    <div className="app">
      <Header />
      <div className="container">
        <div className="content-grid">
          <InputSection
            transcript={youtubeUrl}
            onTranscriptChange={handleUrlChange}
            docTitle={docTitle}
            setDocTitle={setDocTitle}
            author={author}
            setAuthor={setAuthor}
            subject={subject}
            setSubject={setSubject}
            includeTOC={includeTOC}
            setIncludeTOC={setIncludeTOC}
            includeGlossary={includeGlossary}
            setIncludeGlossary={setIncludeGlossary}
            includeFormulas={includeFormulas}
            setIncludeFormulas={setIncludeFormulas}
            onGenerate={generateDocument}
            isGenerating={isGenerating}
            statusMessage={statusMessage}
          />

          <PreviewSection
            isGenerating={isGenerating}
            progress={progress}
            previewHTML={previewHTML}
            hasDocument={documentHTML !== null}
            onDownloadPDF={handleDownloadPDF}
            onCopyHTML={handleCopyHTML}
            onReset={handleReset}
            statusMessage={statusMessage}
          />
        </div>
      </div>
    </div>
  );
}
