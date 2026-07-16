/**
 * Card Component
 * @param {Object} props
 * @param {string} [props.title] - Card title
 * @param {string} [props.headerRight] - HTML for right side of header
 * @param {string} props.children - Card body HTML
 * @param {boolean} [props.noPadding=false]
 * @param {string} [props.id] - Card ID
 * @param {string} [props.className] - Additional classes
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    title = '',
    headerRight = '',
    children = '',
    noPadding = false,
    id = '',
    className = ''
  } = props;

  const idAttr = id ? `id="${id}"` : '';
  const bodyPadding = noPadding ? 'p-0' : 'p-5';

  const headerHtml = title ? `
    <div class="px-5 py-4 border-b border-brand-100 flex justify-between items-center">
      <h3 class="text-base font-bold text-brand-900">${title}</h3>
      ${headerRight ? `<div class="flex items-center gap-2">${headerRight}</div>` : ''}
    </div>
  ` : '';

  return `
    <div ${idAttr}
         class="bg-white border border-brand-300 rounded-xl shadow-sm overflow-hidden
                ${className}">
      ${headerHtml}
      <div class="${bodyPadding}">
        ${children}
      </div>
    </div>
  `;
}

/**
 * Initialize Card interactivity (no-op for pure display component)
 */
export function init() {}

/**
 * Cleanup Card (no-op for pure display component)
 */
export function destroy() {}

export default { render, init, destroy };
