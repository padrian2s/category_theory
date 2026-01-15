import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import SimulatorHint, { HintStep } from './SimulatorHint';
import './NaturalTransformationVisualizer.css';

interface NTObject {
  id: string;
  label: string;
}

interface NTMorphism {
  id: string;
  label: string;
  source: string;
  target: string;
}

interface Preset {
  name: string;
  description: string;
  sourceObjects: NTObject[];
  sourceMorphism: NTMorphism;
  components: { objectId: string; label: string }[];
}

const presets: Preset[] = [
  {
    name: 'List reverse',
    description: 'rev: Seq → Seq reverses a sequence',
    sourceObjects: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
    ],
    sourceMorphism: { id: 'f', label: 'f', source: 'A', target: 'B' },
    components: [
      { objectId: 'A', label: 'rev' },
      { objectId: 'B', label: 'rev' },
    ],
  },
  {
    name: 'List singleton',
    description: 'η: Id → List wraps element in list',
    sourceObjects: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
    ],
    sourceMorphism: { id: 'f', label: 'f', source: 'A', target: 'B' },
    components: [
      { objectId: 'A', label: 'η' },
      { objectId: 'B', label: 'η' },
    ],
  },
  {
    name: 'Flatten (join)',
    description: 'μ: List∘List → List flattens nested lists',
    sourceObjects: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
    ],
    sourceMorphism: { id: 'f', label: 'f', source: 'A', target: 'B' },
    components: [
      { objectId: 'A', label: 'μ' },
      { objectId: 'B', label: 'μ' },
    ],
  },
];

const hintSteps: HintStep[] = [
  {
    title: 'Select an Example',
    description: 'Choose from different natural transformations like list reverse, singleton, or flatten. Each shows how a transformation works across all objects.',
    action: 'Use the dropdown to select an example',
  },
  {
    title: 'Understand the Square',
    description: 'The diagram shows a "naturality square" with four corners: F(A), F(B), G(A), G(B). F and G are functors, and we\'re transforming from F to G.',
  },
  {
    title: 'Compare the Paths',
    description: 'There are two paths from F(A) to G(B). The green path goes right then down. The orange path goes down then right. Naturality means both paths are equal!',
    action: 'Click "Top Path" or "Bottom Path" to highlight',
  },
  {
    title: 'Animate the Commutation',
    description: 'Watch both paths animate to see how the square "commutes" — meaning both ways around give the same result.',
    action: 'Click "Animate Paths"',
  },
];

const tips = [
  'Naturality ensures transformations are "uniform" across all objects',
  'Every functor has a natural transformation to itself: the identity',
  'Natural transformations compose: if η: F→G and θ: G→H, then θ∘η: F→H',
  'In programming: map preserves natural transformations',
];

export default function NaturalTransformationVisualizer() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activePreset, setActivePreset] = useState(0);
  const [highlightPath, setHighlightPath] = useState<'top' | 'bottom' | 'both'>('both');
  const [animating, setAnimating] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const preset = presets[activePreset];

  // Draw the naturality square
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 380;

    svg.selectAll('*').remove();

    // Define arrow markers
    const defs = svg.append('defs');

    defs.append('marker')
      .attr('id', 'nt-arrow')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-4 L 8,0 L 0,4')
      .attr('fill', 'var(--color-accent)');

    defs.append('marker')
      .attr('id', 'nt-arrow-green')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-4 L 8,0 L 0,4')
      .attr('fill', 'var(--color-success)');

    defs.append('marker')
      .attr('id', 'nt-arrow-orange')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-4 L 8,0 L 0,4')
      .attr('fill', '#f59f00');

    defs.append('marker')
      .attr('id', 'nt-arrow-muted')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 8)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-4 L 8,0 L 0,4')
      .attr('fill', 'var(--color-text-muted)');

    // Glow filter
    const glowFilter = defs.append('filter')
      .attr('id', 'nt-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '2')
      .attr('result', 'coloredBlur');

    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Positions for the naturality square
    const positions = {
      FA: { x: 80, y: 70 },
      FB: { x: 300, y: 70 },
      GA: { x: 80, y: 210 },
      GB: { x: 300, y: 210 },
    };

    // Labels
    const functorF = 'F';
    const functorG = 'G';
    const f = preset.sourceMorphism.label;
    const etaA = preset.components[0]?.label || 'η';
    const etaB = preset.components[1]?.label || 'η';

    // Draw the square outline with animation
    svg.append('rect')
      .attr('x', 50)
      .attr('y', 40)
      .attr('width', 0)
      .attr('height', 0)
      .attr('fill', 'none')
      .attr('stroke', 'var(--color-border)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '4,4')
      .attr('rx', 8)
      .transition()
      .duration(600)
      .ease(d3.easeQuadOut)
      .attr('width', 280)
      .attr('height', 200);

    // Draw morphisms (arrows) with animation
    const drawArrow = (
      x1: number, y1: number, x2: number, y2: number,
      label: string, color: string, markerEnd: string,
      labelOffset: { x: number; y: number },
      delay: number,
      isHighlighted: boolean
    ) => {
      const group = svg.append('g')
        .attr('class', `nt-arrow ${isHighlighted ? 'highlighted' : ''}`);

      const line = group.append('line')
        .attr('x1', x1)
        .attr('y1', y1)
        .attr('x2', x1)
        .attr('y2', y1)
        .attr('stroke', color)
        .attr('stroke-width', isHighlighted ? 3 : 2)
        .attr('marker-end', `url(#${markerEnd})`);

      if (isHighlighted) {
        line.attr('filter', 'url(#nt-glow)');
      }

      // Animate line
      line.transition()
        .delay(delay)
        .duration(500)
        .ease(d3.easeQuadOut)
        .attr('x2', x2 - 15)
        .attr('y2', y2);

      group.append('text')
        .attr('x', (x1 + x2) / 2 + labelOffset.x)
        .attr('y', (y1 + y2) / 2 + labelOffset.y)
        .attr('text-anchor', 'middle')
        .attr('font-size', '14px')
        .attr('font-weight', isHighlighted ? 'bold' : '500')
        .attr('fill', color)
        .attr('opacity', 0)
        .text(label)
        .transition()
        .delay(delay + 300)
        .duration(300)
        .attr('opacity', 1);
    };

    // Top path highlighting
    const topHighlight = highlightPath === 'top' || highlightPath === 'both';
    const bottomHighlight = highlightPath === 'bottom' || highlightPath === 'both';

    const topColor = topHighlight ? 'var(--color-success)' : 'var(--color-text-muted)';
    const topMarker = topHighlight ? 'nt-arrow-green' : 'nt-arrow-muted';

    const bottomColor = bottomHighlight ? '#f59f00' : 'var(--color-text-muted)';
    const bottomMarker = bottomHighlight ? 'nt-arrow-orange' : 'nt-arrow-muted';

    // Top horizontal: F(f): F(A) → F(B)
    drawArrow(
      positions.FA.x + 25, positions.FA.y,
      positions.FB.x - 25, positions.FB.y,
      `${functorF}(${f})`,
      topColor,
      topMarker,
      { x: 0, y: -12 },
      200,
      topHighlight
    );

    // Bottom horizontal: G(f): G(A) → G(B)
    drawArrow(
      positions.GA.x + 25, positions.GA.y,
      positions.GB.x - 25, positions.GB.y,
      `${functorG}(${f})`,
      bottomColor,
      bottomMarker,
      { x: 0, y: 20 },
      600,
      bottomHighlight
    );

    // Left vertical: η_A: F(A) → G(A)
    drawArrow(
      positions.FA.x, positions.FA.y + 25,
      positions.GA.x, positions.GA.y - 25,
      `${etaA}_A`,
      bottomColor,
      bottomMarker,
      { x: -25, y: 0 },
      400,
      bottomHighlight
    );

    // Right vertical: η_B: F(B) → G(B)
    drawArrow(
      positions.FB.x, positions.FB.y + 25,
      positions.GB.x, positions.GB.y - 25,
      `${etaB}_B`,
      topColor,
      topMarker,
      { x: 25, y: 0 },
      500,
      topHighlight
    );

    // Draw nodes (objects) with entrance animation
    const drawNode = (x: number, y: number, label: string, sublabel: string, delay: number) => {
      const group = svg.append('g')
        .attr('class', 'nt-node')
        .attr('transform', `translate(${x}, ${y})`)
        .attr('opacity', 0);

      group.append('circle')
        .attr('r', 0)
        .attr('fill', 'var(--color-bg-primary)')
        .attr('stroke', 'var(--color-accent)')
        .attr('stroke-width', 2)
        .transition()
        .delay(delay)
        .duration(400)
        .ease(d3.easeBackOut.overshoot(1.5))
        .attr('r', 22);

      group.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.1em')
        .attr('font-size', '13px')
        .attr('font-weight', 'bold')
        .attr('fill', 'var(--color-text-primary)')
        .attr('opacity', 0)
        .text(label)
        .transition()
        .delay(delay + 200)
        .duration(300)
        .attr('opacity', 1);

      group.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1.1em')
        .attr('font-size', '10px')
        .attr('fill', 'var(--color-text-muted)')
        .attr('opacity', 0)
        .text(sublabel)
        .transition()
        .delay(delay + 250)
        .duration(300)
        .attr('opacity', 1);

      group.transition()
        .delay(delay)
        .duration(400)
        .attr('opacity', 1);
    };

    drawNode(positions.FA.x, positions.FA.y, `${functorF}(A)`, 'F applied to A', 0);
    drawNode(positions.FB.x, positions.FB.y, `${functorF}(B)`, 'F applied to B', 100);
    drawNode(positions.GA.x, positions.GA.y, `${functorG}(A)`, 'G applied to A', 150);
    drawNode(positions.GB.x, positions.GB.y, `${functorG}(B)`, 'G applied to B', 200);

    // Draw path annotations with animation
    if (highlightPath === 'both' || highlightPath === 'top') {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 25)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', 'var(--color-success)')
        .attr('opacity', 0)
        .text(`Top path: ${etaB}_B ∘ ${functorF}(${f})`)
        .transition()
        .delay(700)
        .duration(400)
        .attr('opacity', 1);
    }

    if (highlightPath === 'both' || highlightPath === 'bottom') {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', 268)
        .attr('text-anchor', 'middle')
        .attr('font-size', '11px')
        .attr('fill', '#f59f00')
        .attr('opacity', 0)
        .text(`Bottom path: ${functorG}(${f}) ∘ ${etaA}_A`)
        .transition()
        .delay(800)
        .duration(400)
        .attr('opacity', 1);
    }

    // Add "COMMUTES" indicator when both paths are shown
    if (highlightPath === 'both') {
      const commutesGroup = svg.append('g')
        .attr('class', 'commutes-indicator')
        .attr('transform', `translate(${width / 2}, 140)`)
        .attr('opacity', 0);

      commutesGroup.append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .attr('font-weight', 'bold')
        .attr('fill', 'var(--color-accent)')
        .text('COMMUTES');

      commutesGroup.transition()
        .delay(1000)
        .duration(500)
        .attr('opacity', 1);
    }

  }, [activePreset, highlightPath, preset]);

  const handleAnimate = () => {
    if (animating) return;
    setAnimating(true);

    // Animate through the paths
    setHighlightPath('top');
    setTimeout(() => setHighlightPath('bottom'), 1200);
    setTimeout(() => {
      setHighlightPath('both');
      setAnimating(false);
    }, 2400);
  };

  return (
    <div className="nt-visualizer">
      {showHint && (
        <SimulatorHint
          title="Natural Transformation Visualizer"
          description="See how natural transformations connect functors through commutative diagrams. Naturality is the fundamental coherence condition in category theory."
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

      <div className="nt-controls">
        <div className="preset-selector">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <label>Example:</label>
          <select
            value={activePreset}
            onChange={(e) => setActivePreset(Number(e.target.value))}
          >
            {presets.map((p, i) => (
              <option key={i} value={i}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="path-buttons">
          <button
            className={`btn btn-sm ${highlightPath === 'top' ? 'btn-success' : 'btn-ghost'}`}
            onClick={() => setHighlightPath('top')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7" />
            </svg>
            Top Path
          </button>
          <button
            className={`btn btn-sm ${highlightPath === 'bottom' ? 'btn-warning' : 'btn-ghost'}`}
            onClick={() => setHighlightPath('bottom')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 19l7-7" />
            </svg>
            Bottom Path
          </button>
          <button
            className={`btn btn-sm ${highlightPath === 'both' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setHighlightPath('both')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            Both
          </button>
        </div>
      </div>

      <div className="nt-description">
        <strong>{preset.name}:</strong> {preset.description}
      </div>

      <div className={`nt-canvas ${animating ? 'animating' : ''}`}>
        <svg ref={svgRef} width="100%" height="280" viewBox="0 0 380 280" />
      </div>

      <div className={`nt-equation ${highlightPath === 'both' ? 'highlight' : ''}`}>
        <div className="equation-title">Naturality Condition</div>
        <div className="equation-content">
          <span className={`path-top ${highlightPath === 'top' || highlightPath === 'both' ? 'active' : ''}`}>
            η_B ∘ F(f)
          </span>
          <span className="equals">=</span>
          <span className={`path-bottom ${highlightPath === 'bottom' || highlightPath === 'both' ? 'active' : ''}`}>
            G(f) ∘ η_A
          </span>
        </div>
        <div className="equation-description">
          Both paths from F(A) to G(B) must be equal
        </div>
      </div>

      <div className="nt-actions">
        <button
          className={`btn btn-primary ${animating ? 'animating' : ''}`}
          onClick={handleAnimate}
          disabled={animating}
        >
          {animating ? (
            <>
              <svg className="spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Animating...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Animate Paths
            </>
          )}
        </button>
      </div>

      <div className="nt-explanation">
        <h4>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          Understanding Naturality
        </h4>
        <p>
          A <strong>natural transformation</strong> η: F → G between functors
          consists of component morphisms η_A: F(A) → G(A) for each object A,
          such that the naturality square commutes.
        </p>
        <ul>
          <li>
            <span className="path-label top">Green path</span>: First apply F(f), then η_B
          </li>
          <li>
            <span className="path-label bottom">Orange path</span>: First apply η_A, then G(f)
          </li>
          <li>
            <strong>Naturality</strong> means both paths give the same result!
          </li>
        </ul>
      </div>
    </div>
  );
}
