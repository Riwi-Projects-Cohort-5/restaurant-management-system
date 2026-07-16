/**
 * PageHeader Component
 * @param {Object} props
 * @param {string} props.title - Page title
 * @param {string} [props.actions] - HTML for action buttons
 * @param {Object} [props.backButton] - {label: string, onClick: string}
 * @param {string} [props.id] - Header ID
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    title = '',
    actions = '',
    backButton = null,
    id = '',
    className = ''
  } = props;

  const idAttr = id ? `id="${id}"` : '';

  const backHtml = backButton ? `
    <button type="button"
            class="inline-flex items-center justify-center gap-2 h-10 px-4 text-sm font-semibold
                   rounded-md border border-transparent bg-transparent text-brand-700
                   hover:bg-brand-50 transition-colors duration-fast cursor-pointer"
            data-onclick="${backButton.onClick || ''}">
      <i data-lucide="arrow-left" class="w-4 h-4"></i>
      ${backButton.label || ''}
    </button>
  ` : '';

  const titleHtml = backButton ? `
    <div class="flex items-center gap-3">
      ${backHtml}
      <h1 class="text-[22px] font-bold text-brand-900 m-0 p-0">${title}</h1>
    </div>
  ` : `
    <h1 class="text-[22px] font-bold text-brand-900 m-0 p-0">${title}</h1>
  `;

  return `
    <div ${idAttr}
         class="flex items-center justify-between mb-6 ${className}">
      ${titleHtml}
      ${actions ? `<div class="flex gap-3">${actions}</div>` : ''}
    </div>
  `;
}

/**
 * Initialize PageHeader interactivity
 * Attaches back button click handler
 */
export function init() {
  const backButtons = document.querySelectorAll('[data-onclick]');
  backButtons.forEach(function (btn) {
    const handlerName = btn.getAttribute('data-onclick');
    if (handlerName && typeof window[handlerName] === 'function') {
      btn.addEventListener('click', window[handlerName]);
    }
  });
}

/**
 * Cleanup PageHeader listeners
 */
export function destroy() {
  // Cleanup handled by container
}

export default { render, init, destroy };
