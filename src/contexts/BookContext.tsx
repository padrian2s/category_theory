import { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';
import { bookStructure, getChapterByPage, getSectionByPage } from '../data/bookStructure';

interface BookState {
  currentPage: number;
  totalPages: number;
  zoom: number;
  sidebarOpen: boolean;
  enhancementPanelOpen: boolean;
  enhancementPanelFullscreen: boolean;
  activeTab: 'examples' | 'simulator' | 'applications' | 'learning';
}

type BookAction =
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'NEXT_PAGE' }
  | { type: 'PREV_PAGE' }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'ZOOM_IN' }
  | { type: 'ZOOM_OUT' }
  | { type: 'RESET_ZOOM' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'TOGGLE_ENHANCEMENT_PANEL' }
  | { type: 'TOGGLE_ENHANCEMENT_PANEL_FULLSCREEN' }
  | { type: 'SET_ACTIVE_TAB'; payload: BookState['activeTab'] };

const initialState: BookState = {
  currentPage: 1,
  totalPages: bookStructure.totalPages,
  zoom: 1,
  sidebarOpen: true,
  enhancementPanelOpen: true,
  enhancementPanelFullscreen: false,
  activeTab: 'examples',
};

function bookReducer(state: BookState, action: BookAction): BookState {
  switch (action.type) {
    case 'SET_PAGE':
      return {
        ...state,
        currentPage: Math.max(1, Math.min(action.payload, state.totalPages)),
      };
    case 'NEXT_PAGE':
      return {
        ...state,
        currentPage: Math.min(state.currentPage + 1, state.totalPages),
      };
    case 'PREV_PAGE':
      return {
        ...state,
        currentPage: Math.max(state.currentPage - 1, 1),
      };
    case 'SET_ZOOM':
      return {
        ...state,
        zoom: Math.max(0.5, Math.min(action.payload, 3)),
      };
    case 'ZOOM_IN':
      return {
        ...state,
        zoom: Math.min(state.zoom + 0.25, 3),
      };
    case 'ZOOM_OUT':
      return {
        ...state,
        zoom: Math.max(state.zoom - 0.25, 0.5),
      };
    case 'RESET_ZOOM':
      return {
        ...state,
        zoom: 1,
      };
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };
    case 'TOGGLE_ENHANCEMENT_PANEL':
      return {
        ...state,
        enhancementPanelOpen: !state.enhancementPanelOpen,
      };
    case 'TOGGLE_ENHANCEMENT_PANEL_FULLSCREEN':
      return {
        ...state,
        enhancementPanelFullscreen: !state.enhancementPanelFullscreen,
      };
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload,
      };
    default:
      return state;
  }
}

interface BookContextValue extends BookState {
  // Navigation
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  // Zoom
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  // UI
  toggleSidebar: () => void;
  toggleEnhancementPanel: () => void;
  toggleEnhancementPanelFullscreen: () => void;
  setActiveTab: (tab: BookState['activeTab']) => void;
  // Derived state
  currentChapter: ReturnType<typeof getChapterByPage>;
  currentSection: ReturnType<typeof getSectionByPage>;
}

const BookContext = createContext<BookContextValue | null>(null);

export function BookProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookReducer, initialState);

  const goToPage = useCallback((page: number) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);

  const nextPage = useCallback(() => {
    dispatch({ type: 'NEXT_PAGE' });
  }, []);

  const prevPage = useCallback(() => {
    dispatch({ type: 'PREV_PAGE' });
  }, []);

  const setZoom = useCallback((zoom: number) => {
    dispatch({ type: 'SET_ZOOM', payload: zoom });
  }, []);

  const zoomIn = useCallback(() => {
    dispatch({ type: 'ZOOM_IN' });
  }, []);

  const zoomOut = useCallback(() => {
    dispatch({ type: 'ZOOM_OUT' });
  }, []);

  const resetZoom = useCallback(() => {
    dispatch({ type: 'RESET_ZOOM' });
  }, []);

  const toggleSidebar = useCallback(() => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  }, []);

  const toggleEnhancementPanel = useCallback(() => {
    dispatch({ type: 'TOGGLE_ENHANCEMENT_PANEL' });
  }, []);

  const toggleEnhancementPanelFullscreen = useCallback(() => {
    dispatch({ type: 'TOGGLE_ENHANCEMENT_PANEL_FULLSCREEN' });
  }, []);

  const setActiveTab = useCallback((tab: BookState['activeTab']) => {
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
  }, []);

  const currentChapter = getChapterByPage(state.currentPage);
  const currentSection = getSectionByPage(state.currentPage);

  const value: BookContextValue = {
    ...state,
    goToPage,
    nextPage,
    prevPage,
    setZoom,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleSidebar,
    toggleEnhancementPanel,
    toggleEnhancementPanelFullscreen,
    setActiveTab,
    currentChapter,
    currentSection,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

export function useBook() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBook must be used within a BookProvider');
  }
  return context;
}
