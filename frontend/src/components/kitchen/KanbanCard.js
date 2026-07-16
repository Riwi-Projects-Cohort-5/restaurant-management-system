/**
 * KanbanCard Component
 * @param {Object} props
 * @param {Object} props.order - {id, table, status, time, items, note}
 * @param {string} props.actionLabel - Action button text
 * @param {string} props.actionColor - Tailwind color class
 * @param {string} [props.onAction] - Handler name
 * @param {string} [props.onViewDetail] - Handler name
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    order = {},
    actionLabel = '',
    actionColor = '',
    onAction = '',
    onViewDetail = ''
  } = props;

  const {
    id = '',
    table = 1,
    status = 'new',
    time = 0,
    items = [],
    note = ''
  } = order;

  const actionClick = onAction ? `data-onclick-action="${onAction}"` : '';
  const detailClick = onViewDetail ? `data-onclick-detail="${onViewDetail}"` : '';

  const timeMinutes = time;
  const timeClass = timeMinutes > 15 ? 'text-error-600' : 'text-secondary-500';

  const itemsHtml = items.map(function (item) {
    return `
      <div class="text-sm text-secondary-700">
        <span class="font-semibold">${item.qty}×</span> ${item.name}
      </div>
    `;
  }).join('');

  const noteHtml = note ? `
    <div class="bg-brand-50 border border-brand-200 rounded-lg p-2 text-xs text-secondary-600 mb-3">
      <i data-lucide="message-square" class="w-3 h-3 inline mr-1"></i>
      ${note}
    </div>
  ` : '';

  const actionBtnClass = actionColor || 'bg-primary-600 text-white hover:bg-primary-700';

  return `
    <div class="bg-white rounded-xl p-4 border border-brand-200 shadow-sm"
         data-order-id="${id}">
      <div class="flex justify-between items-center mb-3">
        <span class="text-sm font-bold text-brand-900">Table ${table}</span>
        <span class="text-xs font-semibold ${timeClass}">${timeMinutes} min</span>
      </div>
      <div class="space-y-1.5 mb-3">
        ${itemsHtml}
      </div>
      ${noteHtml}
      <div class="flex gap-2">
        <button type="button" ${detailClick} data-order-id="${id}"
                class="h-8 px-3 text-xs font-semibold rounded-md border border-brand-200
                       bg-transparent text-brand-700 hover:bg-brand-50 transition-colors">
          Detail
        </button>
        <button type="button" ${actionClick} data-order-id="${id}"
                class="h-8 px-3 text-xs font-semibold rounded-md border
                       ${actionBtnClass}
                       transition-colors flex-1">
          ${actionLabel}
        </button>
      </div>
    </div>
  `;
}

/**
 * Initialize KanbanCard interactivity
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
 * Cleanup KanbanCard listeners
 */
export function destroy() {}

export default { render, init, destroy };
