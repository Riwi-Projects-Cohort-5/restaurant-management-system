/**
 * Button Component
 * @param {Object} props
 * @param {'primary'|'secondary'|'danger'|'ghost'|'brand'|'accent'} [props.variant='primary']
 * @param {'sm'|'md'|'lg'} [props.size='md']
 * @param {string} [props.icon] - Lucide icon name
 * @param {boolean} [props.iconOnly=false]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.onClick] - Event handler function name
 * @param {string} props.children - Button label HTML
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    variant = 'primary',
    size = 'md',
    icon = '',
    iconOnly = false,
    disabled = false,
    onClick = '',
    children = '',
    id = '',
    type = 'button',
    className = ''
  } = props;

  const variantClasses = {
    primary:   'bg-primary-600 text-white border-primary-600 hover:bg-primary-700',
    secondary: 'bg-white text-brand-700 border-brand-300 hover:bg-brand-50',
    danger:    'bg-error-600 text-white border-error-600 hover:bg-error-700',
    ghost:     'bg-transparent text-brand-700 border-transparent hover:bg-brand-50',
    brand:     'bg-brand-500 text-white border-brand-500 hover:bg-brand-600',
    accent:    'bg-accent-400 text-white border-accent-400 hover:bg-accent-500'
  };

  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base'
  };

  const iconOnlyClass = iconOnly ? 'w-10 h-10 p-0' : '';
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '';
  const idAttr = id ? `id="${id}"` : '';
  const clickAttr = onClick ? `data-onclick="${onClick}"` : '';
  const typeAttr = type || 'button';

  return `
    <button
      type="${typeAttr}"
      ${idAttr}
      ${clickAttr}
      class="inline-flex items-center justify-center gap-2 font-semibold rounded-md border
             transition-colors duration-fast
             ${variantClasses[variant] || variantClasses.primary}
             ${iconOnlyClass || sizeClasses[size] || sizeClasses.md}
             ${disabledClass}
             ${className}"
      ${disabled ? 'disabled' : ''}
    >
      ${icon ? `<i data-lucide="${icon}" class="w-4 h-4 shrink-0"></i>` : ''}
      ${iconOnly ? '' : children}
    </button>
  `;
}

/**
 * Initialize Button interactivity
 * Attaches click handlers via data-onclick attribute
 */
export function init() {
  const buttons = document.querySelectorAll('[data-onclick]');
  buttons.forEach(function (btn) {
    const handlerName = btn.getAttribute('data-onclick');
    if (handlerName && typeof window[handlerName] === 'function') {
      btn.addEventListener('click', window[handlerName]);
    }
  });
}

/**
 * Cleanup Button listeners
 */
export function destroy() {
  // Cleanup handled by container
}

export default { render, init, destroy };
