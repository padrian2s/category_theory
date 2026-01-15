import { useBook } from '../../contexts/BookContext';
import './TabContent.css';

interface ConceptNode {
  id: string;
  name: string;
  section: string;
  page: number;
  prerequisites: string[];
  description: string;
}

const conceptGraph: ConceptNode[] = [
  {
    id: 'category',
    name: 'Category',
    section: '1a',
    page: 9,
    prerequisites: [],
    description: 'The foundational concept: objects, morphisms, composition, and identity.',
  },
  {
    id: 'functor',
    name: 'Functor',
    section: '1b',
    page: 15,
    prerequisites: ['category'],
    description: 'Structure-preserving maps between categories.',
  },
  {
    id: 'natural-transformation',
    name: 'Natural Transformation',
    section: '1c',
    page: 21,
    prerequisites: ['functor'],
    description: 'Morphisms between functors that respect naturality.',
  },
  {
    id: 'adjunction',
    name: 'Adjunction',
    section: '1d',
    page: 28,
    prerequisites: ['functor', 'natural-transformation'],
    description: 'Pairs of functors with a special relationship.',
  },
  {
    id: 'duality',
    name: 'Duality',
    section: '1e',
    page: 31,
    prerequisites: ['category'],
    description: 'The principle of reversing arrows to get dual concepts.',
  },
  {
    id: 'isomorphism',
    name: 'Isomorphism',
    section: '2a',
    page: 33,
    prerequisites: ['category'],
    description: 'Invertible morphisms indicating structural equivalence.',
  },
  {
    id: 'initial-terminal',
    name: 'Initial & Terminal Objects',
    section: '2b',
    page: 36,
    prerequisites: ['category', 'isomorphism'],
    description: 'Objects with unique morphisms to/from all others.',
  },
  {
    id: 'product',
    name: 'Products & Coproducts',
    section: '2c',
    page: 40,
    prerequisites: ['category', 'duality'],
    description: 'Universal constructions for combining objects.',
  },
  {
    id: 'colimit',
    name: 'Colimits',
    section: '2e',
    page: 49,
    prerequisites: ['product', 'initial-terminal'],
    description: 'General construction subsuming coproducts and coequalisers.',
  },
];

export default function LearningPathTab() {
  const { goToPage, currentSection } = useBook();

  // Find current concept based on section
  const currentConcept = currentSection
    ? conceptGraph.find((c) => c.section === currentSection.number)
    : null;

  // Get prerequisite concepts
  const prerequisites = currentConcept
    ? conceptGraph.filter((c) => currentConcept.prerequisites.includes(c.id))
    : [];

  // Get concepts that depend on current
  const dependents = currentConcept
    ? conceptGraph.filter((c) => c.prerequisites.includes(currentConcept.id))
    : [];

  // Simple exercises based on current concept
  const exercises = currentConcept ? getExercisesForConcept(currentConcept.id) : [];

  return (
    <div className="tab-content learning-tab">
      <div className="tab-intro">
        <p>
          Track your learning progress and see how concepts connect.
          Master prerequisites before advancing to build solid foundations.
        </p>
      </div>

      {currentConcept && (
        <>
          <div className="current-concept">
            <h3>Current Concept</h3>
            <div className="concept-card current">
              <div className="concept-name">{currentConcept.name}</div>
              <p className="concept-description">{currentConcept.description}</p>
            </div>
          </div>

          {prerequisites.length > 0 && (
            <div className="prerequisites">
              <h3>Prerequisites</h3>
              <p className="text-sm text-muted">Review these concepts first:</p>
              <div className="concept-list">
                {prerequisites.map((prereq) => (
                  <button
                    key={prereq.id}
                    className="concept-card clickable"
                    onClick={() => goToPage(prereq.page)}
                  >
                    <div className="concept-name">{prereq.name}</div>
                    <span className="concept-section">Section {prereq.section}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {dependents.length > 0 && (
            <div className="next-concepts">
              <h3>Next Steps</h3>
              <p className="text-sm text-muted">After mastering this, explore:</p>
              <div className="concept-list">
                {dependents.map((dep) => (
                  <button
                    key={dep.id}
                    className="concept-card clickable"
                    onClick={() => goToPage(dep.page)}
                  >
                    <div className="concept-name">{dep.name}</div>
                    <span className="concept-section">Section {dep.section}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {exercises.length > 0 && (
            <div className="exercises">
              <h3>Practice Exercises</h3>
              {exercises.map((exercise, i) => (
                <div key={i} className="exercise-card">
                  <div className="exercise-number">Exercise {i + 1}</div>
                  <p className="exercise-question">{exercise.question}</p>
                  <details className="exercise-hint">
                    <summary>Hint</summary>
                    <p>{exercise.hint}</p>
                  </details>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!currentConcept && (
        <div className="no-concept">
          <p>Navigate to a section with category theory content to see the learning path.</p>
          <button className="btn btn-primary" onClick={() => goToPage(9)}>
            Start with Categories
          </button>
        </div>
      )}
    </div>
  );
}

function getExercisesForConcept(conceptId: string) {
  const exerciseBank: Record<string, { question: string; hint: string }[]> = {
    category: [
      {
        question: 'Verify that the collection of all groups with group homomorphisms forms a category.',
        hint: 'Check: Are homomorphisms closed under composition? Does the identity homomorphism exist?',
      },
      {
        question: 'Is the empty collection (no objects, no morphisms) a valid category?',
        hint: 'The category axioms are vacuously satisfied when there are no objects.',
      },
    ],
    functor: [
      {
        question: 'Show that the power set operation P: Set → Set is a functor.',
        hint: 'Define P on objects (P(A) = {subsets of A}) and on morphisms (direct image).',
      },
      {
        question: 'Prove that the composition of two functors is again a functor.',
        hint: 'Verify that (G ∘ F)(id) = id and (G ∘ F)(g ∘ f) = (G ∘ F)(g) ∘ (G ∘ F)(f).',
      },
    ],
    'natural-transformation': [
      {
        question: 'Find a natural transformation from the identity functor to the List functor.',
        hint: 'For each set A, you need η_A: A → List(A). Try the singleton list function.',
      },
    ],
    product: [
      {
        question: 'Show that in Set, the Cartesian product A × B satisfies the universal property of products.',
        hint: 'Given f: C → A and g: C → B, define ⟨f,g⟩: C → A × B as ⟨f,g⟩(c) = (f(c), g(c)).',
      },
    ],
  };

  return exerciseBank[conceptId] || [];
}
