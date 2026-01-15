import { useState, useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import SimulatorHint, { HintStep } from './SimulatorHint';
import './CategoryBuilder.css';

interface CategoryObject {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface Morphism {
  id: string;
  label: string;
  source: string;
  target: string;
}

const hintSteps: HintStep[] = [
  {
    title: 'Add Objects',
    description: 'Objects are the "things" in your category. They could represent sets, types, or any mathematical structure.',
    action: 'Click "+ Object" to add a new object',
  },
  {
    title: 'Add Morphisms',
    description: 'Morphisms are arrows between objects. They represent relationships like functions, mappings, or transformations.',
    action: 'Click "+ Morphism", then click a source object and target object',
  },
  {
    title: 'Drag to Arrange',
    description: 'Organize your category diagram by dragging objects to new positions. The morphism arrows will follow.',
    action: 'Click and drag any object to reposition it',
  },
  {
    title: 'Check Category Axioms',
    description: 'A valid category must have identity morphisms and be closed under composition. The status bar shows if your category is valid.',
    action: 'Watch the verification status as you add morphisms',
  },
];

const tips = [
  'Every object has an implicit identity morphism (not shown)',
  'Composition must be associative: (h∘g)∘f = h∘(g∘f)',
  'If f: A→B and g: B→C exist, then g∘f: A→C should exist',
  'Click an object to select it, then click Delete to remove it',
];

export default function CategoryBuilder() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [objects, setObjects] = useState<CategoryObject[]>([
    { id: 'A', label: 'A', x: 80, y: 80 },
    { id: 'B', label: 'B', x: 220, y: 80 },
    { id: 'C', label: 'C', x: 150, y: 180 },
  ]);
  const [morphisms, setMorphisms] = useState<Morphism[]>([
    { id: 'f', label: 'f', source: 'A', target: 'B' },
    { id: 'g', label: 'g', source: 'B', target: 'C' },
    { id: 'gf', label: 'g∘f', source: 'A', target: 'C' },
  ]);
  const [selectedObject, setSelectedObject] = useState<string | null>(null);
  const [isAddingMorphism, setIsAddingMorphism] = useState(false);
  const [morphismSource, setMorphismSource] = useState<string | null>(null);
  const [nextLabel, setNextLabel] = useState('D');
  const [showHint, setShowHint] = useState(true);
  const [animatingMorphism, setAnimatingMorphism] = useState<string | null>(null);
  const [verification, setVerification] = useState({
    hasIdentities: true,
    compositionClosed: true,
    message: 'Valid category structure',
  });

  // Add new object with animation
  const addObject = () => {
    const newObj: CategoryObject = {
      id: nextLabel,
      label: nextLabel,
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 120,
    };
    setObjects([...objects, newObj]);
    setNextLabel(String.fromCharCode(nextLabel.charCodeAt(0) + 1));
  };

  // Start adding morphism
  const startAddMorphism = () => {
    setIsAddingMorphism(true);
    setMorphismSource(null);
    setSelectedObject(null);
  };

  // Cancel adding morphism
  const cancelAddMorphism = () => {
    setIsAddingMorphism(false);
    setMorphismSource(null);
  };

  // Handle object click
  const handleObjectClick = useCallback((objId: string) => {
    if (isAddingMorphism) {
      if (!morphismSource) {
        setMorphismSource(objId);
      } else if (morphismSource !== objId) {
        // Create new morphism
        const existingLabels = morphisms.map((m) => m.label);
        let newLabel = 'f';
        let i = 0;
        while (existingLabels.includes(newLabel)) {
          newLabel = String.fromCharCode('f'.charCodeAt(0) + (++i));
          if (i > 20) newLabel = `f${i}`;
        }

        const newMorphismId = `${morphismSource}-${objId}-${Date.now()}`;
        const newMorphism: Morphism = {
          id: newMorphismId,
          label: newLabel,
          source: morphismSource,
          target: objId,
        };
        setMorphisms([...morphisms, newMorphism]);
        setAnimatingMorphism(newMorphismId);
        setTimeout(() => setAnimatingMorphism(null), 600);
        setIsAddingMorphism(false);
        setMorphismSource(null);
      }
    } else {
      setSelectedObject(selectedObject === objId ? null : objId);
    }
  }, [isAddingMorphism, morphismSource, morphisms, selectedObject]);

  // Clear category
  const clearCategory = () => {
    setObjects([]);
    setMorphisms([]);
    setNextLabel('A');
    setSelectedObject(null);
  };

  // Reset to example
  const resetToExample = () => {
    setObjects([
      { id: 'A', label: 'A', x: 80, y: 80 },
      { id: 'B', label: 'B', x: 220, y: 80 },
      { id: 'C', label: 'C', x: 150, y: 180 },
    ]);
    setMorphisms([
      { id: 'f', label: 'f', source: 'A', target: 'B' },
      { id: 'g', label: 'g', source: 'B', target: 'C' },
      { id: 'gf', label: 'g∘f', source: 'A', target: 'C' },
    ]);
    setNextLabel('D');
    setSelectedObject(null);
  };

  // Delete selected object
  const deleteSelected = () => {
    if (selectedObject) {
      setObjects(objects.filter((o) => o.id !== selectedObject));
      setMorphisms(morphisms.filter(
        (m) => m.source !== selectedObject && m.target !== selectedObject
      ));
      setSelectedObject(null);
    }
  };

  // Verify category axioms
  useEffect(() => {
    let message = 'Valid category structure';
    let compositionClosed = true;

    if (objects.length === 0) {
      message = 'Empty category (valid)';
    } else if (morphisms.length === 0) {
      message = 'Only identity morphisms present';
    } else {
      const composablePairs: string[] = [];
      morphisms.forEach((m1) => {
        morphisms.forEach((m2) => {
          if (m1.target === m2.source && m1.id !== m2.id) {
            const compositionExists = morphisms.some(
              (m) => m.source === m1.source && m.target === m2.target
            );
            if (!compositionExists) {
              composablePairs.push(`${m2.label}∘${m1.label}`);
            }
          }
        });
      });

      if (composablePairs.length > 0) {
        compositionClosed = false;
        message = `Missing compositions: ${composablePairs.slice(0, 3).join(', ')}${composablePairs.length > 3 ? '...' : ''}`;
      }
    }

    setVerification({ hasIdentities: true, compositionClosed, message });
  }, [objects, morphisms]);

  // D3 rendering with animations
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 300;
    const height = 220;

    // Transition duration
    const duration = 300;

    // Clear previous content
    svg.selectAll('*').remove();

    // Define arrow markers
    const defs = svg.append('defs');

    const createMarker = (id: string, color: string) => {
      defs.append('marker')
        .attr('id', id)
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 20)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('path')
        .attr('d', 'M 0,-5 L 10,0 L 0,5')
        .attr('fill', color);
    };

    createMarker('arrowhead', 'var(--color-accent)');
    createMarker('arrowhead-new', 'var(--color-success)');
    createMarker('arrowhead-source', '#f59f00');

    // Draw morphisms (arrows)
    const linkGroup = svg.append('g').attr('class', 'links');

    morphisms.forEach((morphism) => {
      const source = objects.find((o) => o.id === morphism.source);
      const target = objects.find((o) => o.id === morphism.target);

      if (!source || !target) return;

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist === 0) return;

      const nodeRadius = 20;
      const startX = source.x + (dx / dist) * nodeRadius;
      const startY = source.y + (dy / dist) * nodeRadius;
      const endX = target.x - (dx / dist) * nodeRadius;
      const endY = target.y - (dy / dist) * nodeRadius;

      const hasReverse = morphisms.some(
        (m) => m.source === morphism.target && m.target === morphism.source
      );

      const isNew = morphism.id === animatingMorphism;
      const link = linkGroup.append('g')
        .attr('class', `link ${isNew ? 'new-morphism' : ''}`);

      if (hasReverse) {
        const midX = (startX + endX) / 2;
        const midY = (startY + endY) / 2;
        const perpX = -(endY - startY) / dist * 25;
        const perpY = (endX - startX) / dist * 25;

        const path = link.append('path')
          .attr('fill', 'none')
          .attr('stroke', isNew ? 'var(--color-success)' : 'var(--color-accent)')
          .attr('stroke-width', 2)
          .attr('marker-end', `url(#${isNew ? 'arrowhead-new' : 'arrowhead'})`);

        if (isNew) {
          path
            .attr('d', `M ${startX} ${startY} Q ${startX} ${startY} ${startX} ${startY}`)
            .transition()
            .duration(duration)
            .attr('d', `M ${startX} ${startY} Q ${midX + perpX} ${midY + perpY} ${endX} ${endY}`);
        } else {
          path.attr('d', `M ${startX} ${startY} Q ${midX + perpX} ${midY + perpY} ${endX} ${endY}`);
        }

        link.append('text')
          .attr('x', midX + perpX * 1.5)
          .attr('y', midY + perpY * 1.5)
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .attr('font-weight', isNew ? 'bold' : 'normal')
          .attr('fill', isNew ? 'var(--color-success)' : 'var(--color-text-primary)')
          .style('opacity', isNew ? 0 : 1)
          .text(morphism.label)
          .transition()
          .duration(duration)
          .style('opacity', 1);
      } else {
        const line = link.append('line')
          .attr('stroke', isNew ? 'var(--color-success)' : 'var(--color-accent)')
          .attr('stroke-width', 2)
          .attr('marker-end', `url(#${isNew ? 'arrowhead-new' : 'arrowhead'})`);

        if (isNew) {
          line
            .attr('x1', startX)
            .attr('y1', startY)
            .attr('x2', startX)
            .attr('y2', startY)
            .transition()
            .duration(duration)
            .attr('x2', endX)
            .attr('y2', endY);
        } else {
          line
            .attr('x1', startX)
            .attr('y1', startY)
            .attr('x2', endX)
            .attr('y2', endY);
        }

        const labelX = (startX + endX) / 2;
        const labelY = (startY + endY) / 2 - 10;
        link.append('text')
          .attr('x', labelX)
          .attr('y', labelY)
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .attr('font-weight', isNew ? 'bold' : 'normal')
          .attr('fill', isNew ? 'var(--color-success)' : 'var(--color-text-primary)')
          .style('opacity', isNew ? 0 : 1)
          .text(morphism.label)
          .transition()
          .duration(duration)
          .style('opacity', 1);
      }
    });

    // Draw objects (circles)
    const nodeGroup = svg.append('g').attr('class', 'nodes');

    objects.forEach((obj) => {
      const isSelected = selectedObject === obj.id;
      const isSource = morphismSource === obj.id;
      const isNewObj = obj.label === String.fromCharCode(nextLabel.charCodeAt(0) - 1);

      const node = nodeGroup.append('g')
        .attr('class', `node ${isSelected ? 'selected' : ''} ${isSource ? 'source' : ''}`)
        .attr('transform', `translate(${obj.x}, ${obj.y})`)
        .style('cursor', isAddingMorphism ? 'crosshair' : 'pointer')
        .on('click', (event) => {
          event.stopPropagation();
          handleObjectClick(obj.id);
        });

      // Glow effect for source
      if (isSource) {
        node.append('circle')
          .attr('r', 28)
          .attr('fill', 'none')
          .attr('stroke', '#f59f00')
          .attr('stroke-width', 2)
          .attr('stroke-dasharray', '4,4')
          .style('opacity', 0.6)
          .attr('class', 'pulse-ring');
      }

      // Main circle
      const circle = node.append('circle')
        .attr('fill', isSelected ? 'var(--color-accent)' : 'var(--color-bg-primary)')
        .attr('stroke', isSource ? '#f59f00' : 'var(--color-accent)')
        .attr('stroke-width', isSource ? 3 : 2);

      if (isNewObj && objects.length > 1) {
        circle
          .attr('r', 0)
          .transition()
          .duration(300)
          .attr('r', 20);
      } else {
        circle.attr('r', 20);
      }

      // Label
      node.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', isSelected ? 'white' : 'var(--color-text-primary)')
        .style('pointer-events', 'none')
        .text(obj.label);
    });

    // Drag behavior
    const drag = d3.drag<SVGGElement, unknown>()
      .on('start', function() {
        d3.select(this).raise();
      })
      .on('drag', function (event) {
        const node = d3.select(this);
        const label = node.select('text').text();
        const objIndex = objects.findIndex((o) => o.label === label);

        if (objIndex !== -1) {
          const newX = Math.max(25, Math.min(width - 25, event.x));
          const newY = Math.max(25, Math.min(height - 25, event.y));

          const newObjects = [...objects];
          newObjects[objIndex] = {
            ...newObjects[objIndex],
            x: newX,
            y: newY,
          };
          setObjects(newObjects);
        }
      });

    nodeGroup.selectAll<SVGGElement, unknown>('.node').call(drag);

  }, [objects, morphisms, selectedObject, morphismSource, animatingMorphism, handleObjectClick, nextLabel, isAddingMorphism]);

  return (
    <div className="category-builder">
      {showHint && (
        <SimulatorHint
          title="Category Builder"
          description="Build your own category by adding objects and morphisms. Explore how composition works and verify category axioms."
          steps={hintSteps}
          tips={tips}
          onDismiss={() => setShowHint(false)}
          compact={false}
        />
      )}

      <div className="builder-toolbar">
        <button className="btn btn-primary btn-sm" onClick={addObject}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Object
        </button>
        <button
          className={`btn btn-sm ${isAddingMorphism ? 'btn-warning' : 'btn-secondary'}`}
          onClick={isAddingMorphism ? cancelAddMorphism : startAddMorphism}
        >
          {isAddingMorphism ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              {morphismSource ? 'Click target...' : 'Click source...'}
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
              Morphism
            </>
          )}
        </button>
        {selectedObject && (
          <button className="btn btn-ghost btn-sm text-danger" onClick={deleteSelected}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Delete
          </button>
        )}
        <div className="toolbar-spacer" />
        <button className="btn btn-ghost btn-sm" onClick={resetToExample} title="Reset to example">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
        <button className="btn btn-ghost btn-sm" onClick={clearCategory} title="Clear all">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          </svg>
        </button>
        {!showHint && (
          <button className="btn btn-ghost btn-sm" onClick={() => setShowHint(true)} title="Show help">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </button>
        )}
      </div>

      <div className="builder-canvas">
        <svg ref={svgRef} width="100%" height="220" viewBox="0 0 300 220" />
        {objects.length === 0 && (
          <div className="canvas-empty-state">
            <p>Click "+ Object" to add your first object</p>
          </div>
        )}
      </div>

      <div className="builder-info">
        <div className="info-section">
          <h4>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
            </svg>
            Objects ({objects.length})
          </h4>
          <div className="info-list">
            {objects.length === 0 ? (
              <span className="text-muted">None yet</span>
            ) : (
              objects.map((o) => (
                <span
                  key={o.id}
                  className={`object-tag ${selectedObject === o.id ? 'selected' : ''}`}
                  onClick={() => setSelectedObject(selectedObject === o.id ? null : o.id)}
                >
                  {o.label}
                </span>
              ))
            )}
          </div>
        </div>
        <div className="info-section">
          <h4>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            Morphisms ({morphisms.length})
          </h4>
          <div className="info-list morphism-list">
            {morphisms.length === 0 ? (
              <span className="text-muted">Only identities</span>
            ) : (
              morphisms.map((m) => (
                <span key={m.id} className="morphism-tag">
                  {m.label}: {m.source}→{m.target}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      <div className={`builder-verification ${verification.compositionClosed ? 'valid' : 'warning'}`}>
        <span className="verification-icon">
          {verification.compositionClosed ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          )}
        </span>
        <span className="verification-message">{verification.message}</span>
      </div>
    </div>
  );
}
