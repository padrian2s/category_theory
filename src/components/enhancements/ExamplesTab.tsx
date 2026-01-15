import { useState } from 'react';
import { useBook } from '../../contexts/BookContext';
import { getExamplesForSection, Example } from '../../data/examples';
import { getConceptsForPage } from '../../data/bookStructure';
import './TabContent.css';

export default function ExamplesTab() {
  const { currentPage, currentSection } = useBook();
  const [expandedExamples, setExpandedExamples] = useState<Set<string>>(new Set());
  const concepts = getConceptsForPage(currentPage);

  // Get examples based on current section
  const examples = currentSection
    ? getExamplesForSection(currentSection.number)
    : [];

  const toggleExample = (id: string) => {
    setExpandedExamples(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedExamples(new Set(examples.map(e => e.id)));
  };

  const collapseAll = () => {
    setExpandedExamples(new Set());
  };

  // Placeholder for sections without examples yet
  const placeholderExample: Example = {
    id: 'placeholder',
    title: 'Examples Coming Soon',
    description: currentSection
      ? `Examples for "${currentSection.title}" are being developed.`
      : 'Navigate to a section to see examples.',
    details: concepts.length > 0
      ? concepts.map(c => `• **${c}**: Detailed examples will cover this concept`)
      : ['• Examples will be added for this section'],
    code: `// Interactive examples for this section will include:
// - Concrete mathematical examples
// - Programming implementations
// - Visual demonstrations
// - Practice exercises`,
  };

  const displayExamples = examples.length > 0 ? examples : [placeholderExample];

  return (
    <div className="tab-content examples-tab">
      <div className="tab-intro">
        <p>
          Explore concrete examples that illustrate the concepts on this page.
          Each example shows how abstract category theory applies to familiar structures.
        </p>
        {examples.length > 1 && (
          <div className="tab-actions">
            <button className="btn btn-sm btn-ghost" onClick={expandAll}>
              Expand All
            </button>
            <button className="btn btn-sm btn-ghost" onClick={collapseAll}>
              Collapse All
            </button>
          </div>
        )}
      </div>

      {currentSection && (
        <div className="section-context">
          <span className="context-label">Section {currentSection.number}:</span>
          <span className="context-title">{currentSection.title}</span>
        </div>
      )}

      <div className="examples-list">
        {displayExamples.map((example) => (
          <div
            key={example.id}
            className={`example-card ${expandedExamples.has(example.id) ? 'expanded' : ''}`}
          >
            <button
              className="example-header"
              onClick={() => toggleExample(example.id)}
            >
              <div className="example-header-content">
                <h3 className="example-title">{example.title}</h3>
                <p className="example-description">{example.description}</p>
              </div>
              <span className={`expand-icon ${expandedExamples.has(example.id) ? 'expanded' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>

            <div className={`example-body ${expandedExamples.has(example.id) ? 'show' : ''}`}>
              <div className="example-details">
                {example.details.map((detail, i) => (
                  <div
                    key={i}
                    className="detail-item"
                    dangerouslySetInnerHTML={{
                      __html: detail.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }}
                  />
                ))}
              </div>

              {example.mathNotation && (
                <div className="example-math">
                  <div className="math-header">Mathematical Notation</div>
                  <pre className="math-content">{example.mathNotation}</pre>
                </div>
              )}

              {example.code && (
                <div className="example-code">
                  <div className="code-header">
                    <span>TypeScript Implementation</span>
                    <button
                      className="btn btn-xs btn-ghost"
                      onClick={() => navigator.clipboard.writeText(example.code || '')}
                      title="Copy code"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                  </div>
                  <pre className="code-content"><code>{example.code}</code></pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {examples.length > 0 && (
        <div className="examples-footer">
          <p className="examples-count">
            {examples.length} example{examples.length !== 1 ? 's' : ''} for this section
          </p>
        </div>
      )}
    </div>
  );
}
