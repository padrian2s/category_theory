/**
 * Page-by-page enhancement plan for "A Gentle Introduction to Category Theory"
 * Each page has specific examples, simulator configurations, and learning content
 */

import { SimulatorType } from '../utils/categoryTypes';

export interface PagePlan {
  pageNumber: number;
  section: string;
  title: string;
  concepts: string[];
  simulatorType: SimulatorType | null;
  exampleTypes: string[];
  applicationAreas: string[];
  exercises: number; // count of exercises to include
}

/**
 * Complete page-by-page enhancement plan
 */
export const pagePlans: PagePlan[] = [
  // ============================================================
  // FRONT MATTER (Pages 1-4)
  // ============================================================
  { pageNumber: 1, section: 'front', title: 'Title Page', concepts: [], simulatorType: null, exampleTypes: [], applicationAreas: [], exercises: 0 },
  { pageNumber: 2, section: 'front', title: 'Copyright', concepts: [], simulatorType: null, exampleTypes: [], applicationAreas: [], exercises: 0 },
  { pageNumber: 3, section: 'front', title: 'Contents', concepts: ['overview'], simulatorType: null, exampleTypes: ['book-structure'], applicationAreas: [], exercises: 0 },
  { pageNumber: 4, section: 'front', title: 'Contents (cont)', concepts: [], simulatorType: null, exampleTypes: [], applicationAreas: [], exercises: 0 },

  // ============================================================
  // CHAPTER 0: INTRODUCTION (Pages 5-8)
  // ============================================================
  {
    pageNumber: 5,
    section: '0',
    title: 'Introduction - Aim',
    concepts: ['motivation', 'goals', 'calculational-approach'],
    simulatorType: null,
    exampleTypes: ['motivation'],
    applicationAreas: ['computer-science', 'mathematics'],
    exercises: 0,
  },
  {
    pageNumber: 6,
    section: '0.3',
    title: 'Why Category Theory?',
    concepts: ['abstraction', 'uniformity', 'structural-concepts'],
    simulatorType: null,
    exampleTypes: ['abstraction-examples'],
    applicationAreas: ['type-systems', 'algebra', 'topology'],
    exercises: 1,
  },
  {
    pageNumber: 7,
    section: '0.4',
    title: 'Notational Conventions',
    concepts: ['notation', 'composition-order', 'typing'],
    simulatorType: null,
    exampleTypes: ['notation-examples'],
    applicationAreas: [],
    exercises: 0,
  },
  {
    pageNumber: 8,
    section: '0.4',
    title: 'Notational Conventions (cont)',
    concepts: ['function-notation', 'composition-notation'],
    simulatorType: null,
    exampleTypes: [],
    applicationAreas: [],
    exercises: 0,
  },

  // ============================================================
  // CHAPTER 1: THE MAIN CONCEPTS
  // Section 1a: Categories (Pages 9-14)
  // ============================================================
  {
    pageNumber: 9,
    section: '1a',
    title: 'Categories - Definition',
    concepts: ['category', 'object', 'morphism', 'typing'],
    simulatorType: 'category-builder',
    exampleTypes: ['set-category', 'basic-definition'],
    applicationAreas: ['type-systems'],
    exercises: 2,
  },
  {
    pageNumber: 10,
    section: '1a',
    title: 'Categories - Composition & Identity',
    concepts: ['composition', 'identity', 'associativity'],
    simulatorType: 'morphism-composer',
    exampleTypes: ['composition-examples', 'identity-examples'],
    applicationAreas: ['function-composition'],
    exercises: 2,
  },
  {
    pageNumber: 11,
    section: '1a',
    title: 'Categories - Axioms',
    concepts: ['category-axioms', 'well-typed-composition'],
    simulatorType: 'category-builder',
    exampleTypes: ['axiom-verification'],
    applicationAreas: ['verification'],
    exercises: 2,
  },
  {
    pageNumber: 12,
    section: '1a',
    title: 'Categories - Examples',
    concepts: ['Set', 'Rel', 'Fun', 'poset-category'],
    simulatorType: 'category-builder',
    exampleTypes: ['set-category', 'relation-category', 'poset-category'],
    applicationAreas: ['databases', 'relations'],
    exercises: 3,
  },
  {
    pageNumber: 13,
    section: '1a',
    title: 'Categories - More Examples',
    concepts: ['monoid-category', 'Alg', 'subcategory'],
    simulatorType: 'category-builder',
    exampleTypes: ['monoid-as-category', 'algebra-category'],
    applicationAreas: ['algebraic-structures'],
    exercises: 2,
  },
  {
    pageNumber: 14,
    section: '1a',
    title: 'Categories - Built Upon',
    concepts: ['subcategory', 'category-construction'],
    simulatorType: 'category-builder',
    exampleTypes: ['subcategory-examples'],
    applicationAreas: ['type-hierarchies'],
    exercises: 2,
  },

  // ============================================================
  // Section 1b: Functors (Pages 15-20)
  // ============================================================
  {
    pageNumber: 15,
    section: '1b',
    title: 'Functors - Definition',
    concepts: ['functor', 'object-mapping', 'morphism-mapping'],
    simulatorType: 'functor-mapper',
    exampleTypes: ['list-functor', 'identity-functor'],
    applicationAreas: ['container-types', 'generic-programming'],
    exercises: 2,
  },
  {
    pageNumber: 16,
    section: '1b',
    title: 'Functors - Laws',
    concepts: ['functor-laws', 'identity-preservation', 'composition-preservation'],
    simulatorType: 'functor-mapper',
    exampleTypes: ['functor-law-verification'],
    applicationAreas: ['functional-programming'],
    exercises: 3,
  },
  {
    pageNumber: 17,
    section: '1b',
    title: 'Functors - Examples',
    concepts: ['twin-functor', 'power-set-functor', 'forgetful-functor'],
    simulatorType: 'functor-mapper',
    exampleTypes: ['twin-functor', 'powerset-functor'],
    applicationAreas: ['data-structures'],
    exercises: 2,
  },
  {
    pageNumber: 18,
    section: '1b',
    title: 'Functors - Endofunctors',
    concepts: ['endofunctor', 'functor-composition'],
    simulatorType: 'functor-mapper',
    exampleTypes: ['endofunctor-examples'],
    applicationAreas: ['monads-intro'],
    exercises: 2,
  },
  {
    pageNumber: 19,
    section: '1b',
    title: 'Functors - Category Cat',
    concepts: ['Cat', 'functor-category'],
    simulatorType: 'functor-mapper',
    exampleTypes: ['category-of-categories'],
    applicationAreas: ['higher-category-theory'],
    exercises: 1,
  },
  {
    pageNumber: 20,
    section: '1b-1c',
    title: 'Functors to Naturality Transition',
    concepts: ['structure-preservation', 'naturality-intro'],
    simulatorType: 'natural-transformation',
    exampleTypes: ['join-transformation'],
    applicationAreas: ['polymorphism'],
    exercises: 2,
  },

  // ============================================================
  // Section 1c: Naturality (Pages 21-27)
  // ============================================================
  {
    pageNumber: 21,
    section: '1c',
    title: 'Naturality - Definition',
    concepts: ['natural-transformation', 'component', 'naturality-condition'],
    simulatorType: 'natural-transformation',
    exampleTypes: ['reverse-transformation', 'inits-transformation'],
    applicationAreas: ['polymorphic-functions'],
    exercises: 3,
  },
  {
    pageNumber: 22,
    section: '1c',
    title: 'Naturality - Formal Definition',
    concepts: ['ntrf-Type', 'Ntrf-law', 'naturality-square'],
    simulatorType: 'natural-transformation',
    exampleTypes: ['naturality-square-examples'],
    applicationAreas: ['type-theory'],
    exercises: 2,
  },
  {
    pageNumber: 23,
    section: '1c',
    title: 'Naturality - Examples',
    concepts: ['rev', 'inits', 'concat', 'tip'],
    simulatorType: 'natural-transformation',
    exampleTypes: ['sequence-transformations'],
    applicationAreas: ['list-operations'],
    exercises: 4,
  },
  {
    pageNumber: 24,
    section: '1c',
    title: 'Naturality - Polymorphism',
    concepts: ['parametric-polymorphism', 'free-theorem'],
    simulatorType: 'natural-transformation',
    exampleTypes: ['polymorphism-examples'],
    applicationAreas: ['programming-languages', 'type-inference'],
    exercises: 2,
  },
  {
    pageNumber: 25,
    section: '1c',
    title: 'Naturality - Composition',
    concepts: ['vertical-composition', 'horizontal-composition'],
    simulatorType: 'natural-transformation',
    exampleTypes: ['composition-of-transformations'],
    applicationAreas: ['functor-composition'],
    exercises: 2,
  },
  {
    pageNumber: 26,
    section: '1c',
    title: 'Naturality - Identity',
    concepts: ['identity-transformation', 'functor-category'],
    simulatorType: 'natural-transformation',
    exampleTypes: ['identity-natural-transformation'],
    applicationAreas: [],
    exercises: 1,
  },
  {
    pageNumber: 27,
    section: '1c',
    title: 'Naturality - Summary',
    concepts: ['naturality-summary'],
    simulatorType: 'natural-transformation',
    exampleTypes: [],
    applicationAreas: ['design-patterns'],
    exercises: 2,
  },

  // ============================================================
  // Section 1d: Adjunctions (Pages 28-30)
  // ============================================================
  {
    pageNumber: 28,
    section: '1d',
    title: 'Adjunctions - Introduction',
    concepts: ['adjunction', 'left-adjoint', 'right-adjoint'],
    simulatorType: 'functor-mapper',
    exampleTypes: ['free-forgetful-adjunction'],
    applicationAreas: ['free-structures'],
    exercises: 2,
  },
  {
    pageNumber: 29,
    section: '1d',
    title: 'Adjunctions - Definition',
    concepts: ['adjunction-definition', 'unit', 'counit'],
    simulatorType: 'functor-mapper',
    exampleTypes: ['adjunction-examples'],
    applicationAreas: ['galois-connections'],
    exercises: 2,
  },
  {
    pageNumber: 30,
    section: '1d',
    title: 'Adjunctions - Properties',
    concepts: ['adjunction-properties', 'universal-property'],
    simulatorType: 'functor-mapper',
    exampleTypes: ['currying-adjunction'],
    applicationAreas: ['currying', 'exponentials'],
    exercises: 2,
  },

  // ============================================================
  // Section 1e: Duality (Pages 31-32)
  // ============================================================
  {
    pageNumber: 31,
    section: '1e',
    title: 'Duality - Opposite Category',
    concepts: ['dual-category', 'opposite', 'arrow-reversal'],
    simulatorType: 'category-builder',
    exampleTypes: ['opposite-category-construction'],
    applicationAreas: ['contravariant-functors'],
    exercises: 2,
  },
  {
    pageNumber: 32,
    section: '1e',
    title: 'Duality - Duality Principle',
    concepts: ['duality-principle', 'dual-concepts'],
    simulatorType: 'category-builder',
    exampleTypes: ['product-coproduct-duality'],
    applicationAreas: ['dual-theorems'],
    exercises: 2,
  },

  // ============================================================
  // CHAPTER 2: CONSTRUCTIONS IN CATEGORIES
  // Section 2a: Iso, Epic, Monic (Pages 33-35)
  // ============================================================
  {
    pageNumber: 33,
    section: '2a',
    title: 'Isomorphism',
    concepts: ['isomorphism', 'inverse', 'iso-unique'],
    simulatorType: 'morphism-composer',
    exampleTypes: ['isomorphism-examples'],
    applicationAreas: ['equivalence', 'type-isomorphism'],
    exercises: 3,
  },
  {
    pageNumber: 34,
    section: '2a',
    title: 'Epimorphism',
    concepts: ['epimorphism', 'epic', 'surjection-generalization'],
    simulatorType: 'morphism-composer',
    exampleTypes: ['epic-examples'],
    applicationAreas: ['surjective-maps'],
    exercises: 2,
  },
  {
    pageNumber: 35,
    section: '2a',
    title: 'Monomorphism',
    concepts: ['monomorphism', 'monic', 'injection-generalization'],
    simulatorType: 'morphism-composer',
    exampleTypes: ['monic-examples'],
    applicationAreas: ['injective-maps', 'subobjects'],
    exercises: 2,
  },

  // ============================================================
  // Section 2b: Initiality and Finality (Pages 36-39)
  // ============================================================
  {
    pageNumber: 36,
    section: '2b',
    title: 'Initial Object',
    concepts: ['initial-object', 'unique-morphism-from'],
    simulatorType: 'category-builder',
    exampleTypes: ['empty-set-initial', 'zero-initial'],
    applicationAreas: ['empty-types', 'void'],
    exercises: 2,
  },
  {
    pageNumber: 37,
    section: '2b',
    title: 'Terminal Object',
    concepts: ['terminal-object', 'unique-morphism-to'],
    simulatorType: 'category-builder',
    exampleTypes: ['singleton-terminal', 'unit-type'],
    applicationAreas: ['unit-types', 'global-elements'],
    exercises: 2,
  },
  {
    pageNumber: 38,
    section: '2b',
    title: 'Initial Algebras',
    concepts: ['initial-algebra', 'catamorphism', 'fold'],
    simulatorType: 'category-builder',
    exampleTypes: ['list-initial-algebra', 'nat-initial-algebra'],
    applicationAreas: ['recursion-schemes', 'inductive-types'],
    exercises: 3,
  },
  {
    pageNumber: 39,
    section: '2b',
    title: 'Final Coalgebras',
    concepts: ['final-coalgebra', 'anamorphism', 'unfold'],
    simulatorType: 'category-builder',
    exampleTypes: ['stream-coalgebra'],
    applicationAreas: ['corecursion', 'coinductive-types'],
    exercises: 2,
  },

  // ============================================================
  // Section 2c: Products and Sums (Pages 40-44)
  // ============================================================
  {
    pageNumber: 40,
    section: '2c',
    title: 'Products - Definition',
    concepts: ['product', 'projection', 'universal-property'],
    simulatorType: 'product-builder',
    exampleTypes: ['cartesian-product', 'tuple-type'],
    applicationAreas: ['tuple-types', 'records'],
    exercises: 3,
  },
  {
    pageNumber: 41,
    section: '2c',
    title: 'Products - Pairing',
    concepts: ['pairing', 'product-morphism', 'fork'],
    simulatorType: 'product-builder',
    exampleTypes: ['pairing-examples'],
    applicationAreas: ['parallel-computation'],
    exercises: 2,
  },
  {
    pageNumber: 42,
    section: '2c',
    title: 'Coproducts - Definition',
    concepts: ['coproduct', 'sum', 'injection'],
    simulatorType: 'product-builder',
    exampleTypes: ['disjoint-union', 'either-type'],
    applicationAreas: ['sum-types', 'variants'],
    exercises: 3,
  },
  {
    pageNumber: 43,
    section: '2c',
    title: 'Coproducts - Case Analysis',
    concepts: ['case-analysis', 'coproduct-morphism', 'join'],
    simulatorType: 'product-builder',
    exampleTypes: ['case-examples'],
    applicationAreas: ['pattern-matching'],
    exercises: 2,
  },
  {
    pageNumber: 44,
    section: '2c',
    title: 'Products & Sums - Properties',
    concepts: ['product-sum-duality', 'distributivity'],
    simulatorType: 'product-builder',
    exampleTypes: ['distributivity-examples'],
    applicationAreas: ['algebraic-data-types'],
    exercises: 2,
  },

  // ============================================================
  // Section 2d: Coequalisers (Pages 45-48)
  // ============================================================
  {
    pageNumber: 45,
    section: '2d',
    title: 'Equalisers',
    concepts: ['equaliser', 'kernel', 'subobject'],
    simulatorType: 'diagram-chaser',
    exampleTypes: ['equaliser-set', 'kernel-examples'],
    applicationAreas: ['constraints', 'equations'],
    exercises: 2,
  },
  {
    pageNumber: 46,
    section: '2d',
    title: 'Coequalisers - Definition',
    concepts: ['coequaliser', 'quotient', 'equivalence-classes'],
    simulatorType: 'diagram-chaser',
    exampleTypes: ['quotient-set', 'coequaliser-examples'],
    applicationAreas: ['quotient-types', 'equivalence'],
    exercises: 2,
  },
  {
    pageNumber: 47,
    section: '2d',
    title: 'Coequalisers - Universal Property',
    concepts: ['coequaliser-universal-property'],
    simulatorType: 'diagram-chaser',
    exampleTypes: ['universal-property-verification'],
    applicationAreas: ['modular-arithmetic'],
    exercises: 2,
  },
  {
    pageNumber: 48,
    section: '2d',
    title: 'Coequalisers - Applications',
    concepts: ['pushout', 'coequaliser-applications'],
    simulatorType: 'diagram-chaser',
    exampleTypes: ['pushout-examples'],
    applicationAreas: ['gluing', 'merge-operations'],
    exercises: 2,
  },

  // ============================================================
  // Section 2e: Colimits (Pages 49-60)
  // ============================================================
  {
    pageNumber: 49,
    section: '2e',
    title: 'Limits - Introduction',
    concepts: ['limit', 'diagram', 'cone'],
    simulatorType: 'diagram-chaser',
    exampleTypes: ['limit-examples'],
    applicationAreas: ['universal-constructions'],
    exercises: 2,
  },
  {
    pageNumber: 50,
    section: '2e',
    title: 'Limits - Definition',
    concepts: ['limit-definition', 'limiting-cone'],
    simulatorType: 'diagram-chaser',
    exampleTypes: ['product-as-limit'],
    applicationAreas: [],
    exercises: 2,
  },
  {
    pageNumber: 51,
    section: '2e',
    title: 'Limits - Examples',
    concepts: ['pullback', 'equalizer-as-limit'],
    simulatorType: 'diagram-chaser',
    exampleTypes: ['pullback-examples'],
    applicationAreas: ['fiber-products'],
    exercises: 2,
  },
  {
    pageNumber: 52,
    section: '2e',
    title: 'Colimits - Introduction',
    concepts: ['colimit', 'cocone'],
    simulatorType: 'diagram-chaser',
    exampleTypes: ['colimit-examples'],
    applicationAreas: [],
    exercises: 2,
  },
  {
    pageNumber: 53,
    section: '2e',
    title: 'Colimits - Definition',
    concepts: ['colimit-definition', 'colimiting-cocone'],
    simulatorType: 'diagram-chaser',
    exampleTypes: ['coproduct-as-colimit'],
    applicationAreas: [],
    exercises: 2,
  },
  {
    pageNumber: 54,
    section: '2e',
    title: 'Colimits - Examples',
    concepts: ['pushout', 'coequalizer-as-colimit'],
    simulatorType: 'diagram-chaser',
    exampleTypes: ['pushout-construction'],
    applicationAreas: ['amalgamation'],
    exercises: 2,
  },
  {
    pageNumber: 55,
    section: '2e',
    title: 'Limit/Colimit Duality',
    concepts: ['limit-colimit-duality'],
    simulatorType: 'diagram-chaser',
    exampleTypes: ['duality-examples'],
    applicationAreas: [],
    exercises: 1,
  },
  {
    pageNumber: 56,
    section: '2e',
    title: 'Limits - Preservation',
    concepts: ['limit-preservation', 'continuous-functor'],
    simulatorType: 'diagram-chaser',
    exampleTypes: ['preservation-examples'],
    applicationAreas: ['functor-properties'],
    exercises: 2,
  },
  {
    pageNumber: 57,
    section: '2e',
    title: 'Colimits - Preservation',
    concepts: ['colimit-preservation', 'cocontinuous-functor'],
    simulatorType: 'diagram-chaser',
    exampleTypes: ['cocontinuity-examples'],
    applicationAreas: [],
    exercises: 2,
  },
  {
    pageNumber: 58,
    section: '2e',
    title: 'Limits - Creation',
    concepts: ['limit-creation', 'reflection'],
    simulatorType: 'diagram-chaser',
    exampleTypes: [],
    applicationAreas: [],
    exercises: 1,
  },
  {
    pageNumber: 59,
    section: '2e',
    title: 'Completeness',
    concepts: ['complete-category', 'cocomplete'],
    simulatorType: null,
    exampleTypes: ['complete-categories'],
    applicationAreas: [],
    exercises: 1,
  },
  {
    pageNumber: 60,
    section: '2e',
    title: 'Chapter 2 Summary',
    concepts: ['constructions-summary'],
    simulatorType: null,
    exampleTypes: [],
    applicationAreas: [],
    exercises: 0,
  },

  // ============================================================
  // APPENDIX A: MORE ON ADJOINTNESS (Pages 61-80)
  // ============================================================
  ...Array.from({ length: 20 }, (_, i) => ({
    pageNumber: 61 + i,
    section: 'A',
    title: `Adjointness - Part ${i + 1}`,
    concepts: ['adjunction-details', 'adjunction-properties'],
    simulatorType: 'functor-mapper' as SimulatorType,
    exampleTypes: ['adjunction-examples'],
    applicationAreas: ['galois-connections', 'free-constructions'],
    exercises: i < 15 ? 2 : 1,
  })),
];

/**
 * Get enhancement plan for a specific page
 */
export function getPagePlan(pageNumber: number): PagePlan | undefined {
  return pagePlans.find(p => p.pageNumber === pageNumber);
}

/**
 * Get all pages for a section
 */
export function getPagesForSection(section: string): PagePlan[] {
  return pagePlans.filter(p => p.section === section || p.section.startsWith(section));
}

/**
 * Get simulator type for current page
 */
export function getSimulatorForPage(pageNumber: number): SimulatorType | null {
  const plan = getPagePlan(pageNumber);
  return plan?.simulatorType ?? null;
}
