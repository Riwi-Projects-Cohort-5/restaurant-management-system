/**
 * DetailGrid Component
 * @param {Object} props
 * @param {Array} props.cells - [{label: string, value: string}]
 * @param {string} [props.id] - Grid ID
 * @param {string} [props.className] - Additional classes
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    cells = [],
    id = '',
    className = ''
  } = props;

  const idAttr = id ? `id="${id}"` : '';

  const cellsHtml = cells.map(function (cell) {
    return `
      <div class="bg-white rounded-xl p-4 border border-brand-200">
        <p class="text-xs font-bold uppercase text-secondary-500 m-0 p-0 leading-tight">
          ${cell.label}
        </p>
        <p class="text-base font-bold text-brand-900 mt-1.5 m-0 p-0">
          ${cell.value}
        </p>
      </div>
    `;
  }).join('');

  return `
    <div ${idAttr}
         class="grid grid-cols-2 md:grid-cols-3 gap-4 ${className}">
      ${cellsHtml}
    </div>
  `;
}

/**
 * Initialize DetailGrid interactivity (no-op for pure display component)
 */
export function init() {}

/**
 * Cleanup DetailGrid (no-op for pure display component)
 */
export function destroy() {}

export default { render, init, destroy };
