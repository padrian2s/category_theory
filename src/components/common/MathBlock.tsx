import { useEffect, useRef } from 'react';
import katex from 'katex';
import './MathBlock.css';

interface MathBlockProps {
  /** LaTeX expression to render */
  math: string;
  /** Display mode (block) or inline mode */
  display?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * Renders mathematical expressions using KaTeX
 */
export default function MathBlock({ math, display = false, className = '' }: MathBlockProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(math, containerRef.current, {
          displayMode: display,
          throwOnError: false,
          errorColor: '#fa5252',
          strict: false,
          trust: true,
          macros: {
            // Common category theory macros
            '\\cat': '\\mathcal{#1}',
            '\\Set': '\\mathbf{Set}',
            '\\Grp': '\\mathbf{Grp}',
            '\\Top': '\\mathbf{Top}',
            '\\Vect': '\\mathbf{Vect}',
            '\\Mon': '\\mathbf{Mon}',
            '\\id': '\\mathrm{id}',
            '\\Hom': '\\mathrm{Hom}',
            '\\ob': '\\mathrm{ob}',
            '\\mor': '\\mathrm{mor}',
            '\\dom': '\\mathrm{dom}',
            '\\cod': '\\mathrm{cod}',
            '\\comp': '\\circ',
            '\\iso': '\\cong',
          },
        });
      } catch (error) {
        console.error('KaTeX render error:', error);
        if (containerRef.current) {
          containerRef.current.textContent = math;
          containerRef.current.className = 'math-error';
        }
      }
    }
  }, [math, display]);

  return (
    <span
      ref={containerRef}
      className={`math-block ${display ? 'display' : 'inline'} ${className}`}
    />
  );
}

/**
 * Inline math component (convenience wrapper)
 */
export function InlineMath({ math, className = '' }: { math: string; className?: string }) {
  return <MathBlock math={math} display={false} className={className} />;
}

/**
 * Display (block) math component (convenience wrapper)
 */
export function DisplayMath({ math, className = '' }: { math: string; className?: string }) {
  return <MathBlock math={math} display={true} className={className} />;
}
