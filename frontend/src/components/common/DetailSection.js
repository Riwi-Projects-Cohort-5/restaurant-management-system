/**
 * DetailSection Component
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {string} [props.headerRight] - HTML for right side of header
 * @param {string} props.children - Section content
 * @param {string} [props.id] - Section ID
 * @param {string} [props.className] - Additional classes
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    title = '',
    headerRight = '',
    children = '',
    id = '',
    className = ''
  } = props;

  const idAttr = id ? `id="${id}"` : '';

  return `
    <div ${idAttr}
         class="bg-white rounded-xl border border-brand-200 overflow-hidden ${className}">

      <div class="px-5 py-3 border-b border-brand-100 flex justify-between items-center">
        <h3 class="text-sm font-bold text-secondary-600 m-0 p-0">${title}</h3>
        ${headerRight ? `<div class="flex items-center gap-2">${headerRight}</div>` : ''}
      </div>

      <div class="p-5">
        ${children}
      </div>
    </div>
  `;
}

/**
 * Initialize DetailSection interactivity (no-op for pure display component)
 */
export function init() {}

/**
 * Cleanup DetailSection (no-op for pure display component)
 */
export function destroy() {}

export default { render, init, destroy };
