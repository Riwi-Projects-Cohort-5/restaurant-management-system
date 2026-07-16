/**
 * Badge Component
 * @param {Object} props
 * @param {'success'|'warning'|'error'|'info'|'brand'|'accent'|'neutral'} [props.variant='neutral']
 * @param {boolean} [props.showDot=false]
 * @param {string} props.children - Badge text
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    variant = 'neutral',
    showDot = false,
    children = '',
    className = ''
  } = props;

  const variantClasses = {
    success: 'bg-success-100 text-success-700',
    warning: 'bg-warning-100 text-warning-700',
    error:   'bg-error-100 text-error-700',
    info:    'bg-info-100 text-info-700',
    brand:   'bg-brand-100 text-brand-700',
    accent:  'bg-accent-100 text-accent-700',
    neutral: 'bg-neutral-100 text-neutral-700'
  };

  const dotHtml = showDot
    ? '<span class="w-2 h-2 rounded-full bg-current shrink-0"></span>'
    : '';

  return `
    <span class="inline-flex items-center gap-1.5 rounded-full font-semibold px-2.5 py-0.5 text-xs
                 ${variantClasses[variant] || variantClasses.neutral}
                 ${className}">
      ${dotHtml}
      ${children}
    </span>
  `;
}

/**
 * Initialize Badge interactivity (no-op for pure display component)
 */
export function init() {}

/**
 * Cleanup Badge (no-op for pure display component)
 */
export function destroy() {}

export default { render, init, destroy };
