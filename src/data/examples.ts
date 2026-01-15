/**
 * Comprehensive examples for all chapters of "A Gentle Introduction to Category Theory"
 */

export interface Example {
  id: string;
  title: string;
  description: string;
  details: string[];
  code?: string;
  mathNotation?: string;
}

export interface SectionExamples {
  sectionNumber: string;
  sectionTitle: string;
  examples: Example[];
}

// ============================================================
// CHAPTER 0: INTRODUCTION
// ============================================================

export const introductionExamples: SectionExamples = {
  sectionNumber: '0',
  sectionTitle: 'Introduction',
  examples: [
    {
      id: 'why-category-theory',
      title: 'Why Study Category Theory?',
      description: 'Category theory provides a unified language for mathematics and computer science.',
      details: [
        '**Abstraction**: Identifies common patterns across different mathematical structures',
        '**Unification**: Same concepts apply to sets, types, groups, topological spaces, etc.',
        '**Compositionality**: Everything is about composition of morphisms',
        '**Universal Properties**: Defines objects by their relationships, not internal structure',
      ],
      code: `// Category theory in programming:
// Instead of thinking about data structures,
// we think about transformations (functions)

// Same pattern applies everywhere:
const mapArray = <A, B>(f: (a: A) => B) => (arr: A[]): B[] => arr.map(f);
const mapPromise = <A, B>(f: (a: A) => B) => (p: Promise<A>): Promise<B> => p.then(f);
const mapOption = <A, B>(f: (a: A) => B) => (opt: A | null): B | null =>
  opt === null ? null : f(opt);

// All three follow the same "functor" pattern!`,
    },
    {
      id: 'notation-intro',
      title: 'Notation: Diagrammatic Composition',
      description: 'Fokkinga uses diagrammatic order: f;g means "first f, then g".',
      details: [
        '**Diagrammatic order**: f;g = g ∘ f (apply f first, then g)',
        '**Typing notation**: f: A → B means f takes input A, produces output B',
        '**Composition rule**: If f: A → B and g: B → C, then f;g: A → C',
        '**Identity**: id_A: A → A for every object A',
      ],
      code: `// In most programming, we use applicative order:
const f = (x: number) => x + 1;      // f: number → number
const g = (x: number) => x * 2;      // g: number → number

// Applicative order (standard): g(f(x)) or (g ∘ f)(x)
const gComposeF = (x: number) => g(f(x));  // = x => (x + 1) * 2

// Diagrammatic order (Fokkinga): f;g means f then g
// f;g(x) = g(f(x))
// This reads left-to-right like a pipeline: x → f → g → result

// Pipeline syntax (similar to diagrammatic):
const result = [1, 2, 3]
  .map(f)   // first f
  .map(g);  // then g`,
    },
  ],
};

// ============================================================
// CHAPTER 1a: CATEGORIES
// ============================================================

export const categoryExamples: SectionExamples = {
  sectionNumber: '1a',
  sectionTitle: 'Categories',
  examples: [
    {
      id: 'set-category',
      title: 'The Category Set',
      description: 'The category of sets and functions is the most familiar example.',
      details: [
        '**Objects**: All sets (e.g., {1,2,3}, {a,b}, ℕ, ℝ)',
        '**Morphisms**: Total functions between sets',
        '**Composition**: Function composition (g ∘ f)(x) = g(f(x))',
        '**Identity**: The identity function id_A(x) = x for each set A',
      ],
      code: `// In programming: types as objects, functions as morphisms
type A = number;
type B = string;
type C = boolean;

// A morphism f: A → B
const f = (n: number): string => n.toString();

// A morphism g: B → C
const g = (s: string): boolean => s.length > 0;

// Composition g ∘ f: A → C
const gf = (n: number): boolean => g(f(n));

// Identity morphism id_A: A → A
const idA = (n: number): number => n;

// Category laws:
// 1. id ∘ f = f = f ∘ id
// 2. (h ∘ g) ∘ f = h ∘ (g ∘ f)`,
    },
    {
      id: 'poset-category',
      title: 'Posets as Categories',
      description: 'Any partially ordered set forms a category.',
      details: [
        '**Objects**: Elements of the poset',
        '**Morphisms**: A unique morphism a → b exists iff a ≤ b',
        '**Composition**: Transitivity: a ≤ b and b ≤ c implies a ≤ c',
        '**Identity**: Reflexivity: a ≤ a for all a',
      ],
      code: `// The natural numbers with ≤ form a category
// Objects: 0, 1, 2, 3, ...
// Morphism 2 → 5 exists because 2 ≤ 5
// No morphism 5 → 2 because 5 ≰ 2

// In TypeScript: type hierarchy as a poset
class Animal { name = "animal"; }
class Dog extends Animal { breed = "unknown"; }
class Labrador extends Dog { color = "yellow"; }

// Labrador ≤ Dog ≤ Animal (subtype relation)
// Morphisms are implicit coercions:
const animalFromDog = (d: Dog): Animal => d;
const dogFromLabrador = (l: Labrador): Dog => l;
// Composition (transitivity):
const animalFromLabrador = (l: Labrador): Animal => animalFromDog(dogFromLabrador(l));`,
    },
    {
      id: 'monoid-category',
      title: 'Monoids as One-Object Categories',
      description: 'A monoid is a category with exactly one object.',
      details: [
        '**Objects**: A single object ★',
        '**Morphisms**: Elements of the monoid (all ★ → ★)',
        '**Composition**: The monoid operation',
        '**Identity**: The monoid identity element',
      ],
      code: `// The monoid (ℕ, +, 0) as a category
// Single object: ★
// Morphisms: 0, 1, 2, 3, ... (all ★ → ★)
// Composition: addition (3 ; 2 = 3 + 2 = 5)
// Identity: 0

// String concatenation monoid
type StringMorphism = string;

const identity: StringMorphism = "";
const compose = (a: StringMorphism, b: StringMorphism): StringMorphism => a + b;

// Verify monoid/category laws:
const x = "hello";
const y = "world";
const z = "!";

compose(identity, x) === x;              // Left identity
compose(x, identity) === x;              // Right identity
compose(compose(x, y), z) === compose(x, compose(y, z)); // Associativity`,
    },
    {
      id: 'graph-category',
      title: 'Free Category from a Graph',
      description: 'Any directed graph generates a free category.',
      details: [
        '**Objects**: Vertices/nodes of the graph',
        '**Morphisms**: Paths in the graph (including empty paths)',
        '**Composition**: Path concatenation',
        '**Identity**: Empty path at each vertex',
      ],
      code: `// Graph: A --f--> B --g--> C
//              \\        /
//               --h----

type Vertex = 'A' | 'B' | 'C';
type Edge = 'f' | 'g' | 'h';

// Free category has paths as morphisms:
type Path = Edge[];

const morphisms = {
  'A→A': [[]],                    // identity: empty path
  'A→B': [['f']],                 // single edge
  'A→C': [['f', 'g'], ['h']],     // two paths!
  'B→B': [[]],                    // identity
  'B→C': [['g']],
  'C→C': [[]],
};

// Composition is path concatenation
const composePaths = (p1: Path, p2: Path): Path => [...p1, ...p2];`,
    },
  ],
};

// ============================================================
// CHAPTER 1b: FUNCTORS
// ============================================================

export const functorExamples: SectionExamples = {
  sectionNumber: '1b',
  sectionTitle: 'Functors',
  examples: [
    {
      id: 'list-functor',
      title: 'The List Functor',
      description: 'List/Array is a functor from Set to Set.',
      details: [
        '**On objects**: A ↦ List[A] (a type to its list type)',
        '**On morphisms**: f: A → B ↦ map(f): List[A] → List[B]',
        '**Preserves identity**: map(id) = id',
        '**Preserves composition**: map(g ∘ f) = map(g) ∘ map(f)',
      ],
      code: `// List functor in TypeScript
// Object mapping: Type A → Type List<A>
type List<A> = A[];

// Morphism mapping: (A → B) → (List<A> → List<B>)
function fmap<A, B>(f: (a: A) => B): (list: A[]) => B[] {
  return (list) => list.map(f);
}

// Functor laws verification:
const numbers = [1, 2, 3];
const double = (n: number) => n * 2;
const addOne = (n: number) => n + 1;
const id = <T>(x: T) => x;

// Law 1: fmap(id) = id
JSON.stringify(fmap(id)(numbers)) === JSON.stringify(numbers);

// Law 2: fmap(g ∘ f) = fmap(g) ∘ fmap(f)
const composed = (n: number) => addOne(double(n));
JSON.stringify(fmap(composed)(numbers)) ===
  JSON.stringify(fmap(addOne)(fmap(double)(numbers)));`,
    },
    {
      id: 'maybe-functor',
      title: 'The Maybe/Option Functor',
      description: 'Maybe represents computations that might fail.',
      details: [
        '**On objects**: A ↦ Maybe[A] = A ∪ {Nothing}',
        '**On morphisms**: f ↦ fmap(f) where fmap(f)(Nothing) = Nothing',
        '**Nothing propagates**: Failure is preserved through the pipeline',
        '**Just transforms normally**: fmap(f)(Just(a)) = Just(f(a))',
      ],
      code: `// Maybe functor
type Maybe<A> = { tag: 'Just'; value: A } | { tag: 'Nothing' };

const just = <A>(value: A): Maybe<A> => ({ tag: 'Just', value });
const nothing: Maybe<never> = { tag: 'Nothing' };

// Functor map
function fmap<A, B>(f: (a: A) => B): (ma: Maybe<A>) => Maybe<B> {
  return (ma) => ma.tag === 'Nothing' ? nothing : just(f(ma.value));
}

// Usage: safe division
const safeDivide = (x: number, y: number): Maybe<number> =>
  y === 0 ? nothing : just(x / y);

const addTen = (n: number) => n + 10;

fmap(addTen)(safeDivide(20, 4));  // Just(15)
fmap(addTen)(safeDivide(20, 0));  // Nothing - error propagates!

// Composing safe operations:
const result = fmap((x: number) => x * 2)(
  fmap((x: number) => x + 1)(
    safeDivide(10, 2)
  )
); // Just(12)`,
    },
    {
      id: 'reader-functor',
      title: 'The Reader/Environment Functor',
      description: 'Reader represents computations that read from an environment.',
      details: [
        '**On objects**: A ↦ Reader[E, A] = E → A',
        '**On morphisms**: f: A → B ↦ (r: E → A) ↦ (e: E) → f(r(e))',
        '**Intuition**: Transforms the output while preserving environment dependency',
        '**Common use**: Dependency injection, configuration',
      ],
      code: `// Reader functor: Reader<E, A> = (env: E) => A
type Reader<E, A> = (env: E) => A;

// Functor map for Reader
function fmap<E, A, B>(f: (a: A) => B): (r: Reader<E, A>) => Reader<E, B> {
  return (reader) => (env) => f(reader(env));
}

// Example: Configuration-dependent computation
type Config = { apiUrl: string; timeout: number };

const getApiUrl: Reader<Config, string> = (cfg) => cfg.apiUrl;
const getTimeout: Reader<Config, number> = (cfg) => cfg.timeout;

// Transform the result
const getApiUrlUppercase = fmap((s: string) => s.toUpperCase())(getApiUrl);
const getTimeoutDoubled = fmap((n: number) => n * 2)(getTimeout);

const config: Config = { apiUrl: "https://api.example.com", timeout: 5000 };
getApiUrlUppercase(config);  // "HTTPS://API.EXAMPLE.COM"
getTimeoutDoubled(config);   // 10000`,
    },
    {
      id: 'contravariant-functor',
      title: 'Contravariant Functors',
      description: 'Some functors reverse the direction of morphisms.',
      details: [
        '**Covariant**: F(f: A → B) gives F(A) → F(B) (same direction)',
        '**Contravariant**: F(f: A → B) gives F(B) → F(A) (reversed!)',
        '**Example**: Predicate<A> = A → boolean is contravariant',
        '**Intuition**: Consumers of A are contravariant in A',
      ],
      code: `// Predicate is contravariant
type Predicate<A> = (a: A) => boolean;

// Contravariant map (contramap)
function contramap<A, B>(f: (b: B) => A): (pa: Predicate<A>) => Predicate<B> {
  return (predA) => (b) => predA(f(b));
}

// Example
const isPositive: Predicate<number> = (n) => n > 0;
const getLength = (s: string) => s.length;

// contramap "pulls back" the predicate through getLength
const hasPositiveLength: Predicate<string> = contramap(getLength)(isPositive);

hasPositiveLength("hello");  // true (length 5 > 0)
hasPositiveLength("");       // false (length 0 not > 0)

// Note: direction reversed!
// getLength: string → number
// but contramap(getLength): Predicate<number> → Predicate<string>`,
    },
  ],
};

// ============================================================
// CHAPTER 1c: NATURALITY
// ============================================================

export const naturalityExamples: SectionExamples = {
  sectionNumber: '1c',
  sectionTitle: 'Naturality',
  examples: [
    {
      id: 'list-reverse',
      title: 'List Reverse as Natural Transformation',
      description: 'reverse: List → List is a natural transformation from List functor to itself.',
      details: [
        '**Components**: rev_A: List[A] → List[A] for each type A',
        '**Naturality**: rev_B ∘ map(f) = map(f) ∘ rev_A',
        '**Intuition**: Reversing then mapping = mapping then reversing',
        '**Polymorphism**: Works uniformly for any element type',
      ],
      code: `// reverse is a natural transformation List → List
const reverse = <A>(list: A[]): A[] => [...list].reverse();
const map = <A, B>(f: (a: A) => B) => (list: A[]): B[] => list.map(f);

// Naturality condition: reverse ∘ map(f) = map(f) ∘ reverse
const numbers = [1, 2, 3, 4];
const double = (n: number) => n * 2;

// Path 1: map then reverse
const path1 = reverse(map(double)(numbers));  // [8, 6, 4, 2]

// Path 2: reverse then map
const path2 = map(double)(reverse(numbers));  // [8, 6, 4, 2]

// Both paths give same result! This is naturality.
JSON.stringify(path1) === JSON.stringify(path2);  // true

// This works for ANY function f, not just double!
// That's what makes it "natural"`,
    },
    {
      id: 'head-natural',
      title: 'head: List → Maybe (Partial)',
      description: 'Getting the first element is a natural transformation.',
      details: [
        '**Components**: head_A: List[A] → Maybe[A]',
        '**Naturality**: head_B ∘ List.map(f) = Maybe.map(f) ∘ head_A',
        '**Note**: Only for non-empty lists (partial function)',
        '**Programming**: safeHead returns Maybe to handle empty lists',
      ],
      code: `type Maybe<A> = { tag: 'Just'; value: A } | { tag: 'Nothing' };
const just = <A>(v: A): Maybe<A> => ({ tag: 'Just', value: v });
const nothing: Maybe<never> = { tag: 'Nothing' };

// head as natural transformation List → Maybe
const safeHead = <A>(list: A[]): Maybe<A> =>
  list.length === 0 ? nothing : just(list[0]);

const mapList = <A, B>(f: (a: A) => B) => (l: A[]): B[] => l.map(f);
const mapMaybe = <A, B>(f: (a: A) => B) => (m: Maybe<A>): Maybe<B> =>
  m.tag === 'Nothing' ? nothing : just(f(m.value));

// Naturality: safeHead ∘ mapList(f) = mapMaybe(f) ∘ safeHead
const nums = [10, 20, 30];
const toString = (n: number) => n.toString();

// Path 1: map over list, then take head
const path1 = safeHead(mapList(toString)(nums));  // Just("10")

// Path 2: take head, then map over Maybe
const path2 = mapMaybe(toString)(safeHead(nums)); // Just("10")

// Natural transformation: both paths agree!`,
    },
    {
      id: 'flatten-natural',
      title: 'flatten/join: List∘List → List',
      description: 'Flattening nested lists is a natural transformation (monad join).',
      details: [
        '**Components**: flatten_A: List[List[A]] → List[A]',
        '**Naturality**: flatten_B ∘ map(map(f)) = map(f) ∘ flatten_A',
        '**Monad connection**: This is the "join" operation of the List monad',
        '**Intuition**: Flattening structure commutes with transforming elements',
      ],
      code: `// flatten: List ∘ List → List (natural transformation)
const flatten = <A>(nested: A[][]): A[] => nested.flat();
const map = <A, B>(f: (a: A) => B) => (l: A[]): B[] => l.map(f);

// Naturality: flatten ∘ map(map(f)) = map(f) ∘ flatten
const nested = [[1, 2], [3, 4], [5]];
const double = (n: number) => n * 2;

// Path 1: map inside each list, then flatten
const mapInner = (ll: number[][]) => ll.map(l => map(double)(l));
const path1 = flatten(mapInner(nested));  // [2, 4, 6, 8, 10]

// Path 2: flatten first, then map
const path2 = map(double)(flatten(nested));  // [2, 4, 6, 8, 10]

// Both paths equal - that's naturality!

// This is the essence of monadic composition:
// flatMap(f) = flatten ∘ map(f)
const flatMap = <A, B>(f: (a: A) => B[]) => (l: A[]): B[] =>
  flatten(map(f)(l));`,
    },
    {
      id: 'polymorphism-naturality',
      title: 'Parametric Polymorphism = Naturality',
      description: 'Every parametrically polymorphic function is a natural transformation.',
      details: [
        '**Free Theorem**: Polymorphic functions satisfy naturality automatically',
        '**No type inspection**: Cannot behave differently based on type parameter',
        '**Uniform behavior**: Same algorithm for all types',
        '**Wadler\'s insight**: "Theorems for free" from parametricity',
      ],
      code: `// Any function with signature: forall A. F<A> → G<A>
// is automatically a natural transformation!

// Example: length: List<A> → Const<number, A>
const length = <A>(list: A[]): number => list.length;

// This satisfies naturality because it CANNOT inspect elements
// It must treat all A uniformly

// Example: duplicate: A → [A, A] (Identity → Pair)
const duplicate = <A>(a: A): [A, A] => [a, a];

// Naturality means:
// map(f)(duplicate(x)) = duplicate(f(x))
// [f(x), f(x)] = [f(x), f(x)] ✓

// Counter-example (NOT natural, NOT parametric):
// This function inspects the type - not allowed in pure parametric polymorphism
// const notNatural = <A>(list: A[]): A[] => {
//   if (typeof list[0] === 'number') return list.slice(0, 1);
//   return list;
// }`,
    },
  ],
};

// ============================================================
// CHAPTER 1d: ADJUNCTIONS
// ============================================================

export const adjunctionExamples: SectionExamples = {
  sectionNumber: '1d',
  sectionTitle: 'Adjunctions',
  examples: [
    {
      id: 'free-forgetful',
      title: 'Free-Forgetful Adjunction',
      description: 'The free monoid functor is left adjoint to the forgetful functor.',
      details: [
        '**Left adjoint**: Free: Set → Mon (creates free monoid = lists)',
        '**Right adjoint**: Forget: Mon → Set (forgets monoid structure)',
        '**Adjunction**: Hom_Mon(Free(A), M) ≅ Hom_Set(A, Forget(M))',
        '**Intuition**: Monoid homomorphisms from lists = functions from elements',
      ],
      code: `// Free monoid on set A = List<A>
// Monoid operation: concatenation
// Identity: empty list

type Monoid<M> = {
  empty: M;
  concat: (a: M, b: M) => M;
};

// The adjunction says:
// To define a monoid homomorphism Free(A) → M,
// you only need to specify where each element of A goes

// Example: sum all numbers (List<number> → number under +)
const numberAddMonoid: Monoid<number> = {
  empty: 0,
  concat: (a, b) => a + b
};

// Generator function: where each element goes
const gen = (n: number): number => n;

// Induced monoid homomorphism (this is the adjunction!)
const sumList = (list: number[]): number =>
  list.reduce((acc, x) => numberAddMonoid.concat(acc, gen(x)), numberAddMonoid.empty);

sumList([1, 2, 3, 4]);  // 10

// The adjunction guarantees this is a monoid homomorphism:
// sumList(xs.concat(ys)) === sumList(xs) + sumList(ys)`,
    },
    {
      id: 'curry-adjunction',
      title: 'Currying Adjunction',
      description: 'Product and exponential form an adjunction (currying).',
      details: [
        '**Left adjoint**: (– × A): Set → Set',
        '**Right adjoint**: (–)^A = (A → –): Set → Set',
        '**Adjunction**: Hom(B × A, C) ≅ Hom(B, C^A)',
        '**This is currying!**: (B × A → C) ≅ (B → A → C)',
      ],
      code: `// The currying adjunction: (B × A → C) ≅ (B → (A → C))

// curry: (B × A → C) → (B → A → C)
const curry = <A, B, C>(f: (pair: [B, A]) => C) =>
  (b: B) => (a: A) => f([b, a]);

// uncurry: (B → A → C) → (B × A → C)
const uncurry = <A, B, C>(f: (b: B) => (a: A) => C) =>
  (pair: [B, A]) => f(pair[0])(pair[1]);

// These are natural isomorphisms (the adjunction)
const add = (pair: [number, number]) => pair[0] + pair[1];
const curriedAdd = curry(add);

curriedAdd(3)(5);  // 8
uncurry(curriedAdd)([3, 5]);  // 8

// Unit of adjunction (η): B → (B × A → A)
const unit = <A, B>(b: B) => (a: A) => a;  // projection!

// Counit of adjunction (ε): (A → C) × A → C
const counit = <A, C>(pair: [(a: A) => C, A]) => pair[0](pair[1]);  // evaluation!`,
    },
    {
      id: 'galois-connection',
      title: 'Galois Connections',
      description: 'Adjunctions between posets are called Galois connections.',
      details: [
        '**Poset adjunction**: L ⊣ R means L(a) ≤ b ⟺ a ≤ R(b)',
        '**Floor-Ceiling**: ⌊x⌋ ≤ n ⟺ x ≤ n (for reals and integers)',
        '**Abstract interpretation**: Abstraction ⊣ Concretization',
        '**Closure operators**: L;R is always a closure operator',
      ],
      code: `// Galois connection: floor ⊣ inclusion
// floor: Real → Int (round down)
// inclusion: Int → Real (embed integers in reals)

// floor(x) ≤ n  ⟺  x ≤ inclusion(n) = n

// In programming: abstraction/concretization
type Concrete = Set<number>;  // actual values
type Abstract = 'positive' | 'negative' | 'zero' | 'unknown';

// Abstraction (left adjoint)
const abstract_ = (s: Set<number>): Abstract => {
  const arr = [...s];
  if (arr.length === 0) return 'unknown';
  if (arr.every(n => n > 0)) return 'positive';
  if (arr.every(n => n < 0)) return 'negative';
  if (arr.every(n => n === 0)) return 'zero';
  return 'unknown';
};

// Concretization (right adjoint)
const concretize = (a: Abstract): Set<number> => {
  switch (a) {
    case 'positive': return new Set([1, 2, 3]); // representative
    case 'negative': return new Set([-1, -2, -3]);
    case 'zero': return new Set([0]);
    case 'unknown': return new Set([-1, 0, 1]);
  }
};

// Adjunction: abstract(S) ⊑ A  ⟺  S ⊆ concretize(A)`,
    },
  ],
};

// ============================================================
// CHAPTER 1e: DUALITY
// ============================================================

export const dualityExamples: SectionExamples = {
  sectionNumber: '1e',
  sectionTitle: 'Duality',
  examples: [
    {
      id: 'opposite-category',
      title: 'The Opposite Category',
      description: 'For any category C, we can form C^op by reversing all arrows.',
      details: [
        '**Same objects**: Obj(C^op) = Obj(C)',
        '**Reversed arrows**: f: A → B in C becomes f: B → A in C^op',
        '**Reversed composition**: f ;_{C^op} g = g ;_C f',
        '**Involution**: (C^op)^op = C',
      ],
      code: `// Original category: functions
type Fn<A, B> = (a: A) => B;

// In Set: morphism from A to B is a function A → B
const f: Fn<number, string> = n => n.toString();
const g: Fn<string, boolean> = s => s.length > 0;

// Composition in Set: g ∘ f : number → boolean
const gf: Fn<number, boolean> = n => g(f(n));

// In Set^op: the same morphism f goes from string to number!
// (objects same, arrows reversed)

// What lives naturally in Set^op?
// Contravariant functors on Set = Covariant functors on Set^op

// Example: Predicate<A> = A → bool is contravariant
// In Set^op, it becomes covariant!

type Predicate<A> = (a: A) => boolean;
// f: A → B in Set gives contramap: Predicate<B> → Predicate<A>
// Same f: B → A in Set^op gives map: Predicate<B> → Predicate<A> (covariant!)`,
    },
    {
      id: 'dual-concepts',
      title: 'Dual Concepts',
      description: 'Many concepts come in dual pairs.',
      details: [
        '**Product ↔ Coproduct**: A × B ↔ A + B',
        '**Terminal ↔ Initial**: 1 ↔ 0',
        '**Monomorphism ↔ Epimorphism**: monic ↔ epic',
        '**Limit ↔ Colimit**: cone ↔ cocone',
      ],
      code: `// Product (in Set): Cartesian product with projections
type Product<A, B> = { fst: A; snd: B };
const fst = <A, B>(p: Product<A, B>): A => p.fst;  // projection
const snd = <A, B>(p: Product<A, B>): B => p.snd;

// Coproduct (in Set): Disjoint union with injections
type Coproduct<A, B> =
  | { tag: 'left'; value: A }
  | { tag: 'right'; value: B };
const inl = <A, B>(a: A): Coproduct<A, B> => ({ tag: 'left', value: a });
const inr = <A, B>(b: B): Coproduct<A, B> => ({ tag: 'right', value: b });

// Product universal property: fork
const fork = <X, A, B>(f: (x: X) => A, g: (x: X) => B) =>
  (x: X): Product<A, B> => ({ fst: f(x), snd: g(x) });

// Coproduct universal property: case (dual of fork!)
const case_ = <A, B, Y>(f: (a: A) => Y, g: (b: B) => Y) =>
  (c: Coproduct<A, B>): Y => c.tag === 'left' ? f(c.value) : g(c.value);

// Notice the duality:
// fork:  (X → A) × (X → B) → (X → A × B)
// case:  (A → Y) × (B → Y) → (A + B → Y)`,
    },
    {
      id: 'duality-principle',
      title: 'The Duality Principle',
      description: 'Every theorem has a dual theorem obtained by reversing arrows.',
      details: [
        '**Automatic theorems**: Prove once, get dual for free',
        '**Reverse everything**: Objects stay, arrows reverse, ∘ reverses',
        '**Example**: "every iso is monic" dualizes to "every iso is epic"',
        '**Co-prefix**: Dual concepts often get "co-" prefix',
      ],
      code: `// Theorem: Every isomorphism is a monomorphism
// If f: A → B is iso with inverse g, then f is monic
// Proof: f∘h = f∘k ⟹ g∘f∘h = g∘f∘k ⟹ h = k

// DUAL Theorem: Every isomorphism is an epimorphism
// (automatically true by duality!)
// If f: A → B is iso, then f is epic
// Proof: h∘f = k∘f ⟹ h∘f∘g = k∘f∘g ⟹ h = k

// In code:
interface Iso<A, B> {
  to: (a: A) => B;
  from: (b: B) => A;
}

// Monic: f is monic if f(x) = f(y) implies x = y
// Epic: f is epic if for all h,k: h∘f = k∘f implies h = k

const exampleIso: Iso<number, string> = {
  to: n => n.toString(),
  from: s => parseInt(s) || 0
};

// Both monic and epic (in appropriate sense)
// to is injective (monic): different numbers → different strings
// to is surjective onto its image (epic when restricted)`,
    },
  ],
};

// ============================================================
// CHAPTER 2a: ISO, EPIC, MONIC
// ============================================================

export const isoEpicMonicExamples: SectionExamples = {
  sectionNumber: '2a',
  sectionTitle: 'Iso, Epic, and Monic',
  examples: [
    {
      id: 'isomorphism',
      title: 'Isomorphisms',
      description: 'An isomorphism is a morphism with a two-sided inverse.',
      details: [
        '**Definition**: f: A → B is iso if ∃g: B → A with g∘f = id_A and f∘g = id_B',
        '**Unique inverse**: The inverse g is unique',
        '**In Set**: Bijective functions (one-to-one and onto)',
        '**Type isomorphism**: Types with same information content',
      ],
      code: `// Isomorphism: bijection with explicit inverse
interface Iso<A, B> {
  to: (a: A) => B;
  from: (b: B) => A;
}

// Example: Celsius ↔ Fahrenheit
const tempIso: Iso<number, number> = {
  to: c => c * 9/5 + 32,    // Celsius to Fahrenheit
  from: f => (f - 32) * 5/9  // Fahrenheit to Celsius
};

// Verify: from(to(x)) = x and to(from(y)) = y
tempIso.from(tempIso.to(100));  // 100
tempIso.to(tempIso.from(212));  // 212

// Type isomorphism: (A × B) → C ≅ A → B → C (currying!)
const curryIso = <A, B, C>(): Iso<(pair: [A, B]) => C, (a: A) => (b: B) => C> => ({
  to: f => a => b => f([a, b]),
  from: g => ([a, b]) => g(a)(b)
});

// Isomorphic types have "the same structure"
// Maybe<A> ≅ 1 + A (Option is unit plus A)`,
    },
    {
      id: 'monomorphism',
      title: 'Monomorphisms (Injective)',
      description: 'A monomorphism is a "left-cancellable" morphism.',
      details: [
        '**Definition**: f: A → B is monic if f∘g = f∘h ⟹ g = h',
        '**In Set**: Injective functions (one-to-one)',
        '**Intuition**: f doesn\'t "collapse" different inputs',
        '**Notation**: A ↣ B (arrow with tail)',
      ],
      code: `// Monomorphism: injective, left-cancellable

// In Set: f is monic iff f(x) = f(y) implies x = y
const isInjective = <A, B>(f: (a: A) => B, domain: A[]): boolean => {
  const outputs = domain.map(f);
  return new Set(outputs.map(JSON.stringify)).size === domain.length;
};

// Example: monic
const double = (n: number) => n * 2;
// double(x) = double(y) ⟹ x = y  ✓ (monic)

// Example: not monic
const absolute = (n: number) => Math.abs(n);
// absolute(-3) = absolute(3) = 3, but -3 ≠ 3  ✗ (not monic)

// In programming: constructors are often monic
type Maybe<A> = { tag: 'Just'; value: A } | { tag: 'Nothing' };
const just = <A>(a: A): Maybe<A> => ({ tag: 'Just', value: a });
// just is monic: just(x) = just(y) implies x = y

// Subtype embeddings are monic
// Dog → Animal is monic (each dog maps to unique animal)`,
    },
    {
      id: 'epimorphism',
      title: 'Epimorphisms (Surjective)',
      description: 'An epimorphism is a "right-cancellable" morphism.',
      details: [
        '**Definition**: f: A → B is epic if g∘f = h∘f ⟹ g = h',
        '**In Set**: Surjective functions (onto)',
        '**Intuition**: f "covers" all of B',
        '**Warning**: Epic ≠ surjective in general categories!',
      ],
      code: `// Epimorphism: surjective, right-cancellable

// In Set: f is epic iff for all b ∈ B, exists a ∈ A with f(a) = b
const isSurjective = <A, B>(f: (a: A) => B, domain: A[], codomain: B[]): boolean => {
  const outputs = new Set(domain.map(f).map(JSON.stringify));
  return codomain.every(b => outputs.has(JSON.stringify(b)));
};

// Example: epic (surjective)
const mod2 = (n: number) => n % 2;  // onto {0, 1}
// Every element of {0, 1} is hit: 0 → 0, 1 → 1

// Example: not epic
const double = (n: number) => n * 2;
// Not surjective onto all integers: 3 is never hit

// Important: Epic doesn't always mean surjective!
// In Ring category: ℤ → ℚ (integers to rationals)
// is epic but NOT surjective

// In programming: pattern matching elimination is often epic
const fromEither = <A>(e: Either<A, A>): A =>
  e.tag === 'left' ? e.value : e.value;
// This is epic: both paths lead to A`,
    },
    {
      id: 'split-mono-epi',
      title: 'Split Mono and Split Epi',
      description: 'A morphism is split if it has a one-sided inverse.',
      details: [
        '**Split mono**: f: A → B with g∘f = id_A (has left inverse)',
        '**Split epi**: f: A → B with f∘g = id_B (has right inverse)',
        '**Section/Retraction**: Split mono is section, split epi is retraction',
        '**In Set**: Split epi requires choice, split mono always exists for non-empty',
      ],
      code: `// Split monomorphism: has a left inverse (retraction)
// Split epimorphism: has a right inverse (section)

// Example: projection is split epi, injection is split mono

// fst: A × B → A is split epi
const fst = <A, B>(p: [A, B]): A => p[0];
// Section: a ↦ (a, default_b) is right inverse

// inl: A → A + B is split mono
type Either<A, B> = { tag: 'left'; value: A } | { tag: 'right'; value: B };
const inl = <A, B>(a: A): Either<A, B> => ({ tag: 'left', value: a });
// Retraction: extract left value (partial!) is left inverse

// Full example:
const pair = <A, B>(a: A, b: B): [A, B] => [a, b];
const pairWithDefault = <A>(a: A): [A, number] => pair(a, 0);

// fst ∘ pairWithDefault = id_A  (pairWithDefault is section of fst)
// fst(pairWithDefault(5)) = fst([5, 0]) = 5

// Note: iso = split mono + split epi (with same inverse)`,
    },
  ],
};

// ============================================================
// CHAPTER 2b: INITIALITY AND FINALITY
// ============================================================

export const initialityFinalityExamples: SectionExamples = {
  sectionNumber: '2b',
  sectionTitle: 'Initiality and Finality',
  examples: [
    {
      id: 'initial-object',
      title: 'Initial Objects',
      description: 'An initial object has exactly one morphism to every object.',
      details: [
        '**Definition**: 0 is initial if for all A, ∃! morphism 0 → A',
        '**In Set**: Empty set ∅ (no elements, unique empty function)',
        '**In types**: Void/Never type (no values)',
        '**Uniqueness**: Initial objects are unique up to isomorphism',
      ],
      code: `// Initial object: exactly one morphism to any object

// In Set: the empty set ∅
// The unique function ∅ → A is the empty function

// In TypeScript: 'never' type
type Void = never;

// The unique function from Void to any type
const absurd = <A>(v: Void): A => {
  // This function exists but can never be called!
  // There are no values of type 'never'
  return v;  // TypeScript allows this
};

// Why unique? There's only ONE way to map zero things!
// Any two functions ∅ → A must be equal (vacuously)

// Initial in Poset: the bottom element ⊥
// ⊥ ≤ a for all a

// Initial in Category of Monoids: trivial monoid {e}
// Unique homomorphism sends e to identity of target`,
    },
    {
      id: 'terminal-object',
      title: 'Terminal Objects',
      description: 'A terminal object has exactly one morphism from every object.',
      details: [
        '**Definition**: 1 is terminal if for all A, ∃! morphism A → 1',
        '**In Set**: Any singleton set {★}',
        '**In types**: Unit type ()',
        '**Duality**: Terminal in C = Initial in C^op',
      ],
      code: `// Terminal object: exactly one morphism from any object

// In Set: any singleton {★}
// The unique function A → {★} sends everything to ★

// In TypeScript: unit type
type Unit = null;
const unit: Unit = null;

// The unique function from any type to Unit
const terminal = <A>(a: A): Unit => null;

// Why unique? There's only ONE way to map to one thing!
// All elements must go to the single element

// Global elements: morphisms 1 → A correspond to elements of A
// In Set: functions {★} → A pick out one element
const pickThree: (u: Unit) => number = (_) => 3;
// This "is" the element 3

// Terminal in Poset: the top element ⊤
// a ≤ ⊤ for all a

// Terminal in types: () (unit)
// Every function A → () is the same (const ())`,
    },
    {
      id: 'initial-algebra',
      title: 'Initial Algebras',
      description: 'Initial algebras give us recursive data types.',
      details: [
        '**F-algebra**: Object A with morphism F(A) → A',
        '**Initial F-algebra**: The "least fixed point" of F',
        '**Lists**: Initial algebra for F(X) = 1 + A × X',
        '**Catamorphism**: The unique fold from initial algebra',
      ],
      code: `// F-algebra: a structure map F(A) → A
// For lists: F(X) = 1 + (Elem × X)

// List is the initial (1 + A × _)-algebra
type ListF<A, X> = { tag: 'nil' } | { tag: 'cons'; head: A; tail: X };

// The algebra structure: ListF<A, List<A>> → List<A>
// nil ↦ []
// cons(a, xs) ↦ [a, ...xs]

type List<A> = A[];

// Catamorphism: unique fold from initial algebra
// Given any algebra g: ListF<A, B> → B, there's unique h: List<A> → B
const cata = <A, B>(
  nilCase: B,
  consCase: (head: A, accum: B) => B
) => (list: List<A>): B => {
  let result = nilCase;
  for (let i = list.length - 1; i >= 0; i--) {
    result = consCase(list[i], result);
  }
  return result;
};

// Examples of catamorphisms (folds):
const sum = cata<number, number>(0, (h, t) => h + t);
const length = cata<unknown, number>(0, (_, t) => 1 + t);
const reverse = <A>() => cata<A, A[]>([], (h, t) => [...t, h]);

sum([1, 2, 3, 4]);      // 10
length([1, 2, 3, 4]);   // 4
reverse<number>()([1, 2, 3]);  // [3, 2, 1]`,
    },
    {
      id: 'final-coalgebra',
      title: 'Final Coalgebras',
      description: 'Final coalgebras give us infinite/lazy data structures.',
      details: [
        '**F-coalgebra**: Object A with morphism A → F(A)',
        '**Final F-coalgebra**: The "greatest fixed point" of F',
        '**Streams**: Final coalgebra for F(X) = A × X',
        '**Anamorphism**: The unique unfold to final coalgebra',
      ],
      code: `// F-coalgebra: an observation map A → F(A)
// For streams: F(X) = A × X (head and tail)

// Stream is the final (A × _)-coalgebra
interface Stream<A> {
  head: () => A;
  tail: () => Stream<A>;
}

// Anamorphism: unique unfold to final coalgebra
const ana = <A, S>(
  getHead: (s: S) => A,
  getTail: (s: S) => S
) => (seed: S): Stream<A> => ({
  head: () => getHead(seed),
  tail: () => ana(getHead, getTail)(getTail(seed))
});

// Infinite stream of natural numbers
const nats: Stream<number> = ana<number, number>(
  n => n,      // head: the number itself
  n => n + 1   // tail: increment
)(0);

nats.head();           // 0
nats.tail().head();    // 1
nats.tail().tail().head();  // 2

// Take first n elements
const take = <A>(n: number, s: Stream<A>): A[] => {
  const result: A[] = [];
  let current = s;
  for (let i = 0; i < n; i++) {
    result.push(current.head());
    current = current.tail();
  }
  return result;
};

take(5, nats);  // [0, 1, 2, 3, 4]`,
    },
  ],
};

// ============================================================
// CHAPTER 2c: PRODUCTS AND SUMS
// ============================================================

export const productsSumsExamples: SectionExamples = {
  sectionNumber: '2c',
  sectionTitle: 'Products and Sums',
  examples: [
    {
      id: 'categorical-product',
      title: 'Categorical Products',
      description: 'Products are defined by their universal property.',
      details: [
        '**Projections**: π₁: A×B → A and π₂: A×B → B',
        '**Universal property**: For any f: X → A, g: X → B, ∃! ⟨f,g⟩: X → A×B',
        '**Pairing**: ⟨f,g⟩ satisfies π₁∘⟨f,g⟩ = f and π₂∘⟨f,g⟩ = g',
        '**In Set**: Cartesian product {(a,b) | a ∈ A, b ∈ B}',
      ],
      code: `// Product with universal property

type Product<A, B> = [A, B];

// Projections
const fst = <A, B>(p: Product<A, B>): A => p[0];
const snd = <A, B>(p: Product<A, B>): B => p[1];

// Universal property: pairing (fork)
const pair = <X, A, B>(f: (x: X) => A, g: (x: X) => B) =>
  (x: X): Product<A, B> => [f(x), g(x)];

// Verify universal property:
// fst ∘ pair(f, g) = f
// snd ∘ pair(f, g) = g

const double = (n: number) => n * 2;
const toString = (n: number) => n.toString();
const both = pair(double, toString);

both(5);        // [10, "5"]
fst(both(5));   // 10 = double(5) ✓
snd(both(5));   // "5" = toString(5) ✓

// Product of morphisms: f × g
const prodMap = <A, B, C, D>(f: (a: A) => C, g: (b: B) => D) =>
  (p: Product<A, B>): Product<C, D> => [f(p[0]), g(p[1])];

prodMap(double, toString)([3, 4]);  // [6, "4"]`,
    },
    {
      id: 'categorical-coproduct',
      title: 'Categorical Coproducts (Sums)',
      description: 'Coproducts are the dual of products.',
      details: [
        '**Injections**: ι₁: A → A+B and ι₂: B → A+B',
        '**Universal property**: For any f: A → X, g: B → X, ∃! [f,g]: A+B → X',
        '**Case analysis**: [f,g] satisfies [f,g]∘ι₁ = f and [f,g]∘ι₂ = g',
        '**In Set**: Disjoint union A ⊔ B',
      ],
      code: `// Coproduct (sum type) with universal property

type Coproduct<A, B> =
  | { tag: 'left'; value: A }
  | { tag: 'right'; value: B };

// Injections
const inl = <A, B>(a: A): Coproduct<A, B> => ({ tag: 'left', value: a });
const inr = <A, B>(b: B): Coproduct<A, B> => ({ tag: 'right', value: b });

// Universal property: case analysis (either)
const either = <A, B, X>(f: (a: A) => X, g: (b: B) => X) =>
  (c: Coproduct<A, B>): X =>
    c.tag === 'left' ? f(c.value) : g(c.value);

// Verify universal property:
// either(f, g) ∘ inl = f
// either(f, g) ∘ inr = g

const showNum = (n: number) => \`Number: \${n}\`;
const showStr = (s: string) => \`String: \${s}\`;
const show = either(showNum, showStr);

show(inl(42));      // "Number: 42" = showNum(42) ✓
show(inr("hi"));    // "String: hi" = showStr("hi") ✓

// Coproduct of morphisms: f + g
const coprodMap = <A, B, C, D>(f: (a: A) => C, g: (b: B) => D) =>
  (c: Coproduct<A, B>): Coproduct<C, D> =>
    c.tag === 'left' ? inl(f(c.value)) : inr(g(c.value));`,
    },
    {
      id: 'product-coproduct-duality',
      title: 'Product-Coproduct Duality',
      description: 'Products and coproducts are dual concepts.',
      details: [
        '**Arrows reversed**: Product in C = Coproduct in C^op',
        '**Fork ↔ Case**: Universal morphisms are dual',
        '**π₁, π₂ ↔ ι₁, ι₂**: Projections dual to injections',
        '**In logic**: A ∧ B (and) ↔ A ∨ B (or)',
      ],
      code: `// Duality between Products and Coproducts

// PRODUCT: morphisms go OUT
//       π₁
// A ←------- A × B -------→ B
//               π₂
// Universal: X → A and X → B induce X → A×B

// COPRODUCT: morphisms go IN
//       ι₁
// A --------→ A + B ←------- B
//               ι₂
// Universal: A → X and B → X induce A+B → X

// The dualities:
// Product             | Coproduct
// ------------------- | -------------------
// A × B               | A + B
// fst, snd            | inl, inr
// pair(f, g)          | either(f, g)
// X → A × B           | A + B → X
// f × g               | f + g

// In logic (Curry-Howard):
// A × B = A ∧ B (conjunction, "and")
// A + B = A ∨ B (disjunction, "or")

// Introduction and elimination are dual:
// pair introduces ×    | either eliminates +
// fst/snd eliminate ×  | inl/inr introduce +

// Example: Distributivity
// A × (B + C) ≅ (A × B) + (A × C)
type Dist<A, B, C> = [A, Coproduct<B, C>];
type Undist<A, B, C> = Coproduct<[A, B], [A, C]>;

const distribute = <A, B, C>(d: Dist<A, B, C>): Undist<A, B, C> => {
  const [a, bc] = d;
  return bc.tag === 'left'
    ? { tag: 'left', value: [a, bc.value] }
    : { tag: 'right', value: [a, bc.value] };
};`,
    },
    {
      id: 'exponential-object',
      title: 'Exponential Objects',
      description: 'Function types as exponentials in a category.',
      details: [
        '**Notation**: B^A or A ⇒ B represents functions A → B',
        '**Evaluation**: eval: B^A × A → B applies a function',
        '**Currying**: Hom(A × B, C) ≅ Hom(A, C^B)',
        '**Closed category**: Has all exponentials',
      ],
      code: `// Exponential object: internal function type

// In Set: B^A = {f: A → B}, the set of all functions from A to B

// Evaluation morphism: applies a function to an argument
// eval: B^A × A → B
const eval_ = <A, B>(pair: [(a: A) => B, A]): B => pair[0](pair[1]);

// Universal property: currying
// For any f: A × B → C, there's unique curry(f): A → C^B
// such that eval ∘ (curry(f) × id) = f

const curry = <A, B, C>(f: (pair: [A, B]) => C) =>
  (a: A) => (b: B) => f([a, b]);

const uncurry = <A, B, C>(g: (a: A) => (b: B) => C) =>
  (pair: [A, B]) => g(pair[0])(pair[1]);

// Verify: uncurry(curry(f)) = f and curry(uncurry(g)) = g

const add = (pair: [number, number]) => pair[0] + pair[1];
const curriedAdd = curry(add);
const uncurriedAdd = uncurry(curriedAdd);

uncurriedAdd([3, 4]) === add([3, 4]);  // true: 7 = 7

// Exponential laws (like number exponents!):
// C^(A+B) ≅ C^A × C^B    (case analysis)
// (C^B)^A ≅ C^(A×B)      (currying)
// C^1 ≅ C                (from unit)
// 1^A ≅ 1                (to unit)`,
    },
  ],
};

// ============================================================
// CHAPTER 2d: COEQUALISERS
// ============================================================

export const coequaliserExamples: SectionExamples = {
  sectionNumber: '2d',
  sectionTitle: 'Coequalisers',
  examples: [
    {
      id: 'equaliser',
      title: 'Equalisers',
      description: 'Equalisers capture where two morphisms agree.',
      details: [
        '**Definition**: Equaliser of f,g: A → B is e: E → A with f∘e = g∘e',
        '**Universal**: Any h with f∘h = g∘h factors uniquely through e',
        '**In Set**: E = {a ∈ A | f(a) = g(a)} with inclusion',
        '**Use case**: Solutions to equations, constraints',
      ],
      code: `// Equaliser: the subobject where f and g agree

// In Set: Eq(f, g) = { a ∈ A | f(a) = g(a) }

const equaliser = <A, B>(
  domain: A[],
  f: (a: A) => B,
  g: (a: A) => B
): A[] => domain.filter(a => f(a) === g(a));

// Example: Find fixed points of a function
// Fixed point: f(x) = x, i.e., f = id
const fixedPoints = <A>(domain: A[], f: (a: A) => A): A[] =>
  equaliser(domain, f, x => x);

const square = (n: number) => n * n;
fixedPoints([0, 1, 2, 3, 4], square);  // [0, 1] (0²=0, 1²=1)

// Example: Elements where f = g
const f = (s: string) => s.length;
const g = (s: string) => s.split('a').length - 1;  // count 'a's
const strings = ['a', 'aa', 'ab', 'aaa', 'abc', 'abcd'];
equaliser(strings, f, g);  // ['a', 'aaa'] (length = #a's)

// Kernel as equaliser: Ker(f) = Eq(f, zero)
const kernel = <A>(domain: A[], f: (a: A) => number): A[] =>
  equaliser(domain, f, () => 0);

kernel([-2, -1, 0, 1, 2], n => n * n - 1);  // [-1, 1]`,
    },
    {
      id: 'coequaliser',
      title: 'Coequalisers',
      description: 'Coequalisers identify elements that should be equal.',
      details: [
        '**Definition**: Coequaliser of f,g: A → B is q: B → Q with q∘f = q∘g',
        '**Universal**: Any h with h∘f = h∘g factors uniquely through q',
        '**In Set**: Q = B/∼ where ∼ is smallest equivalence with f(a)∼g(a)',
        '**Use case**: Quotients, identifying elements',
      ],
      code: `// Coequaliser: quotient that identifies f(a) with g(a)

// Simple model: equivalence classes
const coequaliser = <A, B>(
  domain: A[],
  codomain: B[],
  f: (a: A) => B,
  g: (a: A) => B,
  eq: (b1: B, b2: B) => boolean = (b1, b2) => b1 === b2
): Map<B, B> => {
  // Build equivalence relation: f(a) ~ g(a) for all a
  const repr = new Map<string, B>();

  for (const b of codomain) {
    repr.set(JSON.stringify(b), b);
  }

  // Union-find style: make f(a) and g(a) equivalent
  for (const a of domain) {
    const fa = f(a);
    const ga = g(a);
    // In a real impl, we'd do proper union-find
    repr.set(JSON.stringify(ga), fa);
  }

  return repr as Map<B, B>;
};

// Example: Integers mod n as coequaliser
// Consider f(k) = k*n and g(k) = 0 from ℤ to ℤ
// Coequaliser identifies k*n with 0, giving ℤ/nℤ

const modN = (n: number) => (x: number): number => ((x % n) + n) % n;

// ℤ/3ℤ: 0, 3, 6, ... all identified; 1, 4, 7, ... identified; etc.
const mod3 = modN(3);
[0, 1, 2, 3, 4, 5, 6].map(mod3);  // [0, 1, 2, 0, 1, 2, 0]`,
    },
    {
      id: 'quotient-types',
      title: 'Quotient Types',
      description: 'Coequalisers model quotient types in programming.',
      details: [
        '**Quotient type**: Type A modulo equivalence relation ∼',
        '**Constructor**: A → A/∼ (the coequaliser map)',
        '**Eliminator**: Must respect the equivalence',
        '**Example**: Integers as equivalence classes of pairs',
      ],
      code: `// Quotient types via coequalisers

// Example: Rationals as quotient of pairs
// (a, b) ~ (c, d) iff a*d = b*c

type Pair = [number, number];  // (numerator, denominator)

const equivalent = (p1: Pair, p2: Pair): boolean =>
  p1[0] * p2[1] === p1[1] * p2[0];

// Canonical representative (reduced form)
const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
const reduce = (p: Pair): Pair => {
  const d = gcd(Math.abs(p[0]), Math.abs(p[1]));
  const sign = p[1] < 0 ? -1 : 1;
  return [sign * p[0] / d, sign * p[1] / d];
};

// The quotient map (coequaliser)
class Rational {
  private num: number;
  private den: number;

  constructor(num: number, den: number) {
    const [n, d] = reduce([num, den]);
    this.num = n;
    this.den = d;
  }

  equals(other: Rational): boolean {
    return this.num === other.num && this.den === other.den;
  }
}

// 2/4 and 1/2 become the same Rational
new Rational(2, 4).equals(new Rational(1, 2));  // true

// Operations must be well-defined on quotient
// (respect the equivalence relation)`,
    },
  ],
};

// ============================================================
// CHAPTER 2e: COLIMITS
// ============================================================

export const colimitExamples: SectionExamples = {
  sectionNumber: '2e',
  sectionTitle: 'Colimits',
  examples: [
    {
      id: 'limit-intro',
      title: 'Limits (Cones)',
      description: 'Limits are universal cones over diagrams.',
      details: [
        '**Diagram**: A functor D: J → C from an index category',
        '**Cone**: Object X with morphisms to each D(j) compatible with D',
        '**Limit**: Universal cone - all other cones factor through it',
        '**Examples**: Product, equaliser, pullback',
      ],
      code: `// Limit: universal cone over a diagram

// Example: Pullback (limit of A → C ← B)
// The pullback is: { (a, b) | f(a) = g(b) }

type Pullback<A, B, C> = Array<[A, B]>;

const pullback = <A, B, C>(
  as: A[],
  bs: B[],
  f: (a: A) => C,
  g: (b: B) => C
): Pullback<A, B, C> => {
  const result: [A, B][] = [];
  for (const a of as) {
    for (const b of bs) {
      if (f(a) === g(b)) {
        result.push([a, b]);
      }
    }
  }
  return result;
};

// Example: Find pairs that map to the same value
const nums = [1, 2, 3, 4];
const strs = ['a', 'ab', 'abc', 'abcd'];
const pb = pullback(
  nums,
  strs,
  n => n,
  s => s.length
);
// [[1, 'a'], [2, 'ab'], [3, 'abc'], [4, 'abcd']]

// Pullback is product "over" C
// It generalizes: A ×_C B = {(a,b) | f(a) = g(b)}

// Product is pullback over terminal object:
// A × B = A ×_1 B (trivial condition, always satisfied)`,
    },
    {
      id: 'colimit-intro',
      title: 'Colimits (Cocones)',
      description: 'Colimits are universal cocones under diagrams.',
      details: [
        '**Cocone**: Object X with morphisms from each D(j) compatible with D',
        '**Colimit**: Universal cocone - all other cocones factor through it',
        '**Examples**: Coproduct, coequaliser, pushout',
        '**Duality**: Colimit in C = Limit in C^op',
      ],
      code: `// Colimit: universal cocone under a diagram

// Example: Pushout (colimit of A ← C → B)
// Glues A and B together along their common part C

// In Set: (A ⊔ B) / (f(c) ~ g(c) for all c ∈ C)

type Tagged<A, B> =
  | { src: 'A'; value: A }
  | { src: 'B'; value: B };

const pushout = <A, B, C>(
  as: A[],
  bs: B[],
  cs: C[],
  f: (c: C) => A,
  g: (c: C) => B
): Tagged<A, B>[] => {
  // Simple model: disjoint union with equivalences
  const result: Tagged<A, B>[] = [
    ...as.map(a => ({ src: 'A' as const, value: a })),
    ...bs.map(b => ({ src: 'B' as const, value: b }))
  ];

  // In reality, we'd quotient by f(c) ~ g(c)
  // For simplicity, just return tagged union
  return result;
};

// Example: Gluing two sets at a point
// A = {1, 2, 3}, B = {a, b, c}, C = {*}
// f(*) = 2, g(*) = b
// Pushout identifies 2 with b: {1, 2=b, 3, a, c}

// Pushout is coproduct "under" C
// Coproduct is pushout under initial object:
// A + B = A +_0 B (no identifications)`,
    },
    {
      id: 'limit-preservation',
      title: 'Limit Preservation',
      description: 'Some functors preserve limits.',
      details: [
        '**Preserves limits**: F(lim D) ≅ lim (F∘D)',
        '**Right adjoints preserve limits**: Always!',
        '**Representable functors**: Hom(A, –) preserves all limits',
        '**Example**: Forget functor often preserves limits',
      ],
      code: `// Limit-preserving functors

// A functor F preserves limits if:
// F(lim D) is naturally isomorphic to lim(F ∘ D)

// Key theorem: RIGHT ADJOINTS PRESERVE LIMITS

// Example: Forgetful functor U: Grp → Set preserves limits
// U(G × H) ≅ U(G) × U(H)  (products preserved)

// In programming terms:
// If F is a type constructor with fmap,
// and F preserves products:
// F<[A, B]> ≅ [F<A>, F<B>]

// This is NOT true for all functors!
// List does NOT preserve products:
// List<[A, B]> ≇ [List<A>, List<B>]
// List<[Int, String]> = lists of pairs
// [List<Int>, List<String>] = pair of lists (different lengths possible!)

// Reader DOES preserve products:
// Reader<E, [A, B]> ≅ [Reader<E, A>, Reader<E, B>]
type Reader<E, A> = (e: E) => A;

const readerProductIso = <E, A, B>() => ({
  to: (r: Reader<E, [A, B]>): [Reader<E, A>, Reader<E, B>] =>
    [(e) => r(e)[0], (e) => r(e)[1]],
  from: (pair: [Reader<E, A>, Reader<E, B>]): Reader<E, [A, B]> =>
    (e) => [pair[0](e), pair[1](e)]
});`,
    },
    {
      id: 'colimit-cocontinuous',
      title: 'Colimit Preservation',
      description: 'Left adjoints preserve colimits.',
      details: [
        '**Cocontinuous**: F preserves colimits, F(colim D) ≅ colim (F∘D)',
        '**Left adjoints preserve colimits**: Always!',
        '**Example**: Free functor preserves coproducts',
        '**In programming**: Many container types preserve coproducts',
      ],
      code: `// Colimit-preserving functors (cocontinuous)

// Key theorem: LEFT ADJOINTS PRESERVE COLIMITS

// Example: Free monoid functor F: Set → Mon
// F(A + B) ≅ F(A) + F(B) in Mon
// List<A | B> ≅ List<A> | List<B>? Not quite...

// But coproduct preservation for simple functors:
type Either<A, B> = { tag: 'left'; value: A } | { tag: 'right'; value: B };

// Maybe preserves coproducts:
// Maybe<A + B> ≅ Maybe<A> + Maybe<B>
type Maybe<A> = A | null;

// Isomorphism:
const maybeEitherIso = <A, B>() => ({
  to: (m: Maybe<Either<A, B>>): Either<Maybe<A>, Maybe<B>> => {
    if (m === null) return { tag: 'left', value: null };  // arbitrary choice
    return m.tag === 'left'
      ? { tag: 'left', value: m.value }
      : { tag: 'right', value: m.value };
  },
  from: (e: Either<Maybe<A>, Maybe<B>>): Maybe<Either<A, B>> => {
    if (e.tag === 'left') {
      return e.value === null ? null : { tag: 'left', value: e.value };
    }
    return e.value === null ? null : { tag: 'right', value: e.value };
  }
});

// The practical takeaway:
// Products come from right adjoints → preserved by limits
// Coproducts come from left adjoints → preserved by colimits`,
    },
  ],
};

// ============================================================
// APPENDIX A: ADJUNCTIONS
// ============================================================

export const adjunctionAppendixExamples: SectionExamples = {
  sectionNumber: 'A',
  sectionTitle: 'More on Adjointness',
  examples: [
    {
      id: 'adjunction-equiv-defs',
      title: 'Equivalent Definitions of Adjunction',
      description: 'Adjunctions can be defined in multiple equivalent ways.',
      details: [
        '**Hom-set bijection**: Hom(F(A), B) ≅ Hom(A, G(B)) naturally',
        '**Unit/counit**: η: Id → GF and ε: FG → Id with triangle identities',
        '**Universal arrows**: Unit η_A is universal arrow from A to G',
        '**Initial objects**: (A, η_A) initial in comma category (A ↓ G)',
      ],
      code: `// Multiple ways to specify the same adjunction F ⊣ G

// 1. Hom-set isomorphism (natural in both arguments)
type HomIso<F, G> = <A, B>(
  fab: (fa: F) => B
) => (a: A) => G;  // with inverse

// 2. Unit and Counit with triangle identities
interface Adjunction<F, G> {
  // Unit: η: Id → G∘F
  unit: <A>(a: A) => G;  // actually G(F(A))

  // Counit: ε: F∘G → Id
  counit: <B>(fgb: F) => B;  // actually F(G(B)) → B

  // Triangle identities:
  // ε_F(A) ∘ F(η_A) = id_F(A)
  // G(ε_B) ∘ η_G(B) = id_G(B)
}

// Example: Free/Forgetful adjunction for monoids
// F: Set → Mon (free monoid = lists)
// G: Mon → Set (underlying set)

// Unit: A → G(F(A)) = A → List(A)
const unitFreeForget = <A>(a: A): A[] => [a];  // singleton list

// Counit: F(G(M)) → M = List(|M|) → M
// For a monoid M, concatenate the list using M's operation
const counitFreeForget = <M>(
  concat: (m1: M, m2: M) => M,
  identity: M
) => (list: M[]): M => list.reduce(concat, identity);`,
    },
    {
      id: 'adjunction-compose',
      title: 'Composition of Adjunctions',
      description: 'Adjunctions compose: if F ⊣ G and H ⊣ K, then HF ⊣ GK.',
      details: [
        '**Composition**: (H ∘ F) ⊣ (G ∘ K)',
        '**Units compose**: η_{GK} = G(η_K) ∘ η_G',
        '**Counits compose**: ε_{HF} = ε_H ∘ H(ε_F)',
        '**Example**: List and Maybe compose',
      ],
      code: `// Composition of adjunctions

// If F ⊣ G : C → D and H ⊣ K : D → E
// Then H∘F ⊣ G∘K : C → E

// Example in types:
// Curry adjunction: (– × A) ⊣ (–)^A
// Compose with itself:
// (– × A × B) ⊣ (–)^A^B = (–)^(A×B)

// This gives us:
// Hom(X × A × B, Y) ≅ Hom(X, Y^(A×B))

// In code: currying with multiple arguments
const curry2 = <X, A, B, Y>(f: (x: X, a: A, b: B) => Y) =>
  (x: X) => (a: A) => (b: B) => f(x, a, b);

const uncurry2 = <X, A, B, Y>(g: (x: X) => (a: A) => (b: B) => Y) =>
  (x: X, a: A, b: B) => g(x)(a)(b);

// More interesting: composing different adjunctions
// State monad comes from composing:
// (– × S) ⊣ (–)^S gives State S A = S → (A × S)

type State<S, A> = (s: S) => [A, S];

// This is (–)^S ∘ (– × S) applied to A
// = (A × S)^S
// = S → (A × S)`,
    },
    {
      id: 'monads-from-adjunctions',
      title: 'Monads from Adjunctions',
      description: 'Every adjunction gives rise to a monad.',
      details: [
        '**Monad from adjunction**: T = G ∘ F is a monad',
        '**Unit**: η: Id → GF (same as adjunction unit)',
        '**Multiplication**: μ = G(ε_F): GFGF → GF',
        '**Examples**: State, Reader, Writer all arise this way',
      ],
      code: `// Every adjunction F ⊣ G gives a monad T = G ∘ F

// Monad operations from adjunction:
// return = η : A → T(A) = G(F(A))
// join = G(ε) : T(T(A)) = G(F(G(F(A)))) → G(F(A)) = T(A)

// Example: List monad from Free ⊣ Forgetful
// T = Forget ∘ Free : Set → Set
// T(A) = underlying set of free monoid on A = List(A)

// return: A → List(A)
const returnList = <A>(a: A): A[] => [a];

// join: List(List(A)) → List(A)
const joinList = <A>(lla: A[][]): A[] => lla.flat();

// Example: Reader monad from (– × E) ⊣ (–)^E
// T(A) = (A × E)^E = E → A × E? No wait...
// Actually: T = (–)^E ∘ (– × E) doesn't give Reader directly
// Reader comes from a different adjunction

// State monad from (– × S) ⊣ (–)^S:
// This gives T(A) = (A × S)^S = S → (A × S) = State S A
type State<S, A> = (s: S) => [A, S];

const returnState = <S, A>(a: A): State<S, A> =>
  (s: S) => [a, s];

const joinState = <S, A>(ssa: State<S, State<S, A>>): State<S, A> =>
  (s: S) => {
    const [sa, s1] = ssa(s);
    return sa(s1);
  };`,
    },
    {
      id: 'adjoint-functor-theorem',
      title: 'Adjoint Functor Theorems',
      description: 'When do adjoints exist?',
      details: [
        '**RAPL**: Right Adjoints Preserve Limits',
        '**LAPC**: Left Adjoints Preserve Colimits',
        '**Freyd\'s theorem**: Conditions for existence of left adjoint',
        '**Solution set condition**: Key technical requirement',
      ],
      code: `// Adjoint Functor Theorems

// FACT: Right adjoints preserve limits
// If G has a left adjoint F, then G preserves all limits

// FACT: Left adjoints preserve colimits
// If F has a right adjoint G, then F preserves all colimits

// These are NECESSARY conditions, not sufficient!

// Freyd's Adjoint Functor Theorem (informal):
// G: D → C has a left adjoint if:
// 1. G preserves limits
// 2. D is complete (has all limits)
// 3. Solution set condition holds

// In practice, we often construct adjoints explicitly:

// Example: To show F ⊣ G, we can:
// Option 1: Construct the hom-set bijection
// Option 2: Construct unit η and verify universal property
// Option 3: Use the adjoint functor theorem

// Recognizing right adjoints (they preserve limits):
// - Product: Δ ⊣ ×, so × preserves limits (it does!)
// - Forget: Free ⊣ Forget, so Forget preserves limits (it does!)
// - Exponential: (– × A) ⊣ (–)^A, so (–)^A preserves limits

// This is why:
// - Products of products = product of products
// - Underlying set of product group = product of underlying sets
// - Functions into a product = product of functions`,
    },
  ],
};

// ============================================================
// EXPORT ALL EXAMPLES
// ============================================================

export const allSectionExamples: SectionExamples[] = [
  introductionExamples,
  categoryExamples,
  functorExamples,
  naturalityExamples,
  adjunctionExamples,
  dualityExamples,
  isoEpicMonicExamples,
  initialityFinalityExamples,
  productsSumsExamples,
  coequaliserExamples,
  colimitExamples,
  adjunctionAppendixExamples,
];

/**
 * Get examples for a section number
 */
export function getExamplesForSection(sectionNumber: string): Example[] {
  // Handle section number matching (e.g., "1a" should match "1a")
  const section = allSectionExamples.find(s => {
    // Exact match
    if (s.sectionNumber === sectionNumber) return true;
    // Prefix match for subsections (e.g., "0.1" matches "0")
    if (sectionNumber.startsWith(s.sectionNumber + '.')) return true;
    if (s.sectionNumber.startsWith(sectionNumber)) return true;
    return false;
  });

  return section?.examples ?? [];
}

/**
 * Get all examples for a chapter
 */
export function getExamplesForChapter(chapterNumber: string): SectionExamples[] {
  return allSectionExamples.filter(s =>
    s.sectionNumber.startsWith(chapterNumber) ||
    s.sectionNumber === chapterNumber
  );
}
