/**
 * MenuItemCard Component
 * @param {Object} props
 * @param {Object} props.item - {id, name, price, cat, emoji}
 * @param {string} [props.onClick] - Click handler name
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    item = {},
    onClick = ''
  } = props;

  const { id = '', name = '', price = 0, cat = '', emoji = '' } = item;

  const clickAttr = onClick ? `data-onclick="${onClick}"` : '';
  const dataAttr = id ? `data-item-id="${id}"` : '';

  return `
    <div ${dataAttr} ${clickAttr}
         class="bg-white border border-brand-300 rounded-xl p-4 cursor-pointer
                hover:border-brand-500 hover:shadow-md hover:-translate-y-0.5
                transition-all duration-fast flex flex-col items-center text-center">
      <div class="w-20 h-20 rounded-lg bg-brand-50 flex items-center justify-center text-3xl mb-3">
        ${emoji}
      </div>
      <p class="text-sm font-semibold text-brand-900 mb-1">${name}</p>
      <p class="text-[15px] font-bold text-brand-600">$${price.toFixed(2)}</p>
      ${cat ? `<p class="text-xs text-secondary-400 mt-1">${cat}</p>` : ''}
    </div>
  `;
}

/**
 * Initialize MenuItemCard interactivity
 * Attaches click handlers via data-onclick attribute
 */
export function init() {
  const cards = document.querySelectorAll('[data-item-id][data-onclick]');
  cards.forEach(function (card) {
    const handlerName = card.getAttribute('data-onclick');
    if (handlerName && typeof window[handlerName] === 'function') {
      card.addEventListener('click', window[handlerName]);
    }
  });
}

/**
 * Cleanup MenuItemCard listeners
 */
export function destroy() {}

export default { render, init, destroy };
