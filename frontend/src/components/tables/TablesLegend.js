/**
 * TablesLegend Component
 * @module components/tables/TablesLegend
 *
 * Horizontal legend showing the three status colors with counts.
 *
 * @param {Object} props
 * @param {number} [props.available=0]
 * @param {number} [props.occupied=0]
 * @param {number} [props.reserved=0]
 */

export function render(props = {}) {
  const { available = 0, occupied = 0, reserved = 0 } = props;

  const items = [
    { label: 'Available', count: available, dot: 'bg-success-500' },
    { label: 'Occupied', count: occupied, dot: 'bg-warning-500' },
    { label: 'Reserved', count: reserved, dot: 'bg-accent-500' },
  ];

  const pills = items
    .map(
      (i) => `
      <li class="flex items-center gap-2">
        <span class="w-3 h-3 rounded-full ${i.dot}" aria-hidden="true"></span>
        <span class="font-medium text-secondary-600">${i.label}</span>
        <span class="text-secondary-400">${i.count}</span>
      </li>
    `
    )
    .join('');

  return `
    <ul class="flex gap-4 mb-4 text-sm" role="list" aria-label="Table status legend">
      ${pills}
    </ul>
  `;
}

export function init() {
  /* purely presentational — no listeners */
}

export function destroy() {
  /* no-op */
}
