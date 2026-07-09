import React from 'react';
import StatusMessage from './StatusMessage';

export default function InputSection({
  transcript,
  onTranscriptChange,
  docTitle,
  setDocTitle,
  author,
  setAuthor,
  subject,
  setSubject,
  includeTOC,
  setIncludeTOC,
  includeGlossary,
  setIncludeGlossary,
  includeFormulas,
  setIncludeFormulas,
  onGenerate,
  isGenerating,
  statusMessage
}) {
  return (
    <section id="inputSection">
      <h2>YouTube Transcript Extractor</h2>
      <p style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--color-slate)' }}>
        Paste a YouTube URL to automatically extract and view the transcript content.
      </p>

      <div style={{
        backgroundColor: '#ECFDF5',
        border: '1px solid #A7F3D0',
        padding: '1rem',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem',
        fontSize: '0.875rem',
        color: '#065F46'
      }}>
        <strong>✅ How it works:</strong>
        <p style={{ marginTop: '0.5rem', margin: '0.5rem 0 0 0' }}>Just paste the YouTube link and the transcript will be automatically extracted and displayed in the document.</p>
      </div>

      <div className="form-group">
        <label htmlFor="youtubeUrl">YouTube URL or Video ID</label>
        <input
          type="url"
          id="youtubeUrl"
          value={transcript}
          onChange={onTranscriptChange}
          placeholder="https://www.youtube.com/watch?v=VIDEO_ID or just VIDEO_ID"
        />
        <small style={{ fontSize: '0.75rem', color: 'var(--color-slate)', marginTop: '0.5rem', display: 'block' }}>
          Examples: https://youtu.be/dQw4w9WgXcQ or dQw4w9WgXcQ
        </small>
      </div>

      <hr />

      <h2 style={{ marginTop: 'var(--spacing-lg)' }}>Document Settings (Optional)</h2>

      <div className="form-group">
        <label htmlFor="docTitle">Document Title</label>
        <input
          type="text"
          id="docTitle"
          value={docTitle}
          onChange={(e) => setDocTitle(e.target.value)}
          placeholder="e.g., Video Transcript: Title of Video"
        />
      </div>

      <div className="form-group">
        <label htmlFor="author">Author / Creator</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Video creator or your name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="subject">Subject / Topic</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g., Technology, Education, Science"
        />
      </div>

      <div className="form-group">
        <label>Include in Document</label>
        <div className="checkbox-group">
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="includeTOC"
              checked={includeTOC}
              onChange={(e) => setIncludeTOC(e.target.checked)}
            />
            <label htmlFor="includeTOC">Table of Contents</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="includeGlossary"
              checked={includeGlossary}
              onChange={(e) => setIncludeGlossary(e.target.checked)}
            />
            <label htmlFor="includeGlossary">Glossary of Terms</label>
          </div>
          <div className="checkbox-item">
            <input
              type="checkbox"
              id="includeFormulas"
              checked={includeFormulas}
              onChange={(e) => setIncludeFormulas(e.target.checked)}
            />
            <label htmlFor="includeFormulas">Formulas & Equations</label>
          </div>
        </div>
      </div>

      <hr />

      <div className="form-group">
        <button
          className="btn btn-primary"
          onClick={onGenerate}
          disabled={isGenerating || !transcript.trim()}
        >
          {isGenerating ? (
            <>
              <span className="spinner"></span> Extracting...
            </>
          ) : (
            <>📥 Extract Transcript</>
          )}
        </button>
      </div>

      {statusMessage && (
        <StatusMessage
          message={statusMessage.message}
          type={statusMessage.type}
        />
      )}
    </section>
  );
}
