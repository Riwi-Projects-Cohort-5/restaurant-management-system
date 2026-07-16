/**
 * CartItem Component
 * @param {Object} props
 * @param {Object} props.item - {id, name, price, qty, emoji}
 * @param {string} [props.onUpdateQty] - Qty update handler name
 * @param {string} [props.onRemove] - Remove handler name
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    item = {},
    onUpdateQty = '',
    onRemove = ''
  } = props;

  const { id = '', name = '', price = 0, qty = 1, emoji = '' } = item;
  const total = (price * qty).toFixed(2);

  const qtyUpClick = onUpdateQty ? `data-onclick-qty="${onUpdateQty}"` : '';
  const qtyDownClick = onUpdateQty ? `data-onclick-qty-down="${onUpdateQty}"` : '';
  const removeClick = onRemove ? `data-onclick-remove="${onRemove}"` : '';

  return `
    <div class="flex items-center gap-3 py-3 border-b border-brand-100 last:border-0"
         data-cart-item-id="${id}">
      <div class="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-xl shrink-0">
        ${emoji}
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold text-brand-900 truncate">${name}</p>
        <p class="text-xs text-secondary-500">$${price.toFixed(2)}</p>
      </div>
      <div class="flex items-center gap-2">
        <button type="button" ${qtyDownClick} data-qty="${qty}" data-item-id="${id}"
                class="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold hover:bg-brand-200 transition-colors">
          −
        </button>
        <span class="text-sm font-bold text-brand-900 w-5 text-center">${qty}</span>
        <button type="button" ${qtyUpClick} data-qty="${qty}" data-item-id="${id}"
                class="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold hover:bg-brand-200 transition-colors">
          +
        </button>
      </div>
      <p class="text-sm font-bold text-brand-900 w-16 text-right">$${total}</p>
    </div>
  `;
}

/**
 * Initialize CartItem interactivity
 * Attaches qty and remove handlers via data attributes
 */
export function init() {
  document.querySelectorAll('[data-onclick-qty]').forEach(function (btn) {
    const handlerName = btn.getAttribute('data-onclick-qty');
    if (handlerName && typeof window[handlerName] === 'function') {
      btn.addEventListener('click', window[handlerName]);
    }
  });

  document.querySelectorAll('[data-onclick-qty-down]').forEach(function (btn) {
    const handlerName = btn.getAttribute('data-onclick-qty-down');
    if (handlerName && typeof window[handlerName] === 'function') {
      btn.addEventListener('click', window[handlerName]);
    }
  });

  document.querySelectorAll('[data-onclick-remove]').forEach(function (btn) {
    const handlerName = btn.getAttribute('data-onclick-remove');
    if (handlerName && typeof window[handlerName] === 'function') {
      btn.addEventListener('click', window[handlerName]);
    }
  });
}

/**
 * Cleanup CartItem listeners
 */
export function destroy() {}

export default { render, init, destroy };
