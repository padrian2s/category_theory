import { useState } from 'react';
import './SimulatorHint.css';

export interface HintStep {
  title: string;
  description: string;
  action?: string;
  highlight?: string;
}

interface SimulatorHintProps {
  title: string;
  description: string;
  steps: HintStep[];
  tips?: string[];
  onDismiss?: () => void;
  compact?: boolean;
}

export default function SimulatorHint({
  title,
  description,
  steps,
  tips = [],
  onDismiss,
  compact = false,
}: SimulatorHintProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (compact && !isExpanded) {
    return (
      <button
        className="hint-toggle-btn"
        onClick={() => setIsExpanded(true)}
        title="Show help"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <span>Help</span>
      </button>
    );
  }

  return (
    <div className="simulator-hint">
      <div className="hint-header">
        <div className="hint-title-row">
          <div className="hint-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <h4 className="hint-title">{title}</h4>
          {onDismiss && (
            <button className="hint-close-btn" onClick={onDismiss} title="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <p className="hint-description">{description}</p>
      </div>

      {steps.length > 0 && (
        <div className="hint-steps">
          <div className="step-indicator">
            {steps.map((_, idx) => (
              <button
                key={idx}
                className={`step-dot ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
                onClick={() => setCurrentStep(idx)}
                title={`Step ${idx + 1}`}
              />
            ))}
          </div>

          <div className="step-content">
            <div className="step-number">Step {currentStep + 1} of {steps.length}</div>
            <h5 className="step-title">{steps[currentStep].title}</h5>
            <p className="step-description">{steps[currentStep].description}</p>
            {steps[currentStep].action && (
              <div className="step-action">
                <span className="action-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </span>
                <span className="action-text">{steps[currentStep].action}</span>
              </div>
            )}
          </div>

          <div className="step-navigation">
            <button
              className="btn btn-sm btn-ghost"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {tips.length > 0 && (
        <div className="hint-tips">
          <h5 className="tips-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Tips
          </h5>
          <ul className="tips-list">
            {tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {compact && (
        <button
          className="hint-minimize-btn"
          onClick={() => setIsExpanded(false)}
        >
          Minimize
        </button>
      )}
    </div>
  );
}

// Quick hint tooltip for inline use
interface QuickHintProps {
  children: React.ReactNode;
  hint: string;
}

export function QuickHint({ children, hint }: QuickHintProps) {
  const [showHint, setShowHint] = useState(false);

  return (
    <div
      className="quick-hint-container"
      onMouseEnter={() => setShowHint(true)}
      onMouseLeave={() => setShowHint(false)}
    >
      {children}
      {showHint && (
        <div className="quick-hint-tooltip">
          {hint}
        </div>
      )}
    </div>
  );
}

// Animated callout for highlighting UI elements
interface CalloutProps {
  show: boolean;
  position: { x: number; y: number };
  message: string;
  direction?: 'top' | 'bottom' | 'left' | 'right';
}

export function Callout({ show, position, message, direction = 'top' }: CalloutProps) {
  if (!show) return null;

  return (
    <div
      className={`callout callout-${direction}`}
      style={{ left: position.x, top: position.y }}
    >
      <div className="callout-arrow" />
      <div className="callout-content">{message}</div>
    </div>
  );
}
