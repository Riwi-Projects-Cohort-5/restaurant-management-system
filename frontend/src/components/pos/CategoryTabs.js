/**
 * CategoryTabs Component
 * @param {Object} props
 * @param {Array} props.categories - ['All', 'Appetizers', ...]
 * @param {string} props.activeCategory
 * @param {string} [props.onSelect] - Handler name
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    categories = ['All'],
    activeCategory = 'All',
    onSelect = ''
  } = props;

  const tabsHtml = categories.map(function (cat) {
    const isActive = cat === activeCategory;
    const clickAttr = onSelect ? `data-onclick="${onSelect}"` : '';
    const dataAttr = `data-category="${cat}"`;

    const activeClasses = isActive
      ? 'bg-brand-500 text-white border-brand-500'
      : 'bg-white text-secondary-600 hover:bg-brand-50 border-brand-200';

    return `
      <button type="button" ${clickAttr} ${dataAttr}
              class="px-4 py-2 rounded-full text-sm font-semibold border transition-colors
                     ${activeClasses}"
              ${isActive ? 'aria-current="true"' : ''}>
        ${cat}
      </button>
    `;
  }).join('');

  return `
    <div class="flex gap-2 flex-wrap mb-4">
      ${tabsHtml}
    </div>
  `;
}

/**
 * Initialize CategoryTabs interactivity
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
 * Cleanup CategoryTabs listeners
 */
export function destroy() {}

export default { render, init, destroy };
