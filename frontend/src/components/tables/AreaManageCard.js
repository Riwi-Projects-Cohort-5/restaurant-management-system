/**
 * AreaManageCard Component
 * @module components/tables/AreaManageCard
 *
 * Admin card for managing a single area: expand/collapse, rename, change
 * icon, delete, reassign tables to another area, and add a new table.
 *
 * @param {Object} props
 * @param {Object} props.area
 * @param {string|number} props.area.id
 * @param {string} props.area.name
 * @param {string} [props.area.icon]
 * @param {Array<Object>} props.tables - Tables belonging to this area
 * @param {Array<Object>} props.allAreas - For the reassignment dropdown
 * @param {boolean} props.isExpanded
 * @param {boolean} props.isEditing - True while the area name is being edited
 * @param {string} [props.onToggle]
 * @param {string} [props.onIconClick]
 * @param {string} [props.onNameClick]
 * @param {string} [props.onDelete]
 * @param {string} [props.onReassignTable]
 * @param {string} [props.onAddTable]
 */

export function render(props = {}) {
  const {
    area = {},
    tables = [],
    allAreas = [],
    isExpanded = false,
    isEditing = false,
    onToggle,
    onIconClick,
    onNameClick,
    onDelete,
    onReassignTable,
    onAddTable,
  } = props;

  const { id, name = 'Area', icon = 'grid-3x3' } = area;
  const canDelete = tables.length === 0;

  const chevronRotate = isExpanded ? 'rotate-0' : '-rotate-90';

  const nameSlot = isEditing
    ? `<input
         type="text"
         value="${name}"
         class="text-sm font-bold text-brand-900 border border-brand-300 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-brand-400"
         data-area-name-input="${id}"
       />`
    : `<span
         class="text-sm font-bold text-brand-900 cursor-pointer hover:text-brand-600 transition"
         onclick="window.${onNameClick}('${id}')"
         role="button"
         tabindex="0"
       >${name}</span>`;

  const reassignOptions = allAreas
    .filter((a) => String(a.id) !== String(id))
    .map((a) => `<option value="${a.id}">${a.name}</option>`)
    .join('');

  const tableRows = tables
    .map((t) => {
      const currentAreaOpts = allAreas
        .map((a) => `<option value="${a.id}" ${String(a.id) === String(id) ? 'selected' : ''}>${a.name}</option>`)
        .join('');

      return `
        <div class="flex items-center gap-3 py-3 border-b border-neutral-100 last:border-b-0" data-manage-table="${t.id}">
          <span class="w-8 h-8 rounded-lg border-2 border-brand-200 bg-brand-50 flex items-center justify-center text-xs font-bold text-brand-700 shrink-0">
            ${t.id}
          </span>
          <span class="text-sm text-secondary-700 flex-1 truncate">${t.seats || 2} seats${t.info ? ' · ' + t.info : ''}</span>
          <select
            class="text-xs border border-brand-200 rounded px-2 py-1 bg-white text-secondary-600 focus:outline-none focus:ring-1 focus:ring-brand-400"
            onchange="window.${onReassignTable}('${t.id}', this.value)"
            aria-label="Reassign table ${t.id}"
          >
            ${currentAreaOpts}
          </select>
        </div>
      `;
    })
    .join('');

  const addTableAreaOpts = allAreas
    .map((a) => `<option value="${a.id}">${a.name}</option>`)
    .join('');

  const body = isExpanded
    ? `
    <div class="px-5 pb-5">
      ${tableRows || '<p class="text-sm text-secondary-400 py-3">No tables yet.</p>'}
      <div class="mt-3 flex items-center gap-2">
        <select
          class="text-xs border border-brand-200 rounded px-2 py-1.5 bg-white text-secondary-600 focus:outline-none focus:ring-1 focus:ring-brand-400"
          data-add-table-area="${id}"
        >
          ${addTableAreaOpts}
        </select>
        <input
          type="number"
          min="1"
          max="20"
          value="4"
          placeholder="Seats"
          class="w-16 text-xs border border-brand-200 rounded px-2 py-1.5 bg-white text-secondary-600 focus:outline-none focus:ring-1 focus:ring-brand-400"
          data-add-table-seats="${id}"
        />
        <button
          class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition"
          onclick="window.${onAddTable}('${id}')"
        >
          Add Table
        </button>
      </div>
    </div>`
    : '';

  return `
    <div class="bg-white border border-brand-200 rounded-xl overflow-hidden mb-4" data-manage-area="${id}">
      <div
        class="px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-brand-50 transition"
        onclick="window.${onToggle}('${id}')"
        role="button"
        tabindex="0"
        aria-expanded="${isExpanded}"
      >
        <div class="flex items-center gap-3">
          <i data-lucide="chevron-down" class="w-4 h-4 text-secondary-400 transition-transform ${chevronRotate}"></i>
          <button
            class="p-1 rounded hover:bg-brand-100 transition"
            onclick="event.stopPropagation(); window.${onIconClick}('${id}')"
            aria-label="Change icon for ${name}"
          >
            <i data-lucide="${icon}" class="w-5 h-5 text-brand-500"></i>
          </button>
          ${nameSlot}
          <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-neutral-100 text-secondary-500">${tables.length}</span>
        </div>
        <button
          class="p-1 rounded hover:bg-error-50 transition ${canDelete ? 'text-error-400 hover:text-error-600' : 'text-neutral-300 cursor-not-allowed'}"
          ${canDelete ? `onclick="event.stopPropagation(); window.${onDelete}('${id}')"` : 'disabled'}
          aria-label="Delete area ${name}"
        >
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
      ${body}
    </div>
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
