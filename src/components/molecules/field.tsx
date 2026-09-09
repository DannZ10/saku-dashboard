import type { ReactNode } from 'react';

// Label + control + optional error/hint. Wraps its input verbatim, so form logic
// stays in the organism that owns it; this only standardises the surrounding markup.
export function Field({ htmlFor, label, labelAside, error, errorId, hint, className, children }: {
  htmlFor?: string;
  label: string;
  labelAside?: ReactNode;
  error?: ReactNode;
  errorId?: string;
  hint?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return <div className={className}>
    <label htmlFor={htmlFor} className={'field-label' + (labelAside !== undefined ? ' label-split' : '')}>{label}{labelAside !== undefined && <span>{labelAside}</span>}</label>
    {children}
    {error !== undefined && <p className="field-error" id={errorId ?? (htmlFor ? `${htmlFor}-error` : undefined)}>{error}</p>}
    {hint !== undefined && <p className="field-hint">{hint}</p>}
  </div>;
}
