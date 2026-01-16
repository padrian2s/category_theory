# Interactive Category Theory

An interactive web application for learning Category Theory concepts with hands-on simulators and visualizations. Transforms a category theory textbook into an enhanced, interactive learning platform that preserves academic rigor while improving accessibility through hands-on learning experiences.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Math Rendering**: KaTeX
- **Visualizations**: D3.js
- **Routing**: React Router DOM
- **Deployment**: GitHub Pages

## Project Structure

```
src/
├── components/
│   ├── layout/          # AppShell, Header, Sidebar
│   ├── viewer/          # Page viewing (PageViewer, PageNavigation)
│   ├── enhancements/    # Enhancement panel with tabs
│   ├── simulators/      # Interactive math simulators
│   └── common/          # Shared components (MathBlock)
├── contexts/            # React contexts (BookContext, ProgressContext)
├── data/                # Book structure, enhancements data
│   └── enhancements/    # Per-chapter enhancement definitions
├── hooks/               # Custom hooks (useLocalStorage)
└── utils/               # Utility functions, types
```

## Commands

```bash
npm run dev             # Start development server
npm run build           # Production build
npm run build:gh-pages  # Build for GitHub Pages (with /category_theory/ base)
npm run preview         # Preview production build
```

## Styling Conventions

- Use CSS variables defined in `src/index.css` for colors, spacing, and sizing
- Each component has a co-located `.css` file
- Dark mode is automatic via `prefers-color-scheme` media query
- Mobile breakpoints: 768px (mobile), 1200px (tablet)

### Key CSS Variables

```css
--color-accent: #4263eb;
--spacing-sm/md/lg/xl: 0.5rem / 1rem / 1.5rem / 2rem;
--radius-sm/md/lg: 4px / 8px / 12px;
--sidebar-width: 280px;
--panel-width: 420px;
```

## Component Patterns

- Use functional components with hooks
- State management via React Context (BookContext, ProgressContext)
- Path aliases configured: `@components`, `@hooks`, `@utils`, `@data`, `@contexts`

## Deployment

GitHub Actions automatically deploys to GitHub Pages on push to `main`.
Live site: https://padrian2s.github.io/category_theory/

---

## Enhancement Specifications

Each page should implement five enhancement components in the Enhancement Panel:

### 1. Practical Examples (ExamplesTab)
- 2-3 concrete examples illustrating each theoretical concept
- Use familiar objects: sets, functions, programming concepts
- Step-by-step breakdowns showing how abstract principles apply
- Visual representations where applicable

### 2. Interactive Simulators (SimulatorTab)
- Functional simulators for manipulating category theory elements
- Parameter controls for morphisms, objects, and compositions
- Real-time feedback showing results of user interactions
- Available simulators: CategoryBuilder, MorphismComposer, FunctorMapper, ProductBuilder, NaturalTransformationVisualizer

### 3. Real-World Applications (ApplicationsTab)
- Practical applications in computer science, mathematics, other fields
- Connections to programming languages, database design, logical systems
- Industry case studies where category theory principles apply

### 4. Progressive Learning Scenarios (LearningPathTab)
- Learning paths connecting current concepts to previous material
- Exercises that gradually increase in complexity
- Prerequisite reviews and concept dependencies

### 5. Interactive Components
- Clickable diagrams with hover-over explanations
- Adjustable parameter controls with immediate visual feedback
- Step-by-step guided tutorials with user-controlled pacing

## Quality Standards

### Academic Integrity
- Maintain mathematical precision and theoretical accuracy
- Preserve original terminology and notation systems
- Enhancements support rather than replace core concepts

### User Experience
- Design for undergraduate to graduate level learners
- Multiple learning pathways (visual, interactive, theoretical)
- Responsive design for various screen sizes
- Consistent UI patterns across all enhancements

## Memory Management for Development

When adding new enhancements:
- Work on individual chapters sequentially
- Process 5-10 pages per batch
- Enhancement data stored in `src/data/enhancements/chapter{N}/`
- Maintain consistency tracking between chunks
