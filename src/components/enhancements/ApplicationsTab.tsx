import { useBook } from '../../contexts/BookContext';
import './TabContent.css';

const applications = {
  categories: [
    {
      id: 'type-systems',
      field: 'Programming Languages',
      title: 'Type Systems',
      description: 'Types form a category where morphisms are functions. This view enables powerful abstractions like generics and type inference.',
      examples: [
        'TypeScript/Java generics use functorial mapping',
        'Subtyping forms a preorder category',
        'Type constructors like List<T> are functors',
      ],
      relevance: 'Understanding categories helps design better type systems and write more generic, reusable code.',
    },
    {
      id: 'databases',
      field: 'Database Theory',
      title: 'Schema Design',
      description: 'Database schemas can be viewed as categories, with tables as objects and foreign keys as morphisms.',
      examples: [
        'Entity-relationship diagrams are category diagrams',
        'Database migrations are functors between schemas',
        'Queries correspond to morphisms',
      ],
      relevance: 'Categorical database theory provides principled approaches to schema design and data migration.',
    },
    {
      id: 'state-machines',
      field: 'Automata Theory',
      title: 'State Machines',
      description: 'Finite state machines form a category, enabling composition and analysis of complex systems.',
      examples: [
        'States are objects, transitions are morphisms',
        'Sequential composition is morphism composition',
        'Parallel composition uses products',
      ],
      relevance: 'Design composable state machines for UI, protocols, and business logic.',
    },
  ],
  functors: [
    {
      id: 'containers',
      field: 'Software Engineering',
      title: 'Container Types',
      description: 'Functors model container types that can be mapped over, enabling generic programming.',
      examples: [
        'Array.map is the functor map for lists',
        'Promise.then is functorial (almost)',
        'Optional/Maybe types are functors',
      ],
      relevance: 'Recognizing functors leads to more composable and reusable data transformations.',
    },
    {
      id: 'parsers',
      field: 'Compiler Design',
      title: 'Parser Combinators',
      description: 'Parsers form a category with functorial structure, enabling compositional parser construction.',
      examples: [
        'Parser<A> is a functor',
        'map transforms parsed results',
        'Alternative parsers form coproducts',
      ],
      relevance: 'Build complex parsers from simple, tested components.',
    },
  ],
};

export default function ApplicationsTab() {
  const { currentSection } = useBook();

  const getApplicationsForSection = () => {
    if (!currentSection) return applications.categories;

    if (currentSection.number === '1a') {
      return applications.categories;
    }
    if (currentSection.number === '1b') {
      return applications.functors;
    }

    // Return combined for other sections
    return [...applications.categories.slice(0, 2), ...applications.functors.slice(0, 1)];
  };

  const sectionApplications = getApplicationsForSection();

  return (
    <div className="tab-content applications-tab">
      <div className="tab-intro">
        <p>
          Discover how category theory concepts are applied in real-world software
          engineering, mathematics, and computer science.
        </p>
      </div>

      {sectionApplications.map((app) => (
        <div key={app.id} className="application-card">
          <div className="application-header">
            <span className="field-badge">{app.field}</span>
            <h3 className="application-title">{app.title}</h3>
          </div>

          <p className="application-description">{app.description}</p>

          <div className="application-examples">
            <h4>Examples</h4>
            <ul>
              {app.examples.map((example, i) => (
                <li key={i}>{example}</li>
              ))}
            </ul>
          </div>

          <div className="application-relevance">
            <strong>Why it matters:</strong> {app.relevance}
          </div>
        </div>
      ))}
    </div>
  );
}
