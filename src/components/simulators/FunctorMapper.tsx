import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import SimulatorHint, { HintStep } from './SimulatorHint';
import './FunctorMapper.css';

interface CategoryObject {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface CategoryMorphism {
  id: string;
  label: string;
  source: string;
  target: string;
}

interface CategoryData {
  name: string;
  objects: CategoryObject[];
  morphisms: CategoryMorphism[];
}

interface FunctorMapping {
  name: string;
  description: string;
  objectMap: Record<string, string>;
  morphismMap: Record<string, string>;
}

const hintSteps: HintStep[] = [
  {
    title: 'Two Categories',
    description: 'The diagram shows two categories: C on the left and D on the right. Each has objects (circles) and morphisms (arrows).',
  },
  {
    title: 'Choose a Functor',
    description: 'Select a functor F: C → D from the dropdown. Different functors map objects and morphisms in different ways.',
    action: 'Use the dropdown to select a functor',
  },
  {
    title: 'Observe the Mapping',
    description: 'Watch how the functor maps objects (F(A), F(B), ...) and morphisms (F(f), F(g), ...) from C to D. Dashed lines show the mapping.',
  },
  {
    title: 'Verify Functor Laws',
    description: 'A valid functor preserves identity: F(id_A) = id_F(A), and composition: F(g∘f) = F(g)∘F(f). Toggle verification to check!',
    action: 'Enable "Show Laws Verification"',
  },
];

const tips = [
  'Functors preserve the structure of categories',
  'Every category has an identity functor that maps everything to itself',
  'Composition of functors is also a functor',
  'Constant functors map everything to a single object',
];

// Source category C
const categoryC: CategoryData = {
  name: 'C',
  objects: [
    { id: 'A', label: 'A', x: 60, y: 60 },
    { id: 'B', label: 'B', x: 140, y: 60 },
    { id: 'C', label: 'C', x: 100, y: 140 },
  ],
  morphisms: [
    { id: 'f', label: 'f', source: 'A', target: 'B' },
    { id: 'g', label: 'g', source: 'B', target: 'C' },
    { id: 'h', label: 'h', source: 'A', target: 'C' },
  ],
};

// Target category D
const categoryD: CategoryData = {
  name: 'D',
  objects: [
    { id: 'X', label: 'X', x: 60, y: 60 },
    { id: 'Y', label: 'Y', x: 140, y: 60 },
    { id: 'Z', label: 'Z', x: 100, y: 140 },
  ],
  morphisms: [
    { id: 'α', label: 'α', source: 'X', target: 'Y' },
    { id: 'β', label: 'β', source: 'Y', target: 'Z' },
    { id: 'γ', label: 'γ', source: 'X', target: 'Z' },
  ],
};

// Example functors
const functors: FunctorMapping[] = [
  {
    name: 'Standard F',
    description: 'Maps A→X, B→Y, C→Z preserving the triangle structure',
    objectMap: { A: 'X', B: 'Y', C: 'Z' },
    morphismMap: { f: 'α', g: 'β', h: 'γ' },
  },
  {
    name: 'Collapse G',
    description: 'Maps everything to X, all morphisms to id_X',
    objectMap: { A: 'X', B: 'X', C: 'X' },
    morphismMap: { f: 'id', g: 'id', h: 'id' },
  },
  {
    name: 'Twist H',
    description: 'Swaps A↔B mapping, demonstrating non-trivial object mapping',
    objectMap: { A: 'Y', B: 'X', C: 'Z' },
    morphismMap: { f: 'α⁻¹', g: 'β', h: 'γ\'' },
  },
];

export default function FunctorMapper() {
  const leftSvgRef = useRef<SVGSVGElement>(null);
  const rightSvgRef = useRef<SVGSVGElement>(null);
  const mappingSvgRef = useRef<SVGSVGElement>(null);
  const [activeFunctor, setActiveFunctor] = useState(0);
  const [showLaws, setShowLaws] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [highlightedObject, setHighlightedObject] = useState<string | null>(null);

  const functor = functors[activeFunctor];

  // Draw a category
  const drawCategory = (
    svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
    category: CategoryData,
    isSource: boolean
  ) => {
    svg.selectAll('*').remove();

    const defs = svg.append('defs');

    // Arrow marker
    defs.append('marker')
      .attr('id', `fm-arrow-${isSource ? 'src' : 'tgt'}`)
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 18)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .append('path')
      .attr('d', 'M 0,-4 L 8,0 L 0,4')
      .attr('fill', isSource ? 'var(--color-accent)' : 'var(--color-success)');

    // Category label
    svg.append('text')
      .attr('x', 100)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '16px')
      .attr('font-weight', 'bold')
      .attr('fill', isSource ? 'var(--color-accent)' : 'var(--color-success)')
      .attr('opacity', 0)
      .text(category.name)
      .transition()
      .duration(400)
      .attr('opacity', 1);

    // Draw morphisms with animation
    category.morphisms.forEach((m, idx) => {
      const source = category.objects.find(o => o.id === m.source);
      const target = category.objects.find(o => o.id === m.target);
      if (!source || !target) return;

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const len = Math.sqrt(dx * dx + dy * dy);
      const offsetX = (dx / len) * 18;
      const offsetY = (dy / len) * 18;

      const group = svg.append('g')
        .attr('class', 'fm-morphism');

      const line = group.append('line')
        .attr('x1', source.x + offsetX)
        .attr('y1', source.y + offsetY)
        .attr('x2', source.x + offsetX)
        .attr('y2', source.y + offsetY)
        .attr('stroke', isSource ? 'var(--color-accent)' : 'var(--color-success)')
        .attr('stroke-width', 2)
        .attr('marker-end', `url(#fm-arrow-${isSource ? 'src' : 'tgt'})`);

      line.transition()
        .delay(idx * 150 + 200)
        .duration(400)
        .ease(d3.easeQuadOut)
        .attr('x2', target.x - offsetX)
        .attr('y2', target.y - offsetY);

      // Label
      const midX = (source.x + target.x) / 2;
      const midY = (source.y + target.y) / 2;
      const perpX = -dy / len * 12;
      const perpY = dx / len * 12;

      group.append('text')
        .attr('x', midX + perpX)
        .attr('y', midY + perpY)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .attr('fill', isSource ? 'var(--color-accent)' : 'var(--color-success)')
        .attr('opacity', 0)
        .text(m.label)
        .transition()
        .delay(idx * 150 + 400)
        .duration(300)
        .attr('opacity', 1);
    });

    // Draw objects with entrance animation
    category.objects.forEach((obj, idx) => {
      const isHighlighted = isSource && highlightedObject === obj.id;
      const mappedId = isSource ? functor.objectMap[obj.id] : null;
      const isMappedTarget = !isSource && highlightedObject && functor.objectMap[highlightedObject] === obj.id;

      const group = svg.append('g')
        .attr('class', 'fm-object')
        .attr('transform', `translate(${obj.x}, ${obj.y})`)
        .attr('opacity', 0)
        .style('cursor', isSource ? 'pointer' : 'default')
        .on('mouseenter', () => isSource && setHighlightedObject(obj.id))
        .on('mouseleave', () => setHighlightedObject(null));

      // Highlight ring
      if (isHighlighted || isMappedTarget) {
        group.append('circle')
          .attr('class', 'highlight-ring')
          .attr('r', 22)
          .attr('fill', 'none')
          .attr('stroke', '#f59f00')
          .attr('stroke-width', 3)
          .attr('opacity', 0.5);
      }

      group.append('circle')
        .attr('r', 0)
        .attr('fill', 'var(--color-bg-primary)')
        .attr('stroke', isSource ? 'var(--color-accent)' : 'var(--color-success)')
        .attr('stroke-width', 2)
        .transition()
        .delay(idx * 100)
        .duration(400)
        .ease(d3.easeBackOut.overshoot(1.5))
        .attr('r', 16);

      group.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', 'var(--color-text-primary)')
        .attr('opacity', 0)
        .text(obj.label)
        .transition()
        .delay(idx * 100 + 200)
        .duration(300)
        .attr('opacity', 1);

      // Show mapped label for source objects
      if (isSource && mappedId) {
        group.append('text')
          .attr('y', 28)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .attr('fill', 'var(--color-text-muted)')
          .attr('opacity', 0)
          .text(`→ ${mappedId}`)
          .transition()
          .delay(idx * 100 + 300)
          .duration(300)
          .attr('opacity', 1);
      }

      group.transition()
        .delay(idx * 100)
        .duration(400)
        .attr('opacity', 1);
    });
  };

  // Draw mapping arrows
  const drawMappings = () => {
    if (!mappingSvgRef.current) return;

    const svg = d3.select(mappingSvgRef.current);
    svg.selectAll('*').remove();

    const defs = svg.append('defs');

    defs.append('marker')
      .attr('id', 'fm-mapping-arrow')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .append('path')
      .attr('d', 'M 0,-4 L 8,0 L 0,4')
      .attr('fill', '#f59f00');

    // Draw functor label
    svg.append('text')
      .attr('x', 50)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#f59f00')
      .text('F');

    // Draw mapping lines for each object
    categoryC.objects.forEach((srcObj, idx) => {
      const tgtId = functor.objectMap[srcObj.id];
      const tgtObj = categoryD.objects.find(o => o.id === tgtId);
      if (!tgtObj) return;

      const isHighlighted = highlightedObject === srcObj.id;

      const line = svg.append('line')
        .attr('x1', 0)
        .attr('y1', srcObj.y)
        .attr('x2', 0)
        .attr('y2', srcObj.y)
        .attr('stroke', '#f59f00')
        .attr('stroke-width', isHighlighted ? 3 : 1.5)
        .attr('stroke-dasharray', '4,4')
        .attr('opacity', isHighlighted ? 1 : 0.5)
        .attr('marker-end', 'url(#fm-mapping-arrow)');

      line.transition()
        .delay(idx * 100 + 600)
        .duration(500)
        .ease(d3.easeQuadOut)
        .attr('x2', 100)
        .attr('y2', tgtObj.y);
    });
  };

  // Draw categories
  useEffect(() => {
    if (leftSvgRef.current) {
      drawCategory(d3.select(leftSvgRef.current), categoryC, true);
    }
    if (rightSvgRef.current) {
      drawCategory(d3.select(rightSvgRef.current), categoryD, false);
    }
    drawMappings();
  }, [activeFunctor, highlightedObject]);

  return (
    <div className="functor-mapper">
      {showHint && (
        <SimulatorHint
          title="Functor Mapper"
          description="Visualize how functors map between categories. Functors are structure-preserving maps that transform objects to objects and morphisms to morphisms."
          steps={hintSteps}
          tips={tips}
          onDismiss={() => setShowHint(false)}
          compact={false}
        />
      )}

      {!showHint && (
        <button
          className="hint-toggle-btn"
          onClick={() => setShowHint(true)}
          title="Show help"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>Help</span>
        </button>
      )}

      <div className="fm-controls">
        <div className="fm-functor-selector">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <label>Functor:</label>
          <select
            value={activeFunctor}
            onChange={(e) => setActiveFunctor(Number(e.target.value))}
          >
            {functors.map((f, i) => (
              <option key={i} value={i}>{f.name}</option>
            ))}
          </select>
        </div>
        <label className="fm-checkbox">
          <input
            type="checkbox"
            checked={showLaws}
            onChange={(e) => setShowLaws(e.target.checked)}
          />
          <span>Show Laws Verification</span>
        </label>
      </div>

      <div className="fm-description">
        <strong>{functor.name}:</strong> {functor.description}
      </div>

      <div className="fm-canvas-container">
        <div className="fm-category source">
          <div className="category-label">
            <span className="label-text">Category C</span>
            <span className="label-hint">(Source)</span>
          </div>
          <svg ref={leftSvgRef} width="200" height="180" viewBox="0 0 200 180" />
        </div>

        <div className="fm-mapping">
          <svg ref={mappingSvgRef} width="100" height="180" viewBox="0 0 100 180" />
        </div>

        <div className="fm-category target">
          <div className="category-label">
            <span className="label-text">Category D</span>
            <span className="label-hint">(Target)</span>
          </div>
          <svg ref={rightSvgRef} width="200" height="180" viewBox="0 0 200 180" />
        </div>
      </div>

      <div className="fm-mapping-table">
        <div className="mapping-section">
          <h4>Object Mapping</h4>
          <div className="mapping-items">
            {Object.entries(functor.objectMap).map(([src, tgt]) => (
              <div
                key={src}
                className={`mapping-item ${highlightedObject === src ? 'highlighted' : ''}`}
                onMouseEnter={() => setHighlightedObject(src)}
                onMouseLeave={() => setHighlightedObject(null)}
              >
                <span className="src">F({src})</span>
                <span className="arrow">=</span>
                <span className="tgt">{tgt}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mapping-section">
          <h4>Morphism Mapping</h4>
          <div className="mapping-items">
            {Object.entries(functor.morphismMap).map(([src, tgt]) => (
              <div key={src} className="mapping-item">
                <span className="src">F({src})</span>
                <span className="arrow">=</span>
                <span className="tgt">{tgt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showLaws && (
        <div className="fm-laws">
          <h4>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Functor Laws Verification
          </h4>
          <div className="law-item">
            <div className="law-name">Identity Preservation</div>
            <div className="law-formula">F(id_A) = id_{`{F(A)}`}</div>
            <div className="law-status valid">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Satisfied
            </div>
          </div>
          <div className="law-item">
            <div className="law-name">Composition Preservation</div>
            <div className="law-formula">F(g ∘ f) = F(g) ∘ F(f)</div>
            <div className="law-status valid">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Satisfied
            </div>
          </div>
          <p className="laws-note">
            These laws ensure that the functor preserves the categorical structure.
          </p>
        </div>
      )}
    </div>
  );
}
