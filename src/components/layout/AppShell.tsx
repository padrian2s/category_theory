import { useEffect } from 'react';
import { useBook } from '../../contexts/BookContext';
import Header from './Header';
import Sidebar from './Sidebar';
import PageViewer from '../viewer/PageViewer';
import EnhancementPanel from '../enhancements/EnhancementPanel';
import './AppShell.css';

export default function AppShell() {
  const { sidebarOpen, enhancementPanelOpen, nextPage, prevPage, zoomIn, zoomOut } = useBook();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case 'PageDown':
          e.preventDefault();
          nextPage();
          break;
        case 'ArrowLeft':
        case 'PageUp':
          e.preventDefault();
          prevPage();
          break;
        case '+':
        case '=':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            zoomIn();
          }
          break;
        case '-':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            zoomOut();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPage, prevPage, zoomIn, zoomOut]);

  return (
    <div className="app-shell">
      <Header />
      <div className="app-content">
        <Sidebar isOpen={sidebarOpen} />
        <main className="main-content">
          <PageViewer />
        </main>
        <EnhancementPanel isOpen={enhancementPanelOpen} />
      </div>
    </div>
  );
}
