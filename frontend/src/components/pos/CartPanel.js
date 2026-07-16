/**
 * CartPanel Component
 * @param {Object} props
 * @param {number} props.tableNumber - Table number
 * @param {Array} props.items - Cart items
 * @param {number} props.subtotal
 * @param {number} props.tax
 * @param {number} props.total
 * @param {string} [props.onUpdateQty] - Handler name
 * @param {string} [props.onRemove] - Handler name
 * @param {string} [props.onSendOrder] - Handler name
 * @param {string} [props.onSaveDraft] - Handler name
 * @param {string} [props.onDropOrder] - Handler name
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    tableNumber = 1,
    items = [],
    subtotal = 0,
    tax = 0,
    total = 0,
    onUpdateQty = '',
    onRemove = '',
    onSendOrder = '',
    onSaveDraft = '',
    onDropOrder = ''
  } = props;

  const sendClick = onSendOrder ? `data-onclick="${onSendOrder}"` : '';
  const saveClick = onSaveDraft ? `data-onclick="${onSaveDraft}"` : '';
  const dropClick = onDropOrder ? `data-onclick="${onDropOrder}"` : '';

  let itemsHtml = '';

  if (items.length === 0) {
    itemsHtml = `
      <div class="flex-1 flex flex-col items-center justify-center text-secondary-400 py-12">
        <i data-lucide="shopping-cart" class="w-12 h-12 mb-3 text-brand-200"></i>
        <p class="text-sm font-medium">No items yet</p>
      </div>
    `;
  } else {
    itemsHtml = `
      <div class="flex-1 overflow-y-auto p-5">
        ${items.map(function (item, idx) {
          const total = (item.price * item.qty).toFixed(2);
          const qtyUpClick = onUpdateQty ? `data-onclick-qty="${onUpdateQty}"` : '';
          const qtyDownClick = onUpdateQty ? `data-onclick-qty-down="${onUpdateQty}"` : '';

          return `
            <div class="flex items-center gap-3 py-3 border-b border-brand-100 last:border-0"
                 data-cart-item-id="${item.id}">
              <div class="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center text-xl shrink-0">
                ${item.emoji || ''}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-brand-900 truncate">${item.name}</p>
                <p class="text-xs text-secondary-500">$${item.price.toFixed(2)}</p>
              </div>
              <div class="flex items-center gap-2">
                <button type="button" ${qtyDownClick} data-qty="${item.qty}" data-item-id="${item.id}"
                        class="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold hover:bg-brand-200 transition-colors">
                  −
                </button>
                <span class="text-sm font-bold text-brand-900 w-5 text-center">${item.qty}</span>
                <button type="button" ${qtyUpClick} data-qty="${item.qty}" data-item-id="${item.id}"
                        class="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold hover:bg-brand-200 transition-colors">
                  +
                </button>
              </div>
              <p class="text-sm font-bold text-brand-900 w-16 text-right">$${total}</p>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  return `
    <div class="bg-white border-2 border-brand-300 rounded-xl flex flex-col overflow-hidden shadow-sm h-full">
      <div class="px-5 py-4 flex justify-between items-center border-b border-brand-100">
        <h3 class="text-base font-bold text-brand-900">Current Order</h3>
        <span class="inline-flex items-center gap-1.5 rounded-full font-semibold px-2.5 py-0.5 text-xs
                     bg-info-100 text-info-700">
          Table ${tableNumber}
        </span>
      </div>

      ${itemsHtml}

      <div class="border-t border-brand-200 p-5">
        <div class="space-y-2 mb-4">
          <div class="flex justify-between text-sm">
            <span class="text-secondary-500">Subtotal</span>
            <span class="font-semibold text-brand-900">$${subtotal.toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-secondary-500">Tax (10%)</span>
            <span class="font-semibold text-brand-900">$${tax.toFixed(2)}</span>
          </div>
          <div class="flex justify-between text-base font-bold border-t border-brand-200 pt-2">
            <span class="text-brand-900">Total</span>
            <span class="text-brand-900">$${total.toFixed(2)}</span>
          </div>
        </div>
        <div class="flex gap-2">
          <button type="button" ${dropClick}
                  class="flex-1 h-10 px-4 text-xs font-semibold rounded-md border border-transparent
                         bg-transparent text-brand-700 hover:bg-brand-50 transition-colors">
            Clear
          </button>
          <button type="button" ${saveClick}
                  class="flex-1 h-10 px-4 text-xs font-semibold rounded-md border border-brand-300
                         bg-white text-brand-700 hover:bg-brand-50 transition-colors">
            Save Draft
          </button>
          <button type="button" ${sendClick}
                  class="flex-1 h-10 px-4 text-xs font-semibold rounded-md border border-primary-600
                         bg-primary-600 text-white hover:bg-primary-700 transition-colors">
            Send to Kitchen
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize CartPanel interactivity
 * Attaches handlers for qty, remove, send, save, and drop actions
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

  document.querySelectorAll('[data-onclick]').forEach(function (btn) {
    const handlerName = btn.getAttribute('data-onclick');
    if (handlerName && typeof window[handlerName] === 'function') {
      btn.addEventListener('click', window[handlerName]);
    }
  });
}

/**
 * Cleanup CartPanel listeners
 */
export function destroy() {}

export default { render, init, destroy };
