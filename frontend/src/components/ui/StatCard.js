/**
 * StatCard Component
 * @param {Object} props
 * @param {string} props.label - Stat label
 * @param {string} props.value - Stat value
 * @param {string} props.icon - Lucide icon name
 * @param {'brand'|'primary'|'accent'|'success'|'secondary'} [props.iconColor='brand']
 * @param {Object} [props.change] - {value: string, direction: 'up'|'down'}
 * @param {string} [props.changeText] - e.g. "vs last month"
 * @param {string} [props.id] - Card ID
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    label = '',
    value = '',
    icon = '',
    iconColor = 'brand',
    change = null,
    changeText = '',
    id = '',
    className = ''
  } = props;

  const iconColorClasses = {
    brand:     'bg-brand-100 text-brand-600',
    primary:   'bg-primary-100 text-primary-600',
    accent:    'bg-accent-100 text-accent-600',
    success:   'bg-success-100 text-success-600',
    secondary: 'bg-secondary-100 text-secondary-600'
  };

  const idAttr = id ? `id="${id}"` : '';

  const iconHtml = icon ? `
    <div class="flex items-center justify-center w-11 h-11 rounded-xl
                ${iconColorClasses[iconColor] || iconColorClasses.brand}">
      <i data-lucide="${icon}" class="w-5 h-5"></i>
    </div>
  ` : '';

  let changeHtml = '';
  if (change) {
    const isUp = change.direction === 'up';
    const arrowIcon = isUp ? 'arrow-up' : 'arrow-down';
    const changeColor = isUp ? 'text-success-600' : 'text-error-600';
    changeHtml = `
      <div class="flex items-center gap-1 mt-2">
        <i data-lucide="${arrowIcon}" class="w-3.5 h-3.5 ${changeColor}"></i>
        <span class="text-xs font-semibold ${changeColor}">${change.value}</span>
        ${changeText ? `<span class="text-xs text-secondary-500 ml-1">${changeText}</span>` : ''}
      </div>
    `;
  }

  return `
    <div ${idAttr}
         class="bg-white border border-brand-300 rounded-xl shadow-sm overflow-hidden
                p-5 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-fast
                ${className}">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm text-secondary-600 leading-tight">${label}</p>
          <p class="text-2xl font-bold text-neutral-900 mt-1">${value}</p>
          ${changeHtml}
        </div>
        ${iconHtml}
      </div>
    </div>
  `;
}

/**
 * Initialize StatCard interactivity (no-op for pure display component)
 */
export function init() {}

/**
 * Cleanup StatCard (no-op for pure display component)
 */
export function destroy() {}

export default { render, init, destroy };
