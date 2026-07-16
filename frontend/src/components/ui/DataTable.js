/**
 * DataTable Component
 * @param {Object} props
 * @param {Array} props.columns - [{key: string, label: string, render?: Function, className?: string}]
 * @param {Array} props.data - Array of row objects
 * @param {Function} [props.onRowClick] - Row click handler (receives row object, returns string data-attr)
 * @param {string} [props.id] - Table wrapper ID
 * @param {string} [props.className] - Additional classes for wrapper
 * @returns {string} HTML string
 */
export function render(props = {}) {
  const {
    columns = [],
    data = [],
    onRowClick = null,
    id = '',
    className = ''
  } = props;

  const idAttr = id ? `id="${id}"` : '';

  const theadHtml = columns.map(function (col) {
    return `<th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-secondary-600">${col.label}</th>`;
  }).join('');

  const tbodyHtml = data.map(function (row, rowIndex) {
    const clickAttr = onRowClick
      ? `data-row-index="${rowIndex}" class="cursor-pointer"`
      : '';

    const cellsHtml = columns.map(function (col) {
      const isPrimary = col.primary;
      const cellClass = isPrimary ? 'px-4 py-3 font-semibold text-brand-800' : 'px-4 py-3';
      const content = col.render ? col.render(row[col.key], row) : (row[col.key] ?? '');
      return `<td class="${cellClass} ${col.className || ''}">${content}</td>`;
    }).join('');

    return `
      <tr class="border-b border-brand-100 hover:bg-brand-50 transition-colors duration-fast"
          ${clickAttr}>
        ${cellsHtml}
      </tr>
    `;
  }).join('');

  return `
    <div class="overflow-x-auto ${className}">
      <table class="w-full text-sm" ${idAttr}>
        <thead>
          <tr class="border-b-2 border-brand-200">
            ${theadHtml}
          </tr>
        </thead>
        <tbody>
          ${tbodyHtml}
        </tbody>
      </table>
    </div>
  `;
}

/**
 * Initialize DataTable interactivity
 * Attaches row click handlers
 */
export function init() {
  const clickableRows = document.querySelectorAll('[data-row-index]');
  clickableRows.forEach(function (row) {
    row.addEventListener('click', function () {
      const event = new CustomEvent('datatable:rowclick', {
        detail: { rowIndex: parseInt(row.getAttribute('data-row-index'), 10) }
      });
      row.dispatchEvent(event);
    });
  });
}

/**
 * Cleanup DataTable listeners
 */
export function destroy() {
  // Cleanup handled by container
}

export default { render, init, destroy };
