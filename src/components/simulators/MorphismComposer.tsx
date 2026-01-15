import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import SimulatorHint, { HintStep } from './SimulatorHint';
import './MorphismComposer.css';

interface Morphism {
  id: string;
  label: string;
  source: string;
  target: string;
}

const initialMorphisms: Morphism[] = [
  { id: 'f', label: 'f', source: 'A', target: 'B' },
  { id: 'g', label: 'g', source: 'B', target: 'C' },
  { id: 'h', label: 'h', source: 'C', target: 'D' },
  { id: 'k', label: 'k', source: 'A', target: 'C' },
];

const objectPositions: Record<string, { x: number; y: number }> = {
  A: { x: 60, y: 100 },
  B: { x: 160, y: 100 },
  C: { x: 260, y: 100 },
  D: { x: 360, y: 100 },
};

const hintSteps: HintStep[] = [
  {
    title: 'Select First Morphism',
    description: 'Click on any morphism (arrow) in the diagram or use the buttons below to select it. This will be the first morphism applied.',
    action: 'Click a morphism like "f: A→B"',
  },
  {
    title: 'Select Second Morphism',
    description: 'Now select a second morphism. For composition to work, the target of the first must match the source of the second.',
    action: 'Click a compatible morphism',
  },
  {
    title: 'View Composition Result',
    description: 'If the morphisms are composable, you\'ll see the result appear as a golden arc above the diagram. The notation g∘f means "first f, then g".',
  },
  {
    title: 'Experiment with Associativity',
    description: 'Try composing three morphisms in different orders: (h∘g)∘f vs h∘(g∘f). Both give the same result—this is associativity!',
    action: 'Try different combinations',
  },
];

const tips = [
  'Composition is read right-to-left: g∘f means "first f, then g"',
  'Two morphisms can only compose if their types match: target of first = source of second',
  'The dashed line k: A→C could be the composition g∘f',
  'In programming, this is like function composition: compose(g, f) or g(f(x))',
];

export default function MorphismComposer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [morphisms] = useState<Morphism[]>(initialMorphisms);
  const [selected, setSelected] = useState<string[]>([]);
  const [composition, setComposition] = useState<Morphism | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [isNewComposition, setIsNewComposition] = useState(false);

  // Check if two morphisms can be composed
  const canCompose = (m1: Morphism, m2: Morphism): boolean => {
    return m1.target === m2.source;
  };

  // Compose two morphisms
  const compose = (m1: Morphism, m2: Morphism): Morphism | null => {
    if (!canCompose(m1, m2)) return null;
    return {
      id: `${m2.id}∘${m1.id}`,
      label: `${m2.label}∘${m1.label}`,
      source: m1.source,
      target: m2.target,
    };
  };

  // Handle morphism selection
  const handleSelectMorphism = (morphismId: string) => {
    setError(null);
    setIsNewComposition(false);

    if (selected.includes(morphismId)) {
      // Deselect
      setSelected(selected.filter(id => id !== morphismId));
      setComposition(null);
    } else if (selected.length === 0) {
      // First selection
      setSelected([morphismId]);
      setComposition(null);
    } else if (selected.length === 1) {
      // Second selection - try to compose
      const m1 = morphisms.find(m => m.id === selected[0])!;
      const m2 = morphisms.find(m => m.id === morphismId)!;

      // Try both orders
      let comp = compose(m1, m2);
      if (!comp) {
        comp = compose(m2, m1);
        if (comp) {
          setSelected([morphismId, selected[0]]);
        }
      } else {
        setSelected([selected[0], morphismId]);
      }

      if (comp) {
        setComposition(comp);
        setIsNewComposition(true);
      } else {
        setError(`Cannot compose: ${m1.label} and ${m2.label} are not composable (target ≠ source)`);
        setSelected([morphismId]);
      }
    } else {
      // Reset and start new selection
      setSelected([morphismId]);
      setComposition(null);
    }
  };

  // Clear selection
  const clearSelection = () => {
    setSelected([]);
    setComposition(null);
    setError(null);
    setIsNewComposition(false);
  };

  // Draw diagram
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    svg.selectAll('*').remove();

    // Arrow markers with different colors
    const defs = svg.append('defs');

    // Default arrow
    defs.append('marker')
      .attr('id', 'mc-arrow')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 18)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-4 L 8,0 L 0,4')
      .attr('fill', 'var(--color-accent)');

    // Selected arrow
    defs.append('marker')
      .attr('id', 'mc-arrow-selected')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 18)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-4 L 8,0 L 0,4')
      .attr('fill', 'var(--color-success)');

    // Composition arrow
    defs.append('marker')
      .attr('id', 'mc-arrow-composition')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 18)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-4 L 8,0 L 0,4')
      .attr('fill', '#f59f00');

    // Glow filter for selected morphisms
    const filter = defs.append('filter')
      .attr('id', 'mc-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Draw morphisms
    morphisms.forEach(m => {
      const source = objectPositions[m.source];
      const target = objectPositions[m.target];
      if (!source || !target) return;

      const isSelected = selected.includes(m.id);

      // Calculate curve for non-adjacent morphisms
      const isAdjacent = Math.abs(
        Object.keys(objectPositions).indexOf(m.source) -
        Object.keys(objectPositions).indexOf(m.target)
      ) === 1;

      const group = svg.append('g')
        .attr('class', `morphism ${isSelected ? 'selected' : ''}`)
        .style('cursor', 'pointer')
        .on('click', () => handleSelectMorphism(m.id));

      if (isAdjacent) {
        const line = group.append('line')
          .attr('x1', source.x + 20)
          .attr('y1', source.y)
          .attr('x2', source.x + 20) // Start from source for animation
          .attr('y2', source.y)
          .attr('stroke', isSelected ? 'var(--color-success)' : 'var(--color-accent)')
          .attr('stroke-width', isSelected ? 3 : 2)
          .attr('marker-end', `url(#${isSelected ? 'mc-arrow-selected' : 'mc-arrow'})`);

        if (isSelected) {
          line.attr('filter', 'url(#mc-glow)');
        }

        // Animate line
        line.transition()
          .duration(400)
          .ease(d3.easeQuadOut)
          .attr('x2', target.x - 20)
          .attr('y2', target.y);

        group.append('text')
          .attr('x', (source.x + target.x) / 2)
          .attr('y', source.y - 15)
          .attr('text-anchor', 'middle')
          .attr('font-size', '14px')
          .attr('font-weight', isSelected ? 'bold' : 'normal')
          .attr('fill', isSelected ? 'var(--color-success)' : 'var(--color-text-primary)')
          .attr('opacity', 0)
          .text(m.label)
          .transition()
          .delay(200)
          .duration(300)
          .attr('opacity', 1);
      } else {
        // Curved path for non-adjacent
        const midX = (source.x + target.x) / 2;
        const path = group.append('path')
          .attr('d', `M ${source.x + 20} ${source.y} Q ${midX} ${source.y + 60} ${target.x - 20} ${target.y}`)
          .attr('fill', 'none')
          .attr('stroke', isSelected ? 'var(--color-success)' : 'var(--color-accent)')
          .attr('stroke-width', isSelected ? 3 : 2)
          .attr('stroke-dasharray', '4,4')
          .attr('marker-end', `url(#${isSelected ? 'mc-arrow-selected' : 'mc-arrow'})`);

        // Get path length for animation
        const pathLength = (path.node() as SVGPathElement)?.getTotalLength() || 100;
        path
          .attr('stroke-dasharray', `${pathLength} ${pathLength}`)
          .attr('stroke-dashoffset', pathLength)
          .transition()
          .duration(600)
          .ease(d3.easeQuadOut)
          .attr('stroke-dashoffset', 0)
          .on('end', function() {
            d3.select(this).attr('stroke-dasharray', '4,4');
          });

        group.append('text')
          .attr('x', midX)
          .attr('y', source.y + 45)
          .attr('text-anchor', 'middle')
          .attr('font-size', '14px')
          .attr('font-weight', isSelected ? 'bold' : 'normal')
          .attr('fill', isSelected ? 'var(--color-success)' : 'var(--color-text-primary)')
          .attr('opacity', 0)
          .text(m.label)
          .transition()
          .delay(300)
          .duration(300)
          .attr('opacity', 1);
      }
    });

    // Draw composition result if exists
    if (composition) {
      const source = objectPositions[composition.source];
      const target = objectPositions[composition.target];

      if (source && target) {
        const midX = (source.x + target.x) / 2;

        const compGroup = svg.append('g')
          .attr('class', `composition-result ${isNewComposition ? 'new-composition' : ''}`);

        const compPath = compGroup.append('path')
          .attr('d', `M ${source.x + 20} ${source.y} Q ${midX} ${source.y - 50} ${target.x - 20} ${target.y}`)
          .attr('fill', 'none')
          .attr('stroke', '#f59f00')
          .attr('stroke-width', 3)
          .attr('marker-end', 'url(#mc-arrow-composition)');

        // Animate composition path
        const pathLength = (compPath.node() as SVGPathElement)?.getTotalLength() || 100;
        compPath
          .attr('stroke-dasharray', `${pathLength} ${pathLength}`)
          .attr('stroke-dashoffset', pathLength)
          .transition()
          .duration(800)
          .ease(d3.easeQuadOut)
          .attr('stroke-dashoffset', 0);

        compGroup.append('text')
          .attr('x', midX)
          .attr('y', source.y - 55)
          .attr('text-anchor', 'middle')
          .attr('font-size', '14px')
          .attr('font-weight', 'bold')
          .attr('fill', '#f59f00')
          .attr('opacity', 0)
          .text(composition.label)
          .transition()
          .delay(500)
          .duration(400)
          .attr('opacity', 1);

        // Add pulsing highlight for new composition
        if (isNewComposition) {
          compGroup.append('circle')
            .attr('class', 'composition-pulse')
            .attr('cx', midX)
            .attr('cy', source.y - 50)
            .attr('r', 8)
            .attr('fill', 'rgba(245, 159, 0, 0.3)')
            .attr('stroke', 'none');
        }
      }
    }

    // Draw objects with entrance animation
    Object.entries(objectPositions).forEach(([id, pos], index) => {
      const group = svg.append('g')
        .attr('class', 'mc-object')
        .attr('transform', `translate(${pos.x}, ${pos.y})`)
        .attr('opacity', 0);

      group.append('circle')
        .attr('r', 18)
        .attr('fill', 'var(--color-bg-primary)')
        .attr('stroke', 'var(--color-accent)')
        .attr('stroke-width', 2);

      group.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('font-size', '16px')
        .attr('font-weight', 'bold')
        .attr('fill', 'var(--color-text-primary)')
        .text(id);

      // Staggered entrance animation
      group.transition()
        .delay(index * 80)
        .duration(400)
        .ease(d3.easeBackOut)
        .attr('opacity', 1);
    });

  }, [morphisms, selected, composition, isNewComposition]);

  return (
    <div className="morphism-composer">
      {showHint && (
        <SimulatorHint
          title="Morphism Composer"
          description="Learn how morphisms compose in a category. Composition is the fundamental operation that connects objects through chains of arrows."
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

      <div className="mc-canvas">
        <svg ref={svgRef} width="100%" height="200" viewBox="0 0 420 200" />
      </div>

      <div className="mc-controls">
        <div className="mc-morphisms">
          <span className="mc-label">Morphisms:</span>
          {morphisms.map(m => (
            <button
              key={m.id}
              className={`mc-morphism-btn ${selected.includes(m.id) ? 'selected' : ''}`}
              onClick={() => handleSelectMorphism(m.id)}
            >
              {m.label}: {m.source}→{m.target}
            </button>
          ))}
        </div>
        <button className="btn btn-ghost btn-sm" onClick={clearSelection}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
          Clear
        </button>
      </div>

      {error && (
        <div className="mc-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {composition && (
        <div className={`mc-result ${isNewComposition ? 'animate-in' : ''}`}>
          <div className="result-header">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span className="result-label">Composition Result</span>
          </div>
          <div className="result-value">
            <span className="composition-name">{composition.label}</span>
            <span className="composition-type">: {composition.source} → {composition.target}</span>
          </div>
          <div className="result-explanation">
            Read as "{selected[1]} after {selected[0]}" — first apply {selected[0]}, then apply {selected[1]}
          </div>
        </div>
      )}

      {selected.length === 1 && !composition && (
        <div className="mc-selection-hint">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <span>
            Selected <strong>{selected[0]}</strong> — now click a compatible morphism to compose
          </span>
        </div>
      )}
    </div>
  );
}
