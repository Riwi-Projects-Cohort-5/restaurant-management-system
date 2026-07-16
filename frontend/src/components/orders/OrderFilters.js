/**
 * OrderFilters Component
 * @param {Object} props
 * @param {string} props.activeFilter - 'all'|'active'|'closed'
 * @param {string} [props.onFilter] - Handler name
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    activeFilter = 'all',
    onFilter = ''
  } = props;

  const filters = [
    { value: 'all', label: 'All Orders' },
    { value: 'active', label: 'Active' },
    { value: 'closed', label: 'Closed' }
  ];

  const tabsHtml = filters.map(function (f) {
    const isActive = f.value === activeFilter;
    const clickAttr = onFilter ? `data-onclick="${onFilter}"` : '';
    const dataAttr = `data-filter="${f.value}"`;

    const activeClasses = isActive
      ? 'bg-brand-500 text-white border-brand-500'
      : 'bg-white text-secondary-600 hover:bg-brand-50 border-brand-200';

    return `
      <button type="button" ${clickAttr} ${dataAttr}
              class="px-4 py-2 rounded-full text-sm font-semibold border transition-colors
                     ${activeClasses}"
              ${isActive ? 'aria-current="true"' : ''}>
        ${f.label}
      </button>
    `;
  }).join('');

  return `
    <div class="flex gap-2 mb-4">
      ${tabsHtml}
    </div>
  `;
}

/**
 * Initialize OrderFilters interactivity
 * Attaches click handlers via data-onclick attribute
 */
export function init() {
  document.querySelectorAll('[data-onclick]').forEach(function (btn) {
    const handlerName = btn.getAttribute('data-onclick');
    if (handlerName && typeof window[handlerName] === 'function') {
      btn.addEventListener('click', window[handlerName]);
    }
  });
}

/**
 * Cleanup OrderFilters listeners
 */
export function destroy() {}

export default { render, init, destroy };
