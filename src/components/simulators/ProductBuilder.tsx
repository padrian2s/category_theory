import { useState, useRef, useEffect } from 'react';
import * as d3 from 'd3';
import SimulatorHint, { HintStep } from './SimulatorHint';
import './ProductBuilder.css';

type ConstructionType = 'product' | 'coproduct';

const hintSteps: HintStep[] = [
  {
    title: 'Choose Construction Type',
    description: 'Toggle between Product (×) and Coproduct (+) to see how these dual constructions differ. Products combine data, coproducts represent alternatives.',
    action: 'Click "Product" or "Coproduct" buttons',
  },
  {
    title: 'Observe the Structure',
    description: 'For products, arrows point OUT from A×B to A and B (projections). For coproducts, arrows point IN from A and B to A+B (injections).',
  },
  {
    title: 'Explore Universal Property',
    description: 'Check "Show universal property" to see what makes products/coproducts special: any other object with the same pattern factors through them uniquely.',
    action: 'Enable the checkbox',
  },
  {
    title: 'Understand the Diagram',
    description: 'The dashed arrow represents the UNIQUE morphism that exists by the universal property. This is what defines products/coproducts categorically.',
  },
];

const tips = [
  'Products and coproducts are dual: reverse all arrows to go from one to the other',
  'In programming: Product ≈ Tuple/Struct, Coproduct ≈ Union/Either type',
  'The universal property ensures uniqueness up to isomorphism',
  'Products have projections (π), coproducts have injections (ι)',
];

export default function ProductBuilder() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [constructionType, setConstructionType] = useState<ConstructionType>('product');
  const [showUniversal, setShowUniversal] = useState(false);
  const [factors] = useState(['A', 'B']);
  const [testObject] = useState('X');
  const [showHint, setShowHint] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle type change with animation
  const handleTypeChange = (type: ConstructionType) => {
    if (type !== constructionType) {
      setIsAnimating(true);
      setConstructionType(type);
      setTimeout(() => setIsAnimating(false), 800);
    }
  };

  // Handle universal property toggle with animation
  const handleUniversalToggle = (checked: boolean) => {
    setIsAnimating(true);
    setShowUniversal(checked);
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Draw the universal property diagram
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = 380;

    svg.selectAll('*').remove();

    // Arrow markers
    const defs = svg.append('defs');

    ['blue', 'green', 'orange', 'dashed'].forEach(color => {
      const colorMap: Record<string, string> = {
        blue: 'var(--color-accent)',
        green: 'var(--color-success)',
        orange: '#f59f00',
        dashed: 'var(--color-text-muted)',
      };

      defs.append('marker')
        .attr('id', `pb-arrow-${color}`)
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 16)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 5)
        .attr('markerHeight', 5)
        .append('path')
        .attr('d', 'M 0,-4 L 8,0 L 0,4')
        .attr('fill', colorMap[color]);
    });

    // Glow filter
    const glowFilter = defs.append('filter')
      .attr('id', 'pb-glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');

    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    const isProduct = constructionType === 'product';

    // Positions
    const positions = {
      product: { x: width / 2, y: 80 },  // A×B or A+B
      A: { x: 100, y: 200 },
      B: { x: 280, y: 200 },
      X: { x: width / 2, y: 30 },  // Test object for universal property
    };

    const productLabel = isProduct ? `${factors[0]}×${factors[1]}` : `${factors[0]}+${factors[1]}`;
    const projLabel1 = isProduct ? 'π₁' : 'ι₁';
    const projLabel2 = isProduct ? 'π₂' : 'ι₂';

    // Draw arrow with animation
    const drawArrow = (
      x1: number, y1: number, x2: number, y2: number,
      label: string, color: string, dashed = false, delay = 0
    ) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const offsetX = (dx / len) * 18;
      const offsetY = (dy / len) * 18;

      const startX = x1 + offsetX;
      const startY = y1 + offsetY;
      const endX = x2 - offsetX;
      const endY = y2 - offsetY;

      const group = svg.append('g').attr('class', 'arrow-group');

      const line = group.append('line')
        .attr('x1', startX)
        .attr('y1', startY)
        .attr('x2', startX)
        .attr('y2', startY)
        .attr('stroke', color)
        .attr('stroke-width', 2)
        .attr('marker-end', `url(#pb-arrow-${dashed ? 'dashed' : color === 'var(--color-accent)' ? 'blue' : color === 'var(--color-success)' ? 'green' : 'orange'})`);

      if (dashed) {
        line.attr('stroke-dasharray', '5,5');
      }

      // Animate line
      line.transition()
        .delay(delay)
        .duration(500)
        .ease(d3.easeQuadOut)
        .attr('x2', endX)
        .attr('y2', endY);

      // Label position (perpendicular offset)
      const perpX = -dy / len * 15;
      const perpY = dx / len * 15;

      group.append('text')
        .attr('x', (startX + endX) / 2 + perpX)
        .attr('y', (startY + endY) / 2 + perpY)
        .attr('text-anchor', 'middle')
        .attr('font-size', '13px')
        .attr('font-weight', '500')
        .attr('fill', dashed ? 'var(--color-text-muted)' : color)
        .attr('opacity', 0)
        .text(label)
        .transition()
        .delay(delay + 300)
        .duration(300)
        .attr('opacity', 1);
    };

    // Draw projection/injection arrows
    if (isProduct) {
      // Product: arrows go OUT from product to factors
      drawArrow(
        positions.product.x, positions.product.y,
        positions.A.x, positions.A.y,
        projLabel1, 'var(--color-accent)', false, 200
      );
      drawArrow(
        positions.product.x, positions.product.y,
        positions.B.x, positions.B.y,
        projLabel2, 'var(--color-accent)', false, 350
      );
    } else {
      // Coproduct: arrows go IN from factors to coproduct
      drawArrow(
        positions.A.x, positions.A.y,
        positions.product.x, positions.product.y,
        projLabel1, 'var(--color-accent)', false, 200
      );
      drawArrow(
        positions.B.x, positions.B.y,
        positions.product.x, positions.product.y,
        projLabel2, 'var(--color-accent)', false, 350
      );
    }

    // Draw universal property if enabled
    if (showUniversal) {
      if (isProduct) {
        // Product universal property:
        // X with f: X→A and g: X→B induces unique ⟨f,g⟩: X→A×B
        drawArrow(
          positions.X.x - 30, positions.X.y + 10,
          positions.A.x, positions.A.y - 10,
          'f', 'var(--color-success)', false, 500
        );
        drawArrow(
          positions.X.x + 30, positions.X.y + 10,
          positions.B.x, positions.B.y - 10,
          'g', 'var(--color-success)', false, 650
        );
        drawArrow(
          positions.X.x, positions.X.y + 15,
          positions.product.x, positions.product.y - 15,
          '⟨f,g⟩', '#f59f00', true, 800
        );
      } else {
        // Coproduct universal property:
        // X with f: A→X and g: B→X induces unique [f,g]: A+B→X
        drawArrow(
          positions.A.x + 10, positions.A.y - 30,
          positions.X.x - 30, positions.X.y + 10,
          'f', 'var(--color-success)', false, 500
        );
        drawArrow(
          positions.B.x - 10, positions.B.y - 30,
          positions.X.x + 30, positions.X.y + 10,
          'g', 'var(--color-success)', false, 650
        );
        drawArrow(
          positions.product.x, positions.product.y - 15,
          positions.X.x, positions.X.y + 15,
          '[f,g]', '#f59f00', true, 800
        );
      }
    }

    // Draw nodes with entrance animation
    const drawNode = (x: number, y: number, label: string, isMain = false, delay = 0) => {
      const group = svg.append('g')
        .attr('class', `pb-node ${isMain ? 'main-node' : ''}`)
        .attr('transform', `translate(${x}, ${y})`)
        .attr('opacity', 0);

      // Pulse ring for main node
      if (isMain) {
        group.append('circle')
          .attr('class', 'pulse-ring')
          .attr('r', isMain ? 22 : 18)
          .attr('fill', 'none')
          .attr('stroke', 'var(--color-accent)')
          .attr('stroke-width', 2)
          .attr('opacity', 0.3);
      }

      group.append('circle')
        .attr('r', 0)
        .attr('fill', isMain ? 'rgba(66, 99, 235, 0.1)' : 'var(--color-bg-primary)')
        .attr('stroke', isMain ? 'var(--color-accent)' : 'var(--color-border)')
        .attr('stroke-width', isMain ? 3 : 2)
        .transition()
        .delay(delay)
        .duration(400)
        .ease(d3.easeBackOut.overshoot(1.5))
        .attr('r', isMain ? 22 : 18);

      group.append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '0.35em')
        .attr('font-size', isMain ? '14px' : '16px')
        .attr('font-weight', 'bold')
        .attr('fill', 'var(--color-text-primary)')
        .attr('opacity', 0)
        .text(label)
        .transition()
        .delay(delay + 200)
        .duration(300)
        .attr('opacity', 1);

      group.transition()
        .delay(delay)
        .duration(400)
        .attr('opacity', 1);
    };

    drawNode(positions.product.x, positions.product.y, productLabel, true, 0);
    drawNode(positions.A.x, positions.A.y, factors[0], false, 100);
    drawNode(positions.B.x, positions.B.y, factors[1], false, 150);

    if (showUniversal) {
      drawNode(positions.X.x, positions.X.y, testObject, false, 400);
    }

  }, [constructionType, showUniversal, factors, testObject]);

  const isProduct = constructionType === 'product';

  return (
    <div className="product-builder">
      {showHint && (
        <SimulatorHint
          title="Product & Coproduct Builder"
          description="Explore how products and coproducts work in category theory. These are fundamental constructions that capture the concepts of 'and' (product) and 'or' (coproduct)."
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

      <div className="pb-controls">
        <div className="pb-type-toggle">
          <button
            className={`toggle-btn ${isProduct ? 'active' : ''}`}
            onClick={() => handleTypeChange('product')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Product (×)
          </button>
          <button
            className={`toggle-btn ${!isProduct ? 'active' : ''}`}
            onClick={() => handleTypeChange('coproduct')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Coproduct (+)
          </button>
        </div>
        <label className="pb-checkbox">
          <input
            type="checkbox"
            checked={showUniversal}
            onChange={(e) => handleUniversalToggle(e.target.checked)}
          />
          <span>Show universal property</span>
        </label>
      </div>

      <div className={`pb-canvas ${isAnimating ? 'animating' : ''}`}>
        <svg ref={svgRef} width="100%" height="260" viewBox="0 0 380 260" />
      </div>

      <div className="pb-legend">
        <div className="legend-item">
          <span className="legend-color blue"></span>
          <span>{isProduct ? 'Projections' : 'Injections'} ({isProduct ? 'π' : 'ι'})</span>
        </div>
        {showUniversal && (
          <>
            <div className="legend-item animate-in">
              <span className="legend-color green"></span>
              <span>Given morphisms (f, g)</span>
            </div>
            <div className="legend-item animate-in">
              <span className="legend-color orange dashed"></span>
              <span>Unique induced morphism</span>
            </div>
          </>
        )}
      </div>

      <div className={`pb-info ${isProduct ? 'product-info' : 'coproduct-info'}`}>
        <h4>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          {isProduct ? 'Product' : 'Coproduct'} Universal Property
        </h4>
        {isProduct ? (
          <>
            <p>
              The <strong>product</strong> A×B comes with projections π₁: A×B→A
              and π₂: A×B→B.
            </p>
            <p>
              <strong>Universal property:</strong> For any object X with morphisms
              f: X→A and g: X→B, there exists a <em>unique</em> ⟨f,g⟩: X→A×B such that
              π₁∘⟨f,g⟩ = f and π₂∘⟨f,g⟩ = g.
            </p>
          </>
        ) : (
          <>
            <p>
              The <strong>coproduct</strong> A+B comes with injections ι₁: A→A+B
              and ι₂: B→A+B.
            </p>
            <p>
              <strong>Universal property:</strong> For any object X with morphisms
              f: A→X and g: B→X, there exists a <em>unique</em> [f,g]: A+B→X such that
              [f,g]∘ι₁ = f and [f,g]∘ι₂ = g.
            </p>
          </>
        )}
      </div>

      <div className="pb-examples">
        <h4>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 18l6-6-6-6" />
            <path d="M8 6l-6 6 6 6" />
          </svg>
          In Programming
        </h4>
        <div className="example-grid">
          <div className={`example-item ${isProduct ? 'highlight' : ''}`}>
            <strong>Product:</strong>
            <code>Tuple&lt;A, B&gt;</code>
            <span className="example-note">Access both components</span>
          </div>
          <div className={`example-item ${!isProduct ? 'highlight' : ''}`}>
            <strong>Coproduct:</strong>
            <code>Either&lt;A, B&gt;</code>
            <span className="example-note">One or the other</span>
          </div>
        </div>
      </div>
    </div>
  );
}
