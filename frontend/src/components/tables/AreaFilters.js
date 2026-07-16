/**
 * AreaFilters Component
 * @module components/tables/AreaFilters
 *
 * Horizontal filter bar. Shows an "All" pill plus one pill per area.
 * Admin users see a pencil (edit) icon beside each area pill.
 *
 * @param {Object} props
 * @param {Array<Object>} props.areas
 * @param {string|number} props.areas[].id
 * @param {string} props.areas[].name
 * @param {string} [props.areas[].icon]
 * @param {number} [props.areas[].count]
 * @param {string} props.activeFilter - 'all' or area id
 * @param {string} [props.onFilter] - Global handler name
 * @param {string} [props.onEdit] - Global handler name for pencil click
 * @param {boolean} [props.isAdmin]
 */

export function render(props = {}) {
  const {
    areas = [],
    activeFilter = 'all',
    onFilter,
    onEdit,
    isAdmin = false,
  } = props;

  const totalCount = areas.reduce((sum, a) => sum + (a.count || 0), 0);

  const allActive = activeFilter === 'all';
  const allClasses = allActive
    ? 'bg-brand-500 text-white border-brand-500'
    : 'bg-white text-secondary-600 hover:bg-brand-50 border-brand-200';

  const allBtn = `
    <button
      class="px-4 py-2 rounded-full text-sm font-semibold border transition ${allClasses}"
      data-filter="all"
      onclick="window.${onFilter}('all')"
    >
      All <span class="opacity-70">(${totalCount})</span>
    </button>
  `;

  const areaBtns = areas
    .map((a) => {
      const isActive = activeFilter === String(a.id);
      const cls = isActive
        ? 'bg-brand-500 text-white border-brand-500'
        : 'bg-white text-secondary-600 hover:bg-brand-50 border-brand-200';

      const editBtn = isAdmin
        ? `<button
             class="ml-1 p-0.5 rounded hover:bg-brand-100 transition text-secondary-400 hover:text-brand-600"
             onclick="event.stopPropagation(); window.${onEdit}('${a.id}')"
             aria-label="Edit area ${a.name}"
           >
             <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
           </button>`
        : '';

      return `
        <span class="inline-flex items-center">
          <button
            class="px-4 py-2 rounded-full text-sm font-semibold border transition ${cls}"
            data-filter="${a.id}"
            onclick="window.${onFilter}('${a.id}')"
          >
            <i data-lucide="${a.icon || 'grid-3x3'}" class="w-4 h-4 inline-block align-middle mr-1"></i>
            ${a.name}
            <span class="opacity-70">(${a.count || 0})</span>
          </button>
          ${editBtn}
        </span>
      `;
    })
    .join('');

  return `
    <div class="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Filter tables by area">
      ${allBtn}
      ${areaBtns}
    </div>
  `;
}

export function init() {
  if (typeof window !== 'undefined' && window.createIcons) {
    window.createIcons();
  }
}

export function destroy() {
  /* no persistent listeners */
}
