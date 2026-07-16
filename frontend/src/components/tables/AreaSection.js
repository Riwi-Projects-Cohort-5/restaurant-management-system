/**
 * AreaSection Component
 * @module components/tables/AreaSection
 *
 * Groups tables under a named area header with an icon and a count badge.
 *
 * @param {Object} props
 * @param {Object} props.area
 * @param {string|number} props.area.id
 * @param {string} props.area.name
 * @param {string} [props.area.icon] - Lucide icon name
 * @param {Array<Object>} props.tables - Table objects rendered via TableShape
 * @param {number} props.tableCount
 * @param {string} [props.onTableClick] - Global handler name forwarded to TableShape
 */

import { render as renderTableShape } from './TableShape.js';

export function render(props = {}) {
  const { area = {}, tables = [], tableCount = 0, onTableClick } = props;
  const { id, name = 'Area', icon = 'grid-3x3' } = area;

  const tableCards = tables
    .map((t) => renderTableShape({ table: t, onClick: onTableClick }))
    .join('');

  return `
    <section
      class="bg-white border border-brand-200 rounded-xl overflow-hidden"
      data-area-id="${id}"
    >
      <header class="px-5 py-3 border-b border-brand-100 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <i data-lucide="${icon}" class="w-5 h-5 text-brand-500"></i>
          <h2 class="font-bold text-brand-900">${name}</h2>
        </div>
        <span class="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-neutral-100 text-secondary-600">
          ${tableCount} tables
        </span>
      </header>
      <div class="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        ${tableCards || '<p class="text-sm text-secondary-400 col-span-full text-center py-6">No tables in this area.</p>'}
      </div>
    </section>
  `;
}

let _initialized = false;

export function init() {
  if (_initialized) return;
  _initialized = true;

  if (typeof window !== 'undefined' && window.createIcons) {
    window.createIcons();
  }
}

export function destroy() {
  _initialized = false;
}
