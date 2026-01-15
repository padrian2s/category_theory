/**
 * Core TypeScript types for Category Theory concepts
 */

// Basic category components
export interface CategoryObject {
  id: string;
  label: string;
  x?: number;
  y?: number;
}

export interface Morphism {
  id: string;
  label: string;
  source: string; // Object ID
  target: string; // Object ID
}

export interface Category {
  id: string;
  name: string;
  objects: CategoryObject[];
  morphisms: Morphism[];
}

// Functor between categories
export interface Functor {
  id: string;
  name: string;
  sourceCategory: string;
  targetCategory: string;
  objectMapping: Map<string, string>; // source obj ID -> target obj ID
  morphismMapping: Map<string, string>; // source morph ID -> target morph ID
}

// Natural transformation between functors
export interface NaturalTransformation {
  id: string;
  name: string;
  sourceFunctor: string;
  targetFunctor: string;
  components: Map<string, string>; // object ID -> morphism ID
}

// Product/Coproduct structures
export interface Product {
  productObject: string;
  factors: string[];
  projections: string[]; // morphism IDs
}

export interface Coproduct {
  coproductObject: string;
  summands: string[];
  injections: string[]; // morphism IDs
}

// Book structure types
export interface Chapter {
  id: string;
  number: string; // "0", "1", "2", "A" for appendix
  title: string;
  startPage: number;
  endPage: number;
  sections: Section[];
}

export interface Section {
  id: string;
  number: string; // "1a", "1b", etc.
  title: string;
  startPage: number;
  endPage: number;
  concepts: string[]; // Key concepts covered
}

export interface BookStructure {
  title: string;
  author: string;
  totalPages: number;
  chapters: Chapter[];
}

// Enhancement types
export interface Example {
  id: string;
  title: string;
  description: string;
  math?: string; // KaTeX expression
  code?: string; // Programming example
  diagram?: CategoryDiagramData;
}

export interface Application {
  id: string;
  title: string;
  field: string; // "Computer Science", "Mathematics", etc.
  description: string;
  examples: string[];
}

export interface LearningPath {
  currentConcept: string;
  prerequisites: string[];
  nextConcepts: string[];
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  question: string;
  hints: string[];
  solution?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PageEnhancement {
  pageNumber: number;
  section: string;
  concepts: string[];
  examples: Example[];
  applications: Application[];
  simulatorType?: SimulatorType;
  learningPath: LearningPath;
}

export type SimulatorType =
  | 'category-builder'
  | 'morphism-composer'
  | 'functor-mapper'
  | 'product-builder'
  | 'diagram-chaser'
  | 'natural-transformation';

// D3 diagram data
export interface CategoryDiagramData {
  nodes: DiagramNode[];
  links: DiagramLink[];
}

export interface DiagramNode {
  id: string;
  label: string;
  x?: number;
  y?: number;
  type?: 'object' | 'product' | 'coproduct' | 'initial' | 'terminal';
}

export interface DiagramLink {
  id: string;
  source: string;
  target: string;
  label: string;
  type?: 'morphism' | 'identity' | 'composition' | 'projection' | 'injection';
  curved?: boolean;
}

// User progress tracking
export interface UserProgress {
  pagesViewed: Set<number>;
  bookmarks: Bookmark[];
  notes: Note[];
  exercisesCompleted: Set<string>;
  lastPage: number;
  lastVisit: Date;
}

export interface Bookmark {
  pageNumber: number;
  label: string;
  createdAt: Date;
}

export interface Note {
  id: string;
  pageNumber: number;
  content: string;
  position?: { x: number; y: number };
  createdAt: Date;
  updatedAt: Date;
}
