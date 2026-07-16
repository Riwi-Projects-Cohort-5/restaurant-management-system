/**
 * TableShape Component
 * @module components/tables/TableShape
 *
 * Renders a single table as a color-coded card. Status drives the palette:
 *   - available → success-*
 *   - occupied  → warning-*
 *   - reserved  → accent-*
 *
 * @param {Object} props
 * @param {Object} props.table
 * @param {string|number} props.table.id
 * @param {number} props.table.seats
 * @param {'available'|'occupied'|'reserved'} props.table.status
 * @param {string} [props.table.info]
 * @param {string} [props.table.timer]
 * @param {string} [props.onClick] - Global handler name called on click
 */

const STATUS_STYLES = {
  available: {
    card: 'bg-success-100 border-success-300 text-success-700 hover:border-success-500',
    dot: 'bg-success-500',
  },
  occupied: {
    card: 'bg-warning-100 border-warning-300 text-warning-700 hover:border-warning-500',
    dot: 'bg-warning-500',
  },
  reserved: {
    card: 'bg-accent-100 border-accent-300 text-accent-700 hover:border-accent-500',
    dot: 'bg-accent-500',
  },
};

export function render(props = {}) {
  const { table = {}, onClick } = props;
  const { id, seats = 2, status = 'available', info = '', timer } = table;
  const s = STATUS_STYLES[status] || STATUS_STYLES.available;

  const timerHtml = status === 'occupied' && timer
    ? `<span class="text-xs font-semibold text-error-600 mt-1">${timer}</span>`
    : '';

  const infoHtml = info
    ? `<span class="text-xs mt-1 truncate max-w-full">${info}</span>`
    : '';

  const handler = onClick ? `window.${onClick}('${id}')` : '';

  return `
    <div
      class="rounded-xl border-2 p-4 cursor-pointer transition hover:shadow-md flex flex-col items-center justify-center text-center min-h-[100px] ${s.card}"
      data-table-id="${id}"
      onclick="${handler}"
      role="button"
      tabindex="0"
      aria-label="Table ${id}, ${seats} seats, ${status}"
    >
      <span class="text-2xl font-bold">${id}</span>
      ${infoHtml}
      <span class="text-xs mt-1 opacity-70">${seats} seats</span>
      ${timerHtml}
    </div>
  `;
}

let _keyHandler = null;

export function init() {
  _keyHandler = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.currentTarget.click();
    }
  };
  document.querySelectorAll('[data-table-id]').forEach((el) => {
    el.addEventListener('keydown', _keyHandler);
  });
}

export function destroy() {
  if (_keyHandler) {
    document.querySelectorAll('[data-table-id]').forEach((el) => {
      el.removeEventListener('keydown', _keyHandler);
    });
    _keyHandler = null;
  }
}
