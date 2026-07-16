/**
 * IconPickerPopup Component
 * @module components/tables/IconPickerPopup
 *
 * A small floating grid for choosing an area icon. Positioned absolutely
 * relative to the page via inline styles driven by a `{ top, left }` object.
 *
 * @param {Object} props
 * @param {string} props.selectedIcon - Lucide icon name currently active
 * @param {string} [props.onSelect] - Global handler name; receives the icon name
 * @param {Object} props.position
 * @param {number} props.position.top - Pixel offset from viewport top
 * @param {number} props.position.left - Pixel offset from viewport left
 */

const ICONS = [
  'home',
  'sun',
  'waves',
  'trees',
  'umbrella',
  'coffee',
  'wine',
  'flame',
  'star',
  'building',
];

export function render(props = {}) {
  const {
    selectedIcon = 'home',
    onSelect,
    position = { top: 0, left: 0 },
  } = props;

  const handler = onSelect ? `window.${onSelect}` : '';

  const cells = ICONS.map((ic) => {
    const isActive = ic === selectedIcon;
    const cls = isActive
      ? 'bg-brand-50 border-brand-400'
      : 'border-brand-100 hover:bg-brand-50 hover:border-brand-300';

    return `
      <button
        class="w-10 h-10 rounded-md border flex items-center justify-center transition ${cls}"
        data-icon-pick="${ic}"
        onclick="${handler}('${ic}')"
        aria-label="Select ${ic} icon"
        ${isActive ? 'aria-current="true"' : ''}
      >
        <i data-lucide="${ic}" class="w-5 h-5 text-brand-700"></i>
      </button>
    `;
  }).join('');

  return `
    <div
      class="fixed z-100 bg-white border border-brand-200 rounded-lg shadow-lg p-3"
      style="top:${position.top}px; left:${position.left}px;"
      data-icon-picker
      role="dialog"
      aria-label="Pick an icon"
    >
      <div class="grid grid-cols-5 gap-2">
        ${cells}
      </div>
    </div>
  `;
}

let _outsideClick = null;

export function init() {
  _outsideClick = (e) => {
    const picker = document.querySelector('[data-icon-picker]');
    if (picker && !picker.contains(e.target)) {
      picker.style.display = 'none';
    }
  };
  document.addEventListener('click', _outsideClick, true);
}

export function destroy() {
  if (_outsideClick) {
    document.removeEventListener('click', _outsideClick, true);
    _outsideClick = null;
  }
  const picker = document.querySelector('[data-icon-picker]');
  if (picker) picker.remove();
}
