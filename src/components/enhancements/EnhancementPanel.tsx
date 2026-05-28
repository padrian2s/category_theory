import { useCallback, useEffect, useRef } from 'react';
import { useBook } from '../../contexts/BookContext';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import ExamplesTab from './ExamplesTab';
import SimulatorTab from './SimulatorTab';
import ApplicationsTab from './ApplicationsTab';
import LearningPathTab from './LearningPathTab';
import './EnhancementPanel.css';

interface EnhancementPanelProps {
  isOpen: boolean;
}

const tabs = [
  { id: 'examples', label: 'Examples', icon: '📚' },
  { id: 'simulator', label: 'Simulator', icon: '🔬' },
  { id: 'applications', label: 'Applications', icon: '💡' },
  { id: 'learning', label: 'Learning Path', icon: '🎯' },
] as const;

const MIN_PANEL_WIDTH = 280;
const MAX_PANEL_WIDTH_RATIO = 0.8;
const DEFAULT_PANEL_WIDTH = 420;

export default function EnhancementPanel({ isOpen }: EnhancementPanelProps) {
  const { activeTab, setActiveTab, currentSection, enhancementPanelFullscreen, toggleEnhancementPanelFullscreen } = useBook();
  const [panelWidth, setPanelWidth] = useLocalStorage<number>(
    'category-theory-panel-width',
    DEFAULT_PANEL_WIDTH
  );
  const isResizingRef = useRef(false);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isResizingRef.current = true;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    },
    []
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      const maxWidth = window.innerWidth * MAX_PANEL_WIDTH_RATIO;
      const next = Math.min(
        Math.max(window.innerWidth - e.clientX, MIN_PANEL_WIDTH),
        maxWidth
      );
      setPanelWidth(next);
    };
    const handleMouseUp = () => {
      if (!isResizingRef.current) return;
      isResizingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [setPanelWidth]);

  if (!isOpen) {
    return null;
  }

  const panelStyle = enhancementPanelFullscreen
    ? undefined
    : { width: `${panelWidth}px`, minWidth: `${panelWidth}px` };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'examples':
        return <ExamplesTab />;
      case 'simulator':
        return <SimulatorTab />;
      case 'applications':
        return <ApplicationsTab />;
      case 'learning':
        return <LearningPathTab />;
      default:
        return null;
    }
  };

  return (
    <aside className={`enhancement-panel ${enhancementPanelFullscreen ? 'fullscreen' : ''}`} style={panelStyle}>
      <div
        className="panel-resizer"
        onMouseDown={handleResizeStart}
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize enhancement panel"
      />
      <div className="panel-header">
        <div className="panel-header-content">
          <h2>Interactive Enhancements</h2>
          {currentSection && (
            <span className="section-badge">
              {currentSection.number} {currentSection.title}
            </span>
          )}
        </div>
        <button
          className="fullscreen-toggle"
          onClick={toggleEnhancementPanelFullscreen}
          title={enhancementPanelFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {enhancementPanelFullscreen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          )}
        </button>
      </div>

      <div className="panel-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`panel-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="panel-content">
        {renderTabContent()}
      </div>
    </aside>
  );
}
