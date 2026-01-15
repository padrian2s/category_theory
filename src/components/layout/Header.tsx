import { useBook } from '../../contexts/BookContext';
import { bookStructure } from '../../data/bookStructure';
import './Header.css';

export default function Header() {
  const {
    currentPage,
    totalPages,
    zoom,
    toggleSidebar,
    toggleEnhancementPanel,
    zoomIn,
    zoomOut,
    resetZoom,
    sidebarOpen,
    enhancementPanelOpen,
    currentChapter,
    currentSection,
  } = useBook();

  const zoomPercentage = Math.round(zoom * 100);

  return (
    <header className="header">
      <div className="header-left">
        <button
          className="btn btn-ghost icon-btn"
          onClick={toggleSidebar}
          title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          aria-label={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <div className="header-title">
          <h1 className="book-title">{bookStructure.title}</h1>
          {currentChapter && (
            <span className="chapter-indicator">
              Chapter {currentChapter.number}: {currentChapter.title}
              {currentSection && ` / ${currentSection.number} ${currentSection.title}`}
            </span>
          )}
        </div>
      </div>

      <div className="header-center">
        <div className="zoom-controls">
          <button
            className="btn btn-ghost icon-btn"
            onClick={zoomOut}
            disabled={zoom <= 0.5}
            title="Zoom out (Ctrl+-)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
          <button
            className="btn btn-ghost zoom-label"
            onClick={resetZoom}
            title="Reset zoom"
          >
            {zoomPercentage}%
          </button>
          <button
            className="btn btn-ghost icon-btn"
            onClick={zoomIn}
            disabled={zoom >= 3}
            title="Zoom in (Ctrl++)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
        </div>
      </div>

      <div className="header-right">
        <span className="page-indicator">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-ghost icon-btn"
          onClick={toggleEnhancementPanel}
          title={enhancementPanelOpen ? 'Hide enhancements' : 'Show enhancements'}
          aria-label={enhancementPanelOpen ? 'Hide enhancements' : 'Show enhancements'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18" />
          </svg>
        </button>
      </div>
    </header>
  );
}
