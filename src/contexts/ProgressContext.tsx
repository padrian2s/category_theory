import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLocalStorage, useLocalStorageSet, useBookmarks, useNotes, Bookmark, Note } from '../hooks/useLocalStorage';
import { useBook } from './BookContext';
import { bookStructure } from '../data/bookStructure';

interface ProgressState {
  // Pages viewed
  pagesViewed: Set<number>;
  markPageViewed: (page: number) => void;
  // Bookmarks
  bookmarks: Bookmark[];
  addBookmark: (page: number, label?: string) => void;
  removeBookmark: (page: number) => void;
  isBookmarked: (page: number) => boolean;
  // Notes
  notes: Note[];
  addNote: (page: number, content: string) => void;
  updateNote: (noteId: string, content: string) => void;
  deleteNote: (noteId: string) => void;
  getNotesForPage: (page: number) => Note[];
  // Progress stats
  totalPages: number;
  viewedCount: number;
  progressPercent: number;
  // Last visited
  lastPage: number;
  // Reset
  clearProgress: () => void;
}

const ProgressContext = createContext<ProgressState | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { currentPage } = useBook();
  const [pagesViewed, markViewed, , clearViewed] = useLocalStorageSet<number>('category-theory-viewed');
  const [lastPage, setLastPage] = useLocalStorage<number>('category-theory-last-page', 1);
  const { bookmarks, addBookmark, removeBookmark, isBookmarked, clearBookmarks } = useBookmarks();
  const { notes, addNote, updateNote, deleteNote, getNotesForPage, clearNotes } = useNotes();

  // Auto-mark current page as viewed
  useEffect(() => {
    markViewed(currentPage);
    setLastPage(currentPage);
  }, [currentPage, markViewed, setLastPage]);

  const totalPages = bookStructure.totalPages;
  const viewedCount = pagesViewed.size;
  const progressPercent = Math.round((viewedCount / totalPages) * 100);

  const clearProgress = () => {
    clearViewed();
    clearBookmarks();
    clearNotes();
    setLastPage(1);
  };

  const value: ProgressState = {
    pagesViewed,
    markPageViewed: markViewed,
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesForPage,
    totalPages,
    viewedCount,
    progressPercent,
    lastPage,
    clearProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
