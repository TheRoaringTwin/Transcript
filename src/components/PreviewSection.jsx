import React from 'react';
import StatusMessage from './StatusMessage';

export default function PreviewSection({
  isGenerating,
  progress,
  previewHTML,
  hasDocument,
  onDownloadPDF,
  onCopyHTML,
  onReset,
  statusMessage
}) {
  return (
    <section id="previewSection">
      <h2>Document Preview</h2>
      <p style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--color-slate)' }}>
        Your formatted document will appear here.
      </p>

      <div className="preview-container" id="previewContainer">
        {previewHTML ? (
          <div
            className="document-preview"
            dangerouslySetInnerHTML={{ __html: previewHTML }}
          />
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p><strong>No document yet</strong></p>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              Paste a transcript and click "Generate PDF" to see a preview.
            </p>
          </div>
        )}
      </div>

      {isGenerating && (
        <div id="progressContainer">
          <div className="progress-bar">
            <div
              className="progress-fill"
              id="progressFill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-slate)', textAlign: 'center' }}>
            Processing your transcript...
          </p>
        </div>
      )}

      {statusMessage && (
        <StatusMessage
          message={statusMessage.message}
          type={statusMessage.type}
        />
      )}

      {hasDocument && (
        <div id="outputControls">
          <h3 style={{ marginTop: 0 }}>Download Options</h3>
          <div className="output-controls">
            <button
              className="btn btn-success"
              onClick={onDownloadPDF}
              title="Download as PDF"
            >
              📥 Download PDF
            </button>
            <button
              className="btn btn-secondary"
              onClick={onCopyHTML}
              title="Copy HTML to clipboard"
            >
              📋 Copy HTML
            </button>
            <button
              className="btn btn-secondary"
              onClick={onReset}
              title="Clear and start over"
            >
              🔄 Reset
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
