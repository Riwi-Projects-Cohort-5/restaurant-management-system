/**
 * KanbanColumn Component
 * @param {Object} props
 * @param {string} props.title - Column title
 * @param {string} props.status - 'new'|'preparing'|'ready'
 * @param {Array} props.orders - Kitchen orders
 * @param {string} props.actionLabel - Action button label
 * @param {string} props.actionColor - Tailwind color class
 * @param {string} [props.onAction] - Handler name prefix
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    title = '',
    status = 'new',
    orders = [],
    actionLabel = '',
    actionColor = '',
    onAction = ''
  } = props;

  const headerBgClasses = {
    new: 'bg-info-100 text-info-700',
    preparing: 'bg-warning-100 text-warning-700',
    ready: 'bg-success-100 text-success-700'
  };

  const headerClass = headerBgClasses[status] || headerBgClasses.new;

  const ordersHtml = orders.map(function (order) {
    const actionClick = onAction ? `data-onclick-action="${onAction}"` : '';
    const detailClick = onAction ? `data-onclick-detail="${onAction}"` : '';
    const timeMinutes = order.time || 0;
    const timeClass = timeMinutes > 15 ? 'text-error-600' : 'text-secondary-500';
    const actionBtnClass = actionColor || 'bg-primary-600 text-white hover:bg-primary-700';

    const itemsHtml = (order.items || []).map(function (item) {
      return `
        <div class="text-sm text-secondary-700">
          <span class="font-semibold">${item.qty}×</span> ${item.name}
        </div>
      `;
    }).join('');

    const noteHtml = order.note ? `
      <div class="bg-brand-50 border border-brand-200 rounded-lg p-2 text-xs text-secondary-600 mb-3">
        <i data-lucide="message-square" class="w-3 h-3 inline mr-1"></i>
        ${order.note}
      </div>
    ` : '';

    return `
      <div class="bg-white rounded-xl p-4 border border-brand-200 shadow-sm">
        <div class="flex justify-between items-center mb-3">
          <span class="text-sm font-bold text-brand-900">Table ${order.table}</span>
          <span class="text-xs font-semibold ${timeClass}">${timeMinutes} min</span>
        </div>
        <div class="space-y-1.5 mb-3">
          ${itemsHtml}
        </div>
        ${noteHtml}
        <div class="flex gap-2">
          <button type="button" ${detailClick} data-order-id="${order.id}"
                  class="h-8 px-3 text-xs font-semibold rounded-md border border-transparent
                         bg-transparent text-brand-700 hover:bg-brand-50 transition-colors">
            Detail
          </button>
          <button type="button" ${actionClick} data-order-id="${order.id}"
                  class="h-8 px-3 text-xs font-semibold rounded-md border
                         ${actionBtnClass}
                         transition-colors flex-1">
            ${actionLabel}
          </button>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="flex flex-col">
      <div class="px-4 py-3 rounded-t-xl flex justify-between items-center ${headerClass}">
        <h3 class="text-sm font-bold">${title}</h3>
        <span class="px-2 py-0.5 rounded-full text-xs font-bold bg-white/50">${orders.length}</span>
      </div>
      <div class="flex-1 overflow-y-auto p-3 space-y-3 bg-neutral-50 rounded-b-xl min-h-[200px]">
        ${ordersHtml}
      </div>
    </div>
  `;
}

/**
 * Initialize KanbanColumn interactivity
 * Attaches action and detail handlers via data attributes
 */
export function init() {
  document.querySelectorAll('[data-onclick-action]').forEach(function (btn) {
    const handlerName = btn.getAttribute('data-onclick-action');
    if (handlerName && typeof window[handlerName] === 'function') {
      btn.addEventListener('click', window[handlerName]);
    }
  });

  document.querySelectorAll('[data-onclick-detail]').forEach(function (btn) {
    const handlerName = btn.getAttribute('data-onclick-detail');
    if (handlerName && typeof window[handlerName] === 'function') {
      btn.addEventListener('click', window[handlerName]);
    }
  });
}

/**
 * Cleanup KanbanColumn listeners
 */
export function destroy() {}

export default { render, init, destroy };
