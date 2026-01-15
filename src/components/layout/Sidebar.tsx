import { useState } from 'react';
import { useBook } from '../../contexts/BookContext';
import { getTableOfContents } from '../../data/bookStructure';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const { currentPage, goToPage } = useBook();
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(['chapter-1', 'chapter-2']));
  const tableOfContents = getTableOfContents();

  const toggleChapter = (chapterId: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterId)) {
        next.delete(chapterId);
      } else {
        next.add(chapterId);
      }
      return next;
    });
  };

  const isCurrentPage = (page: number) => currentPage === page;
  const isInRange = (startPage: number, endPage?: number) => {
    if (endPage) {
      return currentPage >= startPage && currentPage <= endPage;
    }
    return currentPage === startPage;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Contents</h2>
      </div>
      <nav className="sidebar-nav">
        <ul className="toc-list">
          {tableOfContents.map((chapter) => (
            <li key={chapter.id} className="toc-chapter">
              <button
                className={`toc-chapter-btn ${isInRange(chapter.page) ? 'active' : ''}`}
                onClick={() => toggleChapter(chapter.id)}
              >
                <span className={`toc-expand-icon ${expandedChapters.has(chapter.id) ? 'expanded' : ''}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </span>
                <span className="toc-label">{chapter.label}</span>
                <span className="toc-page">{chapter.page}</span>
              </button>
              {expandedChapters.has(chapter.id) && chapter.children.length > 0 && (
                <ul className="toc-sections">
                  {chapter.children.map((section) => (
                    <li key={section.id}>
                      <button
                        className={`toc-section-btn ${isCurrentPage(section.page) ? 'active' : ''}`}
                        onClick={() => goToPage(section.page)}
                      >
                        <span className="toc-label">{section.label}</span>
                        <span className="toc-page">{section.page}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <div className="sidebar-info">
          <p className="text-xs text-muted">Use arrow keys to navigate pages</p>
        </div>
      </div>
    </aside>
  );
}
