import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for persisting state in localStorage with automatic serialization
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Get initial value from localStorage or use default
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when value changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Setter that handles function updates
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const newValue = value instanceof Function ? value(prev) : value;
      return newValue;
    });
  }, []);

  // Clear this specific key
  const clearValue = useCallback(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, clearValue];
}

/**
 * Hook for managing a Set in localStorage
 */
export function useLocalStorageSet<T extends string | number>(
  key: string
): [Set<T>, (item: T) => void, (item: T) => void, () => void] {
  const [items, setItems, clearItems] = useLocalStorage<T[]>(key, []);

  const add = useCallback(
    (item: T) => {
      setItems((prev) => {
        if (prev.includes(item)) return prev;
        return [...prev, item];
      });
    },
    [setItems]
  );

  const remove = useCallback(
    (item: T) => {
      setItems((prev) => prev.filter((i) => i !== item));
    },
    [setItems]
  );

  return [new Set(items), add, remove, clearItems];
}

/**
 * Hook for managing bookmarks
 */
export interface Bookmark {
  pageNumber: number;
  label: string;
  createdAt: string;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks, clearBookmarks] = useLocalStorage<Bookmark[]>(
    'category-theory-bookmarks',
    []
  );

  const addBookmark = useCallback(
    (pageNumber: number, label: string = `Page ${pageNumber}`) => {
      setBookmarks((prev) => {
        // Don't add duplicate bookmarks for the same page
        if (prev.some((b) => b.pageNumber === pageNumber)) {
          return prev;
        }
        return [
          ...prev,
          {
            pageNumber,
            label,
            createdAt: new Date().toISOString(),
          },
        ];
      });
    },
    [setBookmarks]
  );

  const removeBookmark = useCallback(
    (pageNumber: number) => {
      setBookmarks((prev) => prev.filter((b) => b.pageNumber !== pageNumber));
    },
    [setBookmarks]
  );

  const isBookmarked = useCallback(
    (pageNumber: number) => bookmarks.some((b) => b.pageNumber === pageNumber),
    [bookmarks]
  );

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    clearBookmarks,
  };
}

/**
 * Hook for managing notes per page
 */
export interface Note {
  id: string;
  pageNumber: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function useNotes() {
  const [notes, setNotes, clearNotes] = useLocalStorage<Note[]>(
    'category-theory-notes',
    []
  );

  const addNote = useCallback(
    (pageNumber: number, content: string) => {
      const now = new Date().toISOString();
      setNotes((prev) => [
        ...prev,
        {
          id: `note-${Date.now()}`,
          pageNumber,
          content,
          createdAt: now,
          updatedAt: now,
        },
      ]);
    },
    [setNotes]
  );

  const updateNote = useCallback(
    (noteId: string, content: string) => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === noteId
            ? { ...note, content, updatedAt: new Date().toISOString() }
            : note
        )
      );
    },
    [setNotes]
  );

  const deleteNote = useCallback(
    (noteId: string) => {
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    },
    [setNotes]
  );

  const getNotesForPage = useCallback(
    (pageNumber: number) => notes.filter((note) => note.pageNumber === pageNumber),
    [notes]
  );

  return {
    notes,
    addNote,
    updateNote,
    deleteNote,
    getNotesForPage,
    clearNotes,
  };
}
