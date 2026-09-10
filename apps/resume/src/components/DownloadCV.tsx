import React, { useState } from 'react';
import { eventBus } from '@impossible-resume/event-bus';

export function DownloadCV() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    eventBus.emit('resume:download_cv', 'resume', { timestamp: Date.now() });

    // Simulate download
    setTimeout(() => {
      setDownloading(false);
      alert('CV download coming soon! Connect with me on LinkedIn.');
    }, 1500);
  };

  return (
    <button
      className={`download-cv ${downloading ? 'download-cv--downloading' : ''}`}
      onClick={handleDownload}
      disabled={downloading}
    >
      <span className="download-cv__icon">{downloading ? '⏳' : '📄'}</span>
      <span className="download-cv__text">{downloading ? 'Preparing...' : 'Download CV'}</span>
    </button>
  );
}
