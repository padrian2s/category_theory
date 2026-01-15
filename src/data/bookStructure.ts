import { BookStructure, Chapter, Section } from '../utils/categoryTypes';

/**
 * Book structure based on "A Gentle Introduction to Category Theory"
 * by Maarten M. Fokkinga
 */

export const bookStructure: BookStructure = {
  title: 'A Gentle Introduction to Category Theory',
  author: 'Maarten M. Fokkinga',
  totalPages: 80,
  chapters: [
    {
      id: 'chapter-0',
      number: '0',
      title: 'Introduction',
      startPage: 5,
      endPage: 8,
      sections: [
        {
          id: 'sec-0-1',
          number: '0.1',
          title: 'Aim',
          startPage: 5,
          endPage: 5,
          concepts: ['motivation', 'goals'],
        },
        {
          id: 'sec-0-2',
          number: '0.2',
          title: 'Acknowledgements',
          startPage: 5,
          endPage: 5,
          concepts: [],
        },
        {
          id: 'sec-0-3',
          number: '0.3',
          title: 'Why category theory?',
          startPage: 5,
          endPage: 6,
          concepts: ['abstraction', 'uniformity', 'structure'],
        },
        {
          id: 'sec-0-4',
          number: '0.4',
          title: 'Notational conventions',
          startPage: 6,
          endPage: 8,
          concepts: ['notation', 'conventions', 'symbols'],
        },
      ],
    },
    {
      id: 'chapter-1',
      number: '1',
      title: 'The main concepts',
      startPage: 9,
      endPage: 32,
      sections: [
        {
          id: 'sec-1a',
          number: '1a',
          title: 'Categories',
          startPage: 9,
          endPage: 14,
          concepts: ['category', 'object', 'morphism', 'composition', 'identity', 'associativity'],
        },
        {
          id: 'sec-1b',
          number: '1b',
          title: 'Functors',
          startPage: 15,
          endPage: 20,
          concepts: ['functor', 'endofunctor', 'type preservation', 'composition preservation'],
        },
        {
          id: 'sec-1c',
          number: '1c',
          title: 'Naturality',
          startPage: 21,
          endPage: 27,
          concepts: ['natural transformation', 'naturality condition', 'polymorphism'],
        },
        {
          id: 'sec-1d',
          number: '1d',
          title: 'Adjunctions',
          startPage: 28,
          endPage: 30,
          concepts: ['adjunction', 'adjoint functors', 'unit', 'counit'],
        },
        {
          id: 'sec-1e',
          number: '1e',
          title: 'Duality',
          startPage: 31,
          endPage: 32,
          concepts: ['dual category', 'opposite category', 'duality principle'],
        },
      ],
    },
    {
      id: 'chapter-2',
      number: '2',
      title: 'Constructions in categories',
      startPage: 33,
      endPage: 60,
      sections: [
        {
          id: 'sec-2a',
          number: '2a',
          title: 'Iso, epic, and monic',
          startPage: 33,
          endPage: 35,
          concepts: ['isomorphism', 'epimorphism', 'monomorphism', 'invertibility'],
        },
        {
          id: 'sec-2b',
          number: '2b',
          title: 'Initiality and finality',
          startPage: 36,
          endPage: 39,
          concepts: ['initial object', 'terminal object', 'unique morphism'],
        },
        {
          id: 'sec-2c',
          number: '2c',
          title: 'Products and Sums',
          startPage: 40,
          endPage: 44,
          concepts: ['product', 'coproduct', 'sum', 'projection', 'injection', 'universal property'],
        },
        {
          id: 'sec-2d',
          number: '2d',
          title: 'Coequalisers',
          startPage: 45,
          endPage: 48,
          concepts: ['coequaliser', 'equaliser', 'quotient'],
        },
        {
          id: 'sec-2e',
          number: '2e',
          title: 'Colimits',
          startPage: 49,
          endPage: 60,
          concepts: ['colimit', 'limit', 'diagram', 'cone', 'cocone'],
        },
      ],
    },
    {
      id: 'appendix-a',
      number: 'A',
      title: 'More on adjointness',
      startPage: 61,
      endPage: 80,
      sections: [
        {
          id: 'sec-a',
          number: 'A',
          title: 'More on adjointness',
          startPage: 61,
          endPage: 80,
          concepts: ['adjunction properties', 'adjunction examples', 'Galois connection'],
        },
      ],
    },
  ],
};

/**
 * Get chapter by page number
 */
export function getChapterByPage(pageNumber: number): Chapter | undefined {
  return bookStructure.chapters.find(
    (ch) => pageNumber >= ch.startPage && pageNumber <= ch.endPage
  );
}

/**
 * Get section by page number
 */
export function getSectionByPage(pageNumber: number): Section | undefined {
  const chapter = getChapterByPage(pageNumber);
  if (!chapter) return undefined;

  return chapter.sections.find(
    (sec) => pageNumber >= sec.startPage && pageNumber <= sec.endPage
  );
}

/**
 * Get all concepts for a page
 */
export function getConceptsForPage(pageNumber: number): string[] {
  const section = getSectionByPage(pageNumber);
  return section?.concepts ?? [];
}

/**
 * Generate page image path
 * Uses import.meta.env.BASE_URL for GitHub Pages compatibility
 */
export function getPageImagePath(pageNumber: number): string {
  const paddedNum = String(pageNumber).padStart(2, '0');
  const baseUrl = import.meta.env.BASE_URL || '/';
  return `${baseUrl}pages/Category_Theory-${paddedNum}.png`;
}

/**
 * Check if page is front matter (title, TOC, etc.)
 */
export function isFrontMatter(pageNumber: number): boolean {
  return pageNumber < 5;
}

/**
 * Get table of contents items for navigation
 */
export function getTableOfContents() {
  return bookStructure.chapters.map((chapter) => ({
    id: chapter.id,
    label: `${chapter.number}. ${chapter.title}`,
    page: chapter.startPage,
    children: chapter.sections.map((section) => ({
      id: section.id,
      label: `${section.number} ${section.title}`,
      page: section.startPage,
    })),
  }));
}
