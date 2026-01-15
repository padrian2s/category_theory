import { useBook } from '../../contexts/BookContext';
import CategoryBuilder from '../simulators/CategoryBuilder';
import NaturalTransformationVisualizer from '../simulators/NaturalTransformationVisualizer';
import MorphismComposer from '../simulators/MorphismComposer';
import ProductBuilder from '../simulators/ProductBuilder';
import FunctorMapper from '../simulators/FunctorMapper';
import './TabContent.css';

type SimulatorType =
  | 'category-builder'
  | 'morphism-composer'
  | 'natural-transformation'
  | 'functor-mapper'
  | 'product-builder'
  | 'diagram-chaser';

interface SimulatorConfig {
  type: SimulatorType;
  title: string;
  description: string;
}

export default function SimulatorTab() {
  const { currentSection } = useBook();

  // Determine which simulator to show based on section
  const getSimulatorForSection = (): SimulatorConfig => {
    if (!currentSection) {
      return {
        type: 'category-builder',
        title: 'Category Builder',
        description: 'Build and explore categories with objects and morphisms',
      };
    }

    switch (currentSection.number) {
      case '1a':
        return {
          type: 'category-builder',
          title: 'Category Builder',
          description: 'Create objects, add morphisms, and verify category axioms',
        };
      case '1b':
        return {
          type: 'functor-mapper',
          title: 'Functor Mapper',
          description: 'Visualize how functors map between categories',
        };
      case '1c':
        return {
          type: 'natural-transformation',
          title: 'Natural Transformation Visualizer',
          description: 'Explore naturality squares and component morphisms',
        };
      case '1d':
      case '1e':
        return {
          type: 'category-builder',
          title: 'Category Builder',
          description: 'Explore adjunctions and duality through category construction',
        };
      case '2a':
        return {
          type: 'morphism-composer',
          title: 'Morphism Composer',
          description: 'Compose morphisms and explore iso, epic, and monic properties',
        };
      case '2b':
        return {
          type: 'category-builder',
          title: 'Category Builder',
          description: 'Explore initial and terminal objects',
        };
      case '2c':
        return {
          type: 'product-builder',
          title: 'Product/Coproduct Builder',
          description: 'Construct products and coproducts with universal properties',
        };
      case '2d':
      case '2e':
        return {
          type: 'diagram-chaser',
          title: 'Diagram Chaser',
          description: 'Chase through commutative diagrams and verify limits',
        };
      default:
        return {
          type: 'category-builder',
          title: 'Category Builder',
          description: 'Build and explore categories with objects and morphisms',
        };
    }
  };

  const simulator = getSimulatorForSection();

  const renderSimulator = () => {
    switch (simulator.type) {
      case 'category-builder':
        return <CategoryBuilder />;
      case 'natural-transformation':
        return <NaturalTransformationVisualizer />;
      case 'morphism-composer':
        return <MorphismComposer />;
      case 'product-builder':
        return <ProductBuilder />;
      case 'functor-mapper':
        return <FunctorMapper />;
      case 'diagram-chaser':
        // Diagram chaser coming soon - show product builder as alternative
        return (
          <div className="simulator-wrapper">
            <div className="simulator-note">
              Diagram chasing involves limits and colimits.
              Explore the product/coproduct builder below to understand universal constructions.
            </div>
            <ProductBuilder />
          </div>
        );
      default:
        return <CategoryBuilder />;
    }
  };

  return (
    <div className="tab-content simulator-tab">
      <div className="tab-intro">
        <p>
          Interact with category theory concepts directly. Add objects, draw morphisms,
          and verify categorical properties in real-time.
        </p>
      </div>

      <div className="simulator-container">
        <div className="simulator-header">
          <h3>{simulator.title}</h3>
          <span className="simulator-badge">Interactive</span>
        </div>
        <div className="simulator-description">
          {simulator.description}
        </div>
        {renderSimulator()}
      </div>

      <div className="simulator-switcher">
        <span className="switcher-label">Quick access:</span>
        <div className="switcher-buttons">
          <SimulatorQuickButton type="category-builder" label="Categories" />
          <SimulatorQuickButton type="morphism-composer" label="Composition" />
          <SimulatorQuickButton type="functor-mapper" label="Functors" />
          <SimulatorQuickButton type="natural-transformation" label="Naturality" />
          <SimulatorQuickButton type="product-builder" label="Products" />
        </div>
      </div>
    </div>
  );
}

// Quick switch button component (simplified - actual switching would need state management)
function SimulatorQuickButton({ label }: { type: SimulatorType; label: string }) {
  return (
    <button className="btn btn-ghost btn-sm switcher-btn" title={`Switch to ${label}`}>
      {label}
    </button>
  );
}
